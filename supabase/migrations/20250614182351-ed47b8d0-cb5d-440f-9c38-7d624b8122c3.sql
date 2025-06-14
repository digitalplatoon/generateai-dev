
-- Insert sample subscription plans with realistic features and limits
INSERT INTO public.subscription_plans (name, tier, price_monthly, price_yearly, features, limits) VALUES 
('Starter', 'free', 0.00, 0.00, 
 '{"rag_lab": true, "basic_chat": true, "community_access": true, "email_support": false}',
 '{"rag_queries_per_day": 10, "documents_limit": 3, "chat_messages_per_day": 50}'),
('Developer', 'basic', 19.99, 199.99,
 '{"rag_lab": true, "advanced_chat": true, "email_support": true, "api_access": true, "priority_processing": false}',
 '{"rag_queries_per_day": 200, "documents_limit": 25, "chat_messages_per_day": 1000}'),
('Pro', 'premium', 49.99, 499.99,
 '{"rag_lab": true, "advanced_chat": true, "priority_support": true, "api_access": true, "custom_models": true, "team_collaboration": true, "priority_processing": true}',
 '{"rag_queries_per_day": 1000, "documents_limit": 100, "chat_messages_per_day": 5000}'),
('Enterprise', 'enterprise', 199.99, 1999.99,
 '{"rag_lab": true, "advanced_chat": true, "dedicated_support": true, "api_access": true, "custom_models": true, "team_collaboration": true, "white_label": true, "sso": true, "priority_processing": true, "custom_integrations": true}',
 '{"rag_queries_per_day": -1, "documents_limit": -1, "chat_messages_per_day": -1}')
ON CONFLICT (name) DO UPDATE SET 
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits;
