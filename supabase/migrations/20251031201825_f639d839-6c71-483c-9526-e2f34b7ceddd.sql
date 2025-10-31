-- Create rate limiting table for RAG functions
CREATE TABLE IF NOT EXISTS public.rag_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rag_rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can only view their own rate limits
CREATE POLICY "Users can view own rate limits"
ON public.rag_rate_limits
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert rate limits
CREATE POLICY "System can manage rate limits"
ON public.rag_rate_limits
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for efficient lookups
CREATE INDEX idx_rag_rate_limits_user_endpoint ON public.rag_rate_limits(user_id, endpoint, window_start);

-- Create trigger for updated_at
CREATE TRIGGER update_rag_rate_limits_updated_at
BEFORE UPDATE ON public.rag_rate_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rag_rate_limit(
  p_user_id UUID,
  p_endpoint TEXT,
  p_max_requests INTEGER,
  p_window_minutes INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_count INTEGER;
  v_window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get current count for this user/endpoint in the time window
  SELECT COALESCE(SUM(request_count), 0)
  INTO v_current_count
  FROM rag_rate_limits
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint
    AND window_start > v_window_start;
  
  -- Check if limit exceeded
  IF v_current_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;
  
  -- Record this request
  INSERT INTO rag_rate_limits (user_id, endpoint, request_count, window_start)
  VALUES (p_user_id, p_endpoint, 1, now())
  ON CONFLICT (user_id, endpoint, window_start)
  DO UPDATE SET
    request_count = rag_rate_limits.request_count + 1,
    updated_at = now();
  
  RETURN TRUE;
END;
$$;

-- Add unique constraint for upsert
ALTER TABLE public.rag_rate_limits 
ADD CONSTRAINT rag_rate_limits_user_endpoint_window_key 
UNIQUE (user_id, endpoint, window_start);