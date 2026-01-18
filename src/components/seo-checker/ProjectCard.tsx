import { Globe, Calendar, Star, MoreVertical, Trash2, Edit, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SeoProject } from '@/types/seo';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: SeoProject;
  onEdit: (project: SeoProject) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  onScan: (id: string) => void;
}

const priorityColors: Record<number, string> = {
  1: 'bg-muted text-muted-foreground',
  2: 'bg-blue-500/10 text-blue-600',
  3: 'bg-yellow-500/10 text-yellow-600',
  4: 'bg-orange-500/10 text-orange-600',
  5: 'bg-red-500/10 text-red-600',
};

export function ProjectCard({ project, onEdit, onDelete, onView, onScan }: ProjectCardProps) {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onView(project.id)}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1 min-w-0">
          <CardTitle className="text-lg font-semibold truncate">{project.name}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{project.domain}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onScan(project.id); }}>
              <Play className="h-4 w-4 mr-2" />
              Run Scan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className={priorityColors[project.priority_score]}>
              <Star className="h-3 w-3 mr-1" />
              Priority {project.priority_score}
            </Badge>
            {project.country && (
              <Badge variant="outline">{project.country}</Badge>
            )}
            {project.language && (
              <Badge variant="outline">{project.language.toUpperCase()}</Badge>
            )}
          </div>
          
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Calendar className="h-3 w-3" />
            <span>Updated {format(new Date(project.updated_at), 'MMM d, yyyy')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
