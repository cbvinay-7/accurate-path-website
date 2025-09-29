
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Award, Plus, Trash2 } from 'lucide-react';

interface Certificate {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

interface CertificatesCardProps {
  formData: {
    certificates: Certificate[];
  };
  onInputChange: (field: string, value: Certificate[]) => void;
}

const CertificatesCard: React.FC<CertificatesCardProps> = ({ formData, onInputChange }) => {
  const addCertificate = () => {
    const newCertificate: Certificate = {
      name: '',
      issuer: '',
      date: '',
      credentialId: ''
    };
    onInputChange('certificates', [...formData.certificates, newCertificate]);
  };

  const updateCertificate = (index: number, field: keyof Certificate, value: string) => {
    const updatedCertificates = [...formData.certificates];
    updatedCertificates[index] = { ...updatedCertificates[index], [field]: value };
    onInputChange('certificates', updatedCertificates);
  };

  const removeCertificate = (index: number) => {
    const updatedCertificates = formData.certificates.filter((_, i) => i !== index);
    onInputChange('certificates', updatedCertificates);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Certificates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {formData.certificates.map((cert, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Certificate #{index + 1}</h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeCertificate(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`cert-name-${index}`}>Certificate Name</Label>
                <Input
                  id={`cert-name-${index}`}
                  value={cert.name}
                  onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                  placeholder="Certificate name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`cert-issuer-${index}`}>Issuing Organization</Label>
                <Input
                  id={`cert-issuer-${index}`}
                  value={cert.issuer}
                  onChange={(e) => updateCertificate(index, 'issuer', e.target.value)}
                  placeholder="Organization name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`cert-date-${index}`}>Issue Date</Label>
                <Input
                  id={`cert-date-${index}`}
                  type="date"
                  value={cert.date}
                  onChange={(e) => updateCertificate(index, 'date', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`cert-id-${index}`}>Credential ID (Optional)</Label>
                <Input
                  id={`cert-id-${index}`}
                  value={cert.credentialId || ''}
                  onChange={(e) => updateCertificate(index, 'credentialId', e.target.value)}
                  placeholder="Credential ID or URL"
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addCertificate}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Certificate
        </Button>
      </CardContent>
    </Card>
  );
};

export default CertificatesCard;
