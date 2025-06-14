
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  context_data: any;
  created_at: string;
  updated_at: string;
  is_shared: boolean;
  share_token?: string;
  do_not_train: boolean;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata: any;
  tokens_used?: number;
  model_used?: string;
  temperature?: number;
  created_at: string;
}

export const useConversations = () => {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
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
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title,
          context_data: {},
          do_not_train: true
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchConversations();
      setCurrentConversation(data);
      return data;
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
      const { error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
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
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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
      const { data, error } = await supabase
        .from('conversation_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Type cast the messages to ensure proper role types
      const typedMessages: ConversationMessage[] = (data || []).map(message => ({
        ...message,
        role: message.role as 'user' | 'assistant' | 'system',
        tokens_used: message.tokens_used || undefined,
        model_used: message.model_used || undefined,
        temperature: message.temperature || undefined
      }));
      
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = async (conversationId: string, message: Omit<ConversationMessage, 'id' | 'created_at' | 'conversation_id'>) => {
    try {
      const { data, error } = await supabase
        .from('conversation_messages')
        .insert({
          conversation_id: conversationId,
          ...message
        })
        .select()
        .single();

      if (error) throw error;
      
      // Type cast the returned data
      const typedMessage: ConversationMessage = {
        ...data,
        role: data.role as 'user' | 'assistant' | 'system',
        tokens_used: data.tokens_used || undefined,
        model_used: data.model_used || undefined,
        temperature: data.temperature || undefined
      };
      
      setMessages(prev => [...prev, typedMessage]);
      return typedMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  };

  const shareConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ is_shared: true })
        .eq('id', conversationId);

      if (error) throw error;
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

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation.id);
    }
  }, [currentConversation]);

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    setCurrentConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    shareConversation,
    fetchConversations
  };
};
