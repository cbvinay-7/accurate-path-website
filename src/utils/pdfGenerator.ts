
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export const generateResumePDF = async (data: ResumeData, templateName: string) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');

    // Create a temporary container for the template
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '210mm';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.zIndex = '-1';
    
    // Append to body before setting innerHTML to allow CSS to apply correctly
    document.body.appendChild(tempContainer);

    // Create the template HTML based on selected template
    tempContainer.innerHTML = createTemplateHTML(data, templateName);

    // Wait for the DOM to render and fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate canvas from the HTML with optimized parameters
    const canvas = await html2canvas(tempContainer, {
      scale: 3, // Higher scale for better text clarity
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: tempContainer.offsetWidth,
      windowHeight: tempContainer.offsetHeight
    });

    // Remove the temporary container
    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    // Calculate dimensions based on A4 page size and canvas aspect ratio
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add subsequent pages if content overflows
    while (heightLeft > 0) {
      position = position - pageHeight;
      doc.addPage();
      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    const fileName = `${data.personalInfo.fullName || 'Resume'}_${templateName.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

const createTemplateHTML = (data: ResumeData, templateName: string): string => {
  const baseStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap');
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      .container {
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        background: white;
      }
      .section {
        margin-bottom: 20px;
        page-break-inside: avoid;
      }
      .section-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .mb-1 { margin-bottom: 4px; }
      .mb-2 { margin-bottom: 8px; }
      .mb-3 { margin-bottom: 12px; }
      .mb-4 { margin-bottom: 16px; }
      .mb-6 { margin-bottom: 24px; }
      .font-bold { font-weight: 700; }
      .font-medium { font-weight: 500; }
      .font-light { font-weight: 300; }
      .text-sm { font-size: 14px; }
      .text-xs { font-size: 12px; }
      .text-lg { font-size: 18px; }
      .text-xl { font-size: 20px; }
      .text-2xl { font-size: 24px; }
      .text-3xl { font-size: 30px; }
      .text-4xl { font-size: 36px; }
      .text-5xl { font-size: 48px; }
      .flex { display: flex; }
      .justify-between { justify-content: space-between; }
      .items-start { align-items: flex-start; }
      .items-center { align-items: center; }
      .items-baseline { align-items: baseline; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }
      .text-justify { text-align: justify; }
      .uppercase { text-transform: uppercase; }
      .space-y-1 > * + * { margin-top: 4px; }
      .space-y-2 > * + * { margin-top: 8px; }
    </style>
  `;

  switch (templateName) {
    case 'Modern Professional':
      return baseStyles + createModernHTML(data);
    case 'Classic Executive':
      return baseStyles + createClassicHTML(data);
    case 'Creative Designer':
      return baseStyles + createCreativeHTML(data);
    case 'Minimal Clean':
      return baseStyles + createMinimalHTML(data);
    default:
      return baseStyles + createModernHTML(data);
  }
};

const createModernHTML = (data: ResumeData): string => {
  return `
    <style>
      .modern-header {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: white;
        padding: 20px;
        margin: -20mm -20mm 20px -20mm;
        border-radius: 0;
      }
      .modern-name {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
        line-height: 1.2;
      }
      .modern-contact {
        color: #bfdbfe;
        font-size: 14px;
        line-height: 1.5;
      }
      .modern-section-title {
        color: #2563eb;
        border-bottom: 2px solid #2563eb;
        padding-bottom: 4px;
        margin-bottom: 16px;
        font-weight: 600;
      }
      .modern-company {
        color: #2563eb;
        font-weight: 500;
      }
      .skill-pill {
        display: inline-block;
        background: #dbeafe;
        color: #1d4ed8;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        margin: 2px 4px 2px 0;
        font-weight: 500;
      }
    </style>
    <div class="container">
      <div class="modern-header">
        <div class="modern-name">${data.personalInfo.fullName || 'Your Name'}</div>
        <div class="modern-contact">
          ${[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | ')}<br>
          ${[data.personalInfo.linkedin, data.personalInfo.portfolio].filter(Boolean).join(' | ')}
        </div>
      </div>

      ${data.summary ? `
        <div class="section">
          <h2 class="section-title modern-section-title">Professional Summary</h2>
          <p style="line-height: 1.6;">${data.summary}</p>
        </div>
      ` : ''}

      ${data.experience.some(exp => exp.company) ? `
        <div class="section">
          <h2 class="section-title modern-section-title">Experience</h2>
          ${data.experience.filter(exp => exp.company).map(exp => `
            <div class="mb-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg">${exp.position}</h3>
                <span class="text-sm">${exp.duration}</span>
              </div>
              <p class="modern-company mb-2">${exp.company}</p>
              ${exp.description ? `<p class="text-sm" style="line-height: 1.6;">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.education.some(edu => edu.institution) ? `
        <div class="section">
          <h2 class="section-title modern-section-title">Education</h2>
          ${data.education.filter(edu => edu.institution).map(edu => `
            <div class="mb-3">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold">${edu.degree}</h3>
                  <p class="modern-company">${edu.institution}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm">${edu.year}</p>
                  ${edu.gpa ? `<p class="text-xs">GPA: ${edu.gpa}</p>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills.length > 0 ? `
        <div class="section">
          <h2 class="section-title modern-section-title">Skills</h2>
          <div>
            ${data.skills.map(skill => `<span class="skill-pill">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${data.projects.some(proj => proj.name) ? `
        <div class="section">
          <h2 class="section-title modern-section-title">Projects</h2>
          ${data.projects.filter(proj => proj.name).map(proj => `
            <div class="mb-4">
              <h3 class="font-bold">${proj.name}</h3>
              ${proj.technologies ? `<p class="text-sm modern-company mb-2">${proj.technologies}</p>` : ''}
              ${proj.description ? `<p class="text-sm" style="line-height: 1.6;">${proj.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.certificates && data.certificates.some(cert => cert.name) ? `
        <div class="section">
          <h2 class="section-title modern-section-title">Certificates</h2>
          ${data.certificates.filter(cert => cert.name).map(cert => `
            <div class="mb-3">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold">${cert.name}</h3>
                  <p class="modern-company">${cert.issuer}</p>
                </div>
                <p class="text-sm">${cert.date}</p>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.languages && data.languages.some(lang => lang.name) ? `
        <div class="section">
          <h2 class="section-title modern-section-title">Languages</h2>
          <div>
            ${data.languages.filter(lang => lang.name).map(lang => `<span class="skill-pill">${lang.name} (${lang.proficiency})</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${data.interests && data.interests.length > 0 ? `
        <div class="section">
          <h2 class="section-title modern-section-title">Interests</h2>
          <div>
            ${data.interests.map(interest => `<span class="skill-pill">${interest}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div class="section">
        <h2 class="section-title modern-section-title">Declaration</h2>
        <p style="line-height: 1.6;">${data.declaration || 'I hereby declare that all the information provided above is true to the best of my knowledge.'}</p>
      </div>
    </div>
  `;
};

const createClassicHTML = (data: ResumeData): string => {
  return `
    <style>
      .classic-container {
        font-family: 'Playfair Display', 'Times New Roman', serif;
      }
      .classic-header {
        text-align: center;
        border-bottom: 2px solid #333;
        padding-bottom: 16px;
        margin-bottom: 24px;
      }
      .classic-name {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 12px;
        line-height: 1.2;
      }
      .classic-contact {
        font-size: 14px;
        line-height: 1.6;
      }
      .classic-section-title {
        font-size: 18px;
        font-weight: 700;
        text-transform: uppercase;
        border-bottom: 2px solid #333;
        padding-bottom: 4px;
        margin-bottom: 16px;
      }
      .classic-company {
        font-style: italic;
        font-weight: 500;
      }
    </style>
    <div class="container classic-container">
      <div class="classic-header">
        <h1 class="classic-name">${data.personalInfo.fullName || 'Your Name'}</h1>
        <div class="classic-contact">
          <p>${[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | ')}</p>
          ${[data.personalInfo.linkedin, data.personalInfo.portfolio].filter(Boolean).length > 0 ? 
            `<p>${[data.personalInfo.linkedin, data.personalInfo.portfolio].filter(Boolean).join(' | ')}</p>` : ''}
        </div>
      </div>

      ${data.summary ? `
        <div class="section">
          <h2 class="classic-section-title">Professional Summary</h2>
          <p style="line-height: 1.6; text-align: justify;">${data.summary}</p>
        </div>
      ` : ''}

      ${data.experience.some(exp => exp.company) ? `
        <div class="section">
          <h2 class="classic-section-title">Experience</h2>
          ${data.experience.filter(exp => exp.company).map(exp => `
            <div class="mb-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg">${exp.position}</h3>
                <span class="text-sm classic-company">${exp.duration}</span>
              </div>
              <p class="mb-2 font-medium">${exp.company}</p>
              ${exp.description ? `<p class="text-sm" style="line-height: 1.6; text-align: justify;">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.education.some(edu => edu.institution) ? `
        <div class="section">
          <h2 class="classic-section-title">Education</h2>
          ${data.education.filter(edu => edu.institution).map(edu => `
            <div class="mb-3">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold">${edu.degree}</h3>
                  <p class="classic-company">${edu.institution}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium">${edu.year}</p>
                  ${edu.gpa ? `<p class="text-sm">GPA: ${edu.gpa}</p>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills.length > 0 ? `
        <div class="section">
          <h2 class="classic-section-title">Skills</h2>
          <p style="line-height: 1.6;">${data.skills.join(' • ')}</p>
        </div>
      ` : ''}

      ${data.projects.some(proj => proj.name) ? `
        <div class="section">
          <h2 class="classic-section-title">Projects</h2>
          ${data.projects.filter(proj => proj.name).map(proj => `
            <div class="mb-4">
              <h3 class="font-bold text-lg">${proj.name}</h3>
              ${proj.technologies ? `<p class="text-sm classic-company mb-2">${proj.technologies}</p>` : ''}
              ${proj.description ? `<p class="text-sm" style="line-height: 1.6; text-align: justify;">${proj.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.certificates && data.certificates.some(cert => cert.name) ? `
        <div class="section">
          <h2 class="classic-section-title">Certificates</h2>
          ${data.certificates.filter(cert => cert.name).map(cert => `
            <div class="mb-3">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold">${cert.name}</h3>
                  <p class="classic-company">${cert.issuer}</p>
                </div>
                <p class="font-medium">${cert.date}</p>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.languages && data.languages.some(lang => lang.name) ? `
        <div class="section">
          <h2 class="classic-section-title">Languages</h2>
          <p style="line-height: 1.6;">${data.languages.filter(lang => lang.name).map(lang => `${lang.name} (${lang.proficiency})`).join(' • ')}</p>
        </div>
      ` : ''}

      ${data.interests && data.interests.length > 0 ? `
        <div class="section">
          <h2 class="classic-section-title">Interests</h2>
          <p style="line-height: 1.6;">${data.interests.join(' • ')}</p>
        </div>
      ` : ''}

      <div class="section">
        <h2 class="classic-section-title">Declaration</h2>
        <p style="line-height: 1.6; text-align: justify;">${data.declaration || 'I hereby declare that all the information provided above is true to the best of my knowledge.'}</p>
      </div>
    </div>
  `;
};

const createCreativeHTML = (data: ResumeData): string => {
  return `
    <style>
      .creative-container {
        display: flex;
        min-height: 297mm;
        font-family: 'Inter', sans-serif;
      }
      .creative-sidebar {
        width: 35%;
        background: linear-gradient(180deg, #ec4899, #f97316);
        color: white;
        padding: 24px 20px;
      }
      .creative-main {
        width: 65%;
        padding: 24px 20px;
      }
      .creative-name {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 16px;
        line-height: 1.2;
      }
      .creative-contact {
        font-size: 12px;
        line-height: 1.6;
        color: #fce7f3;
        margin-bottom: 24px;
      }
      .creative-sidebar-title {
        font-size: 14px;
        font-weight: 700;
        color: #fef3c7;
        margin-bottom: 12px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
      .creative-skill-pill {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 6px 12px;
        margin: 4px 4px 4px 0;
        display: inline-block;
        font-size: 11px;
        font-weight: 500;
      }
      .creative-main-title {
        font-size: 18px;
        font-weight: 700;
        color: #ec4899;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .creative-accent-line {
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, #ec4899, #f97316);
        margin-bottom: 16px;
      }
      .creative-company {
        color: #ec4899;
        font-weight: 500;
      }
      .creative-card {
        background: #f9fafb;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
      }
      .creative-bullet {
        width: 8px;
        height: 8px;
        background: #ec4899;
        border-radius: 50%;
        display: inline-block;
        margin-right: 12px;
        position: relative;
        top: -1px;
      }
    </style>
    <div class="creative-container">
      <div class="creative-sidebar">
        <div class="creative-name">${data.personalInfo.fullName || 'Your Name'}</div>
        <div class="creative-contact">
          ${[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location, data.personalInfo.linkedin, data.personalInfo.portfolio]
            .filter(Boolean).map(info => `<div style="margin-bottom: 4px;">${info}</div>`).join('')}
        </div>

        ${data.skills.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <h3 class="creative-sidebar-title">Skills</h3>
            <div>
              ${data.skills.map(skill => `<span class="creative-skill-pill">${skill}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${data.education.some(edu => edu.institution) ? `
          <div style="margin-bottom: 24px;">
            <h3 class="creative-sidebar-title">Education</h3>
            ${data.education.filter(edu => edu.institution).map(edu => `
              <div style="margin-bottom: 16px;">
                <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${edu.degree}</div>
                <div style="color: #fce7f3; font-size: 12px; margin-bottom: 2px;">${edu.institution}</div>
                <div style="color: #fbcfe8; font-size: 11px;">${edu.year}</div>
                ${edu.gpa ? `<div style="color: #fbcfe8; font-size: 11px;">GPA: ${edu.gpa}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.languages && data.languages.some(lang => lang.name) ? `
          <div style="margin-bottom: 24px;">
            <h3 class="creative-sidebar-title">Languages</h3>
            <div>
              ${data.languages.filter(lang => lang.name).map(lang => `<span class="creative-skill-pill">${lang.name} (${lang.proficiency})</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${data.interests && data.interests.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <h3 class="creative-sidebar-title">Interests</h3>
            <div>
              ${data.interests.map(interest => `<span class="creative-skill-pill">${interest}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="creative-main">
        ${data.summary ? `
          <div class="section">
            <h2 class="creative-main-title">About Me</h2>
            <div class="creative-accent-line"></div>
            <p style="line-height: 1.6; color: #374151;">${data.summary}</p>
          </div>
        ` : ''}

        ${data.experience.some(exp => exp.company) ? `
          <div class="section">
            <h2 class="creative-main-title">Experience</h2>
            <div class="creative-accent-line"></div>
            ${data.experience.filter(exp => exp.company).map(exp => `
              <div style="margin-bottom: 24px; position: relative; padding-left: 20px;">
                <span class="creative-bullet" style="position: absolute; left: 0; top: 8px;"></span>
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-bold text-lg" style="color: #111827;">${exp.position}</h3>
                  <span class="text-sm" style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${exp.duration}</span>
                </div>
                <p class="creative-company mb-2">${exp.company}</p>
                ${exp.description ? `<p class="text-sm" style="line-height: 1.6; color: #374151;">${exp.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.projects.some(proj => proj.name) ? `
          <div class="section">
            <h2 class="creative-main-title">Projects</h2>
            <div class="creative-accent-line"></div>
            ${data.projects.filter(proj => proj.name).map(proj => `
              <div class="creative-card">
                <h3 class="font-bold" style="color: #111827; margin-bottom: 8px;">${proj.name}</h3>
                ${proj.technologies ? `<p class="text-sm creative-company" style="margin-bottom: 8px;">${proj.technologies}</p>` : ''}
                ${proj.description ? `<p class="text-sm" style="line-height: 1.6; color: #374151;">${proj.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.certificates && data.certificates.some(cert => cert.name) ? `
          <div class="section">
            <h2 class="creative-main-title">Certificates</h2>
            <div class="creative-accent-line"></div>
            ${data.certificates.filter(cert => cert.name).map(cert => `
              <div class="creative-card">
                <h3 class="font-bold" style="color: #111827; margin-bottom: 4px;">${cert.name}</h3>
                <p class="text-sm creative-company" style="margin-bottom: 4px;">${cert.issuer}</p>
                <p style="color: #6b7280; font-size: 12px;">${cert.date}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="section">
          <h2 class="creative-main-title">Declaration</h2>
          <div class="creative-accent-line"></div>
          <p style="line-height: 1.6; color: #374151;">${data.declaration || 'I hereby declare that all the information provided above is true to the best of my knowledge.'}</p>
        </div>
      </div>
    </div>
  `;
};

const createMinimalHTML = (data: ResumeData): string => {
  return `
    <style>
      .minimal-container {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 300;
        line-height: 1.6;
        color: #374151;
      }
      .minimal-name {
        font-size: 40px;
        font-weight: 100;
        margin-bottom: 16px;
        color: #111827;
        line-height: 1.1;
      }
      .minimal-contact {
        font-size: 12px;
        color: #6b7280;
        margin-bottom: 48px;
        line-height: 1.5;
      }
      .minimal-section-title {
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #111827;
        margin-bottom: 16px;
      }
      .minimal-accent-line {
        width: 32px;
        height: 1px;
        background: #22c55e;
        margin-bottom: 24px;
      }
      .minimal-position {
        font-size: 20px;
        font-weight: 300;
        color: #111827;
        line-height: 1.3;
      }
      .minimal-company {
        color: #22c55e;
        font-weight: 300;
        font-size: 18px;
        line-height: 1.4;
      }
      .minimal-duration {
        color: #9ca3af;
        font-size: 14px;
        font-weight: 300;
      }
    </style>
    <div class="container minimal-container">
      <div class="mb-6">
        <h1 class="minimal-name">${data.personalInfo.fullName || 'Your Name'}</h1>
        <div class="minimal-contact">
          <div>${[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' • ')}</div>
          ${[data.personalInfo.linkedin, data.personalInfo.portfolio].filter(Boolean).length > 0 ? 
            `<div style="margin-top: 4px;">${[data.personalInfo.linkedin, data.personalInfo.portfolio].filter(Boolean).join(' • ')}</div>` : ''}
        </div>
      </div>

      ${data.summary ? `
        <div class="section">
          <h2 class="minimal-section-title">Summary</h2>
          <div class="minimal-accent-line"></div>
          <p style="font-weight: 300; line-height: 1.6;">${data.summary}</p>
        </div>
      ` : ''}

      ${data.experience.some(exp => exp.company) ? `
        <div class="section">
          <h2 class="minimal-section-title">Experience</h2>
          <div class="minimal-accent-line"></div>
          ${data.experience.filter(exp => exp.company).map(exp => `
            <div style="margin-bottom: 24px;">
              <div class="flex justify-between items-start mb-2">
                <h3 class="minimal-position">${exp.position}</h3>
                <span class="minimal-duration">${exp.duration}</span>
              </div>
              <p class="minimal-company" style="margin-bottom: 12px;">${exp.company}</p>
              ${exp.description ? `<p style="font-weight: 300; line-height: 1.6; color: #374151;">${exp.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.education.some(edu => edu.institution) ? `
        <div class="section">
          <h2 class="minimal-section-title">Education</h2>
          <div class="minimal-accent-line"></div>
          ${data.education.filter(edu => edu.institution).map(edu => `
            <div style="margin-bottom: 16px;">
              <div class="flex justify-between items-start">
                <div>
                  <h3 style="font-size: 16px; font-weight: 300; color: #111827; margin-bottom: 4px;">${edu.degree}</h3>
                  <p class="minimal-company">${edu.institution}</p>
                </div>
                <div class="text-right">
                  <p class="minimal-duration">${edu.year}</p>
                  ${edu.gpa ? `<p class="minimal-duration">GPA: ${edu.gpa}</p>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills.length > 0 ? `
        <div class="section">
          <h2 class="minimal-section-title">Skills</h2>
          <div class="minimal-accent-line"></div>
          <p style="font-weight: 300; line-height: 1.6;">${data.skills.join('  •  ')}</p>
        </div>
      ` : ''}

      ${data.projects.some(proj => proj.name) ? `
        <div class="section">
          <h2 class="minimal-section-title">Projects</h2>
          <div class="minimal-accent-line"></div>
          ${data.projects.filter(proj => proj.name).map(proj => `
            <div style="margin-bottom: 16px;">
              <h3 style="font-size: 16px; font-weight: 300; color: #111827; margin-bottom: 4px;">${proj.name}</h3>
              ${proj.technologies ? `<p style="color: #22c55e; font-size: 14px; font-weight: 300; margin-bottom: 8px;">${proj.technologies}</p>` : ''}
              ${proj.description ? `<p style="font-weight: 300; line-height: 1.6; color: #374151;">${proj.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.certificates && data.certificates.some(cert => cert.name) ? `
        <div class="section">
          <h2 class="minimal-section-title">Certificates</h2>
          <div class="minimal-accent-line"></div>
          ${data.certificates.filter(cert => cert.name).map(cert => `
            <div style="margin-bottom: 16px;">
              <div class="flex justify-between items-start">
                <div>
                  <h3 style="font-size: 16px; font-weight: 300; color: #111827; margin-bottom: 4px;">${cert.name}</h3>
                  <p class="minimal-company">${cert.issuer}</p>
                </div>
                <p class="minimal-duration">${cert.date}</p>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.languages && data.languages.some(lang => lang.name) ? `
        <div class="section">
          <h2 class="minimal-section-title">Languages</h2>
          <div class="minimal-accent-line"></div>
          <p style="font-weight: 300; line-height: 1.6;">${data.languages.filter(lang => lang.name).map(lang => `${lang.name} (${lang.proficiency})`).join('  •  ')}</p>
        </div>
      ` : ''}

      ${data.interests && data.interests.length > 0 ? `
        <div class="section">
          <h2 class="minimal-section-title">Interests</h2>
          <div class="minimal-accent-line"></div>
          <p style="font-weight: 300; line-height: 1.6;">${data.interests.join('  •  ')}</p>
        </div>
      ` : ''}

      <div class="section">
        <h2 class="minimal-section-title">Declaration</h2>
        <div class="minimal-accent-line"></div>
        <p style="font-weight: 300; line-height: 1.6; color: #374151;">${data.declaration || 'I hereby declare that all the information provided above is true to the best of my knowledge.'}</p>
      </div>
    </div>
  `;
};
