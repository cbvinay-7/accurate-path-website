import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, FolderOpen, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  zip_file_url: string | null;
  stars: number;
  contributors: number;
  created_at: string;
  updated_at: string;
}

const AdminProjects = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    author: '',
    category: '',
    tags: '',
    github_url: '',
    demo_url: '',
    image_file: null as File | null,
    zip_file: null as File | null,
    video_url: '',
    technologies: ''
  });

  // Fetch projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    }
  });

  // Upload file to storage
  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  };

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (formData: typeof projectForm) => {
      let imageUrl = '';
      let zipFileUrl = '';

      // Upload image if provided
      if (formData.image_file) {
        const imagePath = `projects/images/${Date.now()}_${formData.image_file.name}`;
        imageUrl = await uploadFile(formData.image_file, 'admin-files', imagePath);
      }

      // Upload zip file if provided
      if (formData.zip_file) {
        const zipPath = `projects/files/${Date.now()}_${formData.zip_file.name}`;
        zipFileUrl = await uploadFile(formData.zip_file, 'admin-files', zipPath);
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        author: formData.author,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        github_url: formData.github_url || null,
        demo_url: formData.demo_url || null,
        image_url: imageUrl || null,
        zip_file_url: zipFileUrl || null
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Project added successfully!"
      });
    },
    onError: (error) => {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: typeof projectForm }) => {
      let imageUrl = editingProject?.image_url || '';
      let zipFileUrl = editingProject?.zip_file_url || '';

      // Upload new image if provided
      if (formData.image_file) {
        const imagePath = `projects/images/${Date.now()}_${formData.image_file.name}`;
        imageUrl = await uploadFile(formData.image_file, 'admin-files', imagePath);
      }

      // Upload new zip file if provided
      if (formData.zip_file) {
        const zipPath = `projects/files/${Date.now()}_${formData.zip_file.name}`;
        zipFileUrl = await uploadFile(formData.zip_file, 'admin-files', zipPath);
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        author: formData.author,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        github_url: formData.github_url || null,
        demo_url: formData.demo_url || null,
        image_url: imageUrl || null,
        zip_file_url: zipFileUrl || null,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      setIsEditDialogOpen(false);
      setEditingProject(null);
      resetForm();
      toast({
        title: "Success",
        description: "Project updated successfully!"
      });
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      toast({
        title: "Success",
        description: "Project deleted successfully!"
      });
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setProjectForm({
      title: '',
      description: '',
      author: '',
      category: '',
      tags: '',
      github_url: '',
      demo_url: '',
      image_file: null,
      zip_file: null,
      video_url: '',
      technologies: ''
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      author: project.author,
      category: project.category,
      tags: project.tags.join(', '),
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      image_file: null,
      zip_file: null,
      video_url: '',
      technologies: ''
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, formData: projectForm });
    } else {
      addProjectMutation.mutate(projectForm);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" className="hover:bg-gray-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Manage Projects</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Fill in the project details below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Project Name *</Label>
                      <Input
                        id="title"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        value={projectForm.author}
                        onChange={(e) => setProjectForm({...projectForm, author: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Project Details *</Label>
                    <Textarea
                      id="description"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Technologies Used (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={projectForm.tags}
                        onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="github_url">GitHub URL</Label>
                      <Input
                        id="github_url"
                        type="url"
                        value={projectForm.github_url}
                        onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="demo_url">Demo URL</Label>
                      <Input
                        id="demo_url"
                        type="url"
                        value={projectForm.demo_url}
                        onChange={(e) => setProjectForm({...projectForm, demo_url: e.target.value})}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="image_file">Project Screenshot</Label>
                      <Input
                        id="image_file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProjectForm({...projectForm, image_file: e.target.files?.[0] || null})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip_file">Project Files (ZIP)</Label>
                      <Input
                        id="zip_file"
                        type="file"
                        accept=".zip,.rar"
                        onChange={(e) => setProjectForm({...projectForm, zip_file: e.target.files?.[0] || null})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="video_url">Project Video URL</Label>
                    <Input
                      id="video_url"
                      type="url"
                      value={projectForm.video_url}
                      onChange={(e) => setProjectForm({...projectForm, video_url: e.target.value})}
                      placeholder="https://youtube.com/..."
                    />
                  </div>

                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={addProjectMutation.isPending}
                    >
                      {addProjectMutation.isPending ? 'Adding...' : 'Add Project'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Manage all projects in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Technologies</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects?.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.author}</TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>{project.tags.join(', ')}</TableCell>
                    <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProjectMutation.mutate(project.id)}
                          disabled={deleteProjectMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Same form fields as add dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Project Name *</Label>
                <Input
                  id="edit-title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-author">Author *</Label>
                <Input
                  id="edit-author"
                  value={projectForm.author}
                  onChange={(e) => setProjectForm({...projectForm, author: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Project Details *</Label>
              <Textarea
                id="edit-description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Input
                  id="edit-category"
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-tags">Technologies Used (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-github">GitHub URL</Label>
                <Input
                  id="edit-github"
                  type="url"
                  value={projectForm.github_url}
                  onChange={(e) => setProjectForm({...projectForm, github_url: e.target.value})}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <Label htmlFor="edit-demo">Demo URL</Label>
                <Input
                  id="edit-demo"
                  type="url"
                  value={projectForm.demo_url}
                  onChange={(e) => setProjectForm({...projectForm, demo_url: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-image">Project Screenshot (replace current)</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProjectForm({...projectForm, image_file: e.target.files?.[0] || null})}
                />
              </div>
              <div>
                <Label htmlFor="edit-zip">Project Files (replace current ZIP)</Label>
                <Input
                  id="edit-zip"
                  type="file"
                  accept=".zip,.rar"
                  onChange={(e) => setProjectForm({...projectForm, zip_file: e.target.files?.[0] || null})}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="submit" 
                disabled={updateProjectMutation.isPending}
              >
                {updateProjectMutation.isPending ? 'Updating...' : 'Update Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;
