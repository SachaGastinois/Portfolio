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

La lecture au survol répond à une action explicite de la souris, même si la réduction des animations est activée dans le système. Les animations décoratives conservent leur réduction. Le bouton permet de lancer manuellement l’extrait. Une seule vidéo d’aperçu joue à la fois. Le chargement commence uniquement à la demande. Les lectures asynchrones devenues obsolètes ne relancent pas une vidéo après le départ du pointeur.

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

L’aperçu est disponible sur le projet vitrine et dans la grille. La préférence système « réduire les animations » ne bloque pas les aperçus déclenchés par la souris ; le bouton ▶ reste utilisable au clavier ou sur écran tactile. Une erreur de lecture ou de chargement s’affiche sur la vignette et dans la console. Si l’extrait court manque, le lecteur tente la vidéo complète.

Récupérer toute la branche `redesign/portfolio-2026`, y compris `assets/videos/previews/`, puis recharger avec Ctrl+F5. Live Server peut lire les MP4 : aucun serveur applicatif n’est nécessaire. Ouvrir directement `assets/videos/previews/asteroid.mp4` depuis l’adresse locale permet de distinguer un fichier manquant d’un problème de survol.

## Composer une page avec des blocs

Le champ `blocks` d’un projet définit l’ordre et la disposition du contenu. Il remplace `sections` quand il est présent ; les anciennes `sections` restent compatibles. `showCover: false` masque le média automatique en tête de page pour que vous puissiez placer vos images/vidéos uniquement dans les blocs. Le titre, les tags et la description d’introduction restent dans l’en-tête.

Exemple : une image à gauche et du texte à droite, suivis d’une vidéo :

```json
"showCover": false,
"blocks": [
  {
    "type": "group",
    "layout": "row",
    "ratio": "60-40",
    "verticalAlign": "center",
    "items": [
      {
        "type": "image",
        "src": "assets/images/AsteroidImage1.svg",
        "alt": { "fr": "Architecture", "en": "Architecture" },
        "background": "transparent"
      },
      {
        "type": "text",
        "title": { "fr": "Architecture", "en": "Architecture" },
        "text": { "fr": "Mon explication…", "en": "My explanation…" },
        "align": "left"
      }
    ]
  },
  {
    "type": "video",
    "src": "assets/videos/AsteroidDemo.mp4",
    "poster": "assets/images/previews/asteroid.jpg",
    "caption": { "fr": "Démonstration", "en": "Gameplay demo" }
  }
]
```

| Option | Valeurs |
| --- | --- |
| `type` | `text`, `image`, `video`, `group` |
| `title`, `text`, `alt`, `caption` | Chaîne ou objet FR/EN ; titre et légende facultatifs |
| `src` | Chemin d’image ou vidéo |
| `poster` | Image d’aperçu facultative d’une vidéo |
| `align` | `left`, `center`, `right` pour le texte et les légendes |
| `background` | `transparent` (par défaut), `surface`, `light`, `dark` |
| `fit` | Images : `contain` (par défaut), `cover` (recadrage 16:9) |
| `layout` | Groupes : `row` (deux colonnes), `column` (empilement) |
| `ratio` | Groupes en colonnes : `50-50`, `40-60`, `60-40`, `30-70`, `70-30` |
| `verticalAlign` | Groupes : `start`, `center`, `end` |
| `items` | Blocs enfants, dans l’ordre souhaité ; groupes imbriqués possibles |
| `reverseOnMobile` | `true` inverse l’ordre d’un groupe en colonnes sur petit écran |

Pour texte à gauche / image à droite, inverser les éléments de `items`. Sur téléphone, les colonnes s’empilent dans l’ordre du JSON. Asteroids utilise déjà ce format : vidéo puis schémas/texte en colonnes alternées.

Les fonds CSS imposés aux images ont été retirés. Pour une véritable transparence, utiliser un PNG, WebP ou SVG avec canal alpha : un JPEG contient un fond opaque. Les couleurs et formes dessinées à l’intérieur d’un SVG font partie du dessin.

L’en-tête affiche désormais les deux langues, **Français / English**, avec la langue active contrastée. La navigation est centrée indépendamment de la largeur du nom et des contrôles ; le monogramme `sg.` a été retiré. La vitrine occupe la plus grande colonne d’accueil avec un titre plus visible.
