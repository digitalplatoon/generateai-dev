
-- Create tables for enhanced security and context awareness

-- Conversation persistence table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  context_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_shared BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  do_not_train BOOLEAN DEFAULT true
);

-- Individual messages within conversations
CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  tokens_used INTEGER DEFAULT 0,
  model_used TEXT,
  temperature REAL DEFAULT 0.7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit logging for all AI interactions
CREATE TABLE IF NOT EXISTS public.ai_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  ip_address INET,
  user_agent TEXT,
  status TEXT NOT NULL,
  error_message TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User AI preferences and settings
CREATE TABLE IF NOT EXISTS public.user_ai_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  temperature REAL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 1000 CHECK (max_tokens > 0),
  do_not_train_consent BOOLEAN DEFAULT true,
  data_retention_days INTEGER DEFAULT 30,
  preferred_model TEXT DEFAULT 'gpt-4o-mini',
  custom_instructions TEXT,
  stop_sequences TEXT[],
  streaming_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Project context tracking
CREATE TABLE IF NOT EXISTS public.project_contexts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  file_structure JSONB DEFAULT '{}',
  technologies_used TEXT[],
  description TEXT,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Conversation sharing and collaboration
CREATE TABLE IF NOT EXISTS public.conversation_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_level TEXT DEFAULT 'read' CHECK (permission_level IN ('read', 'write', 'admin')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_shares ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id OR is_shared = true);

CREATE POLICY "Users can insert their own conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" ON public.conversations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations" ON public.conversations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for conversation messages
CREATE POLICY "Users can view messages from accessible conversations" ON public.conversation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id 
      AND (user_id = auth.uid() OR is_shared = true)
    )
  );

CREATE POLICY "Users can insert messages to their conversations" ON public.conversation_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id 
      AND user_id = auth.uid()
    )
  );

-- RLS policies for audit logs
CREATE POLICY "Users can view their own audit logs" ON public.ai_audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs" ON public.ai_audit_logs
  FOR INSERT WITH CHECK (true);

-- RLS policies for user AI settings
CREATE POLICY "Users can view their own AI settings" ON public.user_ai_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI settings" ON public.user_ai_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI settings" ON public.user_ai_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for project contexts
CREATE POLICY "Users can view their own project contexts" ON public.project_contexts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own project contexts" ON public.project_contexts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project contexts" ON public.project_contexts
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for conversation shares
CREATE POLICY "Users can view shares involving them" ON public.conversation_shares
  FOR SELECT USING (auth.uid() = shared_by OR auth.uid() = shared_with);

CREATE POLICY "Users can create shares for their conversations" ON public.conversation_shares
  FOR INSERT WITH CHECK (
    auth.uid() = shared_by AND
    EXISTS (
      SELECT 1 FROM public.conversations 
      WHERE id = conversation_id 
      AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created_at ON public.conversation_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_user_id ON public.ai_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_audit_logs_created_at ON public.ai_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_contexts_user_id ON public.project_contexts(user_id);
CREATE INDEX IF NOT EXISTS idx_project_contexts_last_accessed ON public.project_contexts(last_accessed DESC);

-- Add triggers for updated_at
CREATE TRIGGER handle_updated_at_conversations BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_ai_settings BEFORE UPDATE ON public.user_ai_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_project_contexts BEFORE UPDATE ON public.project_contexts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate share tokens
CREATE OR REPLACE FUNCTION public.generate_conversation_share_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.is_shared = true AND NEW.share_token IS NULL THEN
    NEW.share_token = encode(gen_random_bytes(32), 'base64url');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_share_token_trigger
  BEFORE INSERT OR UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_conversation_share_token();
