
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface AuditLogEntry {
  id: string;
  user_id: string;
  conversation_id?: string;
  action_type: string;
  request_data?: any;
  response_data?: any;
  ip_address?: string;
  user_agent?: string;
  status: string;
  error_message?: string;
  processing_time_ms?: number;
  created_at: string;
}

export const useAuditLog = () => {
  const { user } = useAuthContext();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const logAction = async (
    actionType: string,
    status: string,
    conversationId?: string,
    requestData?: any,
    responseData?: any,
    errorMessage?: string,
    processingTimeMs?: number
  ) => {
    if (!user) return;

    try {
      await supabase
        .from('ai_audit_logs')
        .insert({
          user_id: user.id,
          conversation_id: conversationId,
          action_type: actionType,
          status,
          request_data: requestData,
          response_data: responseData,
          error_message: errorMessage,
          processing_time_ms: processingTimeMs,
          ip_address: null, // Would need server-side implementation
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error logging action:', error);
    }
  };

  const fetchLogs = async (limit: number = 50) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ai_audit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  return {
    logs,
    isLoading,
    logAction,
    fetchLogs
  };
};
