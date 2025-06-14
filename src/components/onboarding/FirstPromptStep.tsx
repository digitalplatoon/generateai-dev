
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface FirstPromptStepProps {
  onComplete: () => void;
}

export const FirstPromptStep: React.FC<FirstPromptStepProps> = ({ onComplete }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Explore Prompts</h2>
        <p className="text-muted-foreground">
          Discover our curated collection of AI prompts for various tasks and industries.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold mb-3">What you'll find:</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Carefully crafted prompts for different use cases
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Categories for writing, coding, analysis, and more
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Community contributions and ratings
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Bookmark your favorites for quick access
          </li>
        </ul>
      </div>

      <Button onClick={onComplete} size="lg" className="w-full">
        Explore Prompt Library
      </Button>
    </div>
  );
};
