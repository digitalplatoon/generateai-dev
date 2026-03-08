
-- Fix ai_audit_logs: the existing INSERT policy "Users can create their own audit logs" 
-- already has WITH CHECK (auth.uid() = user_id), which is correct.
-- We just need to check if there's a separate overly permissive policy.
-- Based on the scan, there may be a "System can insert audit logs" policy with CHECK(true).

-- Drop any overly permissive system insert policy on ai_audit_logs
DROP POLICY IF EXISTS "System can insert audit logs" ON public.ai_audit_logs;

-- Fix rag_rate_limits: replace the overly permissive "System can manage rate limits" 
-- policy that uses USING(true) WITH CHECK(true) for all authenticated users.
-- Rate limits should only be managed by the service role (edge functions).
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rag_rate_limits;

CREATE POLICY "Service role can manage rate limits"
  ON public.rag_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
