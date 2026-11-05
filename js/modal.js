// Content is maintained in data/projects.fr.json and data/projects.en.json.
const projectContentCache = {};
const supportedLanguages = ["fr", "en"];
let currentLanguage = localStorage.getItem("portfolio-language") === "en" ? "en" : "fr";
let activeProjectKey = null;
let activeProjectTrigger = null;
let modalRequestId = 0;

const translations = {
  fr: { source: "Voir la source ↗", video: "Vidéo du projet", unsupported: "Votre navigateur ne prend pas en charge la vidéo.", code: "Dans le code", error: "Impossible de charger ce projet.", details: "Voir les détails du projet", close: "Fermer les détails du projet" },
  en: { source: "View source ↗", video: "Project video", unsupported: "Your browser does not support video playback.", code: "In the code", error: "Unable to load this project.", details: "View project details", close: "Close project details" }
};

async function loadProjectContent(language) {
  if (projectContentCache[language]) return projectContentCache[language];
  const response = await fetch(`data/projects.${language}.json`);
  if (!response.ok) throw new Error(`Unable to load ${language} projects: ${response.status}`);
  const content = await response.json();
  projectContentCache[language] = content;
  return content;
}
function setPortfolioLanguage(language) {
  if (!supportedLanguages.includes(language)) return;
  currentLanguage = language;
  localStorage.setItem("portfolio-language", language);
  document.documentElement.lang = language;
  document.querySelectorAll("[data-language]").forEach(button => {
    const selected = button.dataset.language === language;
    button.setAttribute("aria-pressed", String(selected));
    button.classList.toggle("text-white", selected);
    button.classList.toggle("text-studio-accent", selected);
  });
  document.querySelectorAll("[data-i18n-fr][data-i18n-en]").forEach(element => {
    element.textContent = element.dataset[`i18n${language.toUpperCase()}`];
  });
  document.querySelectorAll(".project-card").forEach(card => {
    card.setAttribute("aria-label", translations[language].details);
  });
  document.getElementById("closeModalBtn")?.setAttribute("aria-label", translations[language].close);
  if (activeProjectKey) openProjectModal(activeProjectKey, activeProjectTrigger);
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

let lastModalTrigger = null;
async function openProjectModal(key, trigger = null) {
  lastModalTrigger = trigger;
  activeProjectKey = key;
  activeProjectTrigger = trigger || activeProjectTrigger;
  const requestId = ++modalRequestId;
  const modalContent = document.getElementById('modalContent');
  let data;
  try {
    data = (await loadProjectContent(currentLanguage))[key];
  } catch (error) {
    console.error(error);
    if (requestId === modalRequestId) modalContent.textContent = translations[currentLanguage].error;
    return;
  }
  if (requestId !== modalRequestId || !data) return;

  modalContent.classList.add('pt-8');


  // Chaque section peut contenir autant de blocs que nécessaire, dans l'ordre voulu.
  // Formats : text, image, video, gallery, code, columns, divider.
  // Compatibilité : les anciennes propriétés desc / img / videoUrl / codeExamples restent utilisables.
  const renderVideo = (url, title = translations[currentLanguage].video) => {
    if (!url) return "";
    const safeUrl = escapeHtml(url);
    const safeTitle = escapeHtml(title);
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      const type = /\.webm(\?.*)?$/i.test(url) ? "video/webm"
        : /\.ogg(\?.*)?$/i.test(url) ? "video/ogg" : "video/mp4";
      return `<video controls playsinline preload="metadata" class="w-full rounded-lg bg-black"
                     aria-label="${safeTitle}">
                <source src="${safeUrl}" type="${type}">
                Votre navigateur ne prend pas en charge la vidéo.
              </video>`;
    }
    // Les URL externes sont réservées aux intégrations HTTPS.
    if (!/^https:\/\//i.test(url)) return "";
    return `<iframe title="${safeTitle}" src="${safeUrl}" loading="lazy"
                    class="w-full aspect-video rounded-lg border border-studio-border"
                    allow="fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  };

  const renderCode = (block) => `
    <div class="rounded-lg border border-studio-border overflow-hidden bg-zinc-950">
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-900/70 border-b border-studio-border">
        <span class="text-white text-xs font-mono">${escapeHtml(block.title || block.file || "Code")}</span>
        ${block.url ? `<a href="${escapeHtml(block.url)}" target="_blank" rel="noopener noreferrer"
             class="text-xs text-studio-accent hover:underline">${translations[currentLanguage].source}</a>` : ""}
      </div>
      <pre class="overflow-x-auto p-4 text-xs md:text-sm text-zinc-200 leading-6"><code>${escapeHtml(block.code || "")}</code></pre>
      ${block.note ? `<p class="px-4 py-3 border-t border-studio-border text-sm text-zinc-400">${block.note}</p>` : ""}
    </div>`;

  const getAlignment = (align) => {
    switch (align) {
      case "left":   return "mr-auto";
      case "right":  return "ml-auto";
      case "center": return "mx-auto";
      default:       return "mx-auto";
    }
  };

  const renderBlock = (block) => {
    if (!block) return "";
    switch (block.type) {
      case "text":
        return `<div class="text-sm md:text-base text-zinc-300 leading-7 whitespace-pre-line" style="text-align: ${["left", "center", "right", "justify"].includes(block.align) ? block.align : "left"}">${block.content || ""}</div>`;
      case "image":
        return `
          <figure
            class="min-w-0 ${getAlignment(block.align)}"
            style="max-width: ${Math.min(2000, Math.max(100, Number(block.width) || 600))}px"
          >
            <img
              src="${escapeHtml(block.src || "")}"
              alt="${escapeHtml(block.alt || "")}"
              loading="lazy"
              decoding="async"
              class="w-full h-auto rounded-lg object-contain"
            >

            ${block.caption ? `
              <figcaption class="text-xs text-zinc-400 mt-2 text-center">
                ${block.caption}
              </figcaption>
            ` : ""}
          </figure>
        `;
      case "video":
        return `<figure class="min-w-0">${renderVideo(block.src, block.title)}
          ${block.caption ? `<figcaption class="text-xs text-zinc-400 mt-2">${block.caption}</figcaption>` : ""}
        </figure>`;
      case "gallery":
        return `<div class="grid grid-cols-1 ${block.columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4">
          ${(block.items || []).map(item => renderBlock({type: "image", ...item})).join("")}
        </div>`;
      case "code":
        return renderCode(block);
      case "columns": {
        const cols = block.columns || [];
        return `<div class="grid grid-cols-1 ${cols.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6 items-start">
          ${cols.map(column => `<div class="min-w-0 space-y-4">
            ${(Array.isArray(column) ? column : [column]).map(renderBlock).join("")}
          </div>`).join("")}
        </div>`;
      }
      case "divider":
        return `<hr class="border-studio-border my-6">`;
      default:
        return "";
    }
  };

  const renderSection = (section, index) => {
    // Conversion automatique des anciennes sections {title, desc, img}.
    const blocks = Array.isArray(section.blocks) ? section.blocks : [
      ...(section.desc ? [{type: "text", content: section.desc}] : []),
      ...(section.img ? [{type: "image", src: section.img, alt: section.title}] : [])
    ];
    return `<section class="py-7 border-t border-studio-border" aria-label="${escapeHtml(section.title || `Section ${index + 1}`)}">
      ${section.title ? `<h4 class="text-lg font-semibold text-white mb-5">${escapeHtml(section.title)}</h4>` : ""}
      <div class="space-y-6">${blocks.map(renderBlock).join("")}</div>
    </section>`;
  };

  const sections = data.sections || data.imgs || [];
  const legacyCode = (data.codeExamples || []).map(example => ({
    type: "code", ...example
  }));
  const allSections = [...sections];
  if (legacyCode.length) allSections.push({
    title: translations[currentLanguage].code,
    blocks: legacyCode
  });

  modalContent.innerHTML = `
    ${data.videoUrl ? `<div class="mb-8">${renderVideo(data.videoUrl, data.title)}</div>` : ""}
    <span class="text-xs font-mono text-studio-accent uppercase tracking-widest">${escapeHtml(data.tech || "")}</span>
    <h3 class="text-2xl font-bold text-white mt-2 mb-4">${escapeHtml(data.title || "")}</h3>
    ${data.desc ? `<div class="text-sm text-zinc-300 leading-7 mb-8 whitespace-pre-line">${data.desc}</div>` : ""}
    <div class="space-y-4">${allSections.map(renderSection).join("")}</div>
    <div class="flex flex-wrap items-center gap-4 pt-6 mt-8 border-t border-studio-border">
      ${(data.links || []).map(link => `
        <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer"
           class="px-4 py-2 border border-white text-white text-xs font-mono uppercase
                  hover:bg-white hover:text-black transition-colors">
          ${escapeHtml(link.name)}
        </a>`).join("")}
    </div>
  `;

  if (window.lucide) lucide.createIcons();
  const dialog = document.getElementById('projectModal');
  dialog.classList.remove('hidden');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', data.title);
  document.body.style.overflow = 'hidden';
  document.getElementById('closeModalBtn')?.focus();

  // 3. Forcer la lecture automatique via JavaScript après l'affichage
  const videoElement = document.getElementById('modalVideo');
  // La vidéo détaillée est lancée volontairement par le visiteur.
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  lastModalTrigger?.focus();
  lastModalTrigger = null;
  activeProjectKey = null;
  activeProjectTrigger = null;
  ++modalRequestId;
  // Stop video playback when closing modal
  document.getElementById('modalContent').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  setPortfolioLanguage(currentLanguage);
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setPortfolioLanguage(button.dataset.language)));
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeModalBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', e => {
    if (modal?.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeProjectModal();
    if (e.key === 'Tab') {
      const focusables = [...modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); } });
    card.addEventListener('click', () => {
      const projectKey = card.getAttribute('data-project');
      openProjectModal(projectKey, card);
    });
  });
});