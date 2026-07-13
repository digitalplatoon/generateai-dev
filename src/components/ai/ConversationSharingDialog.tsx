import { logger } from '@/lib/logger';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Share2, 
  Copy, 
  Globe, 
  Lock, 
  Users, 
  Clock,
  Eye,
  Edit
} from 'lucide-react';

interface ConversationSharingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  conversationTitle: string;
}

const ConversationSharingDialog = ({ 
  isOpen, 
  onClose, 
  conversationId, 
  conversationTitle 
}: ConversationSharingDialogProps) => {
  const [isPublic, setIsPublic] = useState(false);
  const [shareToken, setShareToken] = useState('');
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [permissions, setPermissions] = useState<'read' | 'write'>('read');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && conversationId) {
      fetchSharingSettings();
    }
  }, [isOpen, conversationId]);

  const fetchSharingSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('is_shared, share_token')
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      setIsPublic(data.is_shared || false);
      setShareToken(data.share_token || '');
    } catch (error) {
      logger.error('Error fetching sharing settings:', error);
    }
  };

  const generateShareLink = () => {
    if (!shareToken) return '';
    return `${window.location.origin}/shared/${shareToken}`;
  };

  const handleTogglePublic = async (enabled: boolean) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          is_shared: enabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) throw error;

      setIsPublic(enabled);
      
      if (enabled) {
        // Fetch the generated share token
        const { data } = await supabase
          .from('conversations')
          .select('share_token')
          .eq('id', conversationId)
          .single();
        
        if (data?.share_token) {
          setShareToken(data.share_token);
        }
      }

      toast({
        title: enabled ? "Conversation shared" : "Sharing disabled",
        description: enabled 
          ? "Anyone with the link can now view this conversation"
          : "The conversation is now private",
      });
    } catch (error) {
      logger.error('Error updating sharing settings:', error);
      toast({
        title: "Error",
        description: "Failed to update sharing settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = () => {
    const link = generateShareLink();
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleSetExpiration = async () => {
    if (!expiresAt) return;

    try {
      const { error } = await supabase
        .from('conversation_shares')
        .update({ expires_at: expiresAt })
        .eq('conversation_id', conversationId);

      if (error) throw error;

      toast({
        title: "Expiration set",
        description: "Share link will expire on the selected date",
      });
    } catch (error) {
      logger.error('Error setting expiration:', error);
      toast({
        title: "Error",
        description: "Failed to set expiration date",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Conversation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Conversation Info */}
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium text-sm truncate">{conversationTitle}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {isPublic ? 'Public conversation' : 'Private conversation'}
            </p>
          </div>

          {/* Public Sharing Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                <span className="font-medium">Public sharing</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can view this conversation
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={handleTogglePublic}
              disabled={isLoading}
            />
          </div>

          {/* Share Link Section */}
          {isPublic && shareToken && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Share link</span>
                <Badge variant="outline" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  {permissions === 'read' ? 'View only' : 'Can edit'}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={generateShareLink()}
                  readOnly
                  className="flex-1 text-xs"
                />
                <Button size="sm" onClick={copyShareLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Permission Settings */}
          {isPublic && (
            <div className="space-y-3">
              <span className="text-sm font-medium">Permissions</span>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="permissions"
                    value="read"
                    checked={permissions === 'read'}
                    onChange={(e) => setPermissions(e.target.value as 'read')}
                  />
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">View only</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="permissions"
                    value="write"
                    checked={permissions === 'write'}
                    onChange={(e) => setPermissions(e.target.value as 'write')}
                  />
                  <Edit className="h-4 w-4" />
                  <span className="text-sm">Can contribute</span>
                </label>
              </div>
            </div>
          )}

          {/* Expiration Settings */}
          {isPublic && (
            <div className="space-y-3">
              <span className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Expiration (optional)
              </span>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSetExpiration} disabled={!expiresAt}>
                  Set
                </Button>
              </div>
            </div>
          )}

          {/* Team Collaboration Note */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Team Collaboration</p>
                <p className="text-blue-700 mt-1">
                  Invite specific team members for private collaboration in the Team panel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationSharingDialog;
