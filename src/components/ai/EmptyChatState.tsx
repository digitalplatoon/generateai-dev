
import React from 'react';
import { Bot, Shield } from 'lucide-react';

const EmptyChatState = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
      <p className="text-sm">
        Ask me anything! I'm here to help with your questions and tasks.
      </p>
      <div className="mt-4 p-3 bg-muted rounded-lg text-xs">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4" />
          <span className="font-medium">Enhanced Security & Collaboration</span>
        </div>
        <p>All messages are filtered for malicious content, and you can collaborate with your team in real-time.</p>
      </div>
    </div>
  );
};

export default EmptyChatState;
