const modalData = {
  'asteroid': {
    title: "Asteroids — Jeu d'arcade et moteur 2D personnalisé",
    tech: "C++20 · SFML 3.0.0 · Game Engine",
    videoUrl: "assets/videos/AsteroidDemo.mp4",
    desc: `Asteroids est un jeu d'arcade développé en <strong class="font-extrabold">C++20 avec SFML 3.0.0, construit sur un moteur 2D conçu pour le projet. </strong> Au-delà du jeu, l'objectif technique est de <strong class="font-extrabold">structurer une base réutilisable</strong> : acteurs et composants, gestion des niveaux, entrées configurées par actions, collisions, animations et interface utilisateur. Deux modes de jeu exploitent cette architecture : <strong class="font-extrabold">un mode classique</strong> organisé en vagues avec des améliorations entre les manches, et <strong class="font-extrabold">un mode chronométré</strong> avec apparition d'ennemis et suivi du score.`,
    sections: [
      {
        title: "01 — Architecture du moteur et cycle de jeu",
        blocks: [
          {
            type: "columns", columns: [
              [
                { type: "text", content: "La classe <strong class=\"font-semibold text-white\">Engine</strong> calcule le delta time et met à jour le niveau actif. Chaque Level dispose de gestionnaires dédiés aux acteurs, au rendu, aux collisions et à l'audio." },
              ],
              [
                { type: "image", align: "left", src: "assets/images/AsteroidImage1.svg", alt: "Architecture du moteur Asteroids", caption: "Architecture du moteur 2D", width: 600}
              ]
            ]
          }
        ]
      },
      {
        title: "02 — Entités composables : Actor / Component",
        blocks: [
          {
            type: "columns", columns: [
              [
                { type: "image", src: "assets/images/AsteroidImage2.svg",  alt: "Architecture du moteur Asteroids", caption: "Architecture du moteur 2D", width: 600}
              ],
              [
                { type: "text", align: "left", content: "AActor constitue la base des objets du monde. Les comportements sont distribués dans des UComponent spécialisés : déplacement, tir, points de vie, collision, animation et rendu. Un acteur peut également gérer des enfants et des transformations relatives. L'initialisation, les mises à jour par frame et la destruction suivent des étapes dédiées (BeginPlay, Tick, BeginDestroy). Cette structure sert notamment aux joueurs, astéroïdes, projectiles et OVNI. Fichiers clés : Actor.h, Actor.cpp, Component.h, ShootComponent.cpp."},
              ]
            ]
          }
        ]
      },
      {
        title: "03 — Gameplay, collisions et modes de jeu",
        blocks: [
          {
            type: "columns", columns: [
              [
                { type: "text", content: "Le système d'input utilise des ActionMap associant événements clavier, souris ou manette à des callbacks, afin de découpler les commandes de leurs effets. Les UCollisionComponent utilisent des canaux et des réponses de collision ; CollisionManager transmet les événements d'entrée, de maintien et de sortie de contact. Le mode Classic gère des vagues et propose des améliorations de tir ou de vie ; le mode Chrono met en place un compte à rebours, des apparitions d'ennemis et l'enregistrement des scores. Fichiers clés : InputManager.h, ActionMap.cpp, CollisionComponent.cpp, ClassicModeLevel.cpp, ChronoModeLevel.cpp."},
              ],
              [ 
                { type: "image", align: "left", src: "assets/images/AsteroidImage3.svg",  alt: "Architecture du moteur Asteroids", caption: "Architecture du moteur 2D", width: 600}
              ]
            ]
          }
        ]
      }
    ],
    codeExamples: [
      {
        title: "01 / Boucle principale",
        file: "Engine.cpp",
        url: "https://github.com/SachaGastinois/Asteroids/blob/main/Engine.cpp",
        note: "Le delta time est calculé à chaque itération puis transmis au niveau actif.",
        code: `while (Level* _currentLevel = M_LEVEL.GetCurrentLevel())
{
    TM_Seconds& _timer = M_TIMER;
    const float _deltaTime = _timer.Update();
    _currentLevel->Update(_deltaTime);
}`
      },
      {
        title: "02 / Création d'un acteur",
        file: "Level.h",
        url: "https://github.com/SachaGastinois/Asteroids/blob/main/Level.h",
        note: "La méthode générique instancie, construit puis enregistre l'acteur dans le niveau.",
        code: `template <typename Type, typename ...Args, IS_BASE_OF(AActor, Type)>
FORCEINLINE Type* SpawnActor(Args&&... _args)
{
    Type* _actor = Spawn<Type>(this, forward<Args>(_args)...);
    _actor->Construct();
    _actor->Register();
    return _actor;
}`
      },
      {
        title: "03 / Événements de collision",
        file: "CollisionManager.cpp",
        url: "https://github.com/SachaGastinois/Asteroids/blob/main/CollisionManager.cpp",
        note: "L'entrée en collision notifie les deux acteurs et mémorise leur paire.",
        code: `if (_otherData.step == CS_ENTER)
{
    _ownerData.other->CollisionEnter(_otherData);
    _otherData.other->CollisionEnter(_ownerData);
    AddCollisionPair(_ownerData.other, _otherData.other);
}`
      }
    ],
    links: [
      {
        name: "Code source GitHub",
        url: "https://github.com/SachaGastinois/Asteroids"
      },
      {
        name: "Jouer sur itch.io",
        url: "https://sachachaussette.itch.io/asteroid"
      }
    ]
  },
  'roblox-launcher': { title: "Roblox Launcher", tech: "C# · WPF", desc: "Projet étudiant. Présentation technique à venir.", sections: [], links: [] },
  'graphics-engine': { title: "Moteur Graphique 3D Custom", tech: "C++20 · Vulkan", desc: "Projet personnel en cours de documentation.", sections: [], links: [] },
  'small-waters': { title: "Small Waters", tech: "C# · Unity", desc: "Projet personnel en développement. Présentation technique à venir.", sections: [], links: [] },
  'serious-game': { title: "Serious Game", tech: "Unity · C#", desc: "Présentation technique à venir.", sections: [], links: [] },
  'devquest-rpg': { title: "DevQuest RPG", tech: "C# · WPF", desc: "Présentation technique à venir.", sections: [], links: [] },
  'despair': {
    title: "Despair",
    tech: "C++ · Unreal Engine 5",
    videoUrl: "assets/videos/Despair-trailer.mp4",
    desc: `Despair est un jeu d'infiltration développé sous Unreal Engine 5.4.4 avec une équipe de 20 personnes dont 6 programmeurs dans le cadre du <strong class="font-extrabold">projet de fin de première année à Objectif 3D : École des Arts Numériques</strong>. Sur ce projet j'étais responsable du système <strong class="font-extrabold">des paramètres graphiques utilisateurs, de l'interface utilisateur et de la sauvegarde de la partie</strong>.`,
    sections: [
      {
        title: "01 — Paramètres Graphique",
        blocks: [
          { type: "text", content: "dadadad"},
          {
            type: "columns", columns: [
              [
                { type: "image", src: "assets/images/DespairImage1.svg",  alt: "Architecture des objet de paramètres", caption: "Architecture des objet de paramètres", width: 600},
              ],
              [
                { type: "image", src: "",  alt: "", caption: "", width: 600}
              ]
            ]
          }
        ]
      },
      {
        title: "02 — Interface Utilisateur",
        blocks: [
          {
            type: "columns", columns: [
              [
                { type: "text", content: ""},
              ],
              [
                { type: "image", src: "",  alt: "", caption: "", width: 600},
              ]
            ]
          }
        ]
      },
      {
        title: "03 — Sauvegarde",
       blocks: [
          {
            type: "columns", columns: [
              [
                { type: "text", content: ""},
              ],
              [
                { type: "image", src: "",  alt: "", caption: "", width: 600},
              ],
              [
                { type: "image", src: "",  alt: "", caption: "", width: 600}
              ],
            ]
          }
        ]
      },
    ],

    links: [
      {
        name: "Voir sur Steam",
        url: "https://store.steampowered.com/app/4456120/Despair/"
      }
    ]
  },
  'poste': {
    title: "La Poste - Formation",
    tech: "C# · Unity 6 · Serious Game",
    videoUrl: "assets/videos/LaPoste-Demo.mp4",
    desc: "Présentation technique à venir.",
    sections: [
      
    ],

    links: [
      
    ]
  },
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

let lastModalTrigger = null;
function openProjectModal(key, trigger = null) {
  lastModalTrigger = trigger;
  const data = modalData[key];
  if (!data) return;

  const modalContent = document.getElementById('modalContent');

  modalContent.classList.add('pt-8');


  // Chaque section peut contenir autant de blocs que nécessaire, dans l'ordre voulu.
  // Formats : text, image, video, gallery, code, columns, divider.
  // Compatibilité : les anciennes propriétés desc / img / videoUrl / codeExamples restent utilisables.
  const renderVideo = (url, title = "Vidéo du projet") => {
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
             class="text-xs text-studio-accent hover:underline">Voir la source ↗</a>` : ""}
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
        return `<div class="text-sm md:text-base text-zinc-300 leading-7 whitespace-pre-line">${block.content || ""}</div>`;
      case "image":
        return `
          <figure
            class="min-w-0 ${getAlignment(block.align)}"
            style="max-width: ${Number(block.width) || 600}px"
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
    title: "Dans le code",
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
  // Stop video playback when closing modal
  document.getElementById('modalContent').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
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