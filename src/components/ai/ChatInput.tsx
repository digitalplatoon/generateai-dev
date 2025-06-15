
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, StopCircle, Shield } from 'lucide-react';

interface AISettings {
  preferred_model?: string;
  temperature: number;
  max_tokens: number;
  do_not_train_consent?: boolean;
}

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  isStreaming: boolean;
  settings: AISettings | null;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  onStopStreaming: () => void;
}

const ChatInput = ({
  input,
  isLoading,
  isStreaming,
  settings,
  onInputChange,
  onSendMessage,
  onStopStreaming
}: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && !isStreaming) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={onInputChange}
          placeholder="Type your message..."
          className="min-h-[60px] max-h-[120px]"
          onKeyDown={handleKeyDown}
          disabled={isLoading || isStreaming}
        />
        <div className="flex flex-col gap-2">
          {isStreaming ? (
            <Button
              onClick={onStopStreaming}
              variant="outline"
              className="self-end"
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={onSendMessage}
              disabled={!input.trim() || isLoading}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {settings && (
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Model: {settings.preferred_model}</span>
            <span>•</span>
            <span>T: {settings.temperature}</span>
            <span>•</span>
            <span>Max: {settings.max_tokens}</span>
            {settings.do_not_train_consent && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Private</span>
                </div>
              </>
            )}
          </div>
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
