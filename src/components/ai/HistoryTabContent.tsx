
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { useAuditLog } from '@/hooks/useAuditLog';

const HistoryTabContent = () => {
  const { logs } = useAuditLog();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Audit Log</h2>
      <div className="space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                  {log.action_type}
                </Badge>
                <span className="ml-2 text-sm text-muted-foreground">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
              {log.processing_time_ms && (
                <span className="text-sm text-muted-foreground">
                  {log.processing_time_ms}ms
                </span>
              )}
            </div>
            {log.error_message && (
              <p className="text-sm text-destructive mt-2">{log.error_message}</p>
            )}
          </div>
        ))}
        
        {logs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No activity logs yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTabContent;
