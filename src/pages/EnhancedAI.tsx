
import React, { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import EnhancedAIHeader from '@/components/ai/EnhancedAIHeader';
import EnhancedAITabs from '@/components/ai/EnhancedAITabs';

const EnhancedAI = () => {
  const { user } = useAuthContext();
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
      <EnhancedAIHeader />
      <EnhancedAITabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default EnhancedAI;
