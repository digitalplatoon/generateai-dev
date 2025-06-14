
import { Json } from '@/integrations/supabase/types';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  price_monthly: number | null;
  price_yearly: number | null;
  features: Json;
  limits: Json;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
  plan?: SubscriptionPlan;
}

export interface UserUsage {
  id: string;
  user_id: string;
  feature_type: string;
  usage_count: number;
  date: string;
  created_at: string;
}

export interface CurrentSubscription {
  plan_name: string;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  status: string;
  limits: Record<string, number>;
  features: Record<string, boolean>;
  expires_at: string | null;
}
