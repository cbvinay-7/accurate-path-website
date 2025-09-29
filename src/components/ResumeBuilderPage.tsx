import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Eye, Sparkles, RefreshCw } from 'lucide-react';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ResumePreviewModal from './ResumePreviewModal';
import { generateResumePDF } from '@/utils/pdfGenerator';
import { useResumeData } from '@/hooks/useResumeData';
import { useToast } from '@/hooks/use-toast';

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

const templates = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and contemporary design perfect for tech roles',
    component: ModernTemplate
  },
  {
    id: 'classic',
    name: 'Classic Executive',
    description: 'Traditional layout ideal for corporate positions',
    component: ClassicTemplate
  },
  {
    id: 'creative',
    name: 'Creative Designer',
    description: 'Bold and artistic layout for creative professionals',
    component: CreativeTemplate
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple and elegant design that highlights content',
    component: MinimalTemplate
  }
];

// Sample data for template previews
const sampleData: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    portfolio: 'johndoe.com'
  },
  summary: 'Experienced software developer with 5+ years of expertise in full-stack development. Passionate about creating innovative solutions and leading cross-functional teams.',
  experience: [
    {
      company: 'Tech Company Inc.',
      position: 'Senior Software Developer',
      duration: '2022 - Present',
      description: 'Led development of scalable web applications serving 10M+ users. Reduced load times by 40% through optimization.'
    },
    {
      company: 'StartupXYZ',
      position: 'Frontend Developer',
      duration: '2020 - 2022',
      description: 'Built responsive React applications and collaborated with design teams to implement pixel-perfect UIs.'
    }
  ],
  education: [
    {
      institution: 'University of California',
      degree: 'Bachelor of Science in Computer Science',
      year: '2020',
      gpa: '3.8'
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB'],
  projects: [
    {
      name: 'E-commerce Platform',
      description: 'Full-stack web application with real-time inventory management and payment processing.',
      technologies: 'React, Node.js, MongoDB, Stripe API'
    }
  ],
  certificates: [],
  languages: [],
  interests: [],
  declaration: ''
};

const ResumeBuilderPage = ({ onBack }: { onBack: () => void }) => {
  const { resumeData: profileData, loading, refetch } = useResumeData();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showPreview, setShowPreview] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    experience: [{ company: '', position: '', duration: '', description: '' }],
    education: [{ institution: '', degree: '', year: '', gpa: '' }],
    skills: [],
    projects: [{ name: '', description: '', technologies: '' }],
    certificates: [],
    languages: [],
    interests: [],
    declaration: ''
  });
  const [activeTab, setActiveTab] = useState('template');

  // Load profile data when available
  useEffect(() => {
    if (profileData && !loading) {
      setResumeData(profileData);
      toast({
        title: "Profile Loaded",
        description: "Your saved profile details have been loaded automatically.",
      });
    }
  }, [profileData, loading, toast]);

  const loadProfileData = () => {
    refetch();
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', duration: '', description: '' }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '', gpa: '' }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: '' }]
    }));
  };

  const updateProject = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const updateSkills = (skillsText: string) => {
    const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
    setResumeData(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleDownloadPDF = () => {
    const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
    generateResumePDF(resumeData, selectedTemplateData?.name || 'Modern Professional');
  };

  const selectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || ModernTemplate;
  const SelectedTemplate = selectedTemplateComponent;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Resume Builder</h1>
              <p className="text-gray-600">Create a professional resume in minutes with our smart templates</p>
            </div>
            <Button 
              onClick={loadProfileData} 
              variant="outline"
              disabled={loading}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Load Profile Data'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Builder Panel */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Choose Your Template</CardTitle>
                      {profileData.personalInfo.fullName && (
                        <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          Profile data loaded ✓
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {templates.map((template) => {
                        const TemplateComponent = template.component;
                        return (
                          <div
                            key={template.id}
                            className={`relative cursor-pointer transition-all duration-200 ${
                              selectedTemplate === template.id
                                ? 'ring-2 ring-blue-500 ring-offset-2'
                                : 'hover:shadow-lg'
                            }`}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                              <div className="h-64 overflow-hidden relative">
                                <TemplateComponent data={sampleData} isPreview={true} />
                              </div>
                              <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                                <p className="text-sm text-gray-600">{template.description}</p>
                              </div>
                            </div>
                            {selectedTemplate === template.id && (
                              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => updatePersonalInfo('location', e.target.value)}
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="portfolio">Portfolio</Label>
                        <Input
                          id="portfolio"
                          value={resumeData.personalInfo.portfolio}
                          onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                          placeholder="johndoe.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        value={resumeData.summary}
                        onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                        placeholder="Write a brief professional summary..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                {/* Experience Section */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Work Experience</CardTitle>
                      <Button onClick={addExperience} size="sm">Add Experience</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              placeholder="Company Name"
                            />
                          </div>
                          <div>
                            <Label>Position</Label>
                            <Input
                              value={exp.position}
                              onChange={(e) => updateExperience(index, 'position', e.target.value)}
                              placeholder="Job Title"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <Input
                            value={exp.duration}
                            onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                            placeholder="Jan 2023 - Present"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Education Section */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Education</CardTitle>
                      <Button onClick={addEducation} size="sm">Add Education</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.education.map((edu, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Institution</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                              placeholder="University Name"
                            />
                          </div>
                          <div>
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              placeholder="Bachelor of Science"
                            />
                          </div>
                          <div>
                            <Label>Year</Label>
                            <Input
                              value={edu.year}
                              onChange={(e) => updateEducation(index, 'year', e.target.value)}
                              placeholder="2024"
                            />
                          </div>
                          <div>
                            <Label>GPA (Optional)</Label>
                            <Input
                              value={edu.gpa || ''}
                              onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                              placeholder="3.8"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Skills Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label>Skills (comma-separated)</Label>
                    <Textarea
                      value={resumeData.skills.join(', ')}
                      onChange={(e) => updateSkills(e.target.value)}
                      placeholder="JavaScript, React, Node.js, Python, SQL"
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Projects Section */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Projects</CardTitle>
                      <Button onClick={addProject} size="sm">Add Project</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.projects.map((proj, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div>
                          <Label>Project Name</Label>
                          <Input
                            value={proj.name}
                            onChange={(e) => updateProject(index, 'name', e.target.value)}
                            placeholder="Project Name"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={proj.description}
                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                            placeholder="Describe your project..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Technologies</Label>
                          <Input
                            value={proj.technologies}
                            onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                            placeholder="React, Node.js, MongoDB"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="review">
                <Card>
                  <CardHeader>
                    <CardTitle>Review & Download</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-800">Resume Score: 95%</p>
                            <p className="text-sm text-green-600">Excellent! Your resume is optimized for ATS systems.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button size="lg" className="flex-1" onClick={handleDownloadPDF}>
                          <Download className="h-5 w-5 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" size="lg" onClick={() => setShowPreview(true)}>
                          <Eye className="h-5 w-5 mr-2" />
                          Full Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Full View
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="h-96 overflow-auto">
                    <SelectedTemplate data={resumeData} isPreview={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <ResumePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={resumeData}
        templateId={selectedTemplate}
      />
    </div>
  );
};

export default ResumeBuilderPage;
