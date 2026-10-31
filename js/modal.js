const modalData = {
  'asteroid': {
    title: "Asteroid",
    tech: "C++ · SFML",
    videoUrl: "assets/videos/AsteroidDemo.mp4", 
    desc: "Reconstitution moderne en C++ 20 et SFML du jeu d'arcade classique Asteroids (1979), s'appuyant sur une architecture et un moteur 2D sur mesure.",
    responsibilities: [
      "Conception du moteur de jeu custom, gestion du cycle de vie des entités (ActorManager) et séparation de la logique métier.",
      "Création d'une couche d'abstraction des commandes (ActionMap) et d'un système d'animation modulaire.",
      "Prise en charge du rendu 2D, des boucles de jeu, de l'IHM et de la gestion des ressources audio/graphiques.",
      "Structuration des dossiers et versionnage du projet via Git"
    ],
    links: [
      { name: "Code source GitHub", url: "https://github.com" }
    ]
  },
  'unity-mechanics': {
    title: "Unity Placement Systems",
    tech: "Unity · C# · UI Toolkit",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    desc: "Système complet de construction et de placement d'objets sur grille 3D. Prise en charge des contraintes d'alignement, prévisualisation visuelle et persistance des objets.",
    responsibilities: [
      "Création d'un algorithme de snapping sur grille avec détection de collisions.",
      "Interface utilisateur avec UI Toolkit pour la sélection des structures.",
      "Système de sauvegarde/chargement basé sur la sérialisation JSON."
    ],
    links: [
      { name: "Démonstration GitHub", url: "https://github.com" }
    ]
  },
  'cpp-engine': {
    title: "C++ Custom Game Engine",
    tech: "C++20 · OpenGL · GLFW · GLM",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    desc: "Projet d'apprentissage bas niveau visant à concevoir les briques essentielles d'un moteur 3D : boucle de rendu, gestionnaire de ressources et pipeline graphique.",
    responsibilities: [
      "Implémentation d'une boucle principale à delta time fixe/variable.",
      "Abstraction du pipeline de rendu OpenGL avec support des Shaders HLSL/GLSL.",
      "Gestionnaire de mémoire personnalisé pour éviter les allocations dynamiques en boucle."
    ],
    links: [
      { name: "Repository GitHub", url: "https://github.com" }
    ]
  },
  'devquest-rpg': {
    title: "DevQuestRPG",
    tech: "C# · WPF · .NET · Gamification",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    desc: "Application de bureau axée sur la productivité intégrant une boucle de gameplay RPG : gains d'XP, statistiques personnelles, historique et stockage local.",
    responsibilities: [
      "Développement de l'interface graphique XAML / WPF responsive.",
      "Implémentation du pattern MVVM pour découpler la logique métrique du UI.",
      "Persistance des données utilisateurs avec chiffrement local basique."
    ],
    links: [
      { name: "Accéder au projet", url: "https://github.com" }
    ]
  }
};

function openProjectModal(key) {
  const data = modalData[key];
  if (!data) return;

  const modalContent = document.getElementById('modalContent');
  
  // 1. Structure de la vidéo avec muted + autoplay
  let videoHTML = '';
  if (data.videoUrl) {
    if (data.videoUrl.endsWith('.mp4') || data.videoUrl.endsWith('.webm')) {
      videoHTML = `
        <div class="w-full h-64 md:h-96 mb-6 rounded border border-studio-border overflow-hidden bg-black shadow-lg">
          <video id="modalVideo" controls autoplay loop muted playsinline class="w-full h-full object-contain">
            <source src="${data.videoUrl}" type="video/mp4">
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
      `;
    } else {
      videoHTML = `
        <div class="w-full h-64 md:h-96 mb-6 rounded border border-studio-border overflow-hidden bg-black shadow-lg">
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

    <h4 class="text-xs font-mono uppercase text-white tracking-wider mb-3">Tâches & Responsabilités :</h4>
    <ul class="space-y-2 text-xs font-mono text-studio-muted mb-8">
      ${data.responsibilities.map(r => `<li class="flex items-start gap-2"><span class="text-studio-accent font-bold">•</span><span>${r}</span></li>`).join('')}
    </ul>

    <div class="flex items-center gap-4 pt-4 border-t border-studio-border">
      ${data.links.map(l => `
        <a href="${l.url}" target="_blank" class="px-4 py-2 border border-white text-white text-xs font-mono uppercase hover:bg-white hover:text-black transition-all flex items-center gap-2 transform hover:-translate-y-0.5">
          <span>${l.name}</span>
          <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
        </a>
      `).join('')}
    </div>
  `;

  if (window.lucide) lucide.createIcons();
  document.getElementById('projectModal').classList.remove('hidden');

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
  // Stop video playback when closing modal
  document.getElementById('modalContent').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeModalBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectKey = card.getAttribute('data-project');
      openProjectModal(projectKey);
    });
  });
});