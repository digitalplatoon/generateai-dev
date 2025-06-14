
import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, ArrowRight } from 'lucide-react';

interface RagIntroductionStepProps {
  onComplete: () => void;
}

export const RagIntroductionStep: React.FC<RagIntroductionStepProps> = ({ onComplete }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Database className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">RAG Lab</h2>
        <p className="text-muted-foreground">
          Upload your documents and chat with them using AI-powered search.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold mb-3">What is RAG?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Retrieval-Augmented Generation (RAG) combines document search with AI generation to answer questions based on your own content.
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Upload PDFs, text files, and documents
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            AI processes and indexes your content
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Ask questions and get accurate, sourced answers
          </li>
          <li className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Perfect for research, analysis, and knowledge discovery
          </li>
        </ul>
      </div>

      <Button onClick={onComplete} size="lg" className="w-full">
        Try RAG Lab
      </Button>
    </div>
  );
};
