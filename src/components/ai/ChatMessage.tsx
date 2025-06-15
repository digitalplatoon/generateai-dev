
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, Clock, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  tokens_used?: number;
  model_used?: string;
  temperature?: number;
}

interface ChatMessageProps {
  message: Message;
  onCopy: (content: string) => void;
}

const ChatMessage = ({ message, onCopy }: ChatMessageProps) => {
  return (
    <div
      className={`flex gap-3 ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`flex gap-3 max-w-[80%] ${
          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div className="flex-shrink-0">
          {message.role === 'user' ? (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Bot className="h-4 w-4 text-secondary-foreground" />
            </div>
          )}
        </div>
        
        <div className={`space-y-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
          <div
            className={`p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </span>
            {message.tokens_used && (
              <>
                <span>•</span>
                <span>{message.tokens_used} tokens</span>
              </>
            )}
            {message.model_used && (
              <>
                <span>•</span>
                <span>{message.model_used}</span>
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCopy(message.content)}
              className="h-4 w-4 p-0 ml-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
