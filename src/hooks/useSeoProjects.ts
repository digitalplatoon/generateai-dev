import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject 
} from '@/services/seoService';
import type { SeoProjectFormData } from '@/types/seo';
import { useToast } from '@/hooks/use-toast';

export function useSeoProjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['seo-projects'],
    queryFn: getProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-projects'] });
      toast({
        title: 'Project created',
        description: 'Your SEO project has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error creating project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SeoProjectFormData> }) => 
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-projects'] });
      toast({
        title: 'Project updated',
        description: 'Your SEO project has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-projects'] });
      toast({
        title: 'Project deleted',
        description: 'Your SEO project has been deleted.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    createProject: createMutation.mutateAsync,
    updateProject: updateMutation.mutateAsync,
    deleteProject: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useSeoProject(id: string) {
  return useQuery({
    queryKey: ['seo-project', id],
    queryFn: () => getProject(id),
    enabled: !!id,
  });
}
