
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { Users, Circle } from 'lucide-react';

interface UserPresence {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  online_at: string;
  status: 'online' | 'typing' | 'idle';
}

interface RealTimePresenceProps {
  conversationId: string;
}

const RealTimePresence = ({ conversationId }: RealTimePresenceProps) => {
  const { user } = useAuthContext();
  const [presences, setPresences] = useState<UserPresence[]>([]);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user || !conversationId) return;

    const roomChannel = supabase.channel(`conversation:${conversationId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    roomChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = roomChannel.presenceState();
        const allPresences: UserPresence[] = [];
        
        Object.keys(newState).forEach((presenceKey) => {
          const presenceArray = newState[presenceKey] as any[];
          presenceArray.forEach((presence) => {
            allPresences.push(presence);
          });
        });
        
        setPresences(allPresences.filter(p => p.user_id !== user.id));
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const userStatus: UserPresence = {
            user_id: user.id,
            user_name: user.email || 'Anonymous',
            avatar_url: user.user_metadata?.avatar_url,
            online_at: new Date().toISOString(),
            status: 'online',
          };

          await roomChannel.track(userStatus);
        }
      });

    setChannel(roomChannel);

    return () => {
      if (roomChannel) {
        roomChannel.unsubscribe();
      }
    };
  }, [user, conversationId]);

  const updateStatus = async (status: 'online' | 'typing' | 'idle') => {
    if (!channel || !user) return;

    const userStatus: UserPresence = {
      user_id: user.id,
      user_name: user.email || 'Anonymous',
      avatar_url: user.user_metadata?.avatar_url,
      online_at: new Date().toISOString(),
      status,
    };

    await channel.track(userStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'typing':
        return 'bg-blue-500 animate-pulse';
      case 'idle':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'typing':
        return 'Typing...';
      case 'idle':
        return 'Idle';
      default:
        return 'Unknown';
    }
  };

  if (presences.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <Users className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center gap-1">
        {presences.slice(0, 3).map((presence) => (
          <div key={presence.user_id} className="relative">
            <Avatar className="h-6 w-6">
              <AvatarImage src={presence.avatar_url} />
              <AvatarFallback className="text-xs">
                {presence.user_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Circle 
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 border-2 border-background rounded-full ${getStatusColor(presence.status)}`}
            />
          </div>
        ))}
        {presences.length > 3 && (
          <Badge variant="secondary" className="text-xs h-6">
            +{presences.length - 3}
          </Badge>
        )}
      </div>
      <div className="text-xs text-muted-foreground">
        {presences.length === 1 
          ? `${presences[0].user_name} is ${getStatusText(presences[0].status).toLowerCase()}`
          : `${presences.length} people online`
        }
      </div>
    </div>
  );
};

// Export the updateStatus function for use in chat interface
export const usePresenceStatus = (conversationId: string) => {
  const { user } = useAuthContext();
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user || !conversationId) return;

    const roomChannel = supabase.channel(`conversation:${conversationId}`);
    setChannel(roomChannel);

    return () => {
      if (roomChannel) {
        roomChannel.unsubscribe();
      }
    };
  }, [user, conversationId]);

  const updateStatus = async (status: 'online' | 'typing' | 'idle') => {
    if (!channel || !user) return;

    const userStatus: UserPresence = {
      user_id: user.id,
      user_name: user.email || 'Anonymous',
      avatar_url: user.user_metadata?.avatar_url,
      online_at: new Date().toISOString(),
      status,
    };

    await channel.track(userStatus);
  };

  return { updateStatus };
};

export default RealTimePresence;
