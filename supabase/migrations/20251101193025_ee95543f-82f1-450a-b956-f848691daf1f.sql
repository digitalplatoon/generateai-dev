-- Fix nullable user_id columns in RLS-protected tables
-- This prevents NULL-based RLS bypass vulnerabilities and ensures data integrity

-- 1. ai_audit_logs
ALTER TABLE ai_audit_logs ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE ai_audit_logs ADD CONSTRAINT fk_ai_audit_logs_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. bookmarks
ALTER TABLE bookmarks ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE bookmarks ADD CONSTRAINT fk_bookmarks_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. conversations
ALTER TABLE conversations ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE conversations ADD CONSTRAINT fk_conversations_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. onboarding_steps
ALTER TABLE onboarding_steps ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE onboarding_steps ADD CONSTRAINT fk_onboarding_steps_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 5. posts
ALTER TABLE posts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE posts ADD CONSTRAINT fk_posts_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. rag_documents
ALTER TABLE rag_documents ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE rag_documents ADD CONSTRAINT fk_rag_documents_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 7. user_ai_settings
ALTER TABLE user_ai_settings ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_ai_settings ADD CONSTRAINT fk_user_ai_settings_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 8. user_preferences
ALTER TABLE user_preferences ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_preferences ADD CONSTRAINT fk_user_preferences_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 9. user_progress
ALTER TABLE user_progress ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_progress ADD CONSTRAINT fk_user_progress_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 10. user_roles
ALTER TABLE user_roles ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 11. user_subscriptions
ALTER TABLE user_subscriptions ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_subscriptions ADD CONSTRAINT fk_user_subscriptions_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 12. user_usage
ALTER TABLE user_usage ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE user_usage ADD CONSTRAINT fk_user_usage_user 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;