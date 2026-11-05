# Portfolio — Sacha Gastinois

Site statique HTML/CSS/JavaScript, compatible GitHub Pages sans compilation ni CDN.

## Lancer

Avec VS Code, ouvrir `index.html` avec l’extension **Live Server**. Avec Node.js : `npx serve .`. Utiliser l’adresse HTTP indiquée ; le double-clic sur un fichier HTML ne permet pas de charger le JSON.

## Choisir le projet vitrine

Dans `data/portfolio.json`, changer **`site.featuredProject`** pour l’`id` du projet voulu :

```json
"featuredProject": "despair"
```

L’image, le titre, les technologies, le contexte et le lien de l’encart d’accueil suivent automatiquement ce projet. Tout projet publié peut être choisi, y compris un projet sans image (un visuel typographique prend le relais). Si l’ID est invalide ou masqué, le premier projet publié est utilisé.

## Contenu et langues

Tout le contenu se configure dans `data/portfolio.json` :

| Champ | Contenu |
| --- | --- |
| `site` | Nom, titre, projet vitrine, e-mail, CV, réseaux, formulaire, thèmes et couleurs |
| `copy` | Interface FR/EN |
| `projects` | Ensemble des projets de la grille, finis ou en préparation |
| `filters` | Boutons et identifiants des filtres |
| `experience`, `skills` | Parcours et compétences |

Un texte traduit utilise `{ "fr": "Texte", "en": "Text" }`. Un nom commun aux deux langues peut rester une chaîne simple. Le thème et la langue choisis par le visiteur sont mémorisés localement.

## Ajouter ou compléter un projet

Copier un objet de `projects` avec un `id` unique. Les champs :

- `title`, `kind`, `summary`, `description` : textes, éventuellement bilingues.
- `tags` : technologies affichées. `filters` : liste des identifiants de filtres auxquels le projet appartient. Par exemple `["unity", "csharp", "serious"]`. `category` reste accepté pour la compatibilité.
- `image` : capture facultative. Sans image, la carte garde sa place avec un visuel typographique.
- `video` : vidéo complète, lue avec les contrôles dans la page du projet.
- `previewVideo` : petit extrait muet pour le survol. Facultatif ; sans extrait, le survol utilise le début de `video`.
- `sections` : liste de `{ "title": ..., "text": ..., "image": ... }` pour détailler le travail. L’image est facultative. Les retours à la ligne sont conservés.
- `links` : liste de `{ "label": "GitHub", "url": "https://..." }`.
- `contentInProgress: true` : affiche une note de contenu en préparation dans la page, sans retirer le projet de la grille. Retirer ce drapeau une fois la présentation terminée.
- `published: false` : masque explicitement un projet. Aucun autre statut n’exclut les projets de la grille.

Les filtres historiques sont rétablis : Unreal Engine, Unity, Vulkan API, SFML API, C++, C#, WPF, Serious Game et Game Engine, plus Tous. Un projet peut appartenir à plusieurs filtres ; le clic affiche les projets correspondant au filtre sélectionné.

L’ancienne entrée Unity sans nom figure sous « Projet Unity — Serious Game ». Remplacer ce titre et son contenu quand ils seront prêts. « Small Waters » reprend le nom de la branche `main` d’origine et reste modifiable.

## Pages des projets

Chaque projet possède son adresse : **`project.html?id=asteroid`**, `project.html?id=despair`, etc. Le document commun charge le contenu correspondant depuis le JSON : aucune page à dupliquer pour ajouter un projet. Les liens directs, le rechargement, précédent/suivant du navigateur et l’ouverture dans un nouvel onglet fonctionnent avec GitHub Pages. Les pages conservent FR/EN, le thème, les liens de retour et un lien vers le projet suivant. Un ID inconnu affiche « Projet introuvable ».

## Aperçus vidéo

`js/previews.js` gère le survol, le bouton mobile/clavier, la pause au départ du pointeur, la pause hors écran et les changements de filtres. Les extraits fournis durent 6 secondes, sont muets, en H.264 / yuv420p et disposent des métadonnées en début de fichier (`faststart`). Ils pèsent environ 60–80 Ko chacun ; les vidéos originales restent inchangées.

La lecture au survol respecte la préférence de réduction des animations. Le bouton permet de lancer manuellement l’extrait. Une seule vidéo d’aperçu joue à la fois. Le chargement commence uniquement à la demande. Les lectures asynchrones devenues obsolètes ne relancent pas une vidéo après le départ du pointeur.

Pour créer un extrait avec FFmpeg :

```sh
ffmpeg -ss 20 -i demo.mp4 -t 6 -an -vf "scale=480:-2,fps=18" -c:v libx264 -b:v 110k -pix_fmt yuv420p -movflags +faststart preview.mp4
```

## Contact et publication

Le formulaire conserve le point de terminaison Formspree d’origine (`site.formEndpoint`). Aucun envoi réel n’est nécessaire pour tester le site. L’adresse e-mail directe reste disponible.

Dans GitHub : **Settings → Pages → Deploy from a branch**, sélectionner la branche et `/ (root)`. Tous les chemins sont relatifs et fonctionnent sous `/Portfolio/`.

## Vérifier

```sh
node --check js/main.js
node --check js/previews.js
python3 -m json.tool data/portfolio.json > /dev/null
```

En navigateur : choix du projet vitrine via le JSON, filtres croisés par technologies, pages de projets avec/sans médias, langue et thème, lecture au survol, pause au départ du pointeur et bouton d’aperçu.

### Si l’aperçu ne démarre pas en local

L’aperçu est disponible sur le projet vitrine et dans la grille. Avec la préférence système « réduire les animations », le survol est désactivé et le bouton ▶ reste utilisable. Une erreur de lecture ou de chargement s’affiche sur la vignette et dans la console. Si l’extrait court manque, le lecteur tente la vidéo complète.

Récupérer toute la branche `redesign/portfolio-2026`, y compris `assets/videos/previews/`, puis recharger avec Ctrl+F5. Live Server peut lire les MP4 : aucun serveur applicatif n’est nécessaire. Ouvrir directement `assets/videos/previews/asteroid.mp4` depuis l’adresse locale permet de distinguer un fichier manquant d’un problème de survol.
