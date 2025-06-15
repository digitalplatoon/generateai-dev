
import React from 'react';

interface Conversation {
  id: string;
  title: string;
}

interface ChatUtilitiesProps {
  currentConversation: Conversation | null;
  messages: any[];
}

const ChatUtilities = ({ currentConversation, messages }: ChatUtilitiesProps) => {
  const exportConversation = () => {
    if (!currentConversation || messages.length === 0) return;
    
    const exportData = {
      title: currentConversation.title,
      created_at: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.created_at
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${currentConversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { exportConversation };
};

export default ChatUtilities;
