'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } };
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const formatText = value => escape(value).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const safeURL = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try { const url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
  };
  const mediaPath = value => escape(safeURL(value));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let config, language = 'fr', activeFilter = 'all', submitting = false;
  const localize = value => typeof value === 'object' && value !== null ? value[language] ?? value.fr ?? value.en ?? '' : value ?? '';
  const text = key => localize(config.copy[key]);
  const linkIcon = url => {
    const host = new URL(url, location.href).hostname.toLowerCase();
    const service = host === 'github.com' ? 'github' : host === 'linkedin.com' || host.endsWith('.linkedin.com') ? 'linkedin' : host === 'itch.io' || host.endsWith('.itch.io') ? 'itch' : host === 'fiverr.com' || host.endsWith('.fiverr.com') ? 'fiverr' : '';
    return service ? `<svg class="external-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="assets/icons.svg#${service}" width="24" height="24"></use></svg>` : '';
  };
  const external = (link, className = '') => {
    const url = safeURL(link.url);
    return url ? `<a class="external-link ${className}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${linkIcon(url)}<span>${escape(localize(link.label))}</span><span class="external-arrow" aria-hidden="true">↗</span></a>` : '';
  };
  const tags = project => `<div class="tags">${project.tags.map(tag => `<span class="tag">${escape(tag)}</span>`).join('')}</div>`;
  const projectURL = project => `project.html?id=${encodeURIComponent(project.id)}`;
  const projectTitle = project => localize(project.title);
  const hasFilter = (project, filter) => filter === 'all' || project.category === filter || (project.filters || []).includes(filter);
  function stopAllPreviews() { window.PortfolioPreviews?.stopAll(); }
  function projectMedia(project) {
    const title = escape(projectTitle(project));
    return `<div class="project-media" data-id="${escape(project.id)}">${project.image ? `<img src="${mediaPath(project.image)}" alt="${title}" width="1280" height="720" loading="lazy">` : `<div class="project-placeholder" aria-hidden="true"><span>${escape(project.tags.join(' / '))}</span><strong>${title}</strong></div>`}<a class="project-image-link" href="${projectURL(project)}" aria-label="${escape(text('viewProject') + ' — ' + projectTitle(project))}"></a>${project.video ? `<video muted playsinline loop preload="none" aria-hidden="true" tabindex="-1"></video><span class="preview-hint">${escape(text('preview'))}</span><button class="preview-toggle" type="button" aria-pressed="false" aria-label="${escape(text('previewButton'))}">▶</button><span class="preview-feedback" role="status"></span>` : ''}</div>`;
  }
  function renderProjects() {
    window.PortfolioPreviews?.destroy();
    $('#filters').setAttribute('aria-label', text('filterLabel'));
    $('#filters').innerHTML = config.filters.map(filter => `<button type="button" class="filter" data-filter="${escape(filter.id)}" aria-pressed="${activeFilter === filter.id}">${escape(localize(filter.label))}</button>`).join('');
    const visible = config.projects.filter(project => project.published !== false && hasFilter(project, activeFilter));
    $('#projectGrid').innerHTML = visible.map(project => `<article class="project-card">${projectMedia(project)}<div class="project-copy"><div class="project-meta"><span class="project-number">${String(config.projects.indexOf(project) + 1).padStart(2,'0')} /</span><span>${escape(localize(project.kind))}</span></div><h3 class="project-title"><a href="${projectURL(project)}">${escape(projectTitle(project))}</a></h3><p class="project-summary">${escape(localize(project.summary))}</p>${tags(project)}<a class="project-open" href="${projectURL(project)}"><span>${escape(text('viewProject'))}</span><span aria-hidden="true">↗</span></a></div></article>`).join('');
    $('#emptyState').hidden = visible.length !== 0;
    $('#projectCount').textContent = language === 'fr' ? `${visible.length} projets affichés` : `${visible.length} projects shown`;
    $('#projectGrid').setAttribute('aria-busy', 'false');
    window.PortfolioPreviews.mount(config.projects, text, safeURL);
  }
  function renderContentBlock(block, depth = 0) {
    if (!block || depth > 8) return '';
    const choice = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
    const alignment = choice(block.align, ['left', 'center', 'right'], 'left');
    const background = choice(block.background, ['transparent', 'surface', 'light', 'dark'], 'transparent');
    const classes = `content-block align-${alignment} background-${background}`;
    const rawTitle = localize(block.title || '');
    const numberedTitle = rawTitle.match(/^(\d{2})\s+(.+)$/);
    const title = rawTitle
      ? numberedTitle
        ? `<h2 class="numbered-title">
            <span class="section-number">${escape(numberedTitle[1])}</span>
            <span>${escape(numberedTitle[2])}</span>
          </h2>`
        : `<h2>${escape(rawTitle)}</h2>`
      : '';
    const caption = block.caption ? `<figcaption>${formatText(localize(block.caption))}</figcaption>` : '';
    if (block.type === 'text') return `<section class="${classes} block-text">${title}${block.text ? `<p>${formatText(localize(block.text))}</p>` : ''}</section>`;
    if (block.type === 'image' && safeURL(block.src)) {
      const fit = choice(block.fit, ['contain', 'cover'], 'contain');
      return `<figure class="${classes} block-image fit-${fit}">${title}<a href="${mediaPath(block.src)}" target="_blank" rel="noopener"><img src="${mediaPath(block.src)}" alt="${escape(localize(block.alt) || localize(block.title))}" loading="lazy"></a>${caption}</figure>`;
    }
    if (block.type === 'video' && safeURL(block.src)) return `<figure class="${classes} block-video">${title}<video controls autoplay muted loop playsinline preload="metadata" src="${mediaPath(block.src)}" ${block.poster && safeURL(block.poster) ? `poster="${mediaPath(block.poster)}"` : ''} aria-label="${escape(localize(block.title) || text('video'))}"></video>${caption}</figure>`;
    if (block.type === 'group' && Array.isArray(block.items)) {
      const layout = choice(block.layout, ['row', 'column'], 'row');
      const ratio = choice(block.ratio, ['50-50', '40-60', '60-40', '30-70', '70-30'], '50-50');
      const vertical = choice(block.verticalAlign, ['start', 'center', 'end'], 'center');
      return `<section class="${classes} block-group">${title}<div class="block-items layout-${layout} ratio-${ratio} vertical-${vertical}${block.reverseOnMobile === true ? ' reverse-mobile' : ''}">${block.items.map(item => renderContentBlock(item, depth + 1)).join('')}</div></section>`;
    }
    return '';
  }
  function renderProjectBlocks(project) {
    if (Array.isArray(project.blocks)) return project.blocks.map(block => renderContentBlock(block)).join('');
    return (project.sections || []).map(section => renderContentBlock({type: 'group', layout: 'column', items: [{type: 'text', title: section.title, text: section.text}, ...(section.image ? [{type: 'image', src: section.image, alt: section.title}] : [])]})).join('');
  }
  function renderProjectPage() {
    const id = new URLSearchParams(location.search).get('id');
    const projects = config.projects.filter(project => project.published !== false);
    const project = projects.find(project => project.id === id);
    const container = $('#projectContent');
    if (!project) { container.innerHTML = `<h1>${escape(text('notFound'))}</h1>`; container.setAttribute('aria-busy', 'false'); document.title = `${text('notFound')} — ${config.site.name}`; return; }
    const title = projectTitle(project);
    document.title = `${title} — ${config.site.name}`;
    document.querySelector('meta[name=description]').content = localize(project.description) || localize(project.summary);
    const next = projects[(projects.indexOf(project) + 1) % projects.length];
    container.innerHTML = `<header class="project-page-heading"><p class="eyebrow">${escape(localize(project.kind))}</p><h1>${escape(title)}</h1>${tags(project)}<p class="project-lead">${formatText(localize(project.description) || localize(project.summary))}</p></header>${project.showCover !== false && project.video ? `<video class="project-video" controls playsinline preload="metadata" ${project.image ? `poster="${mediaPath(project.image)}"` : ''} aria-label="${escape(text('video'))}" src="${mediaPath(project.video)}"></video>` : project.showCover !== false && project.image ? `<img class="project-cover" src="${mediaPath(project.image)}" alt="${escape(title)}">` : ''}${project.contentInProgress ? `<aside class="content-note"><h2>${escape(text('unfinished'))}</h2><p>${escape(text('unfinishedText'))}</p></aside>` : ''}<div class="project-blocks">${renderProjectBlocks(project)}</div><div class="dialog-links">${(project.links || []).map(link => external(link, 'button')).join('')}</div><nav class="project-page-nav"><a class="underlined" href="index.html#projects">← ${escape(text('backProjects'))}</a><a class="underlined" href="${projectURL(next)}">${escape(text('nextProject'))} : ${escape(projectTitle(next))} →</a></nav>`;
    container.setAttribute('aria-busy', 'false');
  }
  function render() {
    document.documentElement.lang = language;
    document.title = config.site.title;
    document.querySelectorAll('[data-name]').forEach(element => { element.textContent = config.site.name; });
    document.querySelectorAll('[data-copy]').forEach(element => { element.textContent = text(element.dataset.copy); });
    $('#languageSelector').setAttribute('aria-label', language === 'fr' ? 'Langue sélectionnée' : 'Selected language');
    document.querySelectorAll('[data-language]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    $('#themeToggle').setAttribute('aria-label',text('theme'));
    $('#menuToggle').setAttribute('aria-label',text('menu'));
    document.querySelectorAll('.cv-link').forEach(link => { link.href = safeURL(config.site.cv); });
    if ($('#emailLink')) {
    $('#emailLink').textContent = config.site.email;
    $('#emailLink').href = `mailto:${config.site.email}`;
    $('#socialLinks').innerHTML = config.site.links.map(link => external(link)).join('');
    $('#skills').innerHTML = config.skills.map(skill => `<div class="skill-row"><span>${escape(text(skill.label))}</span><strong>${skill.items.map(escape).join(' / ')}</strong></div>`).join('');
    $('#timeline').innerHTML = config.experience.map(item => `<article class="timeline-item"><div class="timeline-date">${escape(localize(item.date))}</div><div><h3>${escape(localize(item.title))}</h3><p>${escape(item.place)}</p><p>${escape(localize(item.description))}</p></div></article>`).join('');
    }
    document.querySelector('meta[name=description]').content = language === 'fr' ? 'Sacha Gastinois, Gameplay Programmer. Projets C++, C#, Unreal Engine, Unity et moteurs maison.' : 'Sacha Gastinois, Gameplay Programmer. C++, C#, Unreal Engine, Unity and custom engine projects.';
    if ($('#projectGrid')) {
      const projects = config.projects.filter(project => project.published !== false);
      const featured = projects.find(project => project.id === config.site.featuredProject) || projects[0];
      const hero = $('.hero-feature');
      if (featured) {
        $('#featuredLink').href = projectURL(featured);
        $('#featuredMedia').innerHTML = projectMedia(featured);
        const image = $('#featuredMedia img');
        if (image) { image.loading = 'eager'; image.fetchPriority = 'high'; }
        $('#featuredTitle').textContent = projectTitle(featured);
        $('#featuredNote').textContent = `${localize(featured.kind)} · ${featured.tags.join(' / ')}`;
      } else hero.hidden = true;
      renderProjects();
    } else renderProjectPage();
    if (submitting) $('#sendLabel').textContent = text('sending');
    if ($('#copyStatus')) $('#copyStatus').textContent = '';
    if ($('#formStatus')) $('#formStatus').textContent = '';
  }
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    $('#themeToggle').setAttribute('aria-pressed',String(theme === 'light'));
    document.querySelector('meta[name=theme-color]').content = theme === 'light' ? '#f2f4f5' : '#171d24';
    save('portfolio-theme',theme);
  }
  function closeMenu() { $('#mobileNav').hidden = true; $('#menuToggle').setAttribute('aria-expanded','false'); }
  async function start() {
    try {
      const response = await fetch('data/portfolio.json', { cache: 'no-cache' });
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
      $('#languageSelector').addEventListener('click', event => {
        const button = event.target.closest('[data-language]');
        if (!button || button.dataset.language === language) return;
        language = button.dataset.language; save('portfolio-language', language); render();
      });
      $('#themeToggle').addEventListener('click',() => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
      if ($('#filters')) $('#filters').addEventListener('click', event => {
        const button = event.target.closest('[data-filter]');
        if (!button) return;
        activeFilter = button.dataset.filter; renderProjects();
        [...$('#filters').children].find(button => button.dataset.filter === activeFilter)?.focus();
      });
      $('#menuToggle').addEventListener('click',() => { const open = $('#mobileNav').hidden; $('#mobileNav').hidden = !open; $('#menuToggle').setAttribute('aria-expanded',String(open)); });
      $('#mobileNav').addEventListener('click',event => { if (event.target.closest('a')) closeMenu(); });
      document.addEventListener('keydown',event => { if (event.key === 'Escape') closeMenu(); });
      matchMedia('(min-width:741px)').addEventListener('change',event => { if (event.matches) closeMenu(); });
      document.addEventListener('visibilitychange',() => { if (document.hidden) stopAllPreviews(); });
      reducedMotion.addEventListener('change',() => stopAllPreviews());
      $('#copyEmail')?.addEventListener('click',async () => { try { await navigator.clipboard.writeText(config.site.email); $('#copyStatus').textContent = text('copied'); } catch { $('#copyStatus').textContent = text('copyFailed'); } });
      $('#contactForm')?.addEventListener('submit',async event => {
        event.preventDefault(); if (submitting) return;
        submitting = true; const button = event.currentTarget.querySelector('[type=submit]'); button.disabled = true; $('#sendLabel').textContent = text('sending'); $('#formStatus').textContent = '';
        const abort = new AbortController(); const timeout = setTimeout(() => abort.abort(),20000);
        try { const response = await fetch(safeURL(config.site.formEndpoint), {method:'POST',body:new FormData(event.currentTarget),headers:{Accept:'application/json'},signal:abort.signal}); if (!response.ok) throw new Error('Send failed'); $('#formStatus').textContent = text('sent'); $('#contactForm').reset(); }
        catch { $('#formStatus').textContent = text('sendError'); }
        finally { clearTimeout(timeout); submitting = false; button.disabled = false; $('#sendLabel').textContent = text('send'); }
      });
    } catch (error) {
      const target = $('#projectGrid') || $('#projectContent');
      target.setAttribute('aria-busy','false');
      target.innerHTML = '<div class="error-panel"><p>Impossible de charger le contenu. Recharge la page, ou contacte-moi par e-mail.<br>Unable to load content. Reload the page or contact me by email.</p><button class="button" id="retry">Réessayer / Retry</button></div>';
      $('#retry').addEventListener('click',() => location.reload());
      console.error('Portfolio:',error);
    }
  }
  start();
})();
