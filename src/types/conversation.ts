
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
  isStreaming?: boolean;
}
