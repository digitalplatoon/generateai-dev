import { useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSeoProject } from '@/hooks/useSeoProjects';
import { useSeoUrls } from '@/hooks/useSeoUrls';
import { useSeoScans } from '@/hooks/useSeoScans';
import { UrlManager } from '@/components/seo-checker/UrlManager';
import { ScanRunner } from '@/components/seo-checker/ScanRunner';
import { SEOHead } from '@/components/seo/SEOHead';

export default function SeoProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'urls';

  const { data: project, isLoading: projectLoading } = useSeoProject(id!);
  const { urls, isLoading: urlsLoading, addUrl, deleteUrl, discoverUrls, isAdding, isDeleting, isDiscovering } = useSeoUrls(id!);
  const { scans, isLoading: scansLoading, triggerScan, isTriggering } = useSeoScans(id!);

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link to="/seo-projects">
          <Button>Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead title={project.name} description={`SEO audit for ${project.domain}`} />
      <div className="container py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/seo-projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.domain}</p>
          </div>
        </div>

        <Tabs defaultValue={defaultTab}>
          <TabsList>
            <TabsTrigger value="urls">URLs ({urls.length})</TabsTrigger>
            <TabsTrigger value="scans">Scans ({scans.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="urls" className="mt-6">
            <UrlManager
              urls={urls}
              isLoading={urlsLoading}
              onAddUrl={addUrl}
              onDeleteUrl={deleteUrl}
              onDiscoverUrls={discoverUrls}
              isAdding={isAdding}
              isDeleting={isDeleting}
              isDiscovering={isDiscovering}
            />
          </TabsContent>

          <TabsContent value="scans" className="mt-6">
            <ScanRunner
              projectId={id!}
              scans={scans}
              isLoading={scansLoading}
              onTriggerScan={triggerScan}
              isTriggering={isTriggering}
              urlCount={urls.length}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
