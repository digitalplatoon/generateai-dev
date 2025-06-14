
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan, CurrentSubscription, UserUsage } from '@/types/subscription';

export const useSubscription = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
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
      const { data, error } = await supabase.rpc('get_user_subscription', {
        _user_id: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setCurrentSubscription(data[0] as CurrentSubscription);
      } else {
        // Default to free plan if no subscription found
        setCurrentSubscription({
          plan_name: 'Free Plan',
          tier: 'free',
          status: 'active',
          limits: {
            rag_queries_per_day: 10,
            documents_limit: 3,
            chat_messages_per_day: 50
          },
          features: {
            rag_lab: true,
            basic_chat: true,
            community_access: true
          },
          expires_at: null
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription information",
        variant: "destructive"
      });
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
      setAvailablePlans(data || []);
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
      
      // Refresh usage data
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
    
    return limit === -1 || used < limit; // Unlimited or under limit
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
