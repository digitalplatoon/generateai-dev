
import { useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useConversationState } from './useConversationState';
import { useConversationOperations } from './useConversationOperations';

export type { Conversation, ConversationMessage } from '@/types/conversation';

export const useConversations = () => {
  const { user } = useAuthContext();
  const {
    conversations,
    setConversations,
    currentConversation,
    setCurrentConversation,
    messages,
    setMessages,
    isLoading,
    setIsLoading
  } = useConversationState();

  const operations = useConversationOperations({
    setConversations,
    setCurrentConversation,
    setMessages,
    setIsLoading,
    currentConversation
  });

  useEffect(() => {
    if (user) {
      operations.fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      operations.fetchMessages(currentConversation.id);
    }
  }, [currentConversation]);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    setCurrentConversation,
    ...operations
  };
};
