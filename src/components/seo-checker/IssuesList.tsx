import { ChevronDown, ChevronRight, AlertCircle, AlertTriangle, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { SeoIssue } from '@/types/seo';

interface IssuesListProps {
  issues: SeoIssue[];
  showChangeIndicators?: boolean;
}

const priorityConfig = {
  P0: { 
    label: 'Critical', 
    icon: AlertCircle, 
    className: 'bg-red-500/10 text-red-600 border-red-200',
    badgeClass: 'bg-red-500 text-white'
  },
  P1: { 
    label: 'High', 
    icon: AlertTriangle, 
    className: 'bg-orange-500/10 text-orange-600 border-orange-200',
    badgeClass: 'bg-orange-500 text-white'
  },
  P2: { 
    label: 'Medium', 
    icon: Info, 
    className: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
    badgeClass: 'bg-yellow-500 text-white'
  },
};

function ChangeIndicator({ change }: { change: SeoIssue['change_vs_previous'] }) {
  if (!change) return null;

  const config = {
    improved: { icon: TrendingUp, className: 'text-green-500', label: 'Improved' },
    regressed: { icon: TrendingDown, className: 'text-red-500', label: 'Regressed' },
    new: { icon: AlertCircle, className: 'text-blue-500', label: 'New' },
    unchanged: { icon: Minus, className: 'text-muted-foreground', label: 'Unchanged' },
  };

  const { icon: Icon, className, label } = config[change.direction];

  return (
    <span className={cn('flex items-center gap-1 text-xs', className)}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function IssueCard({ issue, showChange }: { issue: SeoIssue; showChange: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const config = priorityConfig[issue.priority];
  const Icon = config.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={cn('border', config.className)}>
        <CollapsibleTrigger asChild>
          <CardHeader className="py-3 px-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-3">
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-sm font-medium">{issue.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                  {showChange && <ChangeIndicator change={issue.change_vs_previous} />}
                </div>
                {issue.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {issue.description}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4 px-4">
            {issue.fix_steps.length > 0 && (
              <div className="mt-2 space-y-2">
                <h4 className="text-sm font-medium">How to fix:</h4>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  {issue.fix_steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
            {issue.evidence && Object.keys(issue.evidence).length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <h4 className="text-sm font-medium mb-2">Evidence:</h4>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(issue.evidence, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function IssuesList({ issues, showChangeIndicators = false }: IssuesListProps) {
  const groupedIssues = {
    P0: issues.filter(i => i.priority === 'P0'),
    P1: issues.filter(i => i.priority === 'P1'),
    P2: issues.filter(i => i.priority === 'P2'),
  };

  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No issues found. Great job!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(['P0', 'P1', 'P2'] as const).map((priority) => {
        const priorityIssues = groupedIssues[priority];
        if (priorityIssues.length === 0) return null;
        
        const config = priorityConfig[priority];
        
        return (
          <div key={priority} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={config.badgeClass}>
                {priority}
              </Badge>
              <span className="text-sm font-medium">
                {config.label} Issues ({priorityIssues.length})
              </span>
            </div>
            <div className="space-y-2">
              {priorityIssues.map((issue) => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  showChange={showChangeIndicators} 
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
