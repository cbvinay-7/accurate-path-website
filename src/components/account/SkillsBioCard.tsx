
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase } from 'lucide-react';

interface SkillsBioCardProps {
  formData: {
    skills: string;
    bio: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const SkillsBioCard: React.FC<SkillsBioCardProps> = ({ formData, onInputChange }) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Skills & Bio
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="skills">Skills * (comma-separated)</Label>
          <Input
            id="skills"
            value={formData.skills}
            onChange={(e) => onInputChange('skills', e.target.value)}
            placeholder="e.g., JavaScript, React, Node.js, Python"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio *</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => onInputChange('bio', e.target.value)}
            placeholder="Write a brief description about yourself..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsBioCard;
