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
import { Plus, Edit, Trash2, Briefcase, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  tags: string[];
  posted_at: string;
  created_at: string;
  updated_at: string;
}

const AdminJobs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    tags: '',
    requirements: '',
    benefits: '',
    experience_level: '',
    employment_type: ''
  });

  // Fetch jobs
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Job[];
    }
  });

  // Add job mutation
  const addJobMutation = useMutation({
    mutationFn: async (formData: typeof jobForm) => {
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.employment_type || formData.type,
        salary: formData.salary,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        posted_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('jobs')
        .insert(jobData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Job posted successfully!"
      });
    },
    onError: (error) => {
      console.error('Error adding job:', error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: typeof jobForm }) => {
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.employment_type || formData.type,
        salary: formData.salary,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      setIsEditDialogOpen(false);
      setEditingJob(null);
      resetForm();
      toast({
        title: "Success",
        description: "Job updated successfully!"
      });
    },
    onError: (error) => {
      console.error('Error updating job:', error);
      toast({
        title: "Error",
        description: "Failed to update job. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      toast({
        title: "Success",
        description: "Job deleted successfully!"
      });
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setJobForm({
      title: '',
      company: '',
      location: '',
      type: '',
      salary: '',
      description: '',
      tags: '',
      requirements: '',
      benefits: '',
      experience_level: '',
      employment_type: ''
    });
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      tags: job.tags.join(', '),
      requirements: '',
      benefits: '',
      experience_level: '',
      employment_type: job.type
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJob) {
      updateJobMutation.mutate({ id: editingJob.id, formData: jobForm });
    } else {
      addJobMutation.mutate(jobForm);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading jobs...</div>
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
              <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post New Job</DialogTitle>
                  <DialogDescription>
                    Fill in the job details below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                        required
                        placeholder="Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={jobForm.company}
                        onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                        required
                        placeholder="Tech Corp Inc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                        required
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="employment_type">Employment Type *</Label>
                      <Input
                        id="employment_type"
                        value={jobForm.employment_type}
                        onChange={(e) => setJobForm({...jobForm, employment_type: e.target.value})}
                        required
                        placeholder="Full-time, Part-time, Contract"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salary">Salary Range *</Label>
                      <Input
                        id="salary"
                        value={jobForm.salary}
                        onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                        required
                        placeholder="$80,000 - $120,000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience_level">Experience Level</Label>
                      <Input
                        id="experience_level"
                        value={jobForm.experience_level}
                        onChange={(e) => setJobForm({...jobForm, experience_level: e.target.value})}
                        placeholder="Mid-level, Senior, Entry-level"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      value={jobForm.description}
                      onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                      rows={6}
                      required
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      value={jobForm.requirements}
                      onChange={(e) => setJobForm({...jobForm, requirements: e.target.value})}
                      rows={4}
                      placeholder="List the required skills, qualifications, and experience..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="benefits">Benefits & Perks</Label>
                    <Textarea
                      id="benefits"
                      value={jobForm.benefits}
                      onChange={(e) => setJobForm({...jobForm, benefits: e.target.value})}
                      rows={3}
                      placeholder="Health insurance, remote work, flexible hours..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Skills/Technologies (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={jobForm.tags}
                      onChange={(e) => setJobForm({...jobForm, tags: e.target.value})}
                      placeholder="JavaScript, React, Node.js, AWS"
                    />
                  </div>

                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={addJobMutation.isPending}
                    >
                      {addJobMutation.isPending ? 'Posting...' : 'Post Job'}
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
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Listings
            </CardTitle>
            <CardDescription>
              Manage all job postings in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs?.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{job.salary}</TableCell>
                    <TableCell>{new Date(job.posted_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(job)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteJobMutation.mutate(job.id)}
                          disabled={deleteJobMutation.isPending}
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
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the job details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Job Title *</Label>
                <Input
                  id="edit-title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-company">Company *</Label>
                <Input
                  id="edit-company"
                  value={jobForm.company}
                  onChange={(e) => setJobForm({...jobForm, company: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Employment Type *</Label>
                <Input
                  id="edit-type"
                  value={jobForm.employment_type}
                  onChange={(e) => setJobForm({...jobForm, employment_type: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-salary">Salary Range *</Label>
              <Input
                id="edit-salary"
                value={jobForm.salary}
                onChange={(e) => setJobForm({...jobForm, salary: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Job Description *</Label>
              <Textarea
                id="edit-description"
                value={jobForm.description}
                onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                rows={6}
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-tags">Skills/Technologies (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={jobForm.tags}
                onChange={(e) => setJobForm({...jobForm, tags: e.target.value})}
              />
            </div>

            <DialogFooter>
              <Button 
                type="submit" 
                disabled={updateJobMutation.isPending}
              >
                {updateJobMutation.isPending ? 'Updating...' : 'Update Job'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminJobs;
