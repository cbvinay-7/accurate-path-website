
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';

interface EducationCardProps {
  formData: {
    university: string;
    degree: string;
    graduation_year: string;
    experience_years: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const EducationCard: React.FC<EducationCardProps> = ({ formData, onInputChange }) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="university">University *</Label>
          <Input
            id="university"
            value={formData.university}
            onChange={(e) => onInputChange('university', e.target.value)}
            placeholder="Enter your university name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="degree">Degree *</Label>
          <Input
            id="degree"
            value={formData.degree}
            onChange={(e) => onInputChange('degree', e.target.value)}
            placeholder="e.g., Bachelor's in Computer Science"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="graduationYear">Graduation Year *</Label>
          <Input
            id="graduationYear"
            type="number"
            value={formData.graduation_year}
            onChange={(e) => onInputChange('graduation_year', e.target.value)}
            placeholder="e.g., 2024"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experienceYears">Years of Experience</Label>
          <Input
            id="experienceYears"
            type="number"
            value={formData.experience_years}
            onChange={(e) => onInputChange('experience_years', e.target.value)}
            placeholder="e.g., 2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationCard;
