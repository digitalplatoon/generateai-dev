-- Create SECURITY DEFINER function to safely manage subscription records
-- This allows edge functions to update subscriptions without exposing write access to clients
CREATE OR REPLACE FUNCTION public.upsert_user_subscription(
  p_user_id uuid,
  p_plan_id uuid,
  p_status text,
  p_stripe_subscription_id text,
  p_stripe_customer_id text,
  p_current_period_start timestamp with time zone,
  p_current_period_end timestamp with time zone
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (
    user_id,
    plan_id,
    status,
    stripe_subscription_id,
    stripe_customer_id,
    current_period_start,
    current_period_end,
    updated_at
  )
  VALUES (
    p_user_id,
    p_plan_id,
    p_status,
    p_stripe_subscription_id,
    p_stripe_customer_id,
    p_current_period_start,
    p_current_period_end,
    now()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    plan_id = EXCLUDED.plan_id,
    status = EXCLUDED.status,
    stripe_subscription_id = EXCLUDED.stripe_subscription_id,
    stripe_customer_id = EXCLUDED.stripe_customer_id,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = now();
END;
$$;

-- Add policy to allow service role to manage user_usage for usage tracking
CREATE POLICY "Service role can manage usage records"
ON public.user_usage
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);