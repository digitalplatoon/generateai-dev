
-- Fix security vulnerability in generate_conversation_share_token function
-- by adding SET search_path TO '' clause
CREATE OR REPLACE FUNCTION public.generate_conversation_share_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF NEW.is_shared = true AND NEW.share_token IS NULL THEN
    NEW.share_token = encode(gen_random_bytes(32), 'base64url');
  END IF;
  RETURN NEW;
END;
$$;
