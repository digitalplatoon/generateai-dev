
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Bookmark {
  id: string;
  item_type: 'learning_path' | 'prompt' | 'document' | 'agent';
  item_id: string;
  item_title: string;
  item_description: string | null;
  created_at: string;
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_bookmarks' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Fetch bookmarks error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addBookmark = async (itemType: Bookmark['item_type'], itemId: string, itemTitle: string, itemDescription?: string) => {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks' as any)
        .insert({
          item_type: itemType,
          item_id: itemId,
          item_title: itemTitle,
          item_description: itemDescription || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Bookmark added!",
        description: `${itemTitle} has been bookmarked.`,
      });

      await fetchBookmarks();
      return data;
    } catch (error) {
      console.error('Add bookmark error:', error);
      toast({
        title: "Failed to add bookmark",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    }
  };

  const removeBookmark = async (itemType: Bookmark['item_type'], itemId: string) => {
    try {
      const { error } = await supabase
        .from('user_bookmarks' as any)
        .delete()
        .eq('item_type', itemType)
        .eq('item_id', itemId);

      if (error) throw error;

      toast({
        title: "Bookmark removed",
        description: "Item has been removed from bookmarks.",
      });

      await fetchBookmarks();
    } catch (error) {
      console.error('Remove bookmark error:', error);
      toast({
        title: "Failed to remove bookmark",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    }
  };

  const isBookmarked = (itemType: Bookmark['item_type'], itemId: string) => {
    return bookmarks.some(b => b.item_type === itemType && b.item_id === itemId);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    fetchBookmarks,
  };
};
