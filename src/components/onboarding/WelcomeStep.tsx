
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Database, Bot } from 'lucide-react';

interface WelcomeStepProps {
  onComplete: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onComplete }) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <Sparkles className="h-16 w-16 text-primary" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Welcome to AI Prompt Hub!</h2>
        <p className="text-muted-foreground">
          Your comprehensive platform for AI learning, prompt engineering, and document intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div className="flex flex-col items-center text-center p-4">
          <BookOpen className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-semibold">Learning Paths</h3>
          <p className="text-sm text-muted-foreground">Structured courses to master AI</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <Database className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-semibold">RAG Lab</h3>
          <p className="text-sm text-muted-foreground">Upload and query your documents</p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <Bot className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-semibold">AI Agents</h3>
          <p className="text-sm text-muted-foreground">Build and test AI assistants</p>
        </div>
      </div>

      <Button onClick={onComplete} size="lg" className="w-full">
        Let's Get Started!
      </Button>
    </div>
  );
};
