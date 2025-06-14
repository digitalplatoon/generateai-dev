
-- Create AI response cache table for caching OpenAI responses
CREATE TABLE public.ai_response_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  response_data JSONB NOT NULL,
  model_used TEXT NOT NULL,
  settings_hash TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for cache lookups
CREATE INDEX idx_ai_response_cache_key ON public.ai_response_cache(cache_key);
CREATE INDEX idx_ai_response_cache_expires ON public.ai_response_cache(expires_at);

-- Enable RLS
ALTER TABLE public.ai_response_cache ENABLE ROW LEVEL SECURITY;

-- Create policy for cache access (can be more permissive since it's cached data)
CREATE POLICY "Users can access cache" 
  ON public.ai_response_cache 
  FOR ALL 
  USING (true);
