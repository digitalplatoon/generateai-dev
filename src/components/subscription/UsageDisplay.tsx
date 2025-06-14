
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { Activity, FileText, MessageSquare, Search } from 'lucide-react';

const UsageDisplay: React.FC = () => {
  const { currentSubscription, dailyUsage, getUsagePercentage, canUseFeature } = useSubscription();

  if (!currentSubscription) {
    return null;
  }

  const usageItems = [
    {
      key: 'rag_query',
      label: 'RAG Queries',
      icon: <Search className="h-5 w-5" />,
      description: 'Daily search queries'
    },
    {
      key: 'chat_message',
      label: 'Chat Messages',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Daily chat interactions'
    },
    {
      key: 'document_upload',
      label: 'Documents',
      icon: <FileText className="h-5 w-5" />,
      description: 'Total documents uploaded'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <CardTitle>Usage Overview</CardTitle>
        </div>
        <CardDescription>
          Current plan: <Badge variant="outline">{currentSubscription.plan_name}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {usageItems.map((item) => {
          const percentage = getUsagePercentage(item.key);
          const used = dailyUsage[item.key] || 0;
          const limitKey = item.key === 'rag_query' ? 'rag_queries_per_day' :
                          item.key === 'chat_message' ? 'chat_messages_per_day' :
                          item.key === 'document_upload' ? 'documents_limit' :
                          `${item.key}_per_day`;
          const limit = currentSubscription.limits[limitKey];
          const canUse = canUseFeature(item.key);

          return (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {used} / {limit === -1 ? '∞' : limit}
                  </p>
                  {!canUse && limit !== -1 && (
                    <Badge variant="destructive" className="text-xs">
                      Limit reached
                    </Badge>
                  )}
                </div>
              </div>
              {limit !== -1 && (
                <Progress 
                  value={percentage} 
                  className={`h-2 ${percentage >= 90 ? 'bg-red-100' : percentage >= 70 ? 'bg-yellow-100' : 'bg-green-100'}`}
                />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default UsageDisplay;
