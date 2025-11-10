import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Insight {
  type: 'insight' | 'recommendation' | 'tip';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export const usePersonalizedInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('generate-insights', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (functionError) {
        console.error('Error fetching insights:', functionError);
        throw functionError;
      }

      if (data?.insights) {
        setInsights(data.insights);
      }
    } catch (err: any) {
      console.error('Error:', err);
      const errorMessage = err.message || 'Failed to generate insights';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInsights();
    }
  }, [user]);

  return {
    insights,
    isLoading,
    error,
    refetch: fetchInsights,
  };
};
