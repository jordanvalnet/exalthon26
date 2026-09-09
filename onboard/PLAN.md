# Onboard : plan de construction

Entrée : un repo GitHub et un profil (dev, qa, cto, ceo, investisseur, enfant).
Sortie : un dossier documentaire réutilisable (`onboard/cache/<owner>__<repo>/`), un deck de 6 à 9 pages adapté au profil,
et un guide qui répond aux questions en citant ses sources.

Lire dans l'ordre : `WORKFLOW.md` (la chaîne d'agents, IN, OUT, validations), `SCHEMA.md` (le contrat des fichiers),
`agents/` (le prompt de chaque étape), `profiles/` (ce que chaque public attend).
Les skills Claude Code (`.claude/skills/`) ne font que pointer sur `agents/`, pour que Copilot et Codex lisent la même spec.

## Morceaux

| # | Morceau | Fichiers | Fini quand | Qui |
|---|---|---|---|---|
| M0 | Contrat et validations | `WORKFLOW.md`, `SCHEMA.md`, `src/facts.ts`, `src/validate.ts`, `src/merge.ts`, `cache/example/` | `validate facts` et `validate narrative` passent sur `cache/example` | Jordan |
| M1 | Profils | `profiles/<profil>.json` (6 fichiers JSON : description, éléments priorisés avec leurs facts et sources, ton, deck) | les clés `facts` et `sources` existent dans `SCHEMA.md`, chaque question est une vraie question du public visé, l'ordre est l'ordre de priorité | Rado (radomd92) |
| M2 | Collecte, 5 sous-agents parallèles | `agents/1-collect.md` (coordination), `1a-meta`, `1b-history`, `1c-docs`, `1d-code`, `1e-roadmap`, run réel sur le repo de démo | `bun run merge` passe pour dev, puis pour les autres profils, en moins de 3 min | Princy (PrAndrian) |
| M3 | Rédacteur | `agents/2-write.md`, run réel | `validate narrative` passe, le texte est dans le ton du profil | à attribuer |
| M4 | Rendu final | `src/render/`, `agents/3-render.md`, export PDF (impression du HTML) ou PPT | `bun run render onboard/cache/example dev` puis `validate deck` passent, le deck est beau à l'écran, et un PDF ou un PPT en sort | Liivasoa |
| M5 | Guide | `agents/4-ask.md`, run réel | une question absente du cache déclenche un appel github:*, la réponse cite ses sources, faq.md s'allonge | à attribuer |
| M6 | Orchestrateur, CLI | `agents/0-onboard.md`, `src/cli.ts` | `bun onboard <owner/repo> dev` sort un deck sans intervention | Jordan |
| M7 | Démo | cache pré-calculé pour 3 profils, capture, `LIVRABLE.md` | le pitch tient en 1 min, le run live en 2 | Jordan + à attribuer |

À attribuer : M3 (rédacteur), M5 (guide Q/A) et l'aide sur M7, parmi Sacane et Yacine-Alicherif.

## L'heure qui vient

- 0 à 15 min : tout le monde lit `WORKFLOW.md` et `SCHEMA.md`. On choisit le repo de démo dans `CIBLES.md`
  (critère onboarding : lisible, taille moyenne, README, releases, CI, plusieurs contributeurs).
- 15 à 45 min : chacun son morceau. Entrée de secours pour M3, M4, M5 : `cache/example/`, il ne dépend de personne.
- 45 à 60 min : premier run bout en bout sur le repo de démo, profil dev. Ce qui casse se dit sur le canal d'équipe.

## Règles de travail

- Une branche par personne `feat/<login>`, PR petites vers `main`, on ne touche qu'à ses fichiers.
- Toute modification de `SCHEMA.md` ou `WORKFLOW.md` s'annonce sur le canal d'équipe avant d'être poussée.
- Le cache est versionné : c'est un livrable, pas un fichier temporaire.
- Un agent n'invente jamais un chiffre. Une donnée absente reste absente et se dit.
- Pas de tests : le temps va au produit. `bun run check` (typecheck) avant de pousser.
