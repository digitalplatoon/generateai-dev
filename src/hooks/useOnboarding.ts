
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OnboardingStep {
  id: string;
  step_id: string;
  completed_at: string;
  created_at: string;
}

export const ONBOARDING_STEPS = [
  'welcome',
  'profile-setup',
  'learning-preferences',
  'first-prompt',
  'rag-introduction',
  'agent-playground',
  'complete'
] as const;

export type OnboardingStepId = typeof ONBOARDING_STEPS[number];

export const useOnboarding = () => {
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCompletedSteps = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_onboarding' as any)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCompletedSteps(data || []);
    } catch (error) {
      console.error('Fetch onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeStep = async (stepId: OnboardingStepId) => {
    try {
      const { data, error } = await supabase
        .from('user_onboarding' as any)
        .insert({
          step_id: stepId,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Step completed!",
        description: `You've completed the ${stepId} step.`,
      });

      await fetchCompletedSteps();
      return data;
    } catch (error) {
      console.error('Complete step error:', error);
      // Don't show error toast for onboarding steps
    }
  };

  const isStepCompleted = (stepId: OnboardingStepId) => {
    return completedSteps.some(step => step.step_id === stepId);
  };

  const getCurrentStep = (): OnboardingStepId => {
    for (const stepId of ONBOARDING_STEPS) {
      if (!isStepCompleted(stepId)) {
        return stepId;
      }
    }
    return 'complete';
  };

  const getProgress = () => {
    const completed = completedSteps.length;
    const total = ONBOARDING_STEPS.length;
    return Math.round((completed / total) * 100);
  };

  useEffect(() => {
    fetchCompletedSteps();
  }, []);

  return {
    completedSteps,
    isLoading,
    completeStep,
    isStepCompleted,
    getCurrentStep,
    getProgress,
    fetchCompletedSteps,
  };
};
