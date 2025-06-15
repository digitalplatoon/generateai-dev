
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import StreamingMessage from './StreamingMessage';
import EmptyChatState from './EmptyChatState';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  tokens_used?: number;
  model_used?: string;
  temperature?: number;
}

interface ChatMessagesAreaProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
}

const ChatMessagesArea = ({ messages, isStreaming, streamingContent }: ChatMessagesAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            onCopy={copyMessage}
          />
        ))}

        {/* Show streaming message */}
        {isStreaming && streamingContent && (
          <StreamingMessage content={streamingContent} />
        )}
        
        {messages.length === 0 && !isStreaming && <EmptyChatState />}
        
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessagesArea;
