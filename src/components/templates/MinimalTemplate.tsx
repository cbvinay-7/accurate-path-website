
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

const MinimalTemplate = ({ data, isPreview = false }: { data?: ResumeData; isPreview?: boolean }) => {
  const { resumeData, loading } = useResumeData();
  const templateData = data || resumeData;
  const scale = isPreview ? 'scale-[0.3]' : 'scale-100';
  
  if (loading && !data) {
    return (
      <div className={`bg-white ${scale} origin-top-left transition-transform duration-200`}>
        <div className="w-[210mm] min-h-[297mm] p-12 bg-white shadow-lg font-light text-gray-800 flex items-center justify-center">
          <div className="text-lg">Loading resume data...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white ${scale} origin-top-left transition-transform duration-200`}>
      <div className="w-[210mm] min-h-[297mm] p-12 bg-white shadow-lg font-light text-gray-800">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-thin mb-4 text-gray-900">{templateData.personalInfo.fullName || 'Your Name'}</h1>
          <div className="text-gray-600 space-x-4 text-sm">
            <span>{templateData.personalInfo.email || 'email@example.com'}</span>
            <span>•</span>
            <span>{templateData.personalInfo.phone || 'Phone'}</span>
            <span>•</span>
            <span>{templateData.personalInfo.location || 'Location'}</span>
          </div>
          <div className="text-gray-600 space-x-4 text-sm mt-1">
            {templateData.personalInfo.linkedin && (
              <>
                <span>{templateData.personalInfo.linkedin}</span>
                {templateData.personalInfo.portfolio && <span>•</span>}
              </>
            )}
            {templateData.personalInfo.portfolio && <span>{templateData.personalInfo.portfolio}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {templateData.summary && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">Summary</h2>
            <div className="w-8 h-px bg-green-500 mb-4"></div>
            <p className="text-gray-700 leading-relaxed font-light">{templateData.summary}</p>
          </div>
        )}

        {/* Experience */}
        {templateData.experience.some(exp => exp.company) && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">Experience</h2>
            <div className="w-8 h-px bg-green-500 mb-6"></div>
            {templateData.experience.filter(exp => exp.company).map((exp, index) => (
              <div key={index} className="mb-8">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-light text-gray-900">{exp.position}</h3>
                  <span className="text-gray-500 text-sm font-light">{exp.duration}</span>
                </div>
                <p className="text-green-600 font-light mb-3 text-lg">{exp.company}</p>
                {exp.description && <p className="text-gray-700 leading-relaxed font-light">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {templateData.education.some(edu => edu.institution) && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">Education</h2>
            <div className="w-8 h-px bg-green-500 mb-6"></div>
            {templateData.education.filter(edu => edu.institution).map((edu, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-lg font-light text-gray-900">{edu.degree}</h3>
                    <p className="text-green-600 font-light">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm font-light">{edu.year}</p>
                    {edu.gpa && <p className="text-gray-500 text-sm font-light">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {templateData.skills.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">Skills</h2>
            <div className="w-8 h-px bg-green-500 mb-6"></div>
            <p className="text-gray-700 leading-relaxed font-light">{templateData.skills.join('  •  ')}</p>
          </div>
        )}

        {/* Projects */}
        {templateData.projects.some(proj => proj.name) && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">Projects</h2>
            <div className="w-8 h-px bg-green-500 mb-6"></div>
            {templateData.projects.filter(proj => proj.name).map((proj, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-light text-gray-900 mb-1">{proj.name}</h3>
                {proj.technologies && <p className="text-green-600 text-sm font-light mb-2">{proj.technologies}</p>}
                {proj.description && <p className="text-gray-700 leading-relaxed font-light">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certificates */}
        {templateData.certificates && templateData.certificates.some(cert => cert.name) && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">Certificates</h2>
            <div className="w-8 h-px bg-green-500 mb-6"></div>
            {templateData.certificates.filter(cert => cert.name).map((cert, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-lg font-light text-gray-900">{cert.name}</h3>
                    <p className="text-green-600 font-light">{cert.issuer}</p>
                  </div>
                  <p className="text-gray-500 text-sm font-light">{cert.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {templateData.languages && templateData.languages.some(lang => lang.name) && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">Languages</h2>
            <div className="w-8 h-px bg-green-500 mb-6"></div>
            <p className="text-gray-700 leading-relaxed font-light">
              {templateData.languages.filter(lang => lang.name).map(lang => `${lang.name} (${lang.proficiency})`).join('  •  ')}
            </p>
          </div>
        )}

        {/* Interests */}
        {templateData.interests && templateData.interests.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">Interests</h2>
            <div className="w-8 h-px bg-green-500 mb-6"></div>
            <p className="text-gray-700 leading-relaxed font-light">{templateData.interests.join('  •  ')}</p>
          </div>
        )}

        {/* Declaration - Always show with default text if empty */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-gray-900 mb-4 tracking-widest uppercase">Declaration</h2>
          <div className="w-8 h-px bg-green-500 mb-6"></div>
          <p className="text-gray-700 leading-relaxed font-light">
            {templateData.declaration || 'I hereby declare that all the information provided above is true to the best of my knowledge.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MinimalTemplate;
