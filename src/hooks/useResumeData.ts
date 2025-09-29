
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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

export const useResumeData = () => {
  const { user } = useAuth();
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
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certificates: [],
    languages: [],
    interests: [],
    declaration: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchResumeData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        console.log('Fetched profile data:', data); // Debug log to check declaration value
        
        // Type-safe casting for JSONB arrays
        const professionalExperience = Array.isArray(data.professional_experience) 
          ? (data.professional_experience as Array<{
              company: string;
              position: string;
              duration: string;
              description: string;
            }>)
          : [];

        const projects = Array.isArray(data.projects)
          ? (data.projects as Array<{
              name: string;
              description: string;
              technologies: string;
            }>)
          : [];

        const certificates = Array.isArray(data.certificates)
          ? (data.certificates as Array<{
              name: string;
              issuer: string;
              date: string;
              credentialId?: string;
            }>)
          : [];

        const languages = Array.isArray(data.languages)
          ? (data.languages as Array<{
              name: string;
              proficiency: string;
            }>)
          : [];

        const resumeDataToSet = {
          personalInfo: {
            fullName: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.address || '',
            linkedin: data.linkedin_url || '',
            portfolio: data.portfolio_url || ''
          },
          summary: data.bio || '',
          experience: professionalExperience,
          education: [{
            institution: data.university || '',
            degree: data.degree || '',
            year: data.graduation_year?.toString() || '',
            gpa: ''
          }].filter(edu => edu.institution),
          skills: data.skills || [],
          projects: projects,
          certificates: certificates,
          languages: languages,
          interests: data.interests || [],
          declaration: data.declaration || ''
        };

        console.log('Setting resume data with declaration:', resumeDataToSet.declaration); // Debug log
        setResumeData(resumeDataToSet);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, [user]);

  return { resumeData, loading, refetch: fetchResumeData };
};
