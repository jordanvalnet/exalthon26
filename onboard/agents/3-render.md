# Étape 3 : metteur en page

Tu produis le deck. Le rendu est du code (`src/render/`), pas de la prose : tu lances la commande, tu vérifies,
tu corriges le code du rendu si c'est lui qui a tort.

## IN : tu ne lis rien d'autre
- `<cache>/facts.json`, `<cache>/narrative/<profil>.md`.
- `onboard/profiles/<profil>.json`, champs `deck` (`pages`, `finale`) et `design` (`eyebrow`, `kpis`, `brief`).
- Prérequis : `bun run validate narrative <cache> <profil>` passe. Sinon : « étape 2 à refaire » et les erreurs.

## OUT : tu n'écris rien d'autre
- `<cache>/deck-<profil>.html` : un seul fichier, aucune ressource externe, SVG inline, lisible en clair et en sombre,
  `@media print` avec une page par `<section>`.
- Structure : une `<section>` couverture (sur-titre `design.eyebrow`, titre H1 du narratif, tuiles `design.kpis` prises dans
  `facts.json`), une `<section>` par H2 du narratif avec son « à retenir » en exergue et son graphique s'il y a une directive,
  une `<section>` finale (la section `deck.finale` du narratif, sinon les faits), et une `<section>` Sources seulement si le
  narratif cite des URL publiques `[gh:…]` : les citations internes `[facts:…]` `[src:…]` n'apparaissent jamais dans le deck
  (profil enfant : aucune note du tout). La date du relevé est sur la couverture et en pied de chaque page.
- L'identité visuelle est celle du profil, `src/render/theme.ts` : un deck ceo ne ressemble pas à un deck dev. Ne pas l'aplatir.
- `<cache>/deck-<profil>.pdf` par `bun run pdf <cache> <profil>`, mêmes pages que le HTML. Le HTML reste la sortie validée.
- Si tu as dû corriger `src/render/` : le code corrigé.

## Procédure
1. `bun run render <cache> <profil>`.
2. `bun run validate deck <cache> <profil>`.
3. `bun run pdf <cache> <profil>`, puis ouvre le HTML et vérifie à l'œil : toutes les sections, tous les graphiques, aucun `[facts:…]` brut,
   aucune référence au cache interne, la date du relevé, les tuiles de couverture, l'exergue de chaque page, la finale, le nombre de pages du profil.
4. Si le narratif est en cause (section manquante, titre différent) : tu le signales dans « Manques », tu ne le réécris pas.
5. Si le code de rendu est en cause : tu corriges `src/render/`, `bun run check`, et tu relances au 1.

## Interdits
- Écrire du HTML à la main dans le cache : tout passe par `src/render/`.
- Modifier `narrative/`, `facts.json`, `sources/`.
- Une ressource externe : police, script, image distante.

## Compte rendu
Format exact de `WORKFLOW.md`, étape 3.
