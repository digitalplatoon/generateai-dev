
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Settings, History, BarChart3 } from 'lucide-react';
import ChatTabContent from './ChatTabContent';
import HistoryTabContent from './HistoryTabContent';
import AnalyticsTabContent from './AnalyticsTabContent';
import AISettingsPanel from './AISettingsPanel';

interface EnhancedAITabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const EnhancedAITabs = ({ activeTab, onTabChange }: EnhancedAITabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-[calc(100vh-200px)]">
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
        <ChatTabContent />
      </TabsContent>

      <TabsContent value="settings" className="mt-4">
        <div className="flex justify-center">
          <AISettingsPanel />
        </div>
      </TabsContent>

      <TabsContent value="history" className="mt-4">
        <HistoryTabContent />
      </TabsContent>

      <TabsContent value="analytics" className="mt-4">
        <AnalyticsTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedAITabs;
