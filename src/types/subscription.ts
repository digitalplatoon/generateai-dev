
import { Json } from '@/integrations/supabase/types';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier?: 'free' | 'basic' | 'premium' | 'enterprise';
  price_monthly: number | null;
  price_yearly: number | null;
  features: Json;
  limits?: Json;
  active?: boolean;
  max_tokens?: number | null;
  stripe_price_id_monthly?: string | null;
  stripe_price_id_yearly?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  stripe_subscription_id: string | null;
  stripe_customer_id?: string | null;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export interface UserUsage {
  id: string;
  user_id: string;
  requests_count: number;
  tokens_used: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export interface CurrentSubscription {
  plan_name: string;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  status: string;
  limits: Record<string, number>;
  features: Record<string, boolean>;
  expires_at: string | null;
}
