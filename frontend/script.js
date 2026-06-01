/* ==============================
   1. TYPING ANIMATION
   ============================== */
(function setupTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const titles = [
    'Full Stack Developer',
    'ML Engineer',
    'Freelance Developer',
    'MERN Stack Dev',
    'Problem Solver'
  ];
  let ti = 0, ci = 0, deleting = false;

  function tick() {
    const current = titles[ti];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ti = (ti + 1) % titles.length;
        setTimeout(tick, 400);
        return;
      }
    }
    setTimeout(tick, deleting ? 55 : 100);
  }
  setTimeout(tick, 600);
})();

/* ==============================
   2. SCROLL ANIMATIONS (fade-up)
   ============================== */
(function setupScrollAnim() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
})();

/* ==============================
   4. PROJECT FILTER ANIMATION
   ============================== */
function animateFilterChange(grid, newCards) {
  // fade out existing cards
  Array.from(grid.children).forEach(c => {
    c.style.transition = 'opacity 0.2s, transform 0.2s';
    c.style.opacity = '0';
    c.style.transform = 'scale(0.95)';
  });
  setTimeout(() => {
    grid.innerHTML = '';
    newCards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(18px)';
      grid.appendChild(card);
      setTimeout(() => {
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 60);
    });
  }, 200);
}

/* ==============================
   5. GITHUB STATS (stars + forks)
   ============================== */
async function loadGitHubStats() {
  const container = document.getElementById('github-feed');
  if (!container) return;
  try {
    const res = await fetch('https://api.github.com/users/Utkarsh2118/repos?sort=updated&per_page=6');
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();
    if (!repos || !repos.length) return;

    const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

    container.innerHTML = `
      <div style="display:flex;gap:1rem;margin-bottom:0.75rem;flex-wrap:wrap;">
        <span style="font-size:0.85rem;color:var(--text-muted);">⭐ ${totalStars} stars</span>
        <span style="font-size:0.85rem;color:var(--text-muted);">🍴 ${totalForks} forks</span>
        <span style="font-size:0.85rem;color:var(--text-muted);">📦 ${repos.length} repos</span>
      </div>
      <h4 style="margin:0 0 0.5rem;">Latest on GitHub</h4>
      ${repos.map(r => `
        <div style="margin-bottom:0.6rem;display:flex;justify-content:space-between;align-items:center;gap:0.5rem;">
          <div>
            <a href="${r.html_url}" target="_blank" style="color:var(--gold-dark);text-decoration:none;font-weight:500;">${r.name}</a>
            <div style="font-size:0.82rem;color:var(--text-muted);">${r.description || ''}</div>
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);white-space:nowrap;">⭐ ${r.stargazers_count}</div>
        </div>
      `).join('')}
    `;
  } catch (err) { console.error('GitHub stats error', err); }
}

/* ==============================
   6. PROJECT CARD HOVER PREVIEW
   ============================== */
function enhanceProjectCards() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.transition = 'transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s';
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px) scale(1.02)';
      card.style.boxShadow = '0 12px 32px rgba(0,0,0,0.13)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ==============================
   7. CERTIFICATIONS — CLICKABLE
   ============================== */
function makeCertsClickable() {
  // certs.json will need links; for now make cards visually interactive
  document.querySelectorAll('.cert-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.style.transition = 'transform 0.2s, box-shadow 0.2s';
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-3px)';
      card.style.boxShadow = '0 6px 20px rgba(0,0,0,0.10)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

/* ==============================
   8. CUSTOM CURSOR
   ============================== */
(function setupCursor() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const dot = document.createElement('div');
  dot.id = 'cursor-dot';
  dot.style.cssText = `
    position:fixed;width:10px;height:10px;border-radius:50%;
    background:var(--gold-dark,#b8860b);pointer-events:none;
    z-index:99999;transform:translate(-50%,-50%);
    transition:transform 0.15s, width 0.2s, height 0.2s, opacity 0.2s;
    opacity:0;
  `;
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  ring.style.cssText = `
    position:fixed;width:32px;height:32px;border-radius:50%;
    border:1.5px solid var(--gold-dark,#b8860b);pointer-events:none;
    z-index:99998;transform:translate(-50%,-50%);
    transition:left 0.1s ease-out, top 0.1s ease-out, width 0.2s, height 0.2s, opacity 0.2s;
    opacity:0;
  `;
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    dot.style.opacity = '1'; ring.style.opacity = '0.6';
    ring.style.left = mx + 'px'; ring.style.top = my + 'px';
  });

  document.addEventListener('mousedown', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(0.7)';
    ring.style.width = '20px'; ring.style.height = '20px';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '32px'; ring.style.height = '32px';
  });

  // Scale up on hoverable elements
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .project-card, .cert-card, .skill-tag')) {
      dot.style.width = '14px'; dot.style.height = '14px';
      ring.style.width = '44px'; ring.style.height = '44px';
      ring.style.opacity = '0.4';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .project-card, .cert-card, .skill-tag')) {
      dot.style.width = '10px'; dot.style.height = '10px';
      ring.style.width = '32px'; ring.style.height = '32px';
      ring.style.opacity = '0.6';
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
})();

/* ==============================
   9. SMOOTH DARK/LIGHT TRANSITION
   ============================== */
(function setupSmoothTheme() {
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease !important;
    }
  `;
  // Inject only during theme toggle to avoid slowing down page load
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.head.appendChild(style);
    setTimeout(() => style.remove(), 400);
  });
})();

// Scroll animations
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

// Nav scroll effect
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.boxShadow = window.scrollY > 40 ? '0 1px 20px rgba(0,0,0,0.07)' : 'none';
});

// Contact form
// Set your Formspree endpoint below (e.g. 'https://formspree.io/f/xyzabc')
// By default this points to the local backend endpoint `/api/contact`.
let FORM_ENDPOINT = '/api/contact';

async function loadRuntimeConfig() {
  const config = await loadJSON('config.json');
  if (!config) return;
  if (Object.prototype.hasOwnProperty.call(config, 'FORM_ENDPOINT')) {
    FORM_ENDPOINT = String(config.FORM_ENDPOINT || '').trim();
  }
}

async function handleContact() {
  const inputs = document.querySelectorAll('.form-input');
  const name = inputs[0].value.trim();
  const email = inputs[1].value.trim();
  const msg = inputs[2].value.trim();
  if (!name || !email || !msg) {
    alert('Please fill in all fields.');
    return;
  }

  if (FORM_ENDPOINT) {
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message: msg })
      });
      if (res.ok) {
        alert('Thanks — your message was sent.');
        inputs.forEach(i => i.value = '');
      } else {
        const data = await res.json().catch(() => ({}));
        console.error('Form submission error', data);
        alert('Submission failed — please try again later.');
      }
    } catch (err) {
      console.error(err);
      alert('Submission failed — please check your connection.');
    }
  } else {
    // Fallback to mailto if no endpoint configured
    const subject = encodeURIComponent('Portfolio Inquiry from ' + name);
    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
    window.location.href = 'mailto:srivastava.utkarsh2118@gmail.com?subject=' + subject + '&body=' + body;
  }
}

/* ------------------------------
   Dynamic content & UI helpers
   ------------------------------ */
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Fetch error');
    return await res.json();
  } catch (err) {
    console.error('Failed to load', path, err);
    return null;
  }
}

// Projects
let allProjects = [];
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  // show skeletons while loading
  if (grid) {
    grid.innerHTML = '';
    const skeletons = document.createElement('div'); skeletons.className = 'skeleton-grid';
    for (let i=0;i<4;i++) { const s = document.createElement('div'); s.className = 'skeleton-card'; skeletons.appendChild(s); }
    grid.appendChild(skeletons);
  }
  const data = await loadJSON('projects.json');
  if (!data) return;
  allProjects = data;
  populateProjectFilter(allProjects);
  renderProjects(allProjects);
}

function populateProjectFilter(projects) {
  const select = document.getElementById('project-filter');
  if (!select) return;
  const tags = new Set();
  projects.forEach(p => p.stack.forEach(s => tags.add(s)));
  Array.from(tags).sort().forEach(t => {
    const opt = document.createElement('option'); opt.value = t; opt.textContent = t; select.appendChild(opt);
  });
  select.addEventListener('change', () => {
    const v = select.value;
    const filtered = v === 'all' ? allProjects : allProjects.filter(p => p.stack.includes(v));
    const grid = document.getElementById('projects-grid');
    if (!grid) { renderProjects(filtered); return; }
    // build cards without inserting into DOM
    const tempDiv = document.createElement('div');
    const prevGrid = grid.cloneNode(false);
    renderProjects(filtered); // render normally first to build cards
    const cards = Array.from(grid.children);
    // re-apply animation
    cards.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(18px)';
      setTimeout(() => {
        c.style.transition = 'opacity 0.3s, transform 0.3s';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, i * 60);
    });
  });
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';
  projects.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    const imgHtml = p.image ? `<div style="margin-bottom:0.85rem;"><img class="project-thumb blur" data-src="${p.image}" alt="${p.title}" loading="lazy"/></div>` : '';
    card.innerHTML = `
      ${imgHtml}
      <div class="project-num">${String(i+1).padStart(2,'0')}</div>
      <div class="project-stack">${p.stack.map(s=>`<span class="stack-tag">${s}</span>`).join('')}</div>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      ${p.link? `<a href="${p.link}" target="_blank" class="project-link">Visit →</a>`: `<span class="project-link">${p.date}</span>`}
    `;
    card.tabIndex = 0;
    card.addEventListener('click', () => openProjectModal(p));
    card.addEventListener('keypress', (e) => { if (e.key === 'Enter') openProjectModal(p); });
    grid.appendChild(card);
  });
  // Start observing lazy images
  lazyLoadImages();
  setTimeout(enhanceProjectCards, 100);
}

// Lazy-load images using IntersectionObserver
const lazyObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.getAttribute('data-src');
      if (src) {
        img.onload = () => { img.classList.add('loaded'); img.classList.remove('blur'); };
        img.src = src;
        img.removeAttribute('data-src');
      }
      obs.unobserve(img);
    }
  });
}, { rootMargin: '100px' });

function lazyLoadImages() {
  document.querySelectorAll('img.project-thumb[data-src]').forEach(img => lazyObserver.observe(img));
}

// Resume modal
const resumeModal = document.getElementById('resume-modal');
const resumeBody = document.getElementById('resume-body');
const resumeBtn = document.getElementById('resume-btn');
const resumeClose = document.getElementById('resume-close');
if (resumeBtn) resumeBtn.addEventListener('click', openResumeModal);
if (resumeClose) resumeClose.addEventListener('click', closeResumeModal);
if (resumeModal) resumeModal.addEventListener('click', (e) => { if (e.target.classList.contains('modal-backdrop')) closeResumeModal(); });

function openResumeModal() {
  if (!resumeModal || !resumeBody) return;
  // create iframe on demand to avoid loading PDF until requested
  if (!resumeBody.querySelector('iframe')) {
    const iframe = document.createElement('iframe');
    iframe.src = 'resume.pdf';
    iframe.style.width = '100%';
    iframe.style.height = '70vh';
    iframe.title = 'Resume';
    resumeBody.appendChild(iframe);
  }
  resumeModal.style.display = 'flex';
  resumeModal.setAttribute('aria-hidden','false');
}

function closeResumeModal() {
  if (!resumeModal || !resumeBody) return;
  resumeModal.style.display = 'none';
  resumeModal.setAttribute('aria-hidden','true');
  // optionally remove iframe to free memory
  const iframe = resumeBody.querySelector('iframe');
  if (iframe) iframe.remove();
}

// Modal
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
function openProjectModal(project) {
  if (!modal || !modalBody) return;
  // save focused element for accessibility
  modal._previouslyFocused = document.activeElement;
  modalBody.innerHTML = `
    <h2 style="font-family:var(--serif); margin-bottom:0.5rem;">${project.title}</h2>
    <div style="display:flex; gap:0.5rem; margin:0.5rem 0 1rem;">${project.stack.map(s=>`<span class="stack-tag">${s}</span>`).join('')}</div>
    <p style="color:var(--text-muted); line-height:1.7;">${project.desc}</p>
    ${project.link? `<p style="margin-top:1rem;"><a href="${project.link}" target="_blank" class="project-link">Open Project →</a></p>`: ''}
  `;
  modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false');
  // focus close button for keyboard users
  setTimeout(() => { if (modalClose) modalClose.focus(); }, 50);
}
function closeModal() { if (modal) { modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); modalBody.innerHTML = ''; } }
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', (e) => { if (e.target.classList.contains('modal-backdrop')) closeModal(); });
// Close modals on Escape and restore focus
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal(); closeResumeModal();
    // restore focus
    if (modal && modal._previouslyFocused) modal._previouslyFocused.focus();
  }
});

// Skills & Certs
async function loadSkills() {
  const data = await loadJSON('skills.json');
  if (!data) return;
  const grid = document.querySelector('.skills-grid');
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach(group => {
    const el = document.createElement('div'); el.className = 'skill-group';
    el.innerHTML = `<div class="skill-group-title">${group.group}</div><div class="skill-tags">${group.tags.map(t=>`<span class="skill-tag">${t}</span>`).join('')}</div>`;
    grid.appendChild(el);
  });
}

async function loadCerts() {
  const data = await loadJSON('certs.json');
  if (!data) return;
  const grid = document.querySelector('.certs-grid');
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach(c => {
    const el = document.createElement('div'); el.className = 'cert-card';
    const link = c.link ? `href="${c.link}" target="_blank"` : '';
    const tag = c.link ? 'a' : 'div';
    el.innerHTML = `<${tag} ${link} style="text-decoration:none;color:inherit;display:block;">
      <div class="cert-name">${c.name}</div>
      <div class="cert-issuer">${c.issuer} ${c.link ? '<span style="font-size:0.75rem;opacity:0.6;">↗</span>' : ''}</div>
    </${tag}>`;
    grid.appendChild(el);
  });
  makeCertsClickable();
}

// Theme toggle
function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const current = localStorage.getItem('theme') || 'light';
  if (current === 'dark') document.documentElement.classList.add('dark');
  btn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// GitHub feed (public repos)
async function loadGitHubFeed() {
  const container = document.getElementById('github-feed');
  if (!container) return;
  try {
    const res = await fetch('https://api.github.com/users/Utkarsh2118/repos?sort=updated&per_page=5');
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();
    if (!repos || !repos.length) return;
    container.innerHTML = '<h4 style="margin:0 0 0.5rem;">Latest on GitHub</h4>' + repos.map(r => `
      <div style="margin-bottom:0.5rem;"><a href="${r.html_url}" target="_blank" style="color:var(--gold-dark); text-decoration:none; font-weight:500;">${r.name}</a><div style="font-size:0.85rem; color:var(--text-muted);">${r.description? r.description: ''}</div></div>
    `).join('');
  } catch (err) { console.error('Failed to load GitHub feed', err); }
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
  await loadRuntimeConfig();
  loadProjects(); loadSkills(); loadCerts(); setupThemeToggle(); loadGitHubStats();
});

// Button ripple effect
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-primary, .btn-outline');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);
});

/* ------------------------------
   Lightweight SPA router
   - intercepts internal hash links
   - updates history (pushState/replaceState)
   - smooth scrolls to sections and manages focus
   ------------------------------ */
function navigateToHash(hash, replace = false) {
  const id = (hash || '#hero').replace('#', '') || 'hero';
  const el = document.getElementById(id);
  if (!el) return;
  const state = { id };
  try {
    if (replace) history.replaceState(state, '', '#' + id);
    else history.pushState(state, '', '#' + id);
  } catch (err) { /* ignore history errors on some environments */ }

  // update active link
  document.querySelectorAll('nav .nav-links a').forEach(a => {
    a.setAttribute('aria-current', a.getAttribute('href') === ('#' + id) ? 'true' : 'false');
  });

  // animate section (add class then remove on transition end)
  try {
    el.classList.add('section-anim');
    // force reflow
    void el.offsetWidth;
    el.classList.add('active');
    const onEnd = (e) => {
      if (e.target === el) {
        el.classList.remove('section-anim');
        el.classList.remove('active');
        el.removeEventListener('transitionend', onEnd);
      }
    };
    el.addEventListener('transitionend', onEnd);
  } catch (err) { /* ignore */ }

  // smooth scroll and focus heading for accessibility
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const heading = el.querySelector('h2, h1');
  if (heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }

  // update title lightly
  const base = 'Utkarsh Srivastava – Full Stack Developer';
  const sectionTitle = el.querySelector('.section-title') ? el.querySelector('.section-title').textContent.trim() : '';
  document.title = sectionTitle ? `${sectionTitle} — ${base}` : base;
}

function setupRouter() {
  // intercept internal hash links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    // allow links that are only anchors for modals or external controls to opt out by data-no-router
    if (a.hasAttribute('data-no-router')) return;
    e.preventDefault();
    navigateToHash(href);
  });

  // handle back/forward
  window.addEventListener('popstate', () => {
    const id = (location.hash || '#hero').replace('#', '') || 'hero';
    navigateToHash('#' + id, true);
  });

  // initial navigation (replace state so back button behaves)
  const initial = location.hash || '#hero';
  navigateToHash(initial, true);
}

// initialize router after DOM ready
document.addEventListener('DOMContentLoaded', () => { setupRouter(); });

/* ------------------------------
   Prefetch helpers for heavy assets
   - resume.pdf prefetch on hover/click
   - project images prefetch when navigating to Projects
   ------------------------------ */
function prefetchResume() {
  if (document.querySelector('link[data-prefetch-resume]')) return;
  const l = document.createElement('link');
  l.rel = 'prefetch'; l.as = 'document'; l.href = 'resume.pdf'; l.setAttribute('data-prefetch-resume', '1');
  document.head.appendChild(l);
  // also warm cache by fetching (no-cors so it doesn't throw in some environments)
  fetch('resume.pdf', { method: 'GET', mode: 'no-cors' }).catch(()=>{});
}

function prefetchProjectImages(projects) {
  if (!projects || !projects.length) return;
  // limit how many images to prefetch to avoid heavy network use
  const max = 8;
  let count = 0;
  projects.forEach(p => {
    if (count >= max) return;
    if (p.image) {
      const k = 'prefetch-project-' + encodeURIComponent(p.image);
      if (document.querySelector('link[data-' + k + ']')) return;
      const link = document.createElement('link');
      link.rel = 'prefetch'; link.as = 'image'; link.href = p.image; link.setAttribute('data-' + k, '1');
      document.head.appendChild(link);
      // also create Image to warm browser cache
      const img = new Image(); img.src = p.image;
      count++;
    }
  });
}

// Prefetch resume on hover of resume button
if (resumeBtn) {
  resumeBtn.addEventListener('mouseenter', prefetchResume);
  resumeBtn.addEventListener('focus', prefetchResume);
}

// Prefetch projects images when user hovers the 'View Projects' link or nav link
const projectsLink = document.querySelector('a[href="#projects"]');
if (projectsLink) {
  projectsLink.addEventListener('mouseenter', () => { prefetchProjectImages(allProjects); });
  projectsLink.addEventListener('focus', () => { prefetchProjectImages(allProjects); });
}

// When navigating to projects, prefetch their images
const origNavigate = navigateToHash;
navigateToHash = function(hash, replace = false) {
  origNavigate(hash, replace);
  const id = (hash || '#hero').replace('#', '') || 'hero';
  if (id === 'projects') {
    // small timeout to let projects data load first
    setTimeout(() => prefetchProjectImages(allProjects), 250);
  }
  if (id === 'hero' || id === 'about') {
    // optionally prefetch resume if user is browsing to contact/hero
    // keep lightweight
  }
};
