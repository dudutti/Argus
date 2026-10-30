# ARGUS // Rich Media Studio (`public/media/`)

Déposez vos vidéos (`.mp4`, `.webm`) et captures haute résolution (`.png`, `.jpg`, `.webp`) dans ce dossier `public/media/`.

## Comment publier un nouveau média sur la Landing Page Scrollytelling

Ouvrez [`src/data/landingContent.ts`](../../src/data/landingContent.ts) :

1. **Pour remplacer ou ajouter une capsule vidéo dans le lecteur Showcase (Acte V) :**
   Ajoutez le chemin public dans `videoSrc` sur n'importe quel objet `mediaReels` :
   ```ts
   {
     id: 'reel-bybit-replay',
     videoSrc: '/media/demo-bybit-replay.mp4', // <-- Votre fichier déposé dans public/media/
     posterSrc: '/media/poster-bybit.jpg',     // <-- Optionnel : miniature HD
     simulationMode: 'bybit_420_ledger',       // Fallback temps réel Canvas 60 FPS automatique si videoSrc est omis
     ...
   }
   ```

2. **Pour ajouter des captures d'écran ou visuels dans la Galerie Lightbox (Acte V) :**
   Ajoutez une entrée dans `visualGallery` avec `imageSrc: '/media/ma-capture-3d.png'`.

3. **Pour publier une nouvelle chronique / étude de cas éditoriale :**
   Ajoutez un objet dans `editorialStories` (support complet FR + EN, temps de lecture, tags, et bouton de lancement direct vers un cas 3D).

