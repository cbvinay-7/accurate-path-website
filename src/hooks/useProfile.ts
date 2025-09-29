
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  phone: string | null;
  date_of_birth: string | null;
  address: string | null;
  university: string | null;
  degree: string | null;
  graduation_year: number | null;
  skills: string[] | null;
  experience_years: number | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  bio: string | null;
  professional_experience: any[] | null;
  projects: any[] | null;
  certificates: any[] | null;
  languages: any[] | null;
  interests: string[] | null;
  declaration: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface FormData {
  full_name: string;
  phone: string;
  date_of_birth: string;
  address: string;
  university: string;
  degree: string;
  graduation_year: string;
  skills: string;
  experience_years: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  bio: string;
  professional_experience: any[];
  projects: any[];
  certificates: any[];
  languages: any[];
  interests: string;
  declaration: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    university: '',
    degree: '',
    graduation_year: '',
    skills: '',
    experience_years: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
    bio: '',
    professional_experience: [],
    projects: [],
    certificates: [],
    languages: [],
    interests: '',
    declaration: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile information.",
          variant: "destructive",
        });
      } else {
        const profileData = {
          ...data,
          professional_experience: Array.isArray(data.professional_experience) ? data.professional_experience : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          certificates: Array.isArray(data.certificates) ? data.certificates : [],
          languages: Array.isArray(data.languages) ? data.languages : [],
        };
        
        setProfile(profileData);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || '',
          address: data.address || '',
          university: data.university || '',
          degree: data.degree || '',
          graduation_year: data.graduation_year?.toString() || '',
          skills: data.skills?.join(', ') || '',
          experience_years: data.experience_years?.toString() || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          portfolio_url: data.portfolio_url || '',
          bio: data.bio || '',
          professional_experience: Array.isArray(data.professional_experience) ? data.professional_experience : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          certificates: Array.isArray(data.certificates) ? data.certificates : [],
          languages: Array.isArray(data.languages) ? data.languages : [],
          interests: data.interests?.join(', ') || '',
          declaration: data.declaration || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | any[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        full_name: formData.full_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth || null,
        address: formData.address,
        university: formData.university,
        degree: formData.degree,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : null,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        portfolio_url: formData.portfolio_url,
        bio: formData.bio,
        professional_experience: formData.professional_experience,
        projects: formData.projects,
        certificates: formData.certificates,
        languages: formData.languages,
        interests: formData.interests ? formData.interests.split(',').map(s => s.trim()).filter(s => s) : null,
        declaration: formData.declaration,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user?.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully.",
        });
        fetchProfile();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  return {
    profile,
    formData,
    loading,
    saving,
    handleInputChange,
    handleSaveProfile
  };
};
