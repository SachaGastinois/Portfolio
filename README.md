# Portfolio — Sacha Gastinois

Portfolio statique en HTML, CSS et JavaScript, compatible GitHub Pages. Aucun framework, compilation ou CDN requis.

## Lancer en local

Ouvrir le dossier avec VS Code, puis **Open with Live Server** sur `index.html` (extension Live Server). Autre option si Node.js est installé :

```sh
npx serve .
```

Utiliser l’adresse HTTP indiquée. Un double-clic sur `index.html` ne permet pas de charger le JSON avec `fetch`.

## Modifier le contenu

Tout le contenu éditorial se trouve dans **`data/portfolio.json`** :

| Champ | Contenu |
| --- | --- |
| `site` | Nom, titre, e-mail, CV, liens, langues et thème par défaut, accents sombre/clair |
| `copy` | Textes de l’interface, français et anglais |
| `projects` | Projets publiés, tags, vidéos, captures, liens et sections techniques |
| `drafts` | Anciennes entrées incomplètes conservées hors affichage |
| `experience` | Formation et parcours |
| `skills` | Langages, moteurs et bibliothèques |
| `filters` | Catégories de filtrage |

Un texte traduit utilise `{ "fr": "Texte français", "en": "English text" }`. Un texte commun utilise une simple chaîne. Remplir les deux langues pour garder le portfolio intégralement bilingue.

### Ajouter un projet

Copier un objet de `projects`, puis lui donner un `id` unique. Les champs :

- `title`, `category` (ID d’un filtre), `tags`, `kind`, `summary`, `description`.
- `featured: true` : carte avec aperçu et fiche détaillée. `false` : entrée dans la liste des autres projets.
- `image` : chemin d’une capture, par exemple `assets/images/previews/mon-projet.jpg`.
- `video` : chemin MP4/WebM facultatif. `previewVideo` : extrait léger facultatif utilisé au survol. Sans cet extrait, `previewStart` choisit le début en secondes dans la vidéo complète (10 secondes en boucle). La vidéo complète reste disponible dans la fiche.
- `links` : liste d’objets `{ "label": "GitHub", "url": "https://..." }`.
- `sections` : liste d’objets `{ "title": {"fr":"...","en":"..."}, "text": {"fr":"...","en":"..."}, "image": "assets/images/schema.svg" }` ; l’image est facultative.
- `published: false` : masque un projet sans le supprimer.

Le premier projet mis en avant occupe une carte plus large. `site.featuredProject` choisit l’ID du projet présenté dans l’introduction. Ses légendes traduites se trouvent dans `copy.featuredLabel` et `copy.featuredNote`.

Les images d’aperçu incluses proviennent des vidéos originales. Pour en changer : remplacer les JPEG, ou modifier `image` dans le JSON. Garder des fichiers légers, idéalement 1280 × 720. Les vidéos d’aperçu ne sont chargées qu’au survol ou au clic ; le mode de réduction des animations bloque la lecture automatique au survol.

Les projets moins documentés restent dans la liste secondaire. Le projet étudiant sans titre est conservé dans `drafts`. Le nom « Small Waters » est celui présent sur la branche `main` d’origine.

## Thèmes et langues

Boutons FR/EN et clair/sombre dans l’en-tête. Les choix sont mémorisés sur l’appareil. Paramètres initiaux : `site.defaultLanguage` (`fr` ou `en`), `site.defaultTheme` (`dark` ou `light`). `site.accent` et `site.accentLight` permettent de personnaliser les accents ; préserver un contraste lisible avec les boutons.

## Contact

Le formulaire utilise le point de terminaison Formspree existant (`site.formEndpoint`). Aucun secret côté client. La validation locale ne transmet pas de message réel. L’adresse e-mail reste cliquable si le formulaire est indisponible.

## Publier avec GitHub Pages

Conserver le site à la racine et utiliser la branche choisie dans **Settings → Pages → Deploy from a branch**, dossier `/ (root)`. Tous les chemins sont relatifs pour fonctionner sous `/Portfolio/`. Pas de commande de build.

## Vérification

```sh
node --check js/main.js
python3 -m json.tool data/portfolio.json > /dev/null
```

Vérifier en navigateur : filtres, FR/EN, thèmes, menu mobile, aperçus (survol et bouton), fermeture des fiches avec Échap et retour du focus. Ne pas envoyer le formulaire pendant un simple test.
