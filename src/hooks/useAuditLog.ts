
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
    // Audit log writes are restricted to service_role (server-side only).
    // Client-side inserts are intentionally a no-op; edge functions should write entries.
    return;
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
      
      // Type cast the data to ensure proper types
      const typedLogs: AuditLogEntry[] = (data || []).map(log => ({
        ...log,
        conversation_id: log.conversation_id || undefined,
        request_data: log.request_data || undefined,
        response_data: log.response_data || undefined,
        error_message: log.error_message || undefined,
        processing_time_ms: log.processing_time_ms || undefined,
        ip_address: undefined,
        user_agent: undefined
      }));
      
      setLogs(typedLogs);
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
