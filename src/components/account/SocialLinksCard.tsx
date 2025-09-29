
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';

interface SocialLinksCardProps {
  formData: {
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const SocialLinksCard: React.FC<SocialLinksCardProps> = ({ formData, onInputChange }) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Social Links
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input
            id="linkedinUrl"
            value={formData.linkedin_url}
            onChange={(e) => onInputChange('linkedin_url', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input
            id="githubUrl"
            value={formData.github_url}
            onChange={(e) => onInputChange('github_url', e.target.value)}
            placeholder="https://github.com/yourusername"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
          <Input
            id="portfolioUrl"
            value={formData.portfolio_url}
            onChange={(e) => onInputChange('portfolio_url', e.target.value)}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinksCard;
