
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, Plus, Trash2 } from 'lucide-react';

interface Language {
  name: string;
  proficiency: string;
}

interface LanguagesCardProps {
  formData: {
    languages: Language[];
  };
  onInputChange: (field: string, value: Language[]) => void;
}

const LanguagesCard: React.FC<LanguagesCardProps> = ({ formData, onInputChange }) => {
  const proficiencyLevels = [
    'Beginner',
    'Elementary',
    'Intermediate',
    'Upper Intermediate',
    'Advanced',
    'Proficient',
    'Native'
  ];

  const addLanguage = () => {
    const newLanguage: Language = {
      name: '',
      proficiency: ''
    };
    onInputChange('languages', [...formData.languages, newLanguage]);
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    onInputChange('languages', updatedLanguages);
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = formData.languages.filter((_, i) => i !== index);
    onInputChange('languages', updatedLanguages);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Languages
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {formData.languages.map((lang, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Language #{index + 1}</h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeLanguage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`lang-name-${index}`}>Language</Label>
                <Input
                  id={`lang-name-${index}`}
                  value={lang.name}
                  onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                  placeholder="e.g., English, Spanish"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`lang-proficiency-${index}`}>Proficiency Level</Label>
                <Select 
                  value={lang.proficiency} 
                  onValueChange={(value) => updateLanguage(index, 'proficiency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addLanguage}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </CardContent>
    </Card>
  );
};

export default LanguagesCard;
