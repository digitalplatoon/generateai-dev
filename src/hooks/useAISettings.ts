
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AISettings {
  id: string;
  user_id: string;
  temperature: number;
  max_tokens: number;
  do_not_train_consent: boolean;
  data_retention_days: number;
  preferred_model: string;
  custom_instructions?: string;
  stop_sequences: string[];
  streaming_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useAISettings = () => {
  const { user } = useAuthContext();
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    if (!user) {
      setSettings(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_ai_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error fetching AI settings:', error);
      setSettings(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<Omit<AISettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_ai_settings')
        .upsert({
          user_id: user.id,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      
      toast({
        title: "Settings updated",
        description: "Your AI preferences have been saved.",
      });
    } catch (error) {
      console.error('Error updating AI settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return {
    settings,
    isLoading,
    updateSettings,
    refetch: fetchSettings,
  };
};
