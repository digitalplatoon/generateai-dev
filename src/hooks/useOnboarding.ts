import { logger } from '@/lib/logger';

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface OnboardingStep {
  id: string;
  step_id: string;
  completed: boolean;
  created_at: string;
}

export type OnboardingStepId = 
  | 'welcome'
  | 'profile-setup'
  | 'learning-preferences'
  | 'first-prompt'
  | 'rag-introduction'
  | 'agent-playground'
  | 'complete';

export const useOnboarding = () => {
  const { user } = useAuthContext();
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompletedSteps = async () => {
    if (!user) {
      setCompletedSteps([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setCompletedSteps((data || []) as OnboardingStep[]);
    } catch (error) {
      logger.error('Error fetching onboarding progress:', error);
      setCompletedSteps([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedSteps();
  }, [user]);

  const completeStep = async (stepId: OnboardingStepId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('onboarding_steps')
        .upsert({
          user_id: user.id,
          step_id: stepId,
        });

      if (error) throw error;
      await fetchCompletedSteps(); // Refresh steps
    } catch (error) {
      logger.error('Error completing onboarding step:', error);
    }
  };

  const isStepCompleted = (stepId: OnboardingStepId) => {
    return completedSteps.some(step => step.step_id === stepId);
  };

  const getCurrentStep = (): OnboardingStepId => {
    const steps: OnboardingStepId[] = [
      'welcome',
      'profile-setup',
      'learning-preferences',
      'first-prompt',
      'rag-introduction',
      'agent-playground',
      'complete'
    ];

    for (const step of steps) {
      if (!isStepCompleted(step)) {
        return step;
      }
    }
    return 'complete';
  };

  const getProgress = () => {
    const totalSteps = 7;
    const completed = completedSteps.length;
    return Math.round((completed / totalSteps) * 100);
  };

  return {
    completedSteps,
    isLoading,
    completeStep,
    isStepCompleted,
    getCurrentStep,
    getProgress,
    refetch: fetchCompletedSteps,
  };
};
