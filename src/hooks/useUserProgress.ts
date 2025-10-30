
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface UserProgress {
  id: string;
  learning_path_id: string;
  module_id: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export const useUserProgress = () => {
  const { user } = useAuthContext();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = async () => {
    if (!user) {
      setProgress([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProgress((data || []) as UserProgress[]);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      setProgress([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const updateProgress = async (
    learningPathId: string,
    moduleId: string,
    progressPercentage: number
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          learning_path_id: learningPathId,
          module_id: moduleId,
          progress_percentage: progressPercentage,
        });

      if (error) throw error;
      await fetchProgress(); // Refresh progress
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  };

  const getPathProgress = (learningPathId: string) => {
    const pathProgress = progress.filter(p => p.learning_path_id === learningPathId);
    if (pathProgress.length === 0) return 0;
    
    const averageProgress = pathProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / pathProgress.length;
    return Math.round(averageProgress);
  };

  const getModuleProgress = (learningPathId: string, moduleId: string) => {
    const moduleProgress = progress.find(
      p => p.learning_path_id === learningPathId && p.module_id === moduleId
    );
    return moduleProgress?.progress_percentage || 0;
  };

  return {
    progress,
    isLoading,
    updateProgress,
    getPathProgress,
    getModuleProgress,
    refetch: fetchProgress,
  };
};
