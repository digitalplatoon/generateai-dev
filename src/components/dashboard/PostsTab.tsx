
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
}

const PostsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

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

  return (
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
  );
};

export default PostsTab;
