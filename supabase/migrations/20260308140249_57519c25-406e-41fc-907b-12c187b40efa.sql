
-- Convert all RESTRICTIVE RLS policies to PERMISSIVE across all tables.
-- PostgreSQL CREATE POLICY defaults to PERMISSIVE, so we just drop and recreate.

-- ===== profiles =====
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- ===== conversations =====
DROP POLICY IF EXISTS "Users can create their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;

CREATE POLICY "Users can create their own conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own conversations" ON public.conversations FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own conversations" ON public.conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own conversations" ON public.conversations FOR SELECT USING (auth.uid() = user_id);

-- ===== conversation_messages =====
DROP POLICY IF EXISTS "Users can create messages in their conversations" ON public.conversation_messages;
DROP POLICY IF EXISTS "Users can view messages from their conversations" ON public.conversation_messages;

CREATE POLICY "Users can create messages in their conversations" ON public.conversation_messages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = conversation_messages.conversation_id AND conversations.user_id = auth.uid()));
CREATE POLICY "Users can view messages from their conversations" ON public.conversation_messages FOR SELECT USING (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = conversation_messages.conversation_id AND conversations.user_id = auth.uid()));

-- ===== conversation_shares =====
DROP POLICY IF EXISTS "Users can create shares for their conversations" ON public.conversation_shares;
DROP POLICY IF EXISTS "Users can delete shares for their conversations" ON public.conversation_shares;
DROP POLICY IF EXISTS "Users can update shares for their conversations" ON public.conversation_shares;
DROP POLICY IF EXISTS "Users can view shares for their conversations" ON public.conversation_shares;

CREATE POLICY "Users can create shares for their conversations" ON public.conversation_shares FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = conversation_shares.conversation_id AND conversations.user_id = auth.uid()));
CREATE POLICY "Users can delete shares for their conversations" ON public.conversation_shares FOR DELETE USING (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = conversation_shares.conversation_id AND conversations.user_id = auth.uid()));
CREATE POLICY "Users can update shares for their conversations" ON public.conversation_shares FOR UPDATE USING (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = conversation_shares.conversation_id AND conversations.user_id = auth.uid()));
CREATE POLICY "Users can view shares for their conversations" ON public.conversation_shares FOR SELECT USING (EXISTS (SELECT 1 FROM conversations WHERE conversations.id = conversation_shares.conversation_id AND conversations.user_id = auth.uid()));

-- ===== posts =====
DROP POLICY IF EXISTS "Admins can delete any post" ON public.posts;
DROP POLICY IF EXISTS "Admins can update any post" ON public.posts;
DROP POLICY IF EXISTS "Admins can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Users can view their own posts" ON public.posts;

CREATE POLICY "Admins can delete any post" ON public.posts FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update any post" ON public.posts FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all posts" ON public.posts FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view published posts" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "Users can view their own posts" ON public.posts FOR SELECT USING (auth.uid() = user_id);

-- ===== user_ai_settings =====
DROP POLICY IF EXISTS "Users can insert their own AI settings" ON public.user_ai_settings;
DROP POLICY IF EXISTS "Users can update their own AI settings" ON public.user_ai_settings;
DROP POLICY IF EXISTS "Users can view their own AI settings" ON public.user_ai_settings;

CREATE POLICY "Users can insert their own AI settings" ON public.user_ai_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own AI settings" ON public.user_ai_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own AI settings" ON public.user_ai_settings FOR SELECT USING (auth.uid() = user_id);

-- ===== user_preferences =====
DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);

-- ===== user_progress =====
DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can view their own progress" ON public.user_progress;

CREATE POLICY "Users can update their own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

-- ===== onboarding_steps =====
DROP POLICY IF EXISTS "Users can manage their own onboarding steps" ON public.onboarding_steps;
DROP POLICY IF EXISTS "Users can view their own onboarding steps" ON public.onboarding_steps;

CREATE POLICY "Users can manage their own onboarding steps" ON public.onboarding_steps FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own onboarding steps" ON public.onboarding_steps FOR SELECT USING (auth.uid() = user_id);

-- ===== bookmarks =====
DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;

CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

-- ===== ai_audit_logs =====
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.ai_audit_logs;
DROP POLICY IF EXISTS "Users can create their own audit logs" ON public.ai_audit_logs;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.ai_audit_logs;

CREATE POLICY "Admins can view all audit logs" ON public.ai_audit_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create their own audit logs" ON public.ai_audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own audit logs" ON public.ai_audit_logs FOR SELECT USING (auth.uid() = user_id);

-- ===== rag_documents =====
DROP POLICY IF EXISTS "Users can manage their own documents" ON public.rag_documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON public.rag_documents;

CREATE POLICY "Users can manage their own documents" ON public.rag_documents FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own documents" ON public.rag_documents FOR SELECT USING (auth.uid() = user_id);

-- ===== rag_chunks =====
DROP POLICY IF EXISTS "Users can delete chunks of their documents" ON public.rag_chunks;
DROP POLICY IF EXISTS "Users can insert chunks for their documents" ON public.rag_chunks;
DROP POLICY IF EXISTS "Users can update chunks of their documents" ON public.rag_chunks;
DROP POLICY IF EXISTS "Users can view chunks of their documents" ON public.rag_chunks;

CREATE POLICY "Users can delete chunks of their documents" ON public.rag_chunks FOR DELETE USING (EXISTS (SELECT 1 FROM rag_documents WHERE rag_documents.id = rag_chunks.document_id AND rag_documents.user_id = auth.uid()));
CREATE POLICY "Users can insert chunks for their documents" ON public.rag_chunks FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM rag_documents WHERE rag_documents.id = rag_chunks.document_id AND rag_documents.user_id = auth.uid()));
CREATE POLICY "Users can update chunks of their documents" ON public.rag_chunks FOR UPDATE USING (EXISTS (SELECT 1 FROM rag_documents WHERE rag_documents.id = rag_chunks.document_id AND rag_documents.user_id = auth.uid()));
CREATE POLICY "Users can view chunks of their documents" ON public.rag_chunks FOR SELECT USING (EXISTS (SELECT 1 FROM rag_documents WHERE rag_documents.id = rag_chunks.document_id AND rag_documents.user_id = auth.uid()));

-- ===== rag_rate_limits =====
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rag_rate_limits;
DROP POLICY IF EXISTS "Users can view own rate limits" ON public.rag_rate_limits;

CREATE POLICY "Service role can manage rate limits" ON public.rag_rate_limits FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users can view own rate limits" ON public.rag_rate_limits FOR SELECT USING (auth.uid() = user_id);

-- ===== user_roles =====
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- ===== subscription_plans =====
DROP POLICY IF EXISTS "Admins can manage subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;

CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans FOR SELECT USING (true);

-- ===== user_subscriptions =====
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Subscriptions managed by system only - no user deletes" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Subscriptions managed by system only - no user inserts" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Subscriptions managed by system only - no user updates" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.user_subscriptions;

CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
-- Keep system-only restrictions as RESTRICTIVE on top of permissive SELECT
-- Actually, since there are no permissive INSERT/UPDATE/DELETE policies, those operations are blocked by default.
-- No need for explicit deny policies.

-- ===== user_usage =====
DROP POLICY IF EXISTS "Admins can view all usage" ON public.user_usage;
DROP POLICY IF EXISTS "Service role can manage usage records" ON public.user_usage;
DROP POLICY IF EXISTS "Users can view their own usage" ON public.user_usage;

CREATE POLICY "Admins can view all usage" ON public.user_usage FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Service role can manage usage records" ON public.user_usage FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users can view their own usage" ON public.user_usage FOR SELECT USING (auth.uid() = user_id);

-- ===== seo_projects =====
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.seo_projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON public.seo_projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.seo_projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.seo_projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.seo_projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.seo_projects;

CREATE POLICY "Admins can manage all projects" ON public.seo_projects FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all projects" ON public.seo_projects FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can create their own projects" ON public.seo_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.seo_projects FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public.seo_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own projects" ON public.seo_projects FOR SELECT USING (auth.uid() = user_id);

-- ===== seo_project_urls =====
DROP POLICY IF EXISTS "Admins can manage all URLs" ON public.seo_project_urls;
DROP POLICY IF EXISTS "Admins can view all URLs" ON public.seo_project_urls;
DROP POLICY IF EXISTS "Users can manage URLs of their projects" ON public.seo_project_urls;
DROP POLICY IF EXISTS "Users can view URLs of their projects" ON public.seo_project_urls;

CREATE POLICY "Admins can manage all URLs" ON public.seo_project_urls FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all URLs" ON public.seo_project_urls FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage URLs of their projects" ON public.seo_project_urls FOR ALL USING (EXISTS (SELECT 1 FROM seo_projects WHERE seo_projects.id = seo_project_urls.project_id AND seo_projects.user_id = auth.uid()));
CREATE POLICY "Users can view URLs of their projects" ON public.seo_project_urls FOR SELECT USING (EXISTS (SELECT 1 FROM seo_projects WHERE seo_projects.id = seo_project_urls.project_id AND seo_projects.user_id = auth.uid()));

-- ===== seo_scan_runs =====
DROP POLICY IF EXISTS "Admins can manage all scans" ON public.seo_scan_runs;
DROP POLICY IF EXISTS "Admins can view all scans" ON public.seo_scan_runs;
DROP POLICY IF EXISTS "Users can manage scans of their projects" ON public.seo_scan_runs;
DROP POLICY IF EXISTS "Users can view scans of their projects" ON public.seo_scan_runs;

CREATE POLICY "Admins can manage all scans" ON public.seo_scan_runs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view all scans" ON public.seo_scan_runs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can manage scans of their projects" ON public.seo_scan_runs FOR ALL USING (EXISTS (SELECT 1 FROM seo_projects WHERE seo_projects.id = seo_scan_runs.project_id AND seo_projects.user_id = auth.uid()));
CREATE POLICY "Users can view scans of their projects" ON public.seo_scan_runs FOR SELECT USING (EXISTS (SELECT 1 FROM seo_projects WHERE seo_projects.id = seo_scan_runs.project_id AND seo_projects.user_id = auth.uid()));

-- ===== seo_psi_results =====
DROP POLICY IF EXISTS "Admins can view all PSI results" ON public.seo_psi_results;
DROP POLICY IF EXISTS "Users can view PSI results of their projects" ON public.seo_psi_results;

CREATE POLICY "Admins can view all PSI results" ON public.seo_psi_results FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view PSI results of their projects" ON public.seo_psi_results FOR SELECT USING (EXISTS (SELECT 1 FROM seo_scan_runs sr JOIN seo_projects p ON sr.project_id = p.id WHERE sr.id = seo_psi_results.scan_run_id AND p.user_id = auth.uid()));

-- ===== seo_issues =====
DROP POLICY IF EXISTS "Admins can view all issues" ON public.seo_issues;
DROP POLICY IF EXISTS "Users can view issues of their projects" ON public.seo_issues;

CREATE POLICY "Admins can view all issues" ON public.seo_issues FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view issues of their projects" ON public.seo_issues FOR SELECT USING (EXISTS (SELECT 1 FROM seo_psi_results pr JOIN seo_scan_runs sr ON pr.scan_run_id = sr.id JOIN seo_projects p ON sr.project_id = p.id WHERE pr.id = seo_issues.psi_result_id AND p.user_id = auth.uid()));

-- ===== seo_generated_prompts =====
DROP POLICY IF EXISTS "Admins can view all prompts" ON public.seo_generated_prompts;
DROP POLICY IF EXISTS "Users can view prompts of their projects" ON public.seo_generated_prompts;

CREATE POLICY "Admins can view all prompts" ON public.seo_generated_prompts FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can view prompts of their projects" ON public.seo_generated_prompts FOR SELECT USING (EXISTS (SELECT 1 FROM seo_scan_runs sr JOIN seo_projects p ON sr.project_id = p.id WHERE sr.id = seo_generated_prompts.scan_run_id AND p.user_id = auth.uid()));

-- ===== seo_prompt_templates =====
DROP POLICY IF EXISTS "Admins can manage templates" ON public.seo_prompt_templates;
DROP POLICY IF EXISTS "Anyone can view templates" ON public.seo_prompt_templates;

CREATE POLICY "Admins can manage templates" ON public.seo_prompt_templates FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view templates" ON public.seo_prompt_templates FOR SELECT USING (true);
