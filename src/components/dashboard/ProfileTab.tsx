
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ProfileTab = () => {
  const { user } = useAuth();

  return (
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
  );
};

export default ProfileTab;
