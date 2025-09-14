
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarks, Bookmark as BookmarkType } from '@/hooks/useBookmarks';
import { useAuthContext } from '@/contexts/AuthContext';

interface BookmarkButtonProps {
  itemType: BookmarkType['item_type'];
  itemId: string;
  itemTitle: string;
  itemDescription?: string;
  className?: string;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  itemType,
  itemId,
  itemTitle,
  itemDescription,
  className
}) => {
  const { user } = useAuthContext();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();

  if (!user) return null;

  const bookmarked = isBookmarked(itemType, itemId);

  const handleToggle = async () => {
    if (bookmarked) {
      await removeBookmark(itemType, itemId);
    } else {
      await addBookmark(itemType, itemId, itemTitle, itemDescription);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={className}
      aria-label={bookmarked ? `Remove ${itemTitle} from bookmarks` : `Add ${itemTitle} to bookmarks`}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-4 w-4 text-primary" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  );
};
