
import React from 'react';
import { Bot } from 'lucide-react';

interface StreamingMessageProps {
  content: string;
}

const StreamingMessage = ({ content }: StreamingMessageProps) => {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex gap-3 max-w-[80%]">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <Bot className="h-4 w-4 text-secondary-foreground" />
          </div>
        </div>
        
        <div className="space-y-2 text-left">
          <div className="p-3 rounded-lg bg-muted">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
            <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
              <div className="animate-pulse">●</div>
              <span>AI is typing...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingMessage;
