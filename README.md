# Portfolio Gameplay Programmer

## 📁 Structure du projet
- `index.html` : Structure HTML principale.
- `css/style.css` : Styles personnalisés et effets visuels.
- `js/canvas.js` : Animation de fond réactive.
- `js/projects.js` : Filtres dynamiques de la section projets.
- `js/modal.js` : Gestion des fenêtres détaillées de projets.
- `js/main.js` : Interaction globales (Navigation mobile, Formulaire, Presse-papier).


## Développement

Le portfolio est un site statique HTML, CSS et JavaScript, hébergable sur GitHub Pages.

- `js/modal.js` contient les données des études de cas et la navigation des fenêtres.
- `js/main.js` gère notamment le menu mobile et le chargement différé des vidéos d'aperçu.
- `js/canvas.js` désactive l'animation lorsque la page est masquée et respecte `prefers-reduced-motion`.

## Vérifications avant publication

1. Tester chaque carte de projet à la souris et au clavier (Entrée, Espace, Échap, Tab).
2. Vérifier le menu mobile, les filtres et le formulaire de contact.
3. Vérifier que chaque vidéo et image est accessible sur GitHub Pages (attention à la casse).
4. Remplacer les textes provisoires par des contributions techniques vérifiées.
5. Mesurer les performances avec Lighthouse sur mobile et ordinateur.

La compilation locale de Tailwind n'est pas encore configurée ; le CDN actuel reste utilisé pour éviter de casser les classes existantes.
