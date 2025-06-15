
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useConversations } from '@/hooks/useConversations';
import ConversationSharingDialog from './ConversationSharingDialog';
import { 
  MessageSquare, 
  Plus, 
  Share2, 
  Trash2, 
  Edit3,
  Clock,
  Shield,
  Users,
  Globe
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ConversationSidebar = () => {
  const [sharingDialogOpen, setSharingDialogOpen] = useState(false);
  const [selectedConversationForSharing, setSelectedConversationForSharing] = useState<any>(null);

  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    createConversation,
    deleteConversation,
    shareConversation
  } = useConversations();

  const handleNewConversation = async () => {
    await createConversation();
  };

  const handleShareConversation = (conversation: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedConversationForSharing(conversation);
    setSharingDialogOpen(true);
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </span>
            <Button size="sm" onClick={handleNewConversation}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="space-y-2 p-4">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                    currentConversation?.id === conversation.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted border-transparent'
                  }`}
                  onClick={() => setCurrentConversation(conversation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        {conversation.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {conversation.do_not_train && (
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                        {conversation.is_shared && (
                          <Badge variant="outline" className="text-xs">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        )}
                        {/* Show collaboration indicator if there are team members */}
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          Team
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleShareConversation(conversation, e)}
                        className="h-6 w-6 p-0"
                        title="Share conversation"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        title="Delete conversation"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {conversations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs">Create your first conversation to get started</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Sharing Dialog */}
      {selectedConversationForSharing && (
        <ConversationSharingDialog
          isOpen={sharingDialogOpen}
          onClose={() => {
            setSharingDialogOpen(false);
            setSelectedConversationForSharing(null);
          }}
          conversationId={selectedConversationForSharing.id}
          conversationTitle={selectedConversationForSharing.title}
        />
      )}
    </>
  );
};

export default ConversationSidebar;
