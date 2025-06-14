
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan, UserSubscription, UserUsage } from '@/types/subscription';

export const useAdminDashboard = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [usageStats, setUsageStats] = useState<any[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminRole = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (error) throw error;
      setIsAdmin(data);
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    }
  };

  const fetchUsers = async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role),
          user_subscriptions(
            *,
            subscription_plans(name, tier)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    }
  };

  const fetchSubscriptions = async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          profiles(full_name, username),
          subscription_plans(name, tier, price_monthly)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive"
      });
    }
  };

  const fetchUsageStats = async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('user_usage')
        .select(`
          feature_type,
          date,
          user_id,
          usage_count,
          profiles(full_name, username)
        `)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      setUsageStats(data || []);
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch usage statistics",
        variant: "destructive"
      });
    }
  };

  const fetchPlans = async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price_monthly', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription plans",
        variant: "destructive"
      });
    }
  };

  const createPlan = async (planData: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('subscription_plans')
        .insert(planData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription plan created successfully"
      });

      await fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Error",
        description: "Failed to create subscription plan",
        variant: "destructive"
      });
    }
  };

  const updatePlan = async (planId: string, updates: Partial<SubscriptionPlan>) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('subscription_plans')
        .update(updates)
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription plan updated successfully"
      });

      await fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription plan",
        variant: "destructive"
      });
    }
  };

  const assignUserRole = async (userId: string, role: 'admin' | 'moderator' | 'user') => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: role
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${role}`
      });

      await fetchUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign user role",
        variant: "destructive"
      });
    }
  };

  const getUsageAnalytics = () => {
    const analytics = {
      totalUsers: users.length,
      activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
      totalRevenue: subscriptions
        .filter(s => s.status === 'active' && s.plan?.price_monthly)
        .reduce((sum, s) => sum + (s.plan?.price_monthly || 0), 0),
      usageByFeature: {} as Record<string, number>
    };

    usageStats.forEach(stat => {
      analytics.usageByFeature[stat.feature_type] = 
        (analytics.usageByFeature[stat.feature_type] || 0) + stat.usage_count;
    });

    return analytics;
  };

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      const loadAdminData = async () => {
        setIsLoading(true);
        await Promise.all([
          fetchUsers(),
          fetchSubscriptions(),
          fetchUsageStats(),
          fetchPlans()
        ]);
        setIsLoading(false);
      };

      loadAdminData();
    } else {
      setIsLoading(false);
    }
  }, [isAdmin]);

  return {
    isAdmin,
    users,
    subscriptions,
    usageStats,
    plans,
    isLoading,
    createPlan,
    updatePlan,
    assignUserRole,
    getUsageAnalytics,
    refreshData: () => {
      if (isAdmin) {
        fetchUsers();
        fetchSubscriptions();
        fetchUsageStats();
        fetchPlans();
      }
    }
  };
};
