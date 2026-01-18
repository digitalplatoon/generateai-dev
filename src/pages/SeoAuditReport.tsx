import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSeoScanDetail } from '@/hooks/useSeoScans';
import { useSeoProject } from '@/hooks/useSeoProjects';
import { ScoreRow } from '@/components/seo-checker/ScoreCard';
import { IssuesList } from '@/components/seo-checker/IssuesList';
import { PromptViewer } from '@/components/seo-checker/PromptViewer';
import { ExportButton } from '@/components/seo-checker/ExportButton';
import { Badge } from '@/components/ui/badge';
import { SEOHead } from '@/components/seo/SEOHead';
import { format } from 'date-fns';

export default function SeoAuditReport() {
  const { scanId } = useParams<{ scanId: string }>();
  const { scan, results, issues, prompts, isLoading, generatePrompts, isGenerating } = useSeoScanDetail(scanId!);
  const { data: project } = useSeoProject(scan?.project_id || '');

  if (isLoading || !scan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const mobileResults = results.filter(r => r.strategy === 'mobile');
  const desktopResults = results.filter(r => r.strategy === 'desktop');

  const avgScore = (scores: (number | null)[]) => {
    const valid = scores.filter((s): s is number => s !== null);
    return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  };

  return (
    <>
      <SEOHead title="Audit Report" description="SEO audit scan results and issues" />
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={project ? `/seo-projects/${project.id}?tab=scans` : '/seo-projects'}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Audit Report</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>{project?.domain || 'Unknown'}</span>
                <span>•</span>
                <span>{format(new Date(scan.created_at), 'MMM d, yyyy HH:mm')}</span>
                <Badge variant="outline" className="capitalize">{scan.status}</Badge>
              </div>
            </div>
          </div>
          {project && (
            <ExportButton
              scan={scan}
              results={results}
              issues={issues}
              projectName={project.name}
              projectDomain={project.domain}
            />
          )}
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
            <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4 text-center">Mobile Scores</h3>
                <ScoreRow
                  performance={avgScore(mobileResults.map(r => r.performance_score))}
                  accessibility={avgScore(mobileResults.map(r => r.accessibility_score))}
                  bestPractices={avgScore(mobileResults.map(r => r.best_practices_score))}
                  seo={avgScore(mobileResults.map(r => r.seo_score))}
                />
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4 text-center">Desktop Scores</h3>
                <ScoreRow
                  performance={avgScore(desktopResults.map(r => r.performance_score))}
                  accessibility={avgScore(desktopResults.map(r => r.accessibility_score))}
                  bestPractices={avgScore(desktopResults.map(r => r.best_practices_score))}
                  seo={avgScore(desktopResults.map(r => r.seo_score))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="mt-6">
            <IssuesList issues={issues} showChangeIndicators />
          </TabsContent>

          <TabsContent value="prompts" className="mt-6">
            <PromptViewer
              prompts={prompts}
              onGenerate={generatePrompts}
              isGenerating={isGenerating}
              hasIssues={issues.length > 0}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
