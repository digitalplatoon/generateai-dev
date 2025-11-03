-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price_monthly, price_yearly, features, max_tokens, stripe_price_id_monthly, stripe_price_id_yearly) VALUES
  ('Starter', 0, 0, '["1,000 AI tokens/month", "Basic chat features", "Community support", "Limited RAG documents"]'::jsonb, 1000, NULL, NULL),
  ('Developer', 19.99, 199.99, '["50,000 AI tokens/month", "Advanced chat features", "Priority support", "Unlimited RAG documents", "API access"]'::jsonb, 50000, NULL, NULL),
  ('Pro', 49.99, 499.99, '["200,000 AI tokens/month", "All chat features", "24/7 priority support", "Unlimited RAG documents", "Full API access", "Custom models"]'::jsonb, 200000, NULL, NULL),
  ('Enterprise', 199.99, 1999.99, '["Unlimited AI tokens", "Dedicated account manager", "Custom integrations", "SLA guarantees", "On-premise deployment option", "Custom training"]'::jsonb, -1, NULL, NULL)
ON CONFLICT DO NOTHING;