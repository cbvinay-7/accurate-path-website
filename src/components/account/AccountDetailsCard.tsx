
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface Profile {
  email: string | null;
}

interface AccountDetailsCardProps {
  profile: Profile | null;
}

const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({ profile }) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Account Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profile?.email || ''}
            disabled
            className="bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDetailsCard;
