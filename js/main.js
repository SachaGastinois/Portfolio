'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const safeURL = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try { const url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
  };
  const mediaPath = value => escape(safeURL(value));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverDevice = matchMedia('(hover: hover) and (pointer: fine)');
  let config, language = 'fr', activeFilter = 'all', activeProject = null, submitting = false;
  let observer;
  const localize = value => typeof value === 'object' && value !== null ? value[language] ?? value.fr ?? value.en ?? '' : value ?? '';
  const text = key => localize(config.copy[key]);
  const external = link => { const url = safeURL(link.url); return url ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(localize(link.label))}</a>` : ''; };
  const tags = project => `<div class="tags">${project.tags.map(tag => `<span class="tag">${escape(tag)}</span>`).join('')}</div>`;
  function stopPreview(media) {
    const video = media.querySelector('video');
    if (!video) return;
    media.dataset.playback = 'stopped';
    video.pause();
    media.classList.remove('is-playing');
    const toggle = media.querySelector('.preview-toggle');
    if (toggle) { toggle.setAttribute('aria-pressed','false'); toggle.setAttribute('aria-label',text('previewButton')); toggle.textContent = '▶'; }
  }
  function stopAllPreviews() { document.querySelectorAll('.project-media').forEach(stopPreview); }
  function wirePreviews() {
    observer?.disconnect();
    observer = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) stopPreview(entry.target); }), {threshold:.1});
    document.querySelectorAll('.project-media').forEach(media => {
      const video = media.querySelector('video');
      if (!video) return;
      const project = config.projects.find(project => project.id === media.dataset.id);
      const toggle = media.querySelector('.preview-toggle');
      async function play() {
        stopAllPreviews();
        media.dataset.playback = 'requested';
        if (!video.getAttribute('src')) video.src = safeURL(project.previewVideo || project.video);
        try {
          if (video.readyState < 1) await new Promise((resolve, reject) => {
            video.addEventListener('loadedmetadata',resolve,{once:true});
            video.addEventListener('error',reject,{once:true});
          });
          if (media.dataset.playback !== 'requested') return;
          const start = project.previewVideo ? 0 : project.previewStart || 0;
          if (video.currentTime < start || video.currentTime > start + 10) video.currentTime = Math.min(start, Math.max(0,video.duration - 1));
          await video.play();
          if (media.dataset.playback !== 'requested') { video.pause(); return; }
          media.classList.add('is-playing');
          toggle.setAttribute('aria-pressed','true'); toggle.setAttribute('aria-label',text('stopPreview')); toggle.textContent = 'Ⅱ';
        } catch { stopPreview(media); }
      }
      video.addEventListener('timeupdate',() => { const start = project.previewVideo ? 0 : project.previewStart || 0; if (video.currentTime > start + 10) video.currentTime = start; });
      media.addEventListener('pointerenter',() => { if (hoverDevice.matches && !reducedMotion.matches) play(); });
      media.addEventListener('pointerleave',() => { if (hoverDevice.matches) stopPreview(media); });
      toggle.addEventListener('click',event => { event.stopPropagation(); if (media.dataset.playback === 'requested') stopPreview(media); else play(); });
      observer.observe(media);
    });
  }
  function renderProjects() {
    stopAllPreviews();
    $('#filters').setAttribute('aria-label',text('filterLabel'));
    $('#filters').innerHTML = config.filters.map(filter => `<button type="button" class="filter" data-filter="${escape(filter.id)}" aria-pressed="${activeFilter === filter.id}">${escape(localize(filter.label))}</button>`).join('');
    const visible = config.projects.filter(project => project.published !== false && (activeFilter === 'all' || project.category === activeFilter));
    const featured = visible.filter(project => project.featured);
    $('#projectGrid').innerHTML = featured.map(project => {
      const number = String(config.projects.indexOf(project) + 1).padStart(2,'0');
      return `<article class="project-card"><div class="project-media" data-id="${escape(project.id)}"><img src="${mediaPath(project.image)}" alt="${escape(project.title)}" width="1280" height="720" loading="lazy"><button class="project-image-link" data-open="${escape(project.id)}" aria-label="${escape(text('viewProject') + ' — ' + project.title)}"></button>${project.video ? `<video muted playsinline loop preload="none" aria-hidden="true" tabindex="-1"></video><span class="preview-hint">${escape(text('preview'))}</span><button class="preview-toggle" type="button" aria-pressed="false" aria-label="${escape(text('previewButton'))}">▶</button>` : ''}</div><div class="project-copy"><div class="project-meta"><span class="project-number">${number} /</span><span>${escape(localize(project.kind))}</span></div><h3 class="project-title"><button data-open="${escape(project.id)}">${escape(project.title)}</button></h3><p class="project-summary">${escape(localize(project.summary))}</p>${tags(project)}<button class="project-open" data-open="${escape(project.id)}"><span>${escape(text('viewProject'))}</span><span aria-hidden="true">↗</span></button></div></article>`;
    }).join('');
    const others = visible.filter(project => !project.featured);
    $('#otherProjects').innerHTML = others.map(project => `<article class="other-project"><h4>${escape(project.title)}</h4><p>${escape(localize(project.kind))} · ${escape(text('detailsSoon'))}</p>${tags(project)}</article>`).join('');
    $('#workbench').hidden = others.length === 0;
    $('#emptyState').hidden = visible.length !== 0;
    $('#projectCount').textContent = language === 'fr' ? `${visible.length} projets affichés` : `${visible.length} projects shown`;
    $('#projectGrid').setAttribute('aria-busy','false');
    wirePreviews();
  }
  function renderDialog(project) {
    const index = config.projects.indexOf(project) + 1;
    $('#dialogIndex').textContent = `${String(index).padStart(2,'0')} / ${localize(project.kind)}`;
    $('#dialogContent').innerHTML = `${tags(project)}<h2 id="dialogTitle" class="dialog-title">${escape(project.title)}</h2><p class="dialog-description">${escape(localize(project.description))}</p>${project.video ? `<video class="dialog-video" controls playsinline preload="metadata" poster="${mediaPath(project.image)}" aria-label="${escape(text('video'))}" src="${mediaPath(project.video)}"></video>` : ''}${project.sections.map(section => `<section class="detail-section"><h3>${escape(localize(section.title))}</h3><p>${escape(localize(section.text))}</p>${section.image ? `<a href="${mediaPath(section.image)}" target="_blank" rel="noopener"><img src="${mediaPath(section.image)}" alt="${escape(localize(section.title))}" loading="lazy"></a>` : ''}</section>`).join('')}<div class="dialog-links" aria-label="${escape(text('projectLinks'))}">${project.links.map(link => { const url = safeURL(link.url); return url ? `<a class="button" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(localize(link.label))} <span aria-hidden="true">↗</span></a>` : ''; }).join('')}</div>`;
  }
  function openProject(id) {
    const project = config.projects.find(project => project.id === id && project.featured);
    if (!project) return;
    stopAllPreviews(); activeProject = project; renderDialog(project);
    $('#projectDialog').showModal();
    document.body.style.overflow = 'hidden';
    $('#projectDialog').scrollTop = 0;
    $('#closeDialog').focus();
  }
  function render() {
    document.documentElement.lang = language;
    document.title = config.site.title;
    document.querySelectorAll('[data-name]').forEach(element => { element.textContent = config.site.name; });
    const featured = config.projects.find(project => project.id === config.site.featuredProject);
    if (featured) { const image = $('.hero-feature img'); image.src = safeURL(featured.image); image.alt = featured.title; $('#featuredTitle').textContent = featured.title; }
    document.querySelectorAll('[data-copy]').forEach(element => { element.textContent = text(element.dataset.copy); });
    $('#languageToggle').textContent = language === 'fr' ? 'EN' : 'FR';
    $('#languageToggle').setAttribute('aria-label',language === 'fr' ? 'Switch to English' : 'Passer en français');
    $('#languageToggle').lang = language === 'fr' ? 'en' : 'fr';
    $('#themeToggle').setAttribute('aria-label',text('theme'));
    $('#closeDialog').setAttribute('aria-label',text('close'));
    $('#menuToggle').setAttribute('aria-label',text('menu'));
    document.querySelectorAll('.cv-link').forEach(link => { link.href = safeURL(config.site.cv); });
    $('#emailLink').textContent = config.site.email;
    $('#emailLink').href = `mailto:${config.site.email}`;
    $('#socialLinks').innerHTML = config.site.links.map(external).join('');
    $('#skills').innerHTML = config.skills.map(skill => `<div class="skill-row"><span>${escape(text(skill.label))}</span><strong>${skill.items.map(escape).join(' / ')}</strong></div>`).join('');
    $('#timeline').innerHTML = config.experience.map(item => `<article class="timeline-item"><div class="timeline-date">${escape(localize(item.date))}</div><div><h3>${escape(localize(item.title))}</h3><p>${escape(item.place)}</p><p>${escape(localize(item.description))}</p></div></article>`).join('');
    document.querySelector('meta[name=description]').content = language === 'fr' ? 'Sacha Gastinois, Gameplay Programmer. Projets C++, C#, Unreal Engine, Unity et moteurs maison.' : 'Sacha Gastinois, Gameplay Programmer. C++, C#, Unreal Engine, Unity and custom engine projects.';
    renderProjects();
    if (activeProject) renderDialog(activeProject);
    if (submitting) $('#sendLabel').textContent = text('sending');
    $('#copyStatus').textContent = ''; $('#formStatus').textContent = '';
  }
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    $('#themeToggle').setAttribute('aria-pressed',String(theme === 'light'));
    document.querySelector('meta[name=theme-color]').content = theme === 'light' ? '#f5f2e9' : '#141413';
    save('portfolio-theme',theme);
  }
  function closeMenu() { $('#mobileNav').hidden = true; $('#menuToggle').setAttribute('aria-expanded','false'); }
  async function start() {
    try {
      const response = await fetch('data/portfolio.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      config = await response.json();
      if (!config.site || !config.copy || !Array.isArray(config.projects)) throw new Error('Invalid portfolio.json');
      const savedLanguage = read('portfolio-language');
      language = ['fr','en'].includes(savedLanguage) ? savedLanguage : config.site.defaultLanguage === 'en' ? 'en' : 'fr';
      const theme = read('portfolio-theme');
      document.documentElement.style.setProperty('--accent',config.site.accent);
      const style = document.createElement('style');
      if (/^#[0-9a-f]{6}$/i.test(config.site.accentLight)) style.textContent = `:root[data-theme=light]{--accent:${config.site.accentLight}}`;
      document.head.append(style);
      setTheme(theme === 'light' || theme === 'dark' ? theme : config.site.defaultTheme === 'light' ? 'light' : 'dark');
      render();
      $('#year').textContent = String(new Date().getFullYear());
      $('#languageToggle').addEventListener('click',() => { language = language === 'fr' ? 'en' : 'fr'; save('portfolio-language',language); render(); });
      $('#themeToggle').addEventListener('click',() => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
      $('#filters').addEventListener('click',event => { const button = event.target.closest('[data-filter]'); if (!button) return; activeFilter = button.dataset.filter; renderProjects(); $(`[data-filter="${activeFilter}"]`).focus(); });
      $('#projectGrid').addEventListener('click',event => { const button = event.target.closest('[data-open]'); if (button) openProject(button.dataset.open); });
      $('#closeDialog').addEventListener('click',() => $('#projectDialog').close());
      $('#projectDialog').addEventListener('click',event => { if (event.target !== $('#projectDialog')) return; const rect = event.target.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.target.close(); });
      $('#projectDialog').addEventListener('close',() => { $('#dialogContent').querySelectorAll('video').forEach(video => video.pause()); $('#dialogContent').replaceChildren(); document.body.style.overflow = ''; activeProject = null; });
      $('#menuToggle').addEventListener('click',() => { const open = $('#mobileNav').hidden; $('#mobileNav').hidden = !open; $('#menuToggle').setAttribute('aria-expanded',String(open)); });
      $('#mobileNav').addEventListener('click',event => { if (event.target.closest('a')) closeMenu(); });
      document.addEventListener('keydown',event => { if (event.key === 'Escape') closeMenu(); });
      matchMedia('(min-width:741px)').addEventListener('change',event => { if (event.matches) closeMenu(); });
      document.addEventListener('visibilitychange',() => { if (document.hidden) stopAllPreviews(); });
      reducedMotion.addEventListener('change',() => stopAllPreviews());
      $('#copyEmail').addEventListener('click',async () => { try { await navigator.clipboard.writeText(config.site.email); $('#copyStatus').textContent = text('copied'); } catch { $('#copyStatus').textContent = text('copyFailed'); } });
      $('#contactForm').addEventListener('submit',async event => {
        event.preventDefault(); if (submitting) return;
        submitting = true; const button = event.currentTarget.querySelector('[type=submit]'); button.disabled = true; $('#sendLabel').textContent = text('sending'); $('#formStatus').textContent = '';
        const abort = new AbortController(); const timeout = setTimeout(() => abort.abort(),20000);
        try { const response = await fetch(safeURL(config.site.formEndpoint), {method:'POST',body:new FormData(event.currentTarget),headers:{Accept:'application/json'},signal:abort.signal}); if (!response.ok) throw new Error('Send failed'); $('#formStatus').textContent = text('sent'); $('#contactForm').reset(); }
        catch { $('#formStatus').textContent = text('sendError'); }
        finally { clearTimeout(timeout); submitting = false; button.disabled = false; $('#sendLabel').textContent = text('send'); }
      });
    } catch (error) {
      $('#projectGrid').setAttribute('aria-busy','false');
      $('#projectGrid').innerHTML = '<div class="error-panel"><p>Impossible de charger le contenu. Recharge la page, ou contacte-moi par e-mail.<br>Unable to load content. Reload the page or contact me by email.</p><button class="button" id="retry">Réessayer / Retry</button></div>';
      $('#retry').addEventListener('click',() => location.reload());
      console.error('Portfolio:',error);
    }
  }
  start();
})();
