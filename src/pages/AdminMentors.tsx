import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, Edit, Trash2, Star } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  rating: number;
  sessions: number;
  price: string;
  image_url?: string;
  bio?: string;
}

const AdminMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    expertise: '',
    rating: 5.0,
    sessions: 0,
    price: '',
    image_url: '',
    bio: ''
  });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch mentors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mentorData = {
        ...formData,
        expertise: formData.expertise.split(',').map(s => s.trim()).filter(s => s)
      };

      if (editingMentor) {
        const { error } = await supabase
          .from('mentors')
          .update(mentorData)
          .eq('id', editingMentor.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Mentor updated successfully" });
      } else {
        const { error } = await supabase
          .from('mentors')
          .insert([mentorData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Mentor added successfully" });
      }

      resetForm();
      fetchMentors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save mentor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mentor: Mentor) => {
    setEditingMentor(mentor);
    setFormData({
      name: mentor.name,
      title: mentor.title,
      company: mentor.company,
      expertise: mentor.expertise.join(', '),
      rating: mentor.rating,
      sessions: mentor.sessions,
      price: mentor.price,
      image_url: mentor.image_url || '',
      bio: mentor.bio || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mentor?')) return;

    try {
      const { error } = await supabase
        .from('mentors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Mentor deleted successfully" });
      fetchMentors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete mentor",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      company: '',
      expertise: '',
      rating: 5.0,
      sessions: 0,
      price: '',
      image_url: '',
      bio: ''
    });
    setShowForm(false);
    setEditingMentor(null);
  };

  if (loading && mentors.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Manage Mentors</h1>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Mentor
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingMentor ? 'Edit Mentor' : 'Add New Mentor'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="e.g., $50/hour"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="expertise">Expertise (comma-separated)</Label>
                    <Input
                      id="expertise"
                      value={formData.expertise}
                      onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                      placeholder="React, Node.js, JavaScript"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Brief description about the mentor..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {editingMentor ? 'Update' : 'Add'} Mentor
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{mentor.name}</CardTitle>
                    <p className="text-blue-600 font-medium">{mentor.title}</p>
                    <p className="text-gray-600">{mentor.company}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(mentor)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(mentor.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    {mentor.rating} • {mentor.sessions} sessions
                  </div>
                  <div className="text-sm font-medium text-green-600">{mentor.price}</div>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 3}
                      </Badge>
                    )}
                  </div>
                  {mentor.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2">{mentor.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No mentors found. Add your first mentor!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMentors;
