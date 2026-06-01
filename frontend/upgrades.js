/* ============================================
   UPGRADES.JS — All new feature scripts
   ============================================ */

/* ---- SCROLL PROGRESS BAR ---- */
(function() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();

/* ---- HAMBURGER MOBILE MENU ---- */
(function() {
  const btn = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');
  const closeBtn = document.getElementById('drawer-close');
  if (!btn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    btn.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    btn.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
})();

/* ---- PARTICLE HERO BACKGROUND ---- */
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [], W, H, raf;
  const GOLD = 'rgba(200,169,110,';
  const COUNT = 55;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.alpha = Math.random() * 0.4 + 0.1;
  }
  Particle.prototype.update = function() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = GOLD + p.alpha + ')';
      ctx.fill();
      p.update();
    });
    // draw connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = GOLD + (0.08 * (1 - dist/110)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  // Only run when hero is in view
  const hero = document.getElementById('hero');
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { if (!raf) draw(); }
    else { cancelAnimationFrame(raf); raf = null; }
  });
  if (hero) observer.observe(hero);
  else draw();
})();

/* ---- STAT COUNTERS ---- */
(function() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1200;
      const step = Math.ceil(duration / (target || 1));
      let current = 0;
      const timer = setInterval(() => {
        current++;
        el.textContent = current;
        if (current >= target) { el.textContent = target; clearInterval(timer); }
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
})();

/* ---- GITHUB STATS CARD (styled, in contact section) ---- */
(function() {
  const card = document.getElementById('github-stats-card');
  if (!card) return;
  fetch('https://api.github.com/users/Utkarsh2118/repos?sort=updated&per_page=4')
    .then(r => r.json())
    .then(repos => {
      if (!repos || !Array.isArray(repos)) throw new Error('no repos');
      const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
      const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
      const repoHTML = repos.map(r => `
        <div class="gh-repo-item">
          <div>
            <a href="${r.html_url}" target="_blank" class="gh-repo-name">${r.name}</a>
            <div class="gh-repo-desc">${r.description ? r.description.slice(0, 55) + (r.description.length > 55 ? '…' : '') : ''}</div>
          </div>
          <span class="gh-repo-stars">⭐ ${r.stargazers_count}</span>
        </div>`).join('');
      card.innerHTML = `
        <div class="gh-header">
          <span class="gh-icon">⌥</span>
          <span class="gh-username">Utkarsh2118 on GitHub</span>
        </div>
        <div class="gh-stats-row">
          <div class="gh-stat"><span class="gh-stat-num">${repos.length}+</span><span class="gh-stat-lbl">Repos</span></div>
          <div class="gh-stat"><span class="gh-stat-num">${totalStars}</span><span class="gh-stat-lbl">Stars</span></div>
          <div class="gh-stat"><span class="gh-stat-num">${totalForks}</span><span class="gh-stat-lbl">Forks</span></div>
        </div>
        <div class="gh-repos">${repoHTML}</div>`;
    })
    .catch(() => { card.innerHTML = '<a href="https://github.com/Utkarsh2118" target="_blank" class="gh-username" style="color:var(--gold-light);">github.com/Utkarsh2118 ↗</a>'; });
})();
