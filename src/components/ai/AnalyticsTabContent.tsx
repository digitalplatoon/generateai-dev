
import React from 'react';
import { MessageSquare, Zap, Shield } from 'lucide-react';
import { useAuditLog } from '@/hooks/useAuditLog';

const AnalyticsTabContent = () => {
  const { logs } = useAuditLog();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Usage Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Total Messages</h3>
          </div>
          <p className="text-2xl font-bold">
            {logs.filter(log => log.action_type === 'chat_completion').length}
          </p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Avg Response Time</h3>
          </div>
          <p className="text-2xl font-bold">
            {logs.length > 0 
              ? Math.round(logs.reduce((acc, log) => acc + (log.processing_time_ms || 0), 0) / logs.length)
              : 0}ms
          </p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Success Rate</h3>
          </div>
          <p className="text-2xl font-bold">
            {logs.length > 0 
              ? Math.round((logs.filter(log => log.status === 'success').length / logs.length) * 100)
              : 100}%
          </p>
        </div>
      </div>
      
      <div className="p-6 border rounded-lg">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-2">
          {logs.slice(0, 10).map((log) => (
            <div key={log.id} className="flex items-center justify-between text-sm">
              <span>{log.action_type}</span>
              <span className="text-muted-foreground">
                {new Date(log.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTabContent;
