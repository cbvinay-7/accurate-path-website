
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

const CreativeTemplate = ({ data, isPreview = false }: { data?: ResumeData; isPreview?: boolean }) => {
  const { resumeData, loading } = useResumeData();
  const templateData = data || resumeData;
  const scale = isPreview ? 'scale-[0.3]' : 'scale-100';
  
  if (loading && !data) {
    return (
      <div className={`bg-white ${scale} origin-top-left transition-transform duration-200`}>
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg font-sans text-gray-800 flex items-center justify-center">
          <div className="text-lg">Loading resume data...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white ${scale} origin-top-left transition-transform duration-200`}>
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg font-sans text-gray-800 flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-pink-500 to-orange-500 text-white p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">{templateData.personalInfo.fullName || 'Your Name'}</h1>
            <div className="space-y-2 text-pink-100">
              <p className="text-sm">{templateData.personalInfo.email || 'email@example.com'}</p>
              <p className="text-sm">{templateData.personalInfo.phone || 'Phone'}</p>
              <p className="text-sm">{templateData.personalInfo.location || 'Location'}</p>
              {templateData.personalInfo.linkedin && <p className="text-sm">{templateData.personalInfo.linkedin}</p>}
              {templateData.personalInfo.portfolio && <p className="text-sm">{templateData.personalInfo.portfolio}</p>}
            </div>
          </div>

          {/* Skills */}
          {templateData.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-yellow-200">SKILLS</h2>
              <div className="space-y-2">
                {templateData.skills.map((skill, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {templateData.education.some(edu => edu.institution) && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-yellow-200">EDUCATION</h2>
              {templateData.education.filter(edu => edu.institution).map((edu, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-bold text-sm">{edu.degree}</h3>
                  <p className="text-pink-100 text-sm">{edu.institution}</p>
                  <p className="text-pink-200 text-xs">{edu.year}</p>
                  {edu.gpa && <p className="text-pink-200 text-xs">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {templateData.languages && templateData.languages.some(lang => lang.name) && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-yellow-200">LANGUAGES</h2>
              <div className="space-y-2">
                {templateData.languages.filter(lang => lang.name).map((lang, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium">{`${lang.name} (${lang.proficiency})`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {templateData.interests && templateData.interests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-yellow-200">INTERESTS</h2>
              <div className="space-y-2">
                {templateData.interests.map((interest, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium">{interest}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-6">
          {/* Professional Summary */}
          {templateData.summary && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-pink-600 mb-3">ABOUT ME</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mb-4"></div>
              <p className="text-gray-700 leading-relaxed">{templateData.summary}</p>
            </div>
          )}

          {/* Experience */}
          {templateData.experience.some(exp => exp.company) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-pink-600 mb-3">EXPERIENCE</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mb-4"></div>
              {templateData.experience.filter(exp => exp.company).map((exp, index) => (
                <div key={index} className="mb-6 relative pl-4">
                  <div className="absolute left-0 top-2 w-2 h-2 bg-pink-500 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-gray-800">{exp.position}</h3>
                    <span className="text-gray-600 font-medium text-sm bg-gray-100 px-2 py-1 rounded">{exp.duration}</span>
                  </div>
                  <p className="text-pink-600 font-medium mb-2">{exp.company}</p>
                  {exp.description && <p className="text-gray-700 leading-relaxed text-sm">{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {templateData.projects.some(proj => proj.name) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-pink-600 mb-3">PROJECTS</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mb-4"></div>
              {templateData.projects.filter(proj => proj.name).map((proj, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-800">{proj.name}</h3>
                  {proj.technologies && (
                    <p className="text-pink-600 text-sm mb-2 font-medium">{proj.technologies}</p>
                  )}
                  {proj.description && <p className="text-gray-700 leading-relaxed text-sm">{proj.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Certificates */}
          {templateData.certificates && templateData.certificates.some(cert => cert.name) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-pink-600 mb-3">CERTIFICATES</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mb-4"></div>
              {templateData.certificates.filter(cert => cert.name).map((cert, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-800">{cert.name}</h3>
                  <p className="text-pink-600 text-sm mb-1 font-medium">{cert.issuer}</p>
                  <p className="text-gray-600 text-sm">{cert.date}</p>
                </div>
              ))}
            </div>
          )}

          {/* Declaration - Always show with default text if empty */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-3">DECLARATION</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-orange-500 mb-4"></div>
            <p className="text-gray-700 leading-relaxed">
              {templateData.declaration || 'I hereby declare that all the information provided above is true to the best of my knowledge.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
