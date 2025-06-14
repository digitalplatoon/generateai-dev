
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, MessageSquare, FileText, User, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive"
      });
    } finally {
      setPostsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          user_id: user?.id,
          published: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully"
      });
      
      fetchPosts();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({
          message: chatInput,
          history: chatMessages.slice(-10) // Last 10 messages for context
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage: ChatMessage = { role: 'assistant', content: data.message };
        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Make sure OpenAI API key is configured.",
        variant: "destructive"
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-black">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email}!
            </h1>
            <p className="text-light-gray">Your AI development dashboard</p>
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="border-teal/30 text-teal hover:bg-teal/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              My Posts
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <Card className="bg-navy/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-96 overflow-y-auto bg-navy/50 rounded-lg p-4 space-y-4">
                    {chatMessages.length === 0 ? (
                      <p className="text-light-gray text-center">Start a conversation with your AI assistant!</p>
                    ) : (
                      chatMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.role === 'user' 
                              ? 'bg-teal text-navy' 
                              : 'bg-white/10 text-white'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 text-white px-4 py-2 rounded-lg">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleChatSubmit} className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me anything about AI development..."
                      className="flex-1 bg-navy border-white/20 text-white"
                      disabled={chatLoading}
                    />
                    <Button 
                      type="submit" 
                      disabled={chatLoading || !chatInput.trim()}
                      className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy"
                    >
                      Send
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <div className="grid gap-6">
              <Card className="bg-navy/80 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Create New Post</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-white">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        required
                        className="bg-navy border-white/20 text-white"
                        placeholder="Enter post title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="content" className="text-white">Content</Label>
                      <Textarea
                        id="content"
                        name="content"
                        required
                        className="bg-navy border-white/20 text-white min-h-32"
                        placeholder="Write your post content..."
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-teal to-blue-400 hover:from-teal/80 hover:to-blue-400/80 text-navy"
                    >
                      Create Post
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-navy/80 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Your Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {postsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-teal" />
                    </div>
                  ) : posts.length === 0 ? (
                    <p className="text-light-gray text-center py-8">You haven't created any posts yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div key={post.id} className="border border-white/10 rounded-lg p-4">
                          <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                          <p className="text-light-gray text-sm mb-2">{post.content}</p>
                          <p className="text-xs text-light-gray/60">
                            Created: {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-navy/80 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Email</Label>
                  <Input
                    value={user?.email || ''}
                    disabled
                    className="bg-navy/50 border-white/20 text-light-gray"
                  />
                </div>
                <div>
                  <Label className="text-white">Full Name</Label>
                  <Input
                    value={user?.user_metadata?.full_name || ''}
                    disabled
                    className="bg-navy/50 border-white/20 text-light-gray"
                  />
                </div>
                <div>
                  <Label className="text-white">Member Since</Label>
                  <Input
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                    disabled
                    className="bg-navy/50 border-white/20 text-light-gray"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
