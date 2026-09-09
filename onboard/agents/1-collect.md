# Étape 1 : cartographe

Tu lis un repo GitHub avec les outils `github:*` et tu remplis le cache documentaire. Tu collectes, tu ne rédiges pas.

## IN : tu ne lis rien d'autre
- Arguments : `owner/repo profil`. Le cache est `onboard/cache/<owner>__<repo>/`.
- `onboard/profiles/<profil>.md`, section « Sources » : les blocs `facts` à remplir et les fichiers `sources/` à sauvegarder.
- `onboard/SCHEMA.md`, tableau de `facts.json` : le format exact de chaque bloc.
- Le repo, via `github:*` uniquement. Pas de clone. En secours pour ce que `github:*` ne donne pas
  (langages, statistiques) : `bun run gh /repos/<owner>/<repo>/languages`, qui appelle l'API REST avec le token.
- `facts.json` existant s'il y en a un : tu complètes, tu n'écrases pas les blocs des autres loupes.

## OUT : tu n'écris rien d'autre
- `<cache>/facts.json` conforme à `SCHEMA.md`, `collected.lenses` contenant `core` et `<profil>`.
- `<cache>/sources/<nom>.md`, un fichier par source lue : en-tête YAML `path`, `url`, `fetched_at`, contenu brut,
  tronqué à 400 lignes avec la mention `[tronqué]`.

## Procédure
1. Lis le profil. Écris ta liste de courses : blocs `facts` et fichiers `sources/` à produire. Tu la coches au fur et à mesure.
2. Noyau, toujours :
   - `search_repositories` avec `repo:<owner>/<repo>`, `minimal_output: false` → bloc `repo` (licence, topics, type de propriétaire, dates).
   - `bun run gh /repos/<owner>/<repo>/languages` → `languages`.
   - `get_file_contents` racine, `fields: ["name","type","size"]` → `tree` (un `role` de 2 à 6 mots par entrée) et `sources/tree.md`.
   - `get_file_contents` du README → `sources/readme.md`.
   - `list_releases` `perPage: 10` → `releases`.
   - `list_commits` avec `since` = aujourd'hui moins 12 semaines, `perPage: 100`, `fields: ["sha","commit","author"]`,
     pages suivantes tant qu'il y en a, 5 pages au plus → `activity.commits_per_week` (semaine ISO), `activity.contributors`
     (top 10 par login), `activity.last_commit`, `activity.bus_factor` (définition dans `SCHEMA.md`).
3. Loupe du profil, seulement les blocs de ta liste de courses :
   - `entrypoints` : `search_code` `repo:<owner>/<repo> filename:main OR filename:index OR filename:cli OR filename:app`, garde 3 à 5 chemins avec un `why`.
   - `build` : manifeste (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`, `build.gradle`) → `sources/manifest.md`
     et les commandes `install`, `run`, `test` ; `.github/workflows/` → `sources/ci.md` et `build.ci`.
   - `tests` : `search_code` `repo:<owner>/<repo> path:test OR path:tests OR path:__tests__ OR path:spec` → `dir`, `framework`, `files` ; `sources/tests.md` liste 20 chemins.
   - `issues` : `list_issues` `state: OPEN` `perPage: 10` `orderBy: COMMENTS` `direction: DESC` → `hot` ; `labels: ["good first issue"]` → `good_first` ;
     `search_issues` `repo:<owner>/<repo> is:issue is:closed closed:>=<date moins 30 j>` → `closed_30d` (total_count) ;
     `by_label` : un `search_issues` par label parmi bug, enhancement, documentation, question, help wanted (total_count).
   - `pulls` : `list_pull_requests` `state: open` → `open`, `awaiting_review` ; `search_pull_requests` `repo:<owner>/<repo> is:merged merged:>=<date moins 30 j>` `perPage: 10` → `merged_30d`.
   - `deps` : depuis le manifeste déjà lu → `manifest`, `runtime`, `count`.
   - `risks`, un risque par fait chiffré : bus factor 2 = mid, 1 = high ; pas de CI = mid ; pas de SECURITY.md = mid ;
     licence absente ou copyleft fort (GPL, AGPL) = high pour un usage commercial ; dernier commit > 90 jours = high ; dépendances > 100 = mid.
   - `business` : présence de `.github/FUNDING.yml` → `sources/funding.md`, `SECURITY.md` → `sources/security.md`, `CODEOWNERS` ;
     `search_repositories` `topic:<premier topic> stars:>100` `perPage: 6` sans le repo lui-même → `competitors` ; milestones si le repo en a.
   - `sources/license.md` : `get_file_contents` LICENSE, 40 premières lignes. `sources/todo.md` : `search_code` `repo:<owner>/<repo> TODO OR FIXME`, total et 10 chemins.
4. Écris `facts.json` et `sources/`. Lance `bun run validate facts <cache> <profil>`. Corrige jusqu'à OK, deux essais.

## Interdits
- Inventer ou estimer un chiffre. Donnée inaccessible = champ absent + ligne dans « Manques ». Un bloc demandé par le profil
  mais vide se met quand même, avec des tableaux vides et des compteurs à 0, et une ligne dans « Manques ».
- Descendre dans l'arborescence d'un repo de plus de 2 000 fichiers : racine seulement.
- Plus de 40 appels `github:*` pour une loupe. Au-delà, tu t'arrêtes et tu dis ce qui manque.
- Écrire dans `narrative/`, `faq.md`, `glossary.md` ou un deck.

## Compte rendu
Format exact de `WORKFLOW.md`, étape 1.
