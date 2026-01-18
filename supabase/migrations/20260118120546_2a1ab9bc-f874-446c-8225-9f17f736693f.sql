-- Fix the update_seo_updated_at function search path using CREATE OR REPLACE
CREATE OR REPLACE FUNCTION public.update_seo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public;