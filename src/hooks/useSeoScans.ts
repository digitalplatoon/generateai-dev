import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getScanRuns, 
  getScanRun,
  getPsiResults,
  getIssuesForScan,
  triggerScan,
  generatePrompts,
  getGeneratedPrompts 
} from '@/services/seoService';
import { useToast } from '@/hooks/use-toast';

export function useSeoScans(projectId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scansQuery = useQuery({
    queryKey: ['seo-scans', projectId],
    queryFn: () => getScanRuns(projectId),
    enabled: !!projectId,
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasRunning = data?.some(scan => 
        scan.status === 'pending' || scan.status === 'running'
      );
      return hasRunning ? 5000 : false;
    },
  });

  const triggerMutation = useMutation({
    mutationFn: (urlIds?: string[]) => triggerScan(projectId, urlIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-scans', projectId] });
      toast({
        title: 'Scan started',
        description: 'Your scan has been queued and will start shortly.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error starting scan',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    scans: scansQuery.data || [],
    isLoading: scansQuery.isLoading,
    error: scansQuery.error,
    triggerScan: triggerMutation.mutateAsync,
    isTriggering: triggerMutation.isPending,
    refetch: scansQuery.refetch,
  };
}

export function useSeoScanDetail(scanId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scanQuery = useQuery({
    queryKey: ['seo-scan', scanId],
    queryFn: () => getScanRun(scanId),
    enabled: !!scanId,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'pending' || data?.status === 'running' ? 5000 : false;
    },
  });

  const resultsQuery = useQuery({
    queryKey: ['seo-psi-results', scanId],
    queryFn: () => getPsiResults(scanId),
    enabled: !!scanId,
  });

  const issuesQuery = useQuery({
    queryKey: ['seo-issues', scanId],
    queryFn: () => getIssuesForScan(scanId),
    enabled: !!scanId,
  });

  const promptsQuery = useQuery({
    queryKey: ['seo-prompts', scanId],
    queryFn: () => getGeneratedPrompts(scanId),
    enabled: !!scanId,
  });

  const generatePromptsMutation = useMutation({
    mutationFn: () => generatePrompts(scanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-prompts', scanId] });
      toast({
        title: 'Prompts generated',
        description: 'AI fix prompts have been generated for this scan.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error generating prompts',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    scan: scanQuery.data,
    results: resultsQuery.data || [],
    issues: issuesQuery.data || [],
    prompts: promptsQuery.data || [],
    isLoading: scanQuery.isLoading || resultsQuery.isLoading,
    error: scanQuery.error || resultsQuery.error,
    generatePrompts: generatePromptsMutation.mutateAsync,
    isGenerating: generatePromptsMutation.isPending,
  };
}
