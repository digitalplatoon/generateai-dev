
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Shield, Download } from 'lucide-react';
import RealTimePresence from './RealTimePresence';

interface Conversation {
  id: string;
  title: string;
  do_not_train?: boolean;
}

interface AISettings {
  temperature: number;
  preferred_model?: string;
}

interface ChatHeaderProps {
  currentConversation: Conversation | null;
  settings: AISettings | null;
  isStreaming: boolean;
  onExport: () => void;
}

const ChatHeader = ({ currentConversation, settings, isStreaming, onExport }: ChatHeaderProps) => {
  return (
    <div className="pb-3">
      <div className="flex items-center justify-between">
        <span>{currentConversation?.title || 'New Conversation'}</span>
        <div className="flex items-center gap-2">
          {settings && (
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              T: {settings.temperature.toFixed(1)}
            </Badge>
          )}
          {currentConversation?.do_not_train && (
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Private
            </Badge>
          )}
          {isStreaming && (
            <Badge variant="outline" className="text-xs animate-pulse">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-1" />
              Streaming
            </Badge>
          )}
          <Button size="sm" variant="ghost" onClick={onExport}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Real-time Presence */}
      {currentConversation && (
        <RealTimePresence conversationId={currentConversation.id} />
      )}
    </div>
  );
};

export default ChatHeader;
