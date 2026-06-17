/* ==========================================================================
   RESUMECRAFT PRO - CORE APPLICATION LOGIC
   ========================================================================== */

// 1. DEFAULT SAMPLE DATA
const SAMPLE_DATA = {
  personal: {
    name: "Alex Morgan",
    title: "Lead Frontend Architect",
    email: "alex.morgan@design.io",
    phone: "+1 (555) 492-0928",
    website: "portfolio.alexmorgan.dev",
    location: "Seattle, WA",
    summary: "Creative and performance-oriented Frontend Architect with 7+ years of experience leading team engineering projects, building modular design systems, and optimizing loading speed for large web architectures. Excellent communicator with deep proficiency in React, TypeScript, and modern styling solutions."
  },
  experience: [
    {
      company: "TechNova Solutions",
      role: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      description: "- Designed and implemented a custom microfrontend architecture using Webpack Module Federation, reducing build times by 35%.\n- Led a team of 4 engineers to build a premium component library utilized across 6 product lines.\n- Optimised Web Vitals score from 'Poor' to 'Good', increasing mobile conversion rate by 18%."
    },
    {
      company: "Innovate Labs",
      role: "Software Engineer II",
      location: "Seattle, WA",
      startDate: "2019-08",
      endDate: "2022-02",
      description: "- Engineered the core analytics dashboard using React and D3.js, rendering over 100k data points smoothly at 60fps.\n- Integrated Stripe payment flows and designed secure serverless checkout handlers."
    }
  ],
  education: [
    {
      institution: "University of Washington",
      degree: "M.S. in Computer Science",
      location: "Seattle, WA",
      startDate: "2017-09",
      endDate: "2019-06",
      description: "Focused on Human-Computer Interaction and Distributed Systems. Graduate teaching assistant."
    },
    {
      institution: "Oregon State University",
      degree: "B.S. in Computer Science",
      location: "Corvallis, OR",
      startDate: "2013-09",
      endDate: "2017-06",
      description: "Graduated Magna Cum Laude. President of the ACM Student Chapter."
    }
  ],
  projects: [
    {
      title: "OmniStore E-Commerce",
      tech: "Next.js, Tailwind, Stripe",
      link: "github.com/alexm/omnistore",
      description: "A fast e-commerce template incorporating ISR (Incremental Static Regeneration), user profiles, full checkout, and analytics."
    },
    {
      title: "DevMetrics Dashboard",
      tech: "TypeScript, GraphQL, AWS",
      link: "devmetrics.live",
      description: "A beautiful monitoring interface that connects to GitHub and Jira APIs to visualize developer team velocity metrics."
    }
  ],
  skills: [
    { name: "JavaScript / TypeScript", level: "Expert" },
    { name: "React / Next.js", level: "Expert" },
    { name: "CSS Grid & Flexbox", level: "Expert" },
    { name: "Node.js / Express", level: "Advanced" },
    { name: "GraphQL / REST APIs", level: "Advanced" },
    { name: "AWS Cloud / Docker", level: "Intermediate" }
  ],
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Conversational" }
  ]
};

// 2. STATE INITIALIZATION
let resumeData = JSON.parse(localStorage.getItem('resumeData'));
if (!resumeData) {
  resumeData = JSON.parse(JSON.stringify(SAMPLE_DATA)); // Deep copy
}

let activeTemplate = localStorage.getItem('resumeTemplate') || 'modern';
let zoomLevel = parseFloat(localStorage.getItem('resumeZoom')) || 0.85;

// Elements
const templateSelect = document.getElementById('template-select');
const btnExport = document.getElementById('btn-export');
const btnReset = document.getElementById('btn-reset');
const btnClear = document.getElementById('btn-clear');
const themeToggle = document.getElementById('theme-toggle');

const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnZoomFit = document.getElementById('btn-zoom-fit');
const zoomSpan = document.getElementById('zoom-level');
const resumePreview = document.getElementById('resume-preview');
const resumeWrapper = document.querySelector('.resume-wrapper');

// ==========================================================================
// CORE FUNCTIONS
// ==========================================================================

// Save current data to LocalStorage
function saveData() {
  localStorage.setItem('resumeData', JSON.stringify(resumeData));
}

// Accordion Toggles
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const parent = header.parentElement;
    parent.classList.toggle('expanded');
  });
});

// Theme Toggle (Light / Dark)
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('appTheme', newTheme);
});

// Load preferred theme on startup
const savedTheme = localStorage.getItem('appTheme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// ==========================================================================
// ZOOM LOGIC
// ==========================================================================
function applyZoom() {
  resumePreview.style.transform = `scale(${zoomLevel})`;
  zoomSpan.textContent = `${Math.round(zoomLevel * 100)}%`;
  localStorage.setItem('resumeZoom', zoomLevel);
  
  // Dynamically calculate wrapper min-height based on scaled page height
  // standard A4 height is roughly 1123px (at 96 DPI)
  const a4Height = 1123;
  const scaledHeight = a4Height * zoomLevel;
  resumeWrapper.style.minHeight = `${scaledHeight + 60}px`;
}

btnZoomIn.addEventListener('click', () => {
  zoomLevel = Math.min(1.5, zoomLevel + 0.05);
  applyZoom();
});

btnZoomOut.addEventListener('click', () => {
  zoomLevel = Math.max(0.4, zoomLevel - 0.05);
  applyZoom();
});

btnZoomFit.addEventListener('click', () => {
  const wrapperWidth = resumeWrapper.clientWidth - 80; // Padding
  const a4Width = 794; // A4 standard width in px
  zoomLevel = Math.max(0.4, Math.min(1.2, wrapperWidth / a4Width));
  applyZoom();
});

// Fit Zoom on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    // Only auto-fit on desktop if we're fitting
  }
});

// ==========================================================================
// TEMPLATE ENGINE & RENDERING PREVIEW
// ==========================================================================

function updatePreview() {
  const tpl = activeTemplate;
  resumePreview.className = `resume-page template-${tpl}`;
  
  if (tpl === 'modern') {
    renderModernTemplate();
  } else if (tpl === 'elegant') {
    renderElegantTemplate();
  } else if (tpl === 'creative') {
    renderCreativeTemplate();
  }
}

// TEMPLATE 1: MODERN PROFESSIONAL
function renderModernTemplate() {
  const p = resumeData.personal;
  
  // Format contacts
  let contactHtml = '';
  if (p.email) contactHtml += `<li><i class="fa-solid fa-envelope"></i>${p.email}</li>`;
  if (p.phone) contactHtml += `<li><i class="fa-solid fa-phone"></i>${p.phone}</li>`;
  if (p.website) contactHtml += `<li><i class="fa-solid fa-globe"></i>${p.website}</li>`;
  if (p.location) contactHtml += `<li><i class="fa-solid fa-location-dot"></i>${p.location}</li>`;

  // Work experience
  let expHtml = '';
  if (resumeData.experience.length > 0) {
    expHtml = `
      <div class="resume-section">
        <h2>Experience</h2>
        ${resumeData.experience.map(item => `
          <div class="resume-item">
            <div class="resume-item-header">
              <span class="resume-item-title">${item.role}</span>
              <span class="resume-item-date">${item.startDate ? formatDate(item.startDate) : ''} – ${item.endDate ? formatDate(item.endDate) : ''}</span>
            </div>
            <div class="resume-item-subtitle">${item.company} ${item.location ? `• ${item.location}` : ''}</div>
            <div class="resume-item-desc">${escapeHtml(item.description)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Education
  let eduHtml = '';
  if (resumeData.education.length > 0) {
    eduHtml = `
      <div class="resume-section">
        <h2>Education</h2>
        ${resumeData.education.map(item => `
          <div class="resume-item">
            <div class="resume-item-header">
              <span class="resume-item-title">${item.degree}</span>
              <span class="resume-item-date">${item.startDate ? formatDate(item.startDate) : ''} – ${item.endDate ? formatDate(item.endDate) : ''}</span>
            </div>
            <div class="resume-item-subtitle">${item.institution} ${item.location ? `• ${item.location}` : ''}</div>
            ${item.description ? `<div class="resume-item-desc">${escapeHtml(item.description)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  // Projects
  let projHtml = '';
  if (resumeData.projects.length > 0) {
    projHtml = `
      <div class="resume-section">
        <h2>Projects</h2>
        ${resumeData.projects.map(item => `
          <div class="resume-item">
            <div class="resume-item-header">
              <span class="resume-item-title">${item.title}</span>
              ${item.link ? `<span class="resume-item-date">${item.link}</span>` : ''}
            </div>
            <div class="resume-item-subtitle">${item.tech}</div>
            <div class="resume-item-desc">${escapeHtml(item.description)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Skills
  let skillsHtml = '';
  if (resumeData.skills.length > 0) {
    skillsHtml = `
      <div class="resume-section">
        <h2>Skills</h2>
        <div class="modern-skills-grid">
          ${resumeData.skills.map(skill => {
            let pct = 70; // default for Intermediate
            if (skill.level === 'Expert') pct = 100;
            else if (skill.level === 'Advanced') pct = 85;
            else if (skill.level === 'Intermediate') pct = 65;
            else if (skill.level === 'Beginner') pct = 40;
            
            return `
              <div class="modern-skill-item">
                <div class="modern-skill-label">
                  <span>${skill.name}</span>
                  <span class="modern-skill-level">${skill.level}</span>
                </div>
                <div class="modern-skill-bar">
                  <div class="modern-skill-fill" style="width: ${pct}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Languages
  let langHtml = '';
  if (resumeData.languages.length > 0) {
    langHtml = `
      <div class="resume-section">
        <h2>Languages</h2>
        <div class="modern-skills-grid">
          ${resumeData.languages.map(lang => `
            <div class="modern-skill-item">
              <div class="modern-skill-label">
                <span>${lang.name}</span>
                <span class="modern-skill-level">${lang.level}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Summary
  let summaryHtml = '';
  if (p.summary) {
    summaryHtml = `
      <div class="resume-section">
        <h2>Summary</h2>
        <div class="resume-item-desc">${escapeHtml(p.summary)}</div>
      </div>
    `;
  }

  resumePreview.innerHTML = `
    <header class="modern-header">
      <h3>${p.name || 'Your Name'}</h3>
      <div class="subtitle">${p.title || 'Professional Title'}</div>
      <ul class="resume-contact-list">${contactHtml}</ul>
    </header>
    <div class="modern-body">
      <div class="modern-left">
        ${summaryHtml}
        ${expHtml}
        ${eduHtml}
        ${projHtml}
      </div>
      <div class="modern-right">
        ${skillsHtml}
        ${langHtml}
      </div>
    </div>
  `;
}

// TEMPLATE 2: ELEGANT MINIMALIST (Serif design)
function renderElegantTemplate() {
  const p = resumeData.personal;
  
  let contactHtml = '';
  const contacts = [];
  if (p.email) contacts.push(p.email);
  if (p.phone) contacts.push(p.phone);
  if (p.website) contacts.push(p.website);
  if (p.location) contacts.push(p.location);
  
  if (contacts.length > 0) {
    contactHtml = `<ul class="resume-contact-list">${contacts.map(c => `<li>${c}</li>`).join(' • ')}</ul>`;
  }

  let expHtml = '';
  if (resumeData.experience.length > 0) {
    expHtml = `
      <div class="resume-section">
        <h2>Experience</h2>
        ${resumeData.experience.map(item => `
          <div class="resume-item">
            <div class="resume-item-header">
              <span class="resume-item-title">${item.role}</span>
              <span class="resume-item-date">${item.startDate ? formatDate(item.startDate) : ''} – ${item.endDate ? formatDate(item.endDate) : ''}</span>
            </div>
            <div class="resume-item-subtitle">${item.company} ${item.location ? `| ${item.location}` : ''}</div>
            <div class="resume-item-desc">${escapeHtml(item.description)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  let eduHtml = '';
  if (resumeData.education.length > 0) {
    eduHtml = `
      <div class="resume-section">
        <h2>Education</h2>
        ${resumeData.education.map(item => `
          <div class="resume-item">
            <div class="resume-item-header">
              <span class="resume-item-title">${item.degree}</span>
              <span class="resume-item-date">${item.startDate ? formatDate(item.startDate) : ''} – ${item.endDate ? formatDate(item.endDate) : ''}</span>
            </div>
            <div class="resume-item-subtitle">${item.institution} ${item.location ? `| ${item.location}` : ''}</div>
            ${item.description ? `<div class="resume-item-desc">${escapeHtml(item.description)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  let projHtml = '';
  if (resumeData.projects.length > 0) {
    projHtml = `
      <div class="resume-section">
        <h2>Projects</h2>
        ${resumeData.projects.map(item => `
          <div class="resume-item">
            <div class="resume-item-header">
              <span class="resume-item-title">${item.title}</span>
              ${item.link ? `<span class="resume-item-date">${item.link}</span>` : ''}
            </div>
            <div class="resume-item-subtitle">${item.tech}</div>
            <div class="resume-item-desc">${escapeHtml(item.description)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  let skillsHtml = '';
  if (resumeData.skills.length > 0) {
    skillsHtml = `
      <div class="resume-section">
        <h2>Skills</h2>
        <div class="elegant-skills-container">
          ${resumeData.skills.map(s => `<span class="elegant-skill-tag">${s.name} (${s.level})</span>`).join('')}
        </div>
      </div>
    `;
  }

  let langHtml = '';
  if (resumeData.languages.length > 0) {
    langHtml = `
      <div class="resume-section">
        <h2>Languages</h2>
        <div class="elegant-skills-container">
          ${resumeData.languages.map(l => `<span class="elegant-skill-tag">${l.name} (${l.level})</span>`).join('')}
        </div>
      </div>
    `;
  }

  let summaryHtml = '';
  if (p.summary) {
    summaryHtml = `
      <div class="resume-section">
        <h2>Profile</h2>
        <div class="elegant-summary">${escapeHtml(p.summary)}</div>
      </div>
    `;
  }

  resumePreview.innerHTML = `
    <header class="elegant-header">
      <h3>${p.name || 'Your Name'}</h3>
      <div class="subtitle">${p.title || 'Professional Title'}</div>
      ${contactHtml}
    </header>
    ${summaryHtml}
    ${expHtml}
    ${eduHtml}
    ${projHtml}
    ${skillsHtml}
    ${langHtml}
  `;
}

// TEMPLATE 3: CREATIVE SIDEBAR
function renderCreativeTemplate() {
  const p = resumeData.personal;
  
  let contactHtml = '';
  if (p.email) contactHtml += `<li><i class="fa-solid fa-envelope"></i> ${p.email}</li>`;
  if (p.phone) contactHtml += `<li><i class="fa-solid fa-phone"></i> ${p.phone}</li>`;
  if (p.website) contactHtml += `<li><i class="fa-solid fa-globe"></i> ${p.website}</li>`;
  if (p.location) contactHtml += `<li><i class="fa-solid fa-location-dot"></i> ${p.location}</li>`;

  let skillsHtml = '';
  if (resumeData.skills.length > 0) {
    skillsHtml = `
      <div class="resume-section">
        <h2>Skills</h2>
        <div class="skill-pill-list">
          ${resumeData.skills.map(s => `
            <div class="skill-pill">
              <span>${s.name}</span>
              <span class="level">${s.level}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  let langHtml = '';
  if (resumeData.languages.length > 0) {
    langHtml = `
      <div class="resume-section">
        <h2>Languages</h2>
        <div class="skill-pill-list">
          ${resumeData.languages.map(l => `
            <div class="skill-pill">
              <span>${l.name}</span>
              <span class="level">${l.level}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  let expHtml = '';
  if (resumeData.experience.length > 0) {
    expHtml = `
      <div class="resume-section">
        <h2>Work Experience</h2>
        ${resumeData.experience.map(item => `
          <div class="resume-item">
            <div class="resume-item-header">
              <span class="resume-item-title">${item.role}</span>
              <span class="resume-item-date">${item.startDate ? formatDate(item.startDate) : ''} – ${item.endDate ? formatDate(item.endDate) : ''}</span>
            </div>
            <div class="resume-item-subtitle">${item.company} ${item.location ? `• ${item.location}` : ''}</div>
            <div class="resume-item-desc">${escapeHtml(item.description)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  let eduHtml = '';
  if (resumeData.education.length > 0) {
    eduHtml = `
      <div class="resume-section">
        <h2>Education</h2>
        ${resumeData.education.map(item => `
          <div class="resume-item">
            <div class="resume-item-header">
              <span class="resume-item-title">${item.degree}</span>
              <span class="resume-item-date">${item.startDate ? formatDate(item.startDate) : ''} – ${item.endDate ? formatDate(item.endDate) : ''}</span>
            </div>
            <div class="resume-item-subtitle">${item.institution} ${item.location ? `• ${item.location}` : ''}</div>
            ${item.description ? `<div class="resume-item-desc">${escapeHtml(item.description)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  let projHtml = '';
  if (resumeData.projects.length > 0) {
    projHtml = `
      <div class="resume-section">
        <h2>Key Projects</h2>
        ${resumeData.projects.map(item => `
          <div class="resume-item">
            <div class="resume-item-header">
              <span class="resume-item-title">${item.title}</span>
              ${item.link ? `<span class="resume-item-date">${item.link}</span>` : ''}
            </div>
            <div class="resume-item-subtitle">${item.tech}</div>
            <div class="resume-item-desc">${escapeHtml(item.description)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  let summaryHtml = '';
  if (p.summary) {
    summaryHtml = `
      <div class="resume-section">
        <h2>Profile</h2>
        <div class="resume-item-desc">${escapeHtml(p.summary)}</div>
      </div>
    `;
  }

  resumePreview.innerHTML = `
    <div class="creative-sidebar">
      <div>
        <h3>${p.name || 'Your Name'}</h3>
        <div class="subtitle">${p.title || 'Professional Title'}</div>
      </div>
      
      <div class="resume-section">
        <h2>Contact</h2>
        <ul class="resume-contact-list">${contactHtml}</ul>
      </div>
      
      ${skillsHtml}
      ${langHtml}
    </div>
    <div class="creative-main">
      ${summaryHtml}
      ${expHtml}
      ${eduHtml}
      ${projHtml}
    </div>
  `;
}

// Helpers
function formatDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.toLowerCase() === 'present') return 'Present';
  const parts = dateStr.split('-');
  if (parts.length < 2) return dateStr;
  
  // Convert YYYY-MM to Month YYYY
  const year = parts[0];
  const monthIdx = parseInt(parts[1]) - 1;
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  if (monthIdx >= 0 && monthIdx < 12) {
    return `${monthNames[monthIdx]} ${year}`;
  }
  return dateStr;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================================================
// EDITOR RENDERING & EVENT REGISTERING
// ==========================================================================

// Render the complete Editor input pane (Dynamic sections)
function renderEditor() {
  // Personal Info Inputs
  document.getElementById('input-name').value = resumeData.personal.name || '';
  document.getElementById('input-title').value = resumeData.personal.title || '';
  document.getElementById('input-email').value = resumeData.personal.email || '';
  document.getElementById('input-phone').value = resumeData.personal.phone || '';
  document.getElementById('input-website').value = resumeData.personal.website || '';
  document.getElementById('input-location').value = resumeData.personal.location || '';
  document.getElementById('input-summary').value = resumeData.personal.summary || '';

  // Render lists
  renderDynamicList('experience', renderExperienceCard);
  renderDynamicList('education', renderEducationCard);
  renderDynamicList('projects', renderProjectsCard);
  renderDynamicList('skills', renderSkillsCard);
  renderDynamicList('languages', renderLanguagesCard);
}

// Helper to render dynamic lists into their container
function renderDynamicList(listKey, cardRenderer) {
  const container = document.getElementById(`${listKey}-list`);
  container.innerHTML = '';
  
  resumeData[listKey].forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'dynamic-item-card';
    card.innerHTML = `
      <div class="card-header-actions">
        <span class="card-title-index">${listKey} #${index + 1}</span>
        <div class="card-actions">
          <button class="btn-icon-sm btn-move-up" data-list="${listKey}" data-index="${index}" title="Move Up"><i class="fa-solid fa-arrow-up"></i></button>
          <button class="btn-icon-sm btn-move-down" data-list="${listKey}" data-index="${index}" title="Move Down"><i class="fa-solid fa-arrow-down"></i></button>
          <button class="btn-icon-sm btn-delete text-danger" data-list="${listKey}" data-index="${index}" title="Remove Item" style="color: var(--danger);"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
      ${cardRenderer(item, index)}
    `;
    container.appendChild(card);
  });
}

// Individual card HTML generators
function renderExperienceCard(item, idx) {
  return `
    <div class="grid-2-col">
      <div class="form-group">
        <label>Company</label>
        <input type="text" class="exp-input" data-index="${idx}" data-field="company" value="${escapeHtml(item.company)}" placeholder="e.g. Acme Corp">
      </div>
      <div class="form-group">
        <label>Role</label>
        <input type="text" class="exp-input" data-index="${idx}" data-field="role" value="${escapeHtml(item.role)}" placeholder="e.g. Frontend Engineer">
      </div>
    </div>
    <div class="grid-2-col">
      <div class="form-group">
        <label>Location</label>
        <input type="text" class="exp-input" data-index="${idx}" data-field="location" value="${escapeHtml(item.location)}" placeholder="e.g. New York, NY">
      </div>
      <div class="grid-2-col">
        <div class="form-group">
          <label>Start Date</label>
          <input type="month" class="exp-input" data-index="${idx}" data-field="startDate" value="${item.startDate || ''}">
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="text" class="exp-input" data-index="${idx}" data-field="endDate" value="${item.endDate || ''}" placeholder="YYYY-MM or Present">
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="exp-input" data-index="${idx}" data-field="description" rows="3" placeholder="Briefly describe key tasks and accomplishments...">${item.description || ''}</textarea>
    </div>
  `;
}

function renderEducationCard(item, idx) {
  return `
    <div class="grid-2-col">
      <div class="form-group">
        <label>Institution</label>
        <input type="text" class="edu-input" data-index="${idx}" data-field="institution" value="${escapeHtml(item.institution)}" placeholder="e.g. Stanford University">
      </div>
      <div class="form-group">
        <label>Degree / Certificate</label>
        <input type="text" class="edu-input" data-index="${idx}" data-field="degree" value="${escapeHtml(item.degree)}" placeholder="e.g. B.S. in Computer Science">
      </div>
    </div>
    <div class="grid-2-col">
      <div class="form-group">
        <label>Location</label>
        <input type="text" class="edu-input" data-index="${idx}" data-field="location" value="${escapeHtml(item.location)}" placeholder="e.g. Stanford, CA">
      </div>
      <div class="grid-2-col">
        <div class="form-group">
          <label>Start Date</label>
          <input type="month" class="edu-input" data-index="${idx}" data-field="startDate" value="${item.startDate || ''}">
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="month" class="edu-input" data-index="${idx}" data-field="endDate" value="${item.endDate || ''}">
        </div>
      </div>
    </div>
    <div class="form-group">
      <label>Additional Info (Optional)</label>
      <textarea class="edu-input" data-index="${idx}" data-field="description" rows="2" placeholder="e.g. Specialization, honors, GPA...">${item.description || ''}</textarea>
    </div>
  `;
}

function renderProjectsCard(item, idx) {
  return `
    <div class="grid-2-col">
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" class="proj-input" data-index="${idx}" data-field="title" value="${escapeHtml(item.title)}" placeholder="e.g. Analytics Platform">
      </div>
      <div class="form-group">
        <label>Link / URL</label>
        <input type="text" class="proj-input" data-index="${idx}" data-field="link" value="${escapeHtml(item.link)}" placeholder="e.g. github.com/username/project">
      </div>
    </div>
    <div class="form-group">
      <label>Technologies Used</label>
      <input type="text" class="proj-input" data-index="${idx}" data-field="tech" value="${escapeHtml(item.tech)}" placeholder="e.g. React, Node.js, GraphQL">
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="proj-input" data-index="${idx}" data-field="description" rows="2" placeholder="Describe key attributes of the project...">${item.description || ''}</textarea>
    </div>
  `;
}

function renderSkillsCard(item, idx) {
  return `
    <div class="grid-2-col">
      <div class="form-group">
        <label>Skill Name</label>
        <input type="text" class="skill-input" data-index="${idx}" data-field="name" value="${escapeHtml(item.name)}" placeholder="e.g. JavaScript">
      </div>
      <div class="form-group">
        <label>Proficiency</label>
        <select class="skill-input" data-index="${idx}" data-field="level">
          <option value="Expert" ${item.level === 'Expert' ? 'selected' : ''}>Expert</option>
          <option value="Advanced" ${item.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
          <option value="Intermediate" ${item.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
          <option value="Beginner" ${item.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
        </select>
      </div>
    </div>
  `;
}

function renderLanguagesCard(item, idx) {
  return `
    <div class="grid-2-col">
      <div class="form-group">
        <label>Language</label>
        <input type="text" class="lang-input" data-index="${idx}" data-field="name" value="${escapeHtml(item.name)}" placeholder="e.g. Spanish">
      </div>
      <div class="form-group">
        <label>Proficiency</label>
        <select class="lang-input" data-index="${idx}" data-field="level">
          <option value="Native" ${item.level === 'Native' ? 'selected' : ''}>Native</option>
          <option value="Fluent" ${item.level === 'Fluent' ? 'selected' : ''}>Fluent</option>
          <option value="Advanced" ${item.level === 'Advanced' ? 'selected' : ''}>Advanced</option>
          <option value="Conversational" ${item.level === 'Conversational' ? 'selected' : ''}>Conversational</option>
          <option value="Beginner" ${item.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
        </select>
      </div>
    </div>
  `;
}

// ==========================================================================
// DYNAMIC BUTTON EVENT DELEGATION
// ==========================================================================

// Handle dynamic Add buttons
document.getElementById('btn-add-experience').addEventListener('click', () => {
  resumeData.experience.push({ company: '', role: '', location: '', startDate: '', endDate: '', description: '' });
  saveData();
  renderEditor();
  updatePreview();
});

document.getElementById('btn-add-education').addEventListener('click', () => {
  resumeData.education.push({ institution: '', degree: '', location: '', startDate: '', endDate: '', description: '' });
  saveData();
  renderEditor();
  updatePreview();
});

document.getElementById('btn-add-project').addEventListener('click', () => {
  resumeData.projects.push({ title: '', tech: '', link: '', description: '' });
  saveData();
  renderEditor();
  updatePreview();
});

document.getElementById('btn-add-skill').addEventListener('click', () => {
  resumeData.skills.push({ name: '', level: 'Intermediate' });
  saveData();
  renderEditor();
  updatePreview();
});

document.getElementById('btn-add-language').addEventListener('click', () => {
  resumeData.languages.push({ name: '', level: 'Conversational' });
  saveData();
  renderEditor();
  updatePreview();
});

// Event Delegation for Move Up, Move Down, Delete inside lists
document.querySelector('.editor-pane').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-icon-sm');
  if (!btn) return;

  const listKey = btn.dataset.list;
  const index = parseInt(btn.dataset.index);
  if (!listKey || isNaN(index)) return;

  if (btn.classList.contains('btn-delete')) {
    resumeData[listKey].splice(index, 1);
  } else if (btn.classList.contains('btn-move-up') && index > 0) {
    // Swap item with index - 1
    const temp = resumeData[listKey][index];
    resumeData[listKey][index] = resumeData[listKey][index - 1];
    resumeData[listKey][index - 1] = temp;
  } else if (btn.classList.contains('btn-move-down') && index < resumeData[listKey].length - 1) {
    // Swap item with index + 1
    const temp = resumeData[listKey][index];
    resumeData[listKey][index] = resumeData[listKey][index + 1];
    resumeData[listKey][index + 1] = temp;
  } else {
    return; // No valid action taken
  }

  saveData();
  renderEditor();
  updatePreview();
});

// ==========================================================================
// EDITOR INPUT EVENT DELEGATION
// ==========================================================================
document.querySelector('.editor-pane').addEventListener('input', (e) => {
  const target = e.target;
  if (!target) return;

  // Personal Info
  if (target.id === 'input-name') resumeData.personal.name = target.value;
  else if (target.id === 'input-title') resumeData.personal.title = target.value;
  else if (target.id === 'input-email') resumeData.personal.email = target.value;
  else if (target.id === 'input-phone') resumeData.personal.phone = target.value;
  else if (target.id === 'input-website') resumeData.personal.website = target.value;
  else if (target.id === 'input-location') resumeData.personal.location = target.value;
  else if (target.id === 'input-summary') resumeData.personal.summary = target.value;

  // Dynamic Item Fields
  else if (target.classList.contains('exp-input')) {
    const idx = parseInt(target.dataset.index);
    const field = target.dataset.field;
    resumeData.experience[idx][field] = target.value;
  }
  else if (target.classList.contains('edu-input')) {
    const idx = parseInt(target.dataset.index);
    const field = target.dataset.field;
    resumeData.education[idx][field] = target.value;
  }
  else if (target.classList.contains('proj-input')) {
    const idx = parseInt(target.dataset.index);
    const field = target.dataset.field;
    resumeData.projects[idx][field] = target.value;
  }
  else if (target.classList.contains('skill-input')) {
    const idx = parseInt(target.dataset.index);
    const field = target.dataset.field;
    resumeData.skills[idx][field] = target.value;
  }
  else if (target.classList.contains('lang-input')) {
    const idx = parseInt(target.dataset.index);
    const field = target.dataset.field;
    resumeData.languages[idx][field] = target.value;
  }
  else {
    return;
  }

  saveData();
  updatePreview();
});

// ==========================================================================
// TOP ACTION TOOLBAR BUTTONS
// ==========================================================================

// Template Selector
templateSelect.value = activeTemplate;
templateSelect.addEventListener('change', (e) => {
  activeTemplate = e.target.value;
  localStorage.setItem('resumeTemplate', activeTemplate);
  updatePreview();
});

// Reset to Sample Data
btnReset.addEventListener('click', () => {
  if (confirm("Reset editing area to use Sample Profile Data? This will overwrite your current progress.")) {
    resumeData = JSON.parse(JSON.stringify(SAMPLE_DATA));
    saveData();
    renderEditor();
    updatePreview();
  }
});

// Clear All Fields
btnClear.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear all fields? This cannot be undone.")) {
    resumeData = {
      personal: { name: '', title: '', email: '', phone: '', website: '', location: '', summary: '' },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      languages: []
    };
    saveData();
    renderEditor();
    updatePreview();
  }
});

// Export to PDF
btnExport.addEventListener('click', () => {
  window.print();
});

// ==========================================================================
// INITIAL SETUP ON DOM LOAD
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderEditor();
  updatePreview();
  applyZoom();
});

// Extra DOM content load handler if script was loaded async
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderEditor();
  updatePreview();
  applyZoom();
}
