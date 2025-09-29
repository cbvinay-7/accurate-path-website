
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  full_name: string | null;
}

interface ProfileHeaderProps {
  profile: Profile | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/index')}
        className="mb-4 hover:bg-blue-50 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
          <AvatarImage src="" alt={profile?.full_name || 'User'} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-lg font-semibold">
            {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {profile?.full_name || 'Your Account'}
          </h1>
          <p className="text-gray-600 mt-1">Manage your profile and account settings</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
