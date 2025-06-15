
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ConversationSidebar from '@/components/ai/ConversationSidebar';
import EnhancedChatInterface from '@/components/ai/EnhancedChatInterface';
import TeamCollaborationPanel from '@/components/ai/TeamCollaborationPanel';
import AISettingsPanel from '@/components/ai/AISettingsPanel';
import { useAuthContext } from '@/contexts/AuthContext';
import { useAuditLog } from '@/hooks/useAuditLog';
import { useConversations } from '@/hooks/useConversations';
import { 
  MessageSquare, 
  Settings, 
  History, 
  Shield, 
  Zap,
  Brain,
  Users,
  BarChart3
} from 'lucide-react';

const EnhancedAI = () => {
  const { user } = useAuthContext();
  const { logs } = useAuditLog();
  const { currentConversation } = useConversations();
  const [activeTab, setActiveTab] = useState('chat');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Enhanced AI Platform</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to access the enhanced AI features
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen max-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8" />
              Enhanced AI Platform
            </h1>
            <p className="text-muted-foreground mt-2">
              Advanced AI with context awareness, enhanced security, and real-time collaboration
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Enhanced
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Collaborative
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-200px)]">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-4 h-[calc(100%-60px)]">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 h-full">
            <div className="lg:col-span-1">
              <ConversationSidebar />
            </div>
            <div className="lg:col-span-4">
              <EnhancedChatInterface />
            </div>
            <div className="lg:col-span-1">
              <TeamCollaborationPanel conversationId={currentConversation?.id} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <div className="flex justify-center">
            <AISettingsPanel />
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
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
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAI;
