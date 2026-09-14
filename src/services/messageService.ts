
import { supabase } from '@/integrations/supabase/client';
import { ConversationMessage } from '@/types/conversation';

export const messageService = {
  async fetchMessages(conversationId: string): Promise<ConversationMessage[]> {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Type cast the messages to ensure proper role types
    const typedMessages: ConversationMessage[] = ((data || []) as any[]).map((message: any) => ({
      ...message,
      role: message.role as 'user' | 'assistant' | 'system',
      metadata: null,
      tokens_used: message.tokens_used || undefined,
      model_used: message.model_used || undefined,
      temperature: message.temperature || undefined
    }));

    return typedMessages;
  },

  async addMessage(
    conversationId: string, 
    message: Omit<ConversationMessage, 'id' | 'created_at' | 'conversation_id'>
  ): Promise<ConversationMessage> {
    const { data, error } = await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: conversationId,
        ...message,
      } as any)
      .select()
      .single();

    if (error) throw error;

    // Type cast the returned data
    const row = data as any;
    const typedMessage: ConversationMessage = {
      ...row,
      role: row.role as 'user' | 'assistant' | 'system',
      metadata: null,
      tokens_used: row.tokens_used || undefined,
      model_used: row.model_used || undefined,
      temperature: row.temperature || undefined
    };

    return typedMessage;
  }
};
