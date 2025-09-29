
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import Header from '@/components/Header';
import { useProfile } from '@/hooks/useProfile';
import ProfileHeader from '@/components/account/ProfileHeader';
import PersonalInfoCard from '@/components/account/PersonalInfoCard';
import EducationCard from '@/components/account/EducationCard';
import SkillsBioCard from '@/components/account/SkillsBioCard';
import ProfessionalExperienceCard from '@/components/account/ProfessionalExperienceCard';
import ProjectsCard from '@/components/account/ProjectsCard';
import CertificatesCard from '@/components/account/CertificatesCard';
import LanguagesCard from '@/components/account/LanguagesCard';
import InterestsCard from '@/components/account/InterestsCard';
import DeclarationCard from '@/components/account/DeclarationCard';
import SocialLinksCard from '@/components/account/SocialLinksCard';
import AccountDetailsCard from '@/components/account/AccountDetailsCard';

const Account = () => {
  const {
    profile,
    formData,
    loading,
    saving,
    handleInputChange,
    handleSaveProfile
  } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg">Loading account information...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader profile={profile} />

        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* Personal Information */}
          <PersonalInfoCard 
            formData={{
              full_name: formData.full_name,
              phone: formData.phone,
              date_of_birth: formData.date_of_birth,
              address: formData.address
            }}
            onInputChange={handleInputChange}
          />

          {/* Education */}
          <EducationCard 
            formData={{
              university: formData.university,
              degree: formData.degree,
              graduation_year: formData.graduation_year,
              experience_years: formData.experience_years
            }}
            onInputChange={handleInputChange}
          />

          {/* Professional Experience */}
          <ProfessionalExperienceCard 
            formData={{
              professional_experience: formData.professional_experience
            }}
            onInputChange={handleInputChange}
          />

          {/* Skills & Bio */}
          <SkillsBioCard 
            formData={{
              skills: formData.skills,
              bio: formData.bio
            }}
            onInputChange={handleInputChange}
          />

          {/* Projects */}
          <ProjectsCard 
            formData={{
              projects: formData.projects
            }}
            onInputChange={handleInputChange}
          />

          {/* Certificates */}
          <CertificatesCard 
            formData={{
              certificates: formData.certificates
            }}
            onInputChange={handleInputChange}
          />

          {/* Languages */}
          <LanguagesCard 
            formData={{
              languages: formData.languages
            }}
            onInputChange={handleInputChange}
          />

          {/* Interests */}
          <InterestsCard 
            formData={{
              interests: formData.interests
            }}
            onInputChange={handleInputChange}
          />

          {/* Social Links */}
          <SocialLinksCard 
            formData={{
              linkedin_url: formData.linkedin_url,
              github_url: formData.github_url,
              portfolio_url: formData.portfolio_url
            }}
            onInputChange={handleInputChange}
          />

          {/* Declaration */}
          <DeclarationCard 
            formData={{
              declaration: formData.declaration
            }}
            onInputChange={handleInputChange}
          />

          {/* Account Details */}
          <AccountDetailsCard profile={profile} />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Account;
