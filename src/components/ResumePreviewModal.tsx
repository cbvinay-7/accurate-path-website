
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import { generateResumePDF } from '@/utils/pdfGenerator';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa?: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
  interests: string[];
  declaration: string;
}

interface ResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  templateId: string;
}

const templates = {
  modern: { component: ModernTemplate, name: 'Modern Professional' },
  classic: { component: ClassicTemplate, name: 'Classic Executive' },
  creative: { component: CreativeTemplate, name: 'Creative Designer' },
  minimal: { component: MinimalTemplate, name: 'Minimal Clean' }
};

const ResumePreviewModal = ({ isOpen, onClose, data, templateId }: ResumePreviewModalProps) => {
  const selectedTemplate = templates[templateId as keyof typeof templates] || templates.modern;
  const TemplateComponent = selectedTemplate.component;

  const handleDownloadPDF = () => {
    generateResumePDF(data, selectedTemplate.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[95vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Resume Preview - {selectedTemplate.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="bg-gray-50 p-4 rounded-lg min-h-full">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mx-auto" style={{ maxWidth: '210mm', transform: 'scale(0.9)', transformOrigin: 'top center' }}>
              <TemplateComponent data={data} isPreview={false} />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ResumePreviewModal;
