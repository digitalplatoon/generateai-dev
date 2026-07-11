
-- Trigger functions: only the trigger firing needs to execute them.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_seo_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Admin/service-only SECURITY DEFINER functions: callable only by service_role
-- (edge functions using the service key).
REVOKE EXECUTE ON FUNCTION public.upsert_user_subscription(uuid, uuid, text, text, text, timestamptz, timestamptz) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_rag_rate_limit(uuid, text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_user_subscription(uuid, uuid, text, text, text, timestamptz, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_rag_rate_limit(uuid, text, integer, integer) TO service_role;

-- Keep has_role and search_chunks callable by authenticated users (required by
-- RLS policies and the RAG query flow).
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_chunks(vector, integer, double precision) TO authenticated;
