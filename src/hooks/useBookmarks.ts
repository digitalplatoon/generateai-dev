
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface Bookmark {
  id: string;
  item_type: 'learning_path' | 'prompt' | 'document' | 'agent';
  item_id: string;
  item_title: string;
  item_description?: string;
  created_at: string;
}

export const useBookmarks = () => {
  const { user } = useAuthContext();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = async () => {
    if (!user) {
      setBookmarks([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion for the data from Supabase
      const typedBookmarks = (data || []) as Bookmark[];
      setBookmarks(typedBookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setBookmarks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const addBookmark = async (
    itemType: Bookmark['item_type'],
    itemId: string,
    itemTitle: string,
    itemDescription?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .insert({
          user_id: user.id,
          item_type: itemType,
          item_id: itemId,
          item_title: itemTitle,
          item_description: itemDescription,
        });

      if (error) throw error;
      await fetchBookmarks(); // Refresh bookmarks
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const removeBookmark = async (itemType: Bookmark['item_type'], itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId);

      if (error) throw error;
      await fetchBookmarks(); // Refresh bookmarks
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const isBookmarked = (itemType: Bookmark['item_type'], itemId: string) => {
    return bookmarks.some(bookmark => 
      bookmark.item_type === itemType && bookmark.item_id === itemId
    );
  };

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refetch: fetchBookmarks,
  };
};
