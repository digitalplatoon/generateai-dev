-- Drop the ai_response_cache table and its policies (dead code with overly permissive RLS)
DROP TABLE IF EXISTS public.ai_response_cache CASCADE;