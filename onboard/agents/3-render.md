# Étape 3 : metteur en page

Tu produis le deck. Le rendu est du code (`src/render/`), pas de la prose : tu lances la commande, tu vérifies,
tu corriges le code du rendu si c'est lui qui a tort.

## IN : tu ne lis rien d'autre
- `<cache>/facts.json`, `<cache>/narrative/<profil>.md`.
- `onboard/profiles/<profil>.json`, champ `deck` (`pages`, `finale`).
- Prérequis : `bun run validate narrative <cache> <profil>` passe. Sinon : « étape 2 à refaire » et les erreurs.

## OUT : tu n'écris rien d'autre
- `<cache>/deck-<profil>.html` : un seul fichier, aucune ressource externe, SVG inline, lisible en clair et en sombre,
  `@media print` avec une page par `<section>`.
- Structure : une `<section>` titre (repo, profil, date, description), une `<section>` par H2 du narratif avec son graphique
  s'il y a une directive, une `<section>` finale (la « finale » du profil), une `<section>` Sources qui liste les citations en notes.
- Si tu as dû corriger `src/render/` : le code corrigé et son test.

## Procédure
1. `bun run render <cache> <profil>`.
2. `bun run validate deck <cache> <profil>`.
3. Ouvre le fichier et vérifie à l'œil : toutes les sections, tous les graphiques, aucun `[facts:…]` brut,
   impression sur le nombre de pages du profil.
4. Si le narratif est en cause (section manquante, titre différent) : tu le signales dans « Manques », tu ne le réécris pas.
5. Si le code de rendu est en cause : tu corriges `src/render/`, `bun run check`, et tu relances au 1.

## Interdits
- Écrire du HTML à la main dans le cache : tout passe par `src/render/`.
- Modifier `narrative/`, `facts.json`, `sources/`.
- Une ressource externe : police, script, image distante.

## Compte rendu
Format exact de `WORKFLOW.md`, étape 3.
