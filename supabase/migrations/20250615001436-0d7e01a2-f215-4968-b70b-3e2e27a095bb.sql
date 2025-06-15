
-- Add proper foreign key relationships for conversation_shares table
ALTER TABLE public.conversation_shares 
ADD CONSTRAINT fk_conversation_shares_shared_by 
FOREIGN KEY (shared_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.conversation_shares 
ADD CONSTRAINT fk_conversation_shares_shared_with 
FOREIGN KEY (shared_with) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also add foreign key for conversations table
ALTER TABLE public.conversations 
ADD CONSTRAINT fk_conversations_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key for conversation_messages table
ALTER TABLE public.conversation_messages 
ADD CONSTRAINT fk_conversation_messages_conversation_id 
FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;

-- Add foreign key for ai_audit_logs table
ALTER TABLE public.ai_audit_logs 
ADD CONSTRAINT fk_ai_audit_logs_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.ai_audit_logs 
ADD CONSTRAINT fk_ai_audit_logs_conversation_id 
FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;
