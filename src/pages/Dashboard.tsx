
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ChatTab } from "@/components/dashboard/ChatTab";
import { PostsTab } from "@/components/dashboard/PostsTab";
import { ProfileTab } from "@/components/dashboard/ProfileTab";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { UserProfile } from "@/components/profile/UserProfile";
import { useOnboarding } from '@/hooks/useOnboarding';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useBookmarks } from '@/hooks/useBookmarks';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { MessageSquare, FileText, User, TrendingUp, Bookmark, Award } from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useAuthContext();
  const { getCurrentStep, getProgress, isStepCompleted } = useOnboarding();
  const { getPathProgress } = useUserProgress();
  const { bookmarks } = useBookmarks();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding if user hasn't completed it
    if (user && !isStepCompleted('complete')) {
      setShowOnboarding(true);
    }
  }, [user, isStepCompleted]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  const learningPaths = [
    { id: 'ai-basics', name: 'AI Basics', description: 'Fundamentals of artificial intelligence' },
    { id: 'prompt-engineering', name: 'Prompt Engineering', description: 'Master the art of crafting effective prompts' },
    { id: 'rag-systems', name: 'RAG Systems', description: 'Build retrieval-augmented generation systems' },
  ];

  return (
    <div className="container mx-auto py-8">
      {showOnboarding && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Continue your AI learning journey
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowOnboarding(true)}>
            View Tutorial
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Onboarding</p>
                <p className="text-2xl font-bold">{getProgress()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Avg Progress</p>
                <p className="text-2xl font-bold">
                  {Math.round(learningPaths.reduce((acc, path) => acc + getPathProgress(path.id), 0) / learningPaths.length) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Bookmarks</p>
                <p className="text-2xl font-bold">{bookmarks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Current Step</p>
                <p className="text-sm font-bold capitalize">{getCurrentStep().replace('-', ' ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
          <CardDescription>
            Your progress across different learning paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {learningPaths.map(path => (
              <div key={path.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{path.name}</h3>
                    <BookmarkButton
                      itemType="learning_path"
                      itemId={path.id}
                      itemTitle={path.name}
                      itemDescription={path.description}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{path.description}</p>
                </div>
                <div className="w-48 ml-4">
                  <ProgressIndicator progress={getPathProgress(path.id)} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat">
          <ChatTab />
        </TabsContent>
        
        <TabsContent value="posts">
          <PostsTab />
        </TabsContent>
        
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
