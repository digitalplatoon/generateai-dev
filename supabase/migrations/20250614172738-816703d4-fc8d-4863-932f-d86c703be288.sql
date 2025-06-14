
-- Create subscription tiers enum
CREATE TYPE public.subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');

-- Create usage tracking table
CREATE TABLE public.user_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL, -- e.g., 'rag_query', 'document_upload', 'chat_message'
  usage_count INTEGER NOT NULL DEFAULT 1,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_type, date)
);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  tier subscription_tier NOT NULL,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}', -- e.g., {"rag_queries_per_day": 100, "documents_limit": 10}
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'pending'
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_usage
CREATE POLICY "Users can view their own usage" 
  ON public.user_usage 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
  ON public.user_usage 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscription_plans (public read access)
CREATE POLICY "Anyone can view active subscription plans" 
  ON public.subscription_plans 
  FOR SELECT 
  USING (active = true);

CREATE POLICY "Only admins can manage subscription plans" 
  ON public.subscription_plans 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions" 
  ON public.user_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage user subscriptions" 
  ON public.user_subscriptions 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, tier, price_monthly, price_yearly, features, limits) VALUES 
('Free Plan', 'free', 0.00, 0.00, 
 '{"rag_lab": true, "basic_chat": true, "community_access": true}',
 '{"rag_queries_per_day": 10, "documents_limit": 3, "chat_messages_per_day": 50}'),
('Basic Plan', 'basic', 9.99, 99.99,
 '{"rag_lab": true, "advanced_chat": true, "email_support": true, "api_access": true}',
 '{"rag_queries_per_day": 100, "documents_limit": 20, "chat_messages_per_day": 500}'),
('Premium Plan', 'premium', 29.99, 299.99,
 '{"rag_lab": true, "advanced_chat": true, "priority_support": true, "api_access": true, "custom_models": true, "team_collaboration": true}',
 '{"rag_queries_per_day": 1000, "documents_limit": 100, "chat_messages_per_day": 2000}'),
('Enterprise Plan', 'enterprise', 99.99, 999.99,
 '{"rag_lab": true, "advanced_chat": true, "dedicated_support": true, "api_access": true, "custom_models": true, "team_collaboration": true, "white_label": true, "sso": true}',
 '{"rag_queries_per_day": -1, "documents_limit": -1, "chat_messages_per_day": -1}');

-- Create function to get user's current subscription
CREATE OR REPLACE FUNCTION public.get_user_subscription(_user_id UUID)
RETURNS TABLE (
  plan_name TEXT,
  tier subscription_tier,
  status TEXT,
  limits JSONB,
  features JSONB,
  expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    sp.name,
    sp.tier,
    us.status,
    sp.limits,
    sp.features,
    us.expires_at
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = _user_id 
    AND us.status = 'active'
    AND (us.expires_at IS NULL OR us.expires_at > now())
  ORDER BY us.created_at DESC
  LIMIT 1;
$$;

-- Create function to check usage limits
CREATE OR REPLACE FUNCTION public.check_usage_limit(_user_id UUID, _feature_type TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH user_plan AS (
    SELECT limits FROM public.get_user_subscription(_user_id)
  ),
  daily_usage AS (
    SELECT COALESCE(SUM(usage_count), 0) as count
    FROM public.user_usage 
    WHERE user_id = _user_id 
      AND feature_type = _feature_type 
      AND date = CURRENT_DATE
  ),
  limit_key AS (
    SELECT CASE 
      WHEN _feature_type = 'rag_query' THEN 'rag_queries_per_day'
      WHEN _feature_type = 'chat_message' THEN 'chat_messages_per_day'
      WHEN _feature_type = 'document_upload' THEN 'documents_limit'
      ELSE _feature_type || '_per_day'
    END as key
  )
  SELECT 
    CASE 
      WHEN up.limits IS NULL THEN false -- No subscription found
      WHEN (up.limits->>(lk.key))::int = -1 THEN true -- Unlimited
      WHEN (up.limits->>(lk.key))::int > du.count THEN true -- Under limit
      ELSE false -- Over limit
    END
  FROM user_plan up, daily_usage du, limit_key lk;
$$;

-- Create function to record usage
CREATE OR REPLACE FUNCTION public.record_usage(_user_id UUID, _feature_type TEXT, _count INTEGER DEFAULT 1)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
  INSERT INTO public.user_usage (user_id, feature_type, usage_count, date)
  VALUES (_user_id, _feature_type, _count, CURRENT_DATE)
  ON CONFLICT (user_id, feature_type, date)
  DO UPDATE SET usage_count = user_usage.usage_count + _count;
$$;

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
