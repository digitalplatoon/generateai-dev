
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';

interface CompleteStepProps {
  onComplete: () => void;
}

export const CompleteStep: React.FC<CompleteStepProps> = ({ onComplete }) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
        <p className="text-muted-foreground">
          Welcome to AI Prompt Hub. You're ready to start your AI journey!
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6">
        <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
        <h3 className="font-semibold mb-2">What's Next?</h3>
        <p className="text-sm text-muted-foreground">
          Explore learning paths, try the prompt library, upload documents to RAG Lab, 
          or create your first AI agent. The possibilities are endless!
        </p>
      </div>

      <Button onClick={onComplete} size="lg" className="w-full">
        Start Exploring
      </Button>
    </div>
  );
};
