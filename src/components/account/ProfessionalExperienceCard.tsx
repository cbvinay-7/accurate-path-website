
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface ProfessionalExperienceCardProps {
  formData: {
    professional_experience: Experience[];
  };
  onInputChange: (field: string, value: Experience[]) => void;
}

const ProfessionalExperienceCard: React.FC<ProfessionalExperienceCardProps> = ({ 
  formData, 
  onInputChange 
}) => {
  const addExperience = () => {
    const newExperience: Experience = {
      company: '',
      position: '',
      duration: '',
      description: ''
    };
    onInputChange('professional_experience', [...formData.professional_experience, newExperience]);
  };

  const updateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExperience = [...formData.professional_experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    onInputChange('professional_experience', updatedExperience);
  };

  const removeExperience = (index: number) => {
    const updatedExperience = formData.professional_experience.filter((_, i) => i !== index);
    onInputChange('professional_experience', updatedExperience);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Professional Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {formData.professional_experience.map((exp, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Experience #{index + 1}</h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeExperience(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`company-${index}`}>Company</Label>
                <Input
                  id={`company-${index}`}
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="Company name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`position-${index}`}>Position</Label>
                <Input
                  id={`position-${index}`}
                  value={exp.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  placeholder="Job title"
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Label htmlFor={`duration-${index}`}>Duration</Label>
              <Input
                id={`duration-${index}`}
                value={exp.duration}
                onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                placeholder="e.g., Jan 2020 - Dec 2022"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
              />
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addExperience}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfessionalExperienceCard;
