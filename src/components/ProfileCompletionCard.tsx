
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, User, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
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
}

const ProfileCompletionCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const requiredFields = [
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'date_of_birth', label: 'Date of Birth' },
    { key: 'address', label: 'Address' },
    { key: 'university', label: 'University' },
    { key: 'degree', label: 'Degree' },
    { key: 'graduation_year', label: 'Graduation Year' },
    { key: 'skills', label: 'Skills' },
    { key: 'bio', label: 'Bio' }
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

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
        setProfile(data);
        calculateCompletion(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = (profileData: Profile) => {
    const missing: string[] = [];
    let completedFields = 0;

    requiredFields.forEach(field => {
      const value = profileData[field.key as keyof Profile];
      
      if (field.key === 'skills') {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          missing.push(field.label);
        } else {
          completedFields++;
        }
      } else if (!value || value === '') {
        missing.push(field.label);
      } else {
        completedFields++;
      }
    });

    const percentage = Math.round((completedFields / requiredFields.length) * 100);
    setCompletionPercentage(percentage);
    setMissingFields(missing);
  };

  const handleUpdateProfile = () => {
    navigate('/account');
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  const isComplete = completionPercentage === 100;

  return (
    <Card className={`mb-6 ${isComplete ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600" />
          )}
          Profile Completion
        </CardTitle>
        <CardDescription>
          {isComplete 
            ? "Your profile is complete and ready for resume building!"
            : "Complete your profile to unlock full resume building capabilities"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {completionPercentage}% Complete
            </span>
            <span className="text-sm text-gray-500">
              {requiredFields.length - missingFields.length} of {requiredFields.length} fields
            </span>
          </div>
          
          <Progress value={completionPercentage} className="w-full" />
          
          {!isComplete && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                Missing Information:
              </div>
              <div className="flex flex-wrap gap-2">
                {missingFields.map((field, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800"
                  >
                    {field}
                  </span>
                ))}
              </div>
              <Button
                onClick={handleUpdateProfile}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </div>
          )}
          
          {isComplete && (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Ready to build professional resumes!
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
