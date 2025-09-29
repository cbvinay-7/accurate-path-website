import React from 'react';
import { useResumeData } from '@/hooks/useResumeData';

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

const ModernTemplate = ({ data, isPreview = false }: { data?: ResumeData; isPreview?: boolean }) => {
  const { resumeData, loading } = useResumeData();
  const templateData = data || resumeData;
  const scale = isPreview ? 'scale-[0.3]' : 'scale-100';
  
  if (loading && !data) {
    return (
      <div className={`bg-white ${scale} origin-top-left transition-transform duration-200`}>
        <div className="w-[210mm] min-h-[297mm] p-8 bg-white shadow-lg font-sans text-gray-800 flex items-center justify-center">
          <div className="text-lg">Loading resume data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${scale} origin-top-left transition-transform duration-200`}>
      <div className="w-[210mm] min-h-[297mm] p-8 bg-white shadow-lg font-sans text-gray-800">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 -m-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">{templateData.personalInfo.fullName || 'Your Name'}</h1>
          <div className="text-blue-100 space-y-1">
            <p>{templateData.personalInfo.email || 'email@example.com'} | {templateData.personalInfo.phone || 'Phone'}</p>
            <p>{templateData.personalInfo.location || 'Location'}</p>
            {templateData.personalInfo.linkedin && <p>{templateData.personalInfo.linkedin}</p>}
            {templateData.personalInfo.portfolio && <p>{templateData.personalInfo.portfolio}</p>}
          </div>
        </div>

        {/* Professional Summary */}
        {templateData.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">PROFESSIONAL SUMMARY</h2>
            <p className="text-gray-700 leading-relaxed">{templateData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {templateData.experience.some(exp => exp.company) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">EXPERIENCE</h2>
            {templateData.experience.filter(exp => exp.company).map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <span className="text-gray-600 font-medium">{exp.duration}</span>
                </div>
                <p className="text-blue-600 font-medium mb-2">{exp.company}</p>
                {exp.description && <p className="text-gray-700 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {templateData.education.some(edu => edu.institution) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">EDUCATION</h2>
            {templateData.education.filter(edu => edu.institution).map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{edu.degree}</h3>
                    <p className="text-blue-600">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{edu.year}</p>
                    {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {templateData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {templateData.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {templateData.projects.some(proj => proj.name) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">PROJECTS</h2>
            {templateData.projects.filter(proj => proj.name).map((proj, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-bold text-lg">{proj.name}</h3>
                {proj.technologies && <p className="text-blue-600 text-sm mb-1">{proj.technologies}</p>}
                {proj.description && <p className="text-gray-700 leading-relaxed">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certificates */}
        {templateData.certificates && templateData.certificates.some(cert => cert.name) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">CERTIFICATES</h2>
            {templateData.certificates.filter(cert => cert.name).map((cert, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{cert.name}</h3>
                    <p className="text-blue-600">{cert.issuer}</p>
                  </div>
                  <p className="font-medium">{cert.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {templateData.languages && templateData.languages.some(lang => lang.name) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">LANGUAGES</h2>
            <div className="flex flex-wrap gap-2">
              {templateData.languages.filter(lang => lang.name).map((lang, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {`${lang.name} (${lang.proficiency})`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {templateData.interests && templateData.interests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">INTERESTS</h2>
            <div className="flex flex-wrap gap-2">
              {templateData.interests.map((interest, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Declaration - Always show with default text if empty */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-1 mb-3">DECLARATION</h2>
          <p className="text-gray-700 leading-relaxed">
            {templateData.declaration || 'I hereby declare that all the information provided above is true to the best of my knowledge.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
