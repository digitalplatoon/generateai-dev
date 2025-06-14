
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserPreferences {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  learning_pace: 'slow' | 'normal' | 'fast';
  notifications_enabled: boolean;
  preferred_role: string;
  preferred_tech_stack: string;
  profile_visibility: 'public' | 'private';
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_preferences' as any)
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
      setPreferences(data);
    } catch (error) {
      console.error('Fetch preferences error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_preferences' as any)
        .upsert(updates)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Preferences updated!",
        description: "Your preferences have been saved.",
      });

      setPreferences(data);
      return data;
    } catch (error) {
      console.error('Update preferences error:', error);
      toast({
        title: "Failed to update preferences",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return {
    preferences,
    isLoading,
    updatePreferences,
    fetchPreferences,
  };
};
