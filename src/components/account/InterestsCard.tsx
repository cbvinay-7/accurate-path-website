
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';

interface InterestsCardProps {
  formData: {
    interests: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const InterestsCard: React.FC<InterestsCardProps> = ({ formData, onInputChange }) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Interests & Hobbies
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Label htmlFor="interests">Interests (comma-separated)</Label>
          <Input
            id="interests"
            value={formData.interests}
            onChange={(e) => onInputChange('interests', e.target.value)}
            placeholder="e.g., Photography, Reading, Traveling, Coding"
          />
          <p className="text-xs text-gray-500">
            List your hobbies and interests that showcase your personality
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterestsCard;
