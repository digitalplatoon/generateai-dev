import React, { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import EnhancedAIHeader from '@/components/ai/EnhancedAIHeader';
import EnhancedAITabs from '@/components/ai/EnhancedAITabs';
import SEOHead from '@/components/seo/SEOHead';

const EnhancedAI = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('chat');

  if (!user) {
    return (
      <>
        <SEOHead
          title="Enhanced AI Platform - GenerateAI.dev"
          description="Access powerful AI tools, including chat, RAG, and agents. Sign in to unlock the full potential of GenerateAI.dev."
          keywords="AI platform, enhanced AI, AI chat, AI tools, sign in"
          canonical="https://generateai.dev/enhanced-ai"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Enhanced AI Platform</h1>
            <p className="text-muted-foreground mb-6">
              Please sign in to access the enhanced AI features
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Enhanced AI Platform - GenerateAI.dev"
        description="Access powerful AI tools, including chat, RAG, and agents. Sign in to unlock the full potential of GenerateAI.dev."
        keywords="AI platform, enhanced AI, AI chat, AI tools, sign in"
        canonical="https://generateai.dev/enhanced-ai"
      />
      <div className="container mx-auto px-4 py-8 h-screen max-h-screen">
        <EnhancedAIHeader />
        <EnhancedAITabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </>
  );
};

export default EnhancedAI;
