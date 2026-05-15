
-- 1. Block client INSERT/UPDATE/DELETE on user_subscriptions (only service_role writes)
CREATE POLICY "Block client inserts on subscriptions" ON public.user_subscriptions
  AS RESTRICTIVE FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY "Block client updates on subscriptions" ON public.user_subscriptions
  AS RESTRICTIVE FOR UPDATE TO authenticated, anon USING (false);
CREATE POLICY "Block client deletes on subscriptions" ON public.user_subscriptions
  AS RESTRICTIVE FOR DELETE TO authenticated, anon USING (false);

-- 2. Block client writes on SEO scan output tables (only service_role writes via edge functions)
CREATE POLICY "Block client inserts on psi results" ON public.seo_psi_results
  AS RESTRICTIVE FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY "Block client updates on psi results" ON public.seo_psi_results
  AS RESTRICTIVE FOR UPDATE TO authenticated, anon USING (false);
CREATE POLICY "Block client deletes on psi results" ON public.seo_psi_results
  AS RESTRICTIVE FOR DELETE TO authenticated, anon USING (false);

CREATE POLICY "Block client inserts on issues" ON public.seo_issues
  AS RESTRICTIVE FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY "Block client updates on issues" ON public.seo_issues
  AS RESTRICTIVE FOR UPDATE TO authenticated, anon USING (false);
CREATE POLICY "Block client deletes on issues" ON public.seo_issues
  AS RESTRICTIVE FOR DELETE TO authenticated, anon USING (false);

CREATE POLICY "Block client inserts on generated prompts" ON public.seo_generated_prompts
  AS RESTRICTIVE FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY "Block client updates on generated prompts" ON public.seo_generated_prompts
  AS RESTRICTIVE FOR UPDATE TO authenticated, anon USING (false);
CREATE POLICY "Block client deletes on generated prompts" ON public.seo_generated_prompts
  AS RESTRICTIVE FOR DELETE TO authenticated, anon USING (false);

-- 3. Allow conversation share recipients to view shares + messages (only while not expired)
CREATE POLICY "Recipients can view shares to them" ON public.conversation_shares
  FOR SELECT TO authenticated
  USING (auth.uid() = shared_with AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Recipients can view shared messages" ON public.conversation_messages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.conversation_shares cs
    WHERE cs.conversation_id = conversation_messages.conversation_id
      AND cs.shared_with = auth.uid()
      AND (cs.expires_at IS NULL OR cs.expires_at > now())
  ));

-- 4. Lock down SECURITY DEFINER functions: revoke from anon/PUBLIC; keep authenticated where needed
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.upsert_user_subscription(uuid, uuid, text, text, text, timestamptz, timestamptz) FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.search_chunks(vector, integer, double precision) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_rag_rate_limit(uuid, text, integer, integer) FROM PUBLIC, anon;
