
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface UserPreferences {
  id: string;
  theme: 'light' | 'dark' | 'auto';
  learning_pace: string;
  notifications_enabled: boolean;
  preferred_role: string;
  profile_visibility: 'public' | 'private';
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const { user } = useAuthContext();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPreferences = async () => {
    if (!user) {
      setPreferences(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Type assertion for the data from Supabase
      const typedPreferences = data as UserPreferences;
      setPreferences(typedPreferences);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      setPreferences(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user]);

  const updatePreferences = async (updates: Partial<Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the data from Supabase
      const typedPreferences = data as UserPreferences;
      setPreferences(typedPreferences);
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  };

  return {
    preferences,
    isLoading,
    updatePreferences,
    refetch: fetchPreferences,
  };
};
