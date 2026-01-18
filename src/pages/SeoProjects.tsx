import { useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSeoProjects } from '@/hooks/useSeoProjects';
import { ProjectCard } from '@/components/seo-checker/ProjectCard';
import { ProjectForm } from '@/components/seo-checker/ProjectForm';
import type { SeoProject } from '@/types/seo';
import SEOHead from '@/components/seo/SEOHead';

export default function SeoProjects() {
  const navigate = useNavigate();
  const { projects, isLoading, createProject, updateProject, deleteProject, isCreating, isUpdating } = useSeoProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<SeoProject | null>(null);
  const [filter, setFilter] = useState('');

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.domain.toLowerCase().includes(filter.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleEdit = (project: SeoProject) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSubmit = async (data: any) => {
    if (editingProject) {
      await updateProject({ id: editingProject.id, data });
    } else {
      await createProject(data);
    }
    setEditingProject(null);
  };

  return (
    <>
      <SEOHead title="SEO Projects" description="Manage your SEO projects and website audits" />
      <div className="container py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">SEO Projects</h1>
            <p className="text-muted-foreground">Monitor and optimize your websites</p>
          </div>
          <Button onClick={() => { setEditingProject(null); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {projects.length === 0 ? 'No projects yet. Add your first project to get started.' : 'No projects match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={deleteProject}
                onView={(id) => navigate(`/seo-projects/${id}`)}
                onScan={(id) => navigate(`/seo-projects/${id}?tab=scans`)}
              />
            ))}
          </div>
        )}

        <ProjectForm
          open={showForm}
          onOpenChange={setShowForm}
          project={editingProject}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
      </div>
    </>
  );
}
