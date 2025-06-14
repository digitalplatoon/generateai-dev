
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProgress {
  id: string;
  learning_path_id: string;
  module_id: string;
  progress_percentage: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_progress' as any)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error('Fetch progress error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (learningPathId: string, moduleId: string, progressPercentage: number) => {
    try {
      const { data, error } = await supabase
        .from('user_progress' as any)
        .upsert({
          learning_path_id: learningPathId,
          module_id: moduleId,
          progress_percentage: progressPercentage,
          completed_at: progressPercentage === 100 ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Progress updated!",
        description: `${progressPercentage}% completed for ${moduleId}`,
      });

      await fetchProgress();
      return data;
    } catch (error) {
      console.error('Update progress error:', error);
      toast({
        title: "Failed to update progress",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    }
  };

  const getPathProgress = (learningPathId: string) => {
    const pathProgress = progress.filter(p => p.learning_path_id === learningPathId);
    if (pathProgress.length === 0) return 0;
    
    const totalProgress = pathProgress.reduce((sum, p) => sum + p.progress_percentage, 0);
    return Math.round(totalProgress / pathProgress.length);
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return {
    progress,
    isLoading,
    updateProgress,
    getPathProgress,
    fetchProgress,
  };
};
