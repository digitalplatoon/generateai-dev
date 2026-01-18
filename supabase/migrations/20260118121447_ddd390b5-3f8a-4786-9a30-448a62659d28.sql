-- Remove overly permissive "USING (true) / WITH CHECK (true)" policies introduced for SEO tables
DROP POLICY IF EXISTS "System can manage PSI results" ON public.seo_psi_results;
DROP POLICY IF EXISTS "System can manage issues" ON public.seo_issues;
DROP POLICY IF EXISTS "System can manage prompts" ON public.seo_generated_prompts;