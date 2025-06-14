
import { supabase } from '@/integrations/supabase/client';
import { Conversation, ConversationMessage } from '@/types/conversation';

export const conversationService = {
  async fetchConversations(): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createConversation(userId: string, title: string = 'New Conversation'): Promise<Conversation> {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title,
        context_data: {},
        do_not_train: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteConversation(id: string): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async shareConversation(conversationId: string): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .update({ is_shared: true })
      .eq('id', conversationId);

    if (error) throw error;
  }
};
