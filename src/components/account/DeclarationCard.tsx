
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileCheck } from 'lucide-react';

interface DeclarationCardProps {
  formData: {
    declaration: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const DeclarationCard: React.FC<DeclarationCardProps> = ({ formData, onInputChange }) => {
  const defaultDeclaration = "I hereby declare that all the information provided above is true and accurate to the best of my knowledge. I understand that any false information may lead to disqualification of my application.";

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-500 to-gray-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          Declaration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Label htmlFor="declaration">Declaration Statement</Label>
          <Textarea
            id="declaration"
            value={formData.declaration || defaultDeclaration}
            onChange={(e) => onInputChange('declaration', e.target.value)}
            placeholder={defaultDeclaration}
            rows={4}
          />
          <p className="text-xs text-gray-500">
            This statement will appear at the end of your resume
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeclarationCard;
