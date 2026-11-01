const modalData = {
  'asteroid': {
    title: "Asteroids — Jeu d'arcade et moteur 2D personnalisé",
    tech: "C++20 · SFML 3 · Architecture Actor/Component · Gameplay",
    videoUrl: "assets/videos/AsteroidDemo.mp4",
    desc: "Asteroids est un jeu d'arcade développé en C++20 avec SFML 3, construit sur un moteur 2D conçu pour le projet. Au-delà du jeu, l'objectif technique est de structurer une base réutilisable : acteurs et composants, gestion des niveaux, entrées configurées par actions, collisions, animations et interface utilisateur. Deux modes de jeu exploitent cette architecture : un mode classique organisé en vagues avec des améliorations entre les manches, et un mode chronométré avec apparition d'ennemis et suivi du score.",
    imgs: [
      {
        title: "01 — Architecture du moteur et cycle de jeu",
        desc: "La classe Engine pilote une boucle principale basée sur un delta time obtenu via TimerManager, puis délègue la mise à jour au niveau actif. Chaque Level regroupe ses responsables de systèmes : ActorManager pour les entités, CameraManager pour le rendu, CollisionManager pour les interactions et AudioManager pour les sons. Le chargement et le changement de niveau permettent de partager cette infrastructure entre le menu principal et les différents modes de jeu. Fichiers clés : Engine.cpp, Level.cpp, Main.cpp.",
        img: "assets/images/AsteroidArchitecture.svg"
      },
      {
        title: "02 — Entités composables : Actor / Component",
        desc: "AActor constitue la base des objets du monde. Les comportements sont distribués dans des UComponent spécialisés : déplacement, tir, points de vie, collision, animation et rendu. Un acteur peut également gérer des enfants et des transformations relatives. L'initialisation, les mises à jour par frame et la destruction suivent des étapes dédiées (BeginPlay, Tick, BeginDestroy). Cette structure sert notamment aux joueurs, astéroïdes, projectiles et OVNI. Fichiers clés : Actor.h, Actor.cpp, Component.h, ShootComponent.cpp.",
        img: "assets/images/AsteroidImage2.svg"
      },
      {
        title: "03 — Gameplay, collisions et modes de jeu",
        desc: "Le système d'input utilise des ActionMap associant événements clavier, souris ou manette à des callbacks, afin de découpler les commandes de leurs effets. Les UCollisionComponent utilisent des canaux et des réponses de collision ; CollisionManager transmet les événements d'entrée, de maintien et de sortie de contact. Le mode Classic gère des vagues et propose des améliorations de tir ou de vie ; le mode Chrono met en place un compte à rebours, des apparitions d'ennemis et l'enregistrement des scores. Fichiers clés : InputManager.h, ActionMap.cpp, CollisionComponent.cpp, ClassicModeLevel.cpp, ChronoModeLevel.cpp.",
        img: "assets/images/AsteroidImage3.svg"
      }
    ],
    codeExamples: [
      {
        title: "01 / Boucle principale",
        file: "Engine.cpp",
        url: "https://github.com/SachaGastinois/Asteroid_SFML/blob/main/Engine.cpp",
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
        url: "https://github.com/SachaGastinois/Asteroid_SFML/blob/main/Level.h",
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
        url: "https://github.com/SachaGastinois/Asteroid_SFML/blob/main/CollisionManager.cpp",
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
        url: "https://github.com/SachaGastinois/Asteroid_SFML"
      },
      {
        name: "Jouer sur itch.io",
        url: "https://sachachaussette.itch.io/asteroid"
      }
    ]
  },
  'roblox-launcher': { title: "Roblox Launcher", tech: "C# · WPF", desc: "Projet étudiant. Présentation technique à venir.", imgs: [], links: [] },
  'graphics-engine': { title: "Moteur Graphique 3D Custom", tech: "C++20 · Vulkan", desc: "Projet personnel en cours de documentation.", imgs: [], links: [] },
  'small-waters': { title: "Small Waters", tech: "C# · Unity", desc: "Projet personnel en développement. Présentation technique à venir.", imgs: [], links: [] },
  'serious-game': { title: "Serious Game", tech: "Unity · C#", desc: "Présentation technique à venir.", imgs: [], links: [] },
  'devquest-rpg': { title: "DevQuest RPG", tech: "C# · WPF", desc: "Présentation technique à venir.", imgs: [], links: [] },
  'despair': {
    title: "Despair",
    tech: "C++ · Unreal Engine 5",
    videoUrl: "assets/videos/Despair-trailer.mp4",
    desc: "Présentation technique à venir.",
    imgs: [
      
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
    imgs: [
      
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

  // 1. Structure de la vidéo avec muted + autoplay
  let videoHTML = '';
  if (data.videoUrl) {
    if (data.videoUrl.endsWith('.mp4') || data.videoUrl.endsWith('.webm')) {
      videoHTML = `
        <div class="w-full h-full object-cover">
          <video
            id="modalVideo"
            controls
            loop
            muted
            playsinline
            class="w-full h-full object-contain bg-transparent"
          >
            <source src="${data.videoUrl}" type="video/mp4">
          </video>
        </div>
      `;
    } else {
      videoHTML = `
        <div class="w-full h-64 md:h-96 mb-6 rounded border border-studio-border overflow-hidden bg-transparent shadow-lg">
          <iframe title="Vidéo de présentation : ${data.title}" loading="lazy" src="${data.videoUrl}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
    }
  }

  // 2. Injection HTML dans le conteneur
  modalContent.innerHTML = `
    ${videoHTML}
    <span class="text-xs font-mono text-studio-accent uppercase tracking-widest">${data.tech}</span>

    <h3 class="text-2xl font-bold uppercase text-white mt-1 mb-4">${data.title}</h3>

    <p class="text-sm text-studio-muted font-light leading-relaxed mb-6">${data.desc}</p>

    <div class="">
     <div class="space-y-12 my-8">
     ${data.imgs.map((l, index) => `
      <h4 class="text-xs font-mono uppercase text-white tracking-wider mb-3">
        ${l.title}
      </h4>
      <div class="flex flex-col md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} items-center gap-8">
          <div class="w-full md:w-2/5">
            <p class="text-sm text-studio-muted font-light leading-relaxed">
              ${l.desc}
            </p>
            </div>

            <div class="w-full md:w-3/5">
              <img
                src="${l.img}"
                alt="${l.title}"
                loading="lazy"
                decoding="async"
                class="w-full h-auto object-contain rounded-lg"
              />
            </div>

          </div>
        `).join('')}
      </div>
        
    </div>

    ${data.codeExamples?.length ? `
      <section class="mt-12 mb-10" aria-label="Extraits de code du projet">
        <div class="flex items-center gap-3 mb-5">
          <span class="text-studio-accent font-mono text-xs tracking-widest">SOURCE / C++</span>
          <h4 class="text-lg font-bold text-white uppercase">Dans le code</h4>
        </div>
        <div class="grid grid-cols-1 gap-5">
          ${data.codeExamples.map(example => `
            <article class="rounded-xl border border-studio-border overflow-hidden bg-zinc-950">
              <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-studio-border bg-zinc-900/70">
                <h5 class="text-white font-mono text-sm font-semibold">${example.title}</h5>
                <a href="${example.url}" target="_blank" rel="noopener noreferrer" class="text-xs font-mono text-studio-accent hover:underline focus-visible:underline">Voir ${example.file} ↗</a>
              </div>
              <pre class="overflow-x-auto px-4 py-5 text-xs md:text-sm leading-6 text-zinc-200 font-mono"><code>${escapeHtml(example.code)}</code></pre>
              <p class="border-t border-studio-border px-4 py-3 text-sm text-zinc-400 leading-relaxed">${example.note}</p>
            </article>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <div class="flex items-center gap-4 pt-4 border-t border-studio-border">
      ${data.links.map(l => `
        <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 border border-white text-white text-xs font-mono uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
          <span>${l.name}</span>
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
        </a>
      `).join('')}
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