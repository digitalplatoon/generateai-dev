# Project Architecture Rules

- Use `EnhancedLogo` as the single reusable GenerateAI.dev brand lockup in application UI so the mark and wordmark stay consistent.
- Billing edge functions identify Stripe customers only through server-written `supabase_user_id` metadata, never by matching an unverified email address.