
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FolderOpen, Plus, Trash2 } from 'lucide-react';

interface Project {
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

interface ProjectsCardProps {
  formData: {
    projects: Project[];
  };
  onInputChange: (field: string, value: Project[]) => void;
}

const ProjectsCard: React.FC<ProjectsCardProps> = ({ formData, onInputChange }) => {
  const addProject = () => {
    const newProject: Project = {
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    onInputChange('projects', [...formData.projects, newProject]);
  };

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    onInputChange('projects', updatedProjects);
  };

  const removeProject = (index: number) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    onInputChange('projects', updatedProjects);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {formData.projects.map((project, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">Project #{index + 1}</h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeProject(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor={`project-name-${index}`}>Project Name</Label>
                <Input
                  id={`project-name-${index}`}
                  value={project.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  placeholder="Project name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`project-link-${index}`}>Project Link (Optional)</Label>
                <Input
                  id={`project-link-${index}`}
                  value={project.link || ''}
                  onChange={(e) => updateProject(index, 'link', e.target.value)}
                  placeholder="https://github.com/user/project"
                />
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Label htmlFor={`project-technologies-${index}`}>Technologies Used</Label>
              <Input
                id={`project-technologies-${index}`}
                value={project.technologies}
                onChange={(e) => updateProject(index, 'technologies', e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`project-description-${index}`}>Description</Label>
              <Textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                placeholder="Describe the project and your role..."
                rows={3}
              />
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addProject}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectsCard;
