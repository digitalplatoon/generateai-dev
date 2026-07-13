import { logger } from '@/lib/logger';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { User, Settings, Bookmark, TrendingUp, Award } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useAuthContext();
  const { preferences, updatePreferences, isLoading: prefsLoading } = useUserPreferences();
  const { bookmarks } = useBookmarks();
  const { progress, getPathProgress } = useUserProgress();
  const { getProgress: getOnboardingProgress } = useOnboarding();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    full_name: '',
    username: '',
    bio: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  React.useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          username: data.username || '',
          bio: data.bio || '',
        });
      }
    } catch (error) {
      logger.error('Fetch profile error:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
        });

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      toast({
        title: "Failed to update profile",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const learningPaths = [
    { id: 'ai-basics', name: 'AI Basics', modules: 10 },
    { id: 'prompt-engineering', name: 'Prompt Engineering', modules: 8 },
    { id: 'rag-systems', name: 'RAG Systems', modules: 12 },
  ];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8" />
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Bookmarks
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and bio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself and your interests in AI"
                  rows={4}
                />
              </div>

              <Button onClick={updateProfile} disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Onboarding Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressIndicator progress={getOnboardingProgress()} size="lg" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Path Progress</CardTitle>
                <CardDescription>
                  Track your progress across different learning paths
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningPaths.map(path => (
                  <div key={path.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{path.name}</h3>
                      <p className="text-sm text-muted-foreground">{path.modules} modules</p>
                    </div>
                    <div className="w-48">
                      <ProgressIndicator progress={getPathProgress(path.id)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookmarks">
          <Card>
            <CardHeader>
              <CardTitle>My Bookmarks</CardTitle>
              <CardDescription>
                Items you've saved for later reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookmarks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No bookmarks yet. Start bookmarking content you find useful!
                </p>
              ) : (
                <div className="space-y-4">
                  {bookmarks.map(bookmark => (
                    <div key={bookmark.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{bookmark.item_title}</h3>
                          <Badge variant="secondary">{bookmark.item_type}</Badge>
                        </div>
                        {bookmark.item_description && (
                          <p className="text-sm text-muted-foreground">{bookmark.item_description}</p>
                        )}
                      </div>
                      <BookmarkButton
                        itemType={bookmark.item_type}
                        itemId={bookmark.item_id}
                        itemTitle={bookmark.item_title}
                        itemDescription={bookmark.item_description || undefined}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your learning experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {preferences && (
                <>
                  <div>
                    <Label className="text-base font-semibold">Learning Pace</Label>
                    <RadioGroup
                      value={preferences.learning_pace}
                      onValueChange={(value) => updatePreferences({ learning_pace: value as any })}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="slow" id="slow" />
                        <Label htmlFor="slow">Slow</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal">Normal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fast" id="fast" />
                        <Label htmlFor="fast">Fast</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="role">Experience Level</Label>
                    <Select 
                      value={preferences.preferred_role} 
                      onValueChange={(value) => updatePreferences({ preferred_role: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="role">Learning Focus</Label>
                    <Select 
                      value={preferences.preferred_role} 
                      onValueChange={(value) => updatePreferences({ preferred_role: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AI Developer">AI Developer</SelectItem>
                        <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                        <SelectItem value="ML Engineer">ML Engineer</SelectItem>
                        <SelectItem value="Java">Java</SelectItem>
                        <SelectItem value="C++">C++</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Enable Notifications</Label>
                    <Switch
                      id="notifications"
                      checked={preferences.notifications_enabled}
                      onCheckedChange={(checked) => updatePreferences({ notifications_enabled: checked })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="visibility">Profile Visibility</Label>
                    <Select 
                      value={preferences.profile_visibility} 
                      onValueChange={(value) => updatePreferences({ profile_visibility: value as any })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
