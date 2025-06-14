
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, ArrowRight } from 'lucide-react';

interface AgentPlaygroundStepProps {
  onComplete: () => void;
}

export const AgentPlaygroundStep: React.FC<AgentPlaygroundStepProps> = ({ onComplete }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Bot className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Agent Playground</h2>
        <p className="text-muted-foreground">
          Create and test custom AI agents with different personalities and capabilities.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold mb-3">Build Your AI Assistant:</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Configure agent personality and behavior
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Set system instructions and context
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Test different conversation scenarios
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Monitor performance and token usage
          </li>
        </ul>
      </div>

      <Button onClick={onComplete} size="lg" className="w-full">
        Visit Agent Playground
      </Button>
    </div>
  );
};
