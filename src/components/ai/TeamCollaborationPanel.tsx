
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import RealTimePresence from './RealTimePresence';
import { 
  Users, 
  UserPlus, 
  Crown, 
  Shield, 
  Eye,
  MessageCircle,
  Calendar,
  Activity
} from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  lastActive?: string;
  avatar?: string;
  name?: string;
}

interface TeamCollaborationPanelProps {
  conversationId?: string;
}

const TeamCollaborationPanel = ({ conversationId }: TeamCollaborationPanelProps) => {
  const { user } = useAuthContext();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'member' | 'viewer'>('member');
  const [isInviting, setIsInviting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (conversationId) {
      fetchTeamMembers();
    }
  }, [conversationId]);

  const fetchTeamMembers = async () => {
    if (!conversationId) return;

    try {
      // First get the conversation shares
      const { data: shares, error: sharesError } = await supabase
        .from('conversation_shares')
        .select('*')
        .eq('conversation_id', conversationId);

      if (sharesError) throw sharesError;

      if (!shares || shares.length === 0) {
        setTeamMembers([]);
        return;
      }

      // Get user profiles for the shared users
      const userIds = shares.map(share => share.shared_with);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const members: TeamMember[] = shares.map(share => {
        const profile = profiles?.find(p => p.id === share.shared_with);
        return {
          id: share.shared_with,
          email: profile?.full_name || 'Unknown User',
          role: share.permission_level as 'owner' | 'admin' | 'member' | 'viewer',
          joinedAt: share.created_at,
          avatar: profile?.avatar_url,
          name: profile?.full_name
        };
      });

      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim() || !conversationId || !user) return;

    setIsInviting(true);
    try {
      // First, check if user exists by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', inviteEmail) // Using full_name as proxy for email search
        .single();

      if (userError || !userData) {
        toast({
          title: "User not found",
          description: "No user found with that email address.",
          variant: "destructive"
        });
        return;
      }

      // Create share invitation
      const { error: shareError } = await supabase
        .from('conversation_shares')
        .insert({
          conversation_id: conversationId,
          shared_with: userData.id,
          shared_by: user.id,
          permission_level: selectedRole,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        });

      if (shareError) throw shareError;

      toast({
        title: "Invitation sent",
        description: `User invited as ${selectedRole}`,
      });

      setInviteEmail('');
      fetchTeamMembers();
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "Failed to invite user",
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'member':
        return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Collaboration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Real-time presence indicator */}
        {conversationId && (
          <RealTimePresence conversationId={conversationId} />
        )}

        {/* Invite Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Invite Team Members</h3>
          <div className="flex gap-2">
            <Input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter user name or email"
              className="flex-1"
            />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'member' | 'viewer')}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <Button
            onClick={handleInviteUser}
            disabled={!inviteEmail.trim() || isInviting}
            className="w-full"
            size="sm"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {isInviting ? 'Inviting...' : 'Send Invitation'}
          </Button>
        </div>

        {/* Team Members List */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Team Members ({teamMembers.length})</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name || member.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={getRoleBadgeColor(member.role)}>
                      <span className="flex items-center gap-1">
                        {getRoleIcon(member.role)}
                        {member.role}
                      </span>
                    </Badge>
                  </div>
                </div>
              ))}
              
              {teamMembers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No team members yet</p>
                  <p className="text-xs">Invite collaborators to get started</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Real-time Activity */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• Team collaboration active</p>
            <p>• Real-time presence enabled</p>
            <p>• Secure conversation sharing</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCollaborationPanel;
