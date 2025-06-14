
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useOnboarding, OnboardingStepId } from '@/hooks/useOnboarding';
import { WelcomeStep } from './WelcomeStep';
import { ProfileSetupStep } from './ProfileSetupStep';
import { LearningPreferencesStep } from './LearningPreferencesStep';
import { FirstPromptStep } from './FirstPromptStep';
import { RagIntroductionStep } from './RagIntroductionStep';
import { AgentPlaygroundStep } from './AgentPlaygroundStep';
import { CompleteStep } from './CompleteStep';
import { X } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const { getCurrentStep, getProgress, completeStep, isStepCompleted } = useOnboarding();
  const [currentStep, setCurrentStep] = useState<OnboardingStepId>(getCurrentStep());

  const handleStepComplete = async (stepId: OnboardingStepId) => {
    await completeStep(stepId);
    
    // Move to next step
    const stepIndex = ['welcome', 'profile-setup', 'learning-preferences', 'first-prompt', 'rag-introduction', 'agent-playground', 'complete'].indexOf(stepId);
    const nextStepIndex = stepIndex + 1;
    const nextStep = ['welcome', 'profile-setup', 'learning-preferences', 'first-prompt', 'rag-introduction', 'agent-playground', 'complete'][nextStepIndex] as OnboardingStepId;
    
    if (nextStep) {
      setCurrentStep(nextStep);
    }
    
    if (stepId === 'complete') {
      onComplete();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onComplete={() => handleStepComplete('welcome')} />;
      case 'profile-setup':
        return <ProfileSetupStep onComplete={() => handleStepComplete('profile-setup')} />;
      case 'learning-preferences':
        return <LearningPreferencesStep onComplete={() => handleStepComplete('learning-preferences')} />;
      case 'first-prompt':
        return <FirstPromptStep onComplete={() => handleStepComplete('first-prompt')} />;
      case 'rag-introduction':
        return <RagIntroductionStep onComplete={() => handleStepComplete('rag-introduction')} />;
      case 'agent-playground':
        return <AgentPlaygroundStep onComplete={() => handleStepComplete('agent-playground')} />;
      case 'complete':
        return <CompleteStep onComplete={() => handleStepComplete('complete')} />;
      default:
        return <WelcomeStep onComplete={() => handleStepComplete('welcome')} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Welcome to AI Prompt Hub</CardTitle>
            <CardDescription>Let's get you started with a quick tour</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onSkip}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Progress value={getProgress()} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {['welcome', 'profile-setup', 'learning-preferences', 'first-prompt', 'rag-introduction', 'agent-playground', 'complete'].indexOf(currentStep) + 1} of 7
            </p>
          </div>
          {renderCurrentStep()}
        </CardContent>
      </Card>
    </div>
  );
};
