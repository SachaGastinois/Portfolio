const modalData = {
  'asteroid': {
    title: "Asteroids — Moteur 2D Custom",
    tech: "C++20 · SFML · Game Engine",
    videoUrl: "assets/videos/AsteroidDemo.mp4",
    desc: "Développement d'un jeu d'arcade en C++20 avec SFM 3.0.0, reposant sur un moteur 2D personnalisé. Le projet met l'accent sur la conception de systèmes de gameplay modulaires, la gestion des entités et l'architecture logicielle.",
    imgs: [
      {
        title: "01 Architecture Général",
        desc: "Le moteur 2D, développé en C++20 avec SFML, repose sur une architecture modulaire permettant de séparer les différentes responsabilités techniques. Chaque système, comme la gestion des acteurs, des collisions, des entrées utilisateur, de la caméra ou de l'audio, possède un rôle spécifique. Cette organisation facilite la maintenance, l'évolution du moteur et la réutilisation des fonctionnalités entre les différents modes de jeu.",
        img: "assets/images/AsteroidImage1.svg"
      },
      {
        title: "02 Actor et Components",
        desc: "Le système Actor/Component permet de construire des entités à partir de composants spécialisés et réutilisables. Chaque acteur peut disposer de fonctionnalités indépendantes, telles que le déplacement, les collisions, le tir ou la gestion des points de vie. Cette approche combine héritage et composition afin de limiter les dépendances entre les systèmes, de favoriser la réutilisation du code et de simplifier l'ajout de nouveaux comportements.",
        img: "assets/images/AsteroidImage2.svg"
      },
      {
        title: "03 Gameplay et Intéraction",
        desc: "Les mécaniques de gameplay reposent sur la collaboration de plusieurs systèmes indépendants. Les entrées utilisateur sont traduites en actions permettant de contrôler le joueur, tandis que des composants spécialisés gèrent les déplacements et les tirs. Le système de collisions détecte les interactions entre les entités et permet de déclencher les comportements appropriés. Cette séparation entre logique de gameplay et fonctionnalités techniques favorise une architecture flexible, maintenable et évolutive.",
        img: "assets/images/AsteroidImage3.svg"
      }
    ],

    links: [
      {
        name: "Repository Github",
        url: "https://github.com/SachaGastinois/Asteroid_SFML"
      },
      {
        name: "Itch.io",
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
            autoplay
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
          <iframe src="${data.videoUrl}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
                class="w-full h-auto object-contain rounded-lg"
              />
            </div>

          </div>
        `).join('')}
      </div>
        
    </div>

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
  if (videoElement) {
    videoElement.play().catch(error => {
      console.log("Lecture automatique bloquée par le navigateur :", error);
    });
  }
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  lastModalTrigger?.focus();
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