
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePresenceStatus } from './RealTimePresence';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useStreamingChat } from '@/hooks/useStreamingChat';
import ChatHeader from './ChatHeader';
import ChatMessagesArea from './ChatMessagesArea';
import ChatInput from './ChatInput';
import ChatUtilities from './ChatUtilities';

const EnhancedChatInterface = () => {
  const {
    input,
    isLoading,
    isTyping,
    currentConversation,
    messages,
    settings,
    handleInputChange,
    sendMessage
  } = useChatMessages();

  const {
    isStreaming,
    streamingContent,
    startStreaming,
    updateStreamingContent,
    stopStreaming
  } = useStreamingChat();

  const { updateStatus } = usePresenceStatus(currentConversation?.id || '');
  const { exportConversation } = ChatUtilities({ currentConversation, messages });

  // Handle typing status for real-time presence
  useEffect(() => {
    if (currentConversation?.id) {
      if (isTyping) {
        updateStatus('typing');
      } else {
        updateStatus('online');
      }
    }
  }, [isTyping, currentConversation?.id, updateStatus]);

  const handleSendMessage = async () => {
    await sendMessage(startStreaming, updateStreamingContent, stopStreaming);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          <ChatHeader
            currentConversation={currentConversation}
            settings={settings}
            isStreaming={isStreaming}
            onExport={exportConversation}
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ChatMessagesArea
          messages={messages}
          isStreaming={isStreaming}
          streamingContent={streamingContent}
        />
        
        <ChatInput
          input={input}
          isLoading={isLoading}
          isStreaming={isStreaming}
          settings={settings}
          onInputChange={handleInputChange}
          onSendMessage={handleSendMessage}
          onStopStreaming={stopStreaming}
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedChatInterface;
