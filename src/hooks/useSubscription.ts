import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useStripeIntegration } from '@/hooks/useStripeIntegration';
import { SubscriptionPlan, CurrentSubscription, UserUsage } from '@/types/subscription';

export const useSubscription = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const { checkSubscriptionStatus } = useStripeIntegration();
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [dailyUsage, setDailyUsage] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentSubscription = async () => {
    if (!user) {
      setCurrentSubscription(null);
      return;
    }

    try {
      // First try to get subscription from Stripe
      const stripeData = await checkSubscriptionStatus();
      
      if (stripeData) {
        setCurrentSubscription({
          plan_name: stripeData.plan_name || 'Starter',
          tier: stripeData.subscription_tier || 'free',
          status: 'active',
          limits: getDefaultLimits(stripeData.subscription_tier || 'free'),
          features: getDefaultFeatures(stripeData.subscription_tier || 'free'),
          expires_at: stripeData.subscription_end
        });
        return;
      }

      // Fallback to database lookup
      const { data, error } = await supabase.rpc('get_user_subscription', {
        _user_id: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setCurrentSubscription(data[0] as CurrentSubscription);
      } else {
        // Default to free plan if no subscription found
        setCurrentSubscription({
          plan_name: 'Starter',
          tier: 'free',
          status: 'active',
          limits: getDefaultLimits('free'),
          features: getDefaultFeatures('free'),
          expires_at: null
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Set free plan as fallback on error
      setCurrentSubscription({
        plan_name: 'Starter',
        tier: 'free',
        status: 'active',
        limits: getDefaultLimits('free'),
        features: getDefaultFeatures('free'),
        expires_at: null
      });
    }
  };

  const getDefaultLimits = (tier: string) => {
    switch (tier) {
      case 'basic':
        return {
          rag_queries_per_day: 200,
          documents_limit: 25,
          chat_messages_per_day: 1000
        };
      case 'premium':
        return {
          rag_queries_per_day: 1000,
          documents_limit: 100,
          chat_messages_per_day: 5000
        };
      case 'enterprise':
        return {
          rag_queries_per_day: -1,
          documents_limit: -1,
          chat_messages_per_day: -1
        };
      default: // free
        return {
          rag_queries_per_day: 10,
          documents_limit: 3,
          chat_messages_per_day: 50
        };
    }
  };

  const getDefaultFeatures = (tier: string) => {
    const baseFeatures = {
      rag_lab: true,
      basic_chat: true,
      community_access: true
    };

    switch (tier) {
      case 'basic':
        return {
          ...baseFeatures,
          advanced_chat: true,
          email_support: true,
          api_access: true
        };
      case 'premium':
        return {
          ...baseFeatures,
          advanced_chat: true,
          priority_support: true,
          api_access: true,
          custom_models: true,
          team_collaboration: true,
          priority_processing: true
        };
      case 'enterprise':
        return {
          ...baseFeatures,
          advanced_chat: true,
          dedicated_support: true,
          api_access: true,
          custom_models: true,
          team_collaboration: true,
          white_label: true,
          sso: true,
          priority_processing: true,
          custom_integrations: true
        };
      default: // free
        return baseFeatures;
    }
  };

  const fetchAvailablePlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('active', true)
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      
      setAvailablePlans((data || []) as SubscriptionPlan[]);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription plans",
        variant: "destructive"
      });
    }
  };

  const fetchDailyUsage = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today);

      if (error) throw error;

      const usageMap: Record<string, number> = {};
      data?.forEach((usage: UserUsage) => {
        usageMap[usage.feature_type] = usage.usage_count;
      });
      setDailyUsage(usageMap);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const checkUsageLimit = async (featureType: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('check_usage_limit', {
        _user_id: user.id,
        _feature_type: featureType
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking usage limit:', error);
      return false;
    }
  };

  const recordUsage = async (featureType: string, count: number = 1) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc('record_usage', {
        _user_id: user.id,
        _feature_type: featureType,
        _count: count
      });

      if (error) throw error;
      
      await fetchDailyUsage();
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  };

  const getUsagePercentage = (featureType: string): number => {
    if (!currentSubscription) return 0;
    
    const limitKey = featureType === 'rag_query' ? 'rag_queries_per_day' :
                     featureType === 'chat_message' ? 'chat_messages_per_day' :
                     featureType === 'document_upload' ? 'documents_limit' :
                     `${featureType}_per_day`;
    
    const limit = currentSubscription.limits[limitKey];
    const used = dailyUsage[featureType] || 0;
    
    if (limit === -1) return 0; // Unlimited
    if (limit === 0) return 100; // No access
    
    return Math.min((used / limit) * 100, 100);
  };

  const canUseFeature = (featureType: string): boolean => {
    if (!currentSubscription) return false;
    
    const limitKey = featureType === 'rag_query' ? 'rag_queries_per_day' :
                     featureType === 'chat_message' ? 'chat_messages_per_day' :
                     featureType === 'document_upload' ? 'documents_limit' :
                     `${featureType}_per_day`;
    
    const limit = currentSubscription.limits[limitKey];
    const used = dailyUsage[featureType] || 0;
    
    return limit === -1 || used < limit;
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCurrentSubscription(),
        fetchAvailablePlans(),
        fetchDailyUsage()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [user]);

  return {
    currentSubscription,
    availablePlans,
    dailyUsage,
    isLoading,
    checkUsageLimit,
    recordUsage,
    getUsagePercentage,
    canUseFeature,
    refreshSubscription: fetchCurrentSubscription,
    refreshUsage: fetchDailyUsage,
  };
};
