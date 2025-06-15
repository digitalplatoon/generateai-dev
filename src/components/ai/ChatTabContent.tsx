
import React from 'react';
import ConversationSidebar from './ConversationSidebar';
import EnhancedChatInterface from './EnhancedChatInterface';
import TeamCollaborationPanel from './TeamCollaborationPanel';
import { useConversations } from '@/hooks/useConversations';

const ChatTabContent = () => {
  const { currentConversation } = useConversations();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 h-full">
      <div className="lg:col-span-1">
        <ConversationSidebar />
      </div>
      <div className="lg:col-span-4">
        <EnhancedChatInterface />
      </div>
      <div className="lg:col-span-1">
        <TeamCollaborationPanel conversationId={currentConversation?.id} />
      </div>
    </div>
  );
};

export default ChatTabContent;
