import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProjectUrls, 
  addUrl, 
  updateUrl, 
  deleteUrl,
  discoverUrls 
} from '@/services/seoService';
import type { SeoUrlFormData } from '@/types/seo';
import { useToast } from '@/hooks/use-toast';

export function useSeoUrls(projectId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const urlsQuery = useQuery({
    queryKey: ['seo-urls', projectId],
    queryFn: () => getProjectUrls(projectId),
    enabled: !!projectId,
  });

  const addMutation = useMutation({
    mutationFn: (urlData: SeoUrlFormData) => addUrl(projectId, urlData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-urls', projectId] });
      toast({
        title: 'URL added',
        description: 'The URL has been added to your project.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error adding URL',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SeoUrlFormData> }) => 
      updateUrl(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-urls', projectId] });
      toast({
        title: 'URL updated',
        description: 'The URL has been updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error updating URL',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-urls', projectId] });
      toast({
        title: 'URL deleted',
        description: 'The URL has been removed from your project.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error deleting URL',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const discoverMutation = useMutation({
    mutationFn: () => discoverUrls(projectId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['seo-urls', projectId] });
      toast({
        title: 'URLs discovered',
        description: `Found ${data.discovered} URLs from sitemap.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error discovering URLs',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    urls: urlsQuery.data || [],
    isLoading: urlsQuery.isLoading,
    error: urlsQuery.error,
    addUrl: addMutation.mutateAsync,
    updateUrl: updateMutation.mutateAsync,
    deleteUrl: deleteMutation.mutateAsync,
    discoverUrls: discoverMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isDiscovering: discoverMutation.isPending,
  };
}
