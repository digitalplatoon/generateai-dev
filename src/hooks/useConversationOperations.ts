
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { conversationService } from '@/services/conversationService';
import { messageService } from '@/services/messageService';
import { Conversation, ConversationMessage } from '@/types/conversation';

interface UseConversationOperationsProps {
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: ConversationMessage[] | ((prev: ConversationMessage[]) => ConversationMessage[])) => void;
  setIsLoading: (loading: boolean) => void;
  currentConversation: Conversation | null;
}

export const useConversationOperations = ({
  setConversations,
  setCurrentConversation,
  setMessages,
  setIsLoading,
  currentConversation
}: UseConversationOperationsProps) => {
  const { user } = useAuthContext();
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const conversations = await conversationService.fetchConversations();
      setConversations(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    }
  };

  const createConversation = async (title: string = 'New Conversation') => {
    if (!user) return null;

    try {
      const conversation = await conversationService.createConversation(user.id, title);
      await fetchConversations();
      setCurrentConversation(conversation);
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateConversation = async (id: string, updates: Partial<Conversation>) => {
    try {
      await conversationService.updateConversation(id, updates);
      await fetchConversations();
    } catch (error) {
      console.error('Error updating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to update conversation",
        variant: "destructive"
      });
    }
  };

  const deleteConversation = async (id: string) => {
    try {
      await conversationService.deleteConversation(id);
      await fetchConversations();
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive"
      });
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const messages = await messageService.fetchMessages(conversationId);
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = async (
    conversationId: string, 
    message: Omit<ConversationMessage, 'id' | 'created_at' | 'conversation_id'>
  ) => {
    try {
      const newMessage = await messageService.addMessage(conversationId, message);
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  };

  const shareConversation = async (conversationId: string) => {
    try {
      await conversationService.shareConversation(conversationId);
      await fetchConversations();
    } catch (error) {
      console.error('Error sharing conversation:', error);
      toast({
        title: "Error",
        description: "Failed to share conversation",
        variant: "destructive"
      });
    }
  };

  return {
    fetchConversations,
    createConversation,
    updateConversation,
    deleteConversation,
    fetchMessages,
    addMessage,
    shareConversation
  };
};
