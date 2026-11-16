# Portfolio — Sacha Gastinois

Portfolio de programmation gameplay : projets C++, C#, Unreal Engine, Unity et moteurs maison. Le site est écrit en HTML, CSS et JavaScript, avec du contenu en français et en anglais. Il fonctionne sur un hébergement statique, notamment GitHub Pages, sans compilation ni dépendance à installer pour le site.

## Démarrage local

Servir le dossier avec un serveur HTTP. Dans VS Code, utiliser **Live Server**, ou lancer depuis la racine avec Node.js :

```sh
npx serve .
```

Ouvrir l’adresse indiquée dans le terminal. Un double-clic sur `index.html` ne suffit pas : le navigateur doit pouvoir charger `data/portfolio.json` avec `fetch`.

## Structure

```text
index.html                 Accueil, projets, présentation, parcours et contact
project.html               Page commune aux fiches projets
data/portfolio.json        Contenu, traductions et configuration
css/style.css              Styles, thèmes et mise en page responsive
js/main.js                 Rendu du contenu, filtres, langues et interactions
js/previews.js             Lecture et arrêt des aperçus vidéo
assets/favicon.svg         Icône SG du portfolio, au format vectoriel
assets/icons.svg           Symboles des services externes
assets/images/             Illustrations et schémas
assets/images/previews/    Vignettes des projets
assets/videos/             Démonstrations et éventuels extraits
assets/files/              CV et documents
```

## Fonctionnalités

- Grille de projets filtrable par moteur, technologie ou type de projet.
- Projet mis en avant sur l’accueil.
- Fiches accessibles directement avec `project.html?id=chaussette-engine`.
- Contenus FR/EN et thèmes clair/sombre, avec mémorisation locale des préférences.
- Aperçus vidéo muets au survol ou via un bouton utilisable au clavier et sur mobile.
- Blocs de textes, images, vidéos et groupes en colonnes pour les présentations.
- Formulaire Formspree, adresse e-mail directe et liens vers les réseaux.

## Modifier le contenu

Le fichier `data/portfolio.json` regroupe :

| Champ | Rôle |
| --- | --- |
| `site` | Nom, titre, contact, CV, réseaux, formulaire et couleurs d’accent |
| `site.featuredProject` | Identifiant du projet mis en avant sur l’accueil |
| `copy` | Textes de l’interface en FR/EN |
| `projects` | Fiches et médias des projets |
| `filters` | Filtres proposés dans la grille |
| `skills`, `experience` | Compétences et parcours |

Un texte traduit utilise `{ "fr": "Texte français", "en": "English text" }`. Une chaîne simple convient aux noms communs aux deux langues. Les champs de contenu textuel prennent en charge `**le gras**` ; les descriptions et textes de blocs conservent les retours à la ligne.

Les couleurs d’accent se règlent avec `site.accent` et `site.accentLight`. Les autres couleurs et les règles de mise en page se trouvent dans le CSS.

## Ajouter ou mettre à jour un projet

Dupliquer une entrée de `projects` puis choisir un `id` unique. L’identifiant sert aux liens directs et à `site.featuredProject` : le modifier implique de mettre à jour les liens qui l’utilisent.

| Champ | Utilisation |
| --- | --- |
| `title`, `kind` | Nom et contexte du projet |
| `summary`, `description` | Résumé de carte et introduction de la fiche |
| `tags` | Technologies affichées |
| `filters` | Identifiants des filtres associés ; `category` est également accepté |
| `image` | Image fixe de la carte et poster de la vidéo de couverture |
| `video` | Vidéo de démonstration |
| `previewVideo` | Extrait facultatif pour la carte ; sinon, utilisation de `video` |
| `showCover` | `false` masque le média automatique en tête de fiche |
| `blocks` | Contenu structuré de la fiche |
| `links` | Liens externes sous la forme `{ "label": "GitHub", "url": "https://…" }` |
| `contentInProgress` | `true` signale une présentation en préparation |
| `published` | `false` masque le projet de la grille et des fiches |

Sans image, un visuel de remplacement est affiché. Pour une présentation en préparation sans image, la carte affiche un indicateur dédié. Si le projet vitrine est invalide ou masqué, le premier projet publié est utilisé.

### Composer les fiches

`blocks` remplace l’ancien champ `sections` lorsqu’il est présent. Les types disponibles sont :

- `text` : `title`, `text`, `align`.
- `image` : `src`, `alt`, `caption`, `fit` (`contain` ou `cover`). Un clic ouvre l’image en grand.
- `video` : `src`, `poster` facultatif et `caption`.
- `group` : `items`, `layout` (`row` ou `column`), `ratio`, `verticalAlign` et `reverseOnMobile`.

Les ratios disponibles sont `50-50`, `40-60`, `60-40`, `30-70` et `70-30`. Sur petit écran, les colonnes s’empilent ; `reverseOnMobile: true` inverse leur ordre. `background` accepte `transparent`, `surface`, `light` ou `dark`. Les titres commençant par deux chiffres et une espace, comme `01 Architecture`, utilisent la présentation numérotée.

Asteroids et Chaussette Engine fournissent des exemples d’alternance texte/schéma. Chaussette Engine contient quatre schémas, un bilan technique, une démonstration et une vignette dédiée. Les entrées Musée Fabre, Small Waters, Rootbound et Adhafera sont actuellement signalées en préparation.

## Médias et aperçus vidéo

Conserver les chemins relatifs, avec leur casse exacte pour les hébergements Linux. La vignette se configure dans `image`, indépendamment de la vidéo. Une image PNG, WebP ou SVG peut avoir un fond transparent ; le JPEG est opaque.

Les aperçus sont chargés à la demande. Une seule vidéo d’aperçu joue à la fois ; elle est mise en pause au départ du pointeur, hors écran, lorsque la page est masquée ou lors d’un changement de filtre. Le bouton permet aussi une lecture manuelle. Si un `previewVideo` échoue et qu’une vidéo complète existe, le lecteur tente cette dernière.

Pour réduire le chargement des cartes, un extrait court et muet est préférable à une démonstration complète. Exemple avec une installation FFmpeg disposant de l’encodeur H.264 :

```sh
ffmpeg -ss 20 -i demo.mp4 -t 6 -an -vf "scale=480:-2,fps=18" -c:v libx264 -crf 28 -pix_fmt yuv420p -movflags +faststart preview.mp4
```

Renseigner ensuite son chemin dans `previewVideo`. La vidéo complète reste dans `video`.

## Icône du portfolio

`assets/favicon.svg` contient un monogramme **SG** dessiné en tracés, sans dépendance à une police, sur fond ardoise avec des accents cuivrés. L’icône est référencée par `index.html` et `project.html`. Son format vectoriel permet de la réutiliser à d’autres tailles.

Après modification, un rechargement forcé peut être nécessaire pour actualiser le cache du navigateur. Les deux pages utilisent une version dans l’URL du favicon pour faciliter cette actualisation.

## Vérifications avant publication

Depuis la racine, avec Node.js :

```sh
node --check js/main.js
node --check js/previews.js
node -e "JSON.parse(require('fs').readFileSync('data/portfolio.json', 'utf8')); console.log('JSON valide')"
```

Dans un navigateur, vérifier la grille et les filtres, les fiches avec et sans médias, les versions FR/EN, les deux thèmes, la navigation mobile, les aperçus et le favicon. Vérifier aussi les chemins des images, vidéos et du CV. Il n’est pas nécessaire d’envoyer un véritable message pour vérifier la mise en page du formulaire.

En cas de problème d’aperçu, ouvrir le chemin de la vidéo directement sur le serveur local et consulter la console du navigateur. Vérifier que le fichier existe et que son format est lisible avant de modifier les scripts.

## Publication et contact

Pour GitHub Pages : **Settings → Pages → Deploy from a branch**, sélectionner la branche à publier et le dossier **`/ (root)`**. Publier les deux pages HTML, le CSS, les scripts, le JSON et les médias utilisés. Aucun build n’est requis. Les chemins relatifs permettent un hébergement sous un sous-dossier tel que `/Portfolio/`.

Le formulaire utilise `site.formEndpoint` pour Formspree. L’e-mail, le CV et les réseaux se configurent dans `site`. Aucun secret ni clé privée ne doit être ajouté aux fichiers publics du site.
