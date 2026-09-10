---
repo: jordanvalnet/code-dev-intel.ts
profile: dev
generated_at: 2026-09-10T13:33:23Z
---
# code-dev-intel.ts remplace grep pour les agents IA : un serveur MCP TypeScript bien outillé, testé sur trois OS, porté par une seule personne

## Que fait ce projet et pour qui ?
Un paquet npm qui expose un serveur MCP et HTTP auto-hébergé d'intelligence de code TypeScript : définitions, références, implémentations, plan d'un fichier, graphe d'imports, recherche structurelle, recherche texte et détection de doublons, sans que le modèle relise tout le repo [facts:repo.description] [src:readme.md].
Pour qui : les agents IA et assistants d'IDE (Claude Code, VS Code et Copilot, CLI) et les équipes qui veulent garder leur code en local ; côté consommateur, `pnpm add -D code-dev-intel.ts` puis `pnpm exec code-dev-intel ensure --workspaceRoot=. --port=4545` démarre le service seulement s'il ne tourne pas déjà [src:readme.md] [facts:build.install] [facts:build.run].
Outils exposés : `findDefinitions`, `findReferences`, `findImplementations`, `findSymbol`, `findCallers` / `findCallees`, `getSymbolContent`, `getFileOutline`, `dependencyGraph`, `impactedFiles` (résolus par le type-checker), plus `searchStruct` (ast-grep), `searchText` (ripgrep) et `findDuplicates` [src:readme.md] [facts:deps.runtime.0.name] [facts:deps.runtime.1.name].
Protocoles : MCP sur stdio, MCP JSON-RPC sur `POST /mcp`, endpoints HTTP `/tools/*`, santé et découverte sur `/health` et `/tools/describe` [src:readme.md].
Dépôt personnel créé le 2026-03-20, dernier push le 2026-09-06, licence AGPL-3.0 (copyleft, contraignante pour un usage commercial), 0 étoile, 0 fork : un outil d'auteur, pas encore une communauté [facts:repo.owner_type] [facts:repo.created_at] [facts:repo.pushed_at] [facts:repo.license] [facts:risks.0.note] [facts:repo.stars] [facts:repo.forks].
Langages : donnée non relevée ; à vérifier dans https://github.com/jordanvalnet/code-dev-intel.ts. Ce qu'on sait : tout est TypeScript en ESM (`"type": "module"`, `tsconfig.json`, `vitest.config.ts`, `eslint.config.mjs`) [src:manifest.md] [facts:tree.20.role] [facts:tree.21.role].
> Le pitch : l'agent arrête de grep et navigue dans TypeScript avec le type-checker, en local, sous AGPL [src:readme.md] [facts:repo.license].

## Comment le code est-il organisé ?
<!-- chart: tree -->
`services/` porte tout le code : le serveur MCP (`services/code-intel-mcp/`), l'indexeur (`services/indexer/`), la gouvernance (`services/governance/`) et la sécurité (`services/security/`) [facts:tree.18.role] [facts:entrypoints.0.path] [facts:entrypoints.1.path] [facts:entrypoints.3.path] [src:manifest.md].
`__tests__/unit/` : 4 fichiers de tests vitest, un sous-dossier par service (code-intel-mcp, governance, indexer, security) [facts:tests.dir] [facts:tests.files] [facts:tests.framework] [src:tests.md].
`scripts/` (bootstrap, smoke tests, benchmark), `perf/` (benchmarks de performance), `schemas/` (schémas livrés avec le paquet) et `security/` (règles du scan) sont l'outillage autour du produit [facts:tree.16.role] [facts:tree.13.role] [facts:tree.15.role] [facts:tree.17.role].
`docker/` contient `docker-compose.yml` avec les profils `core`, `search-optional` et `zoekt-optional` (`pnpm docker:core:up`) ; `docs/` regroupe `docs/ai/` (backlog et mémoire des agents), `docs/benchmarks/` et `docs/design/` [facts:tree.9.role] [facts:tree.10.role] [src:manifest.md] [src:docs.md] [src:contributing.md].
`tsconfig.build.json` compile vers `dist/` ; le paquet publié ne contient que `dist/`, `schemas/`, `CHANGELOG.md`, `LICENSE` et `README.md`, et `.github/` abrite les quatre workflows Actions [facts:tree.19.role] [src:manifest.md] [facts:tree.1.role].
> Tout le code vit sous services/ ; le reste de la racine sert à le tester, le livrer et le mesurer [facts:tree.18.role] [facts:tree.16.role].

## Par où commencer à lire ?
1. `services/code-intel-mcp/src/server.ts` : le serveur MCP, `main` et `bin` (`code-dev-intel`) du paquet une fois compilé dans `dist/`, lancé par `pnpm mcp:start`, auto-testé par `--self-test` en CI [facts:entrypoints.0.path] [facts:entrypoints.0.why].
2. `services/code-intel-mcp/src/contracts.ts` : les contrats des outils exposés, export public `./contracts` du paquet [facts:entrypoints.2.path] [facts:entrypoints.2.why].
3. `services/code-intel-mcp/src/mcp-handler.ts` et `health-handler.ts` : le texte d'instructions envoyé au client MCP et la description des endpoints `/tools/*` (le routage « symbole → outil, texte → searchText ») [src:todo.md].
4. `services/indexer/src/indexer-runner.ts` : l'indexeur, `pnpm indexer:impacted`, piloté par `scripts/indexer-smoke.mjs` en modes git-diff et impacted [facts:entrypoints.1.path] [facts:entrypoints.1.why].
5. `services/security/opengrep-runner.ts` (`pnpm security:scan`, job security de la CI) puis `scripts/bootstrap.sh`, qui vérifie `docs/ai/*` et crée les dossiers de travail [facts:entrypoints.3.path] [facts:entrypoints.3.why] [facts:entrypoints.4.path] [facts:entrypoints.4.why].
Garde le README ouvert à « Typical agent workflow » (`getFileOutline` → `getSymbolContent` → `findReferences` → `dependencyGraph` → `searchStruct` → `searchText`) : c'est la carte des outils que `server.ts` branche [src:readme.md] [facts:entrypoints.0.path].
> server.ts d'abord, contracts.ts ensuite : tout le reste des services s'y branche [facts:entrypoints.0.path] [facts:entrypoints.2.path].

## Comment builder, tester et lancer ?
Les trois commandes du poste de travail, dans l'ordre [src:manifest.md] [src:ci.md] [facts:build.test] :
```
pnpm install --frozen-lockfile
pnpm ci:quality
pnpm mcp:self-test
```
`pnpm` seulement (npm et yarn interdits) ; `pnpm ci:quality` enchaîne `pnpm lint`, `pnpm type-check` et `pnpm test` (vitest, `__tests__/unit`), les trois gates obligatoires de toute PR ; `pnpm mcp:start` lance le serveur depuis le TypeScript via `node --experimental-strip-types`, `pnpm build` compile vers `dist/` [src:contributing.md] [src:manifest.md] [facts:tests.framework] [facts:tests.dir] [facts:tree.19.role].
Node : `engines` annonce node >=18, mais vitest 5 et `--experimental-strip-types` exigent node 22+ ; la CI `.github/workflows/ci.yml` tourne sur push et pull_request en ubuntu, windows et macos avec node 20, 22 et 24 (lint, type-check, tests, puis release-smoke, indexer-smoke et scan OpenGrep), les autres workflows sont `perf-budget.yml`, `pr-memory-reference.yml` et `security.yml` (déclencheurs non relevés ; à vérifier dans https://github.com/jordanvalnet/code-dev-intel.ts/tree/main/.github/workflows) [facts:risks.4.note] [facts:risks.3.note] [facts:build.ci.0.path] [facts:build.ci.0.triggers.0] [facts:build.ci.0.triggers.1] [facts:build.ci.1.path] [facts:build.ci.2.path] [facts:build.ci.3.path] [src:ci.md].
> pnpm install --frozen-lockfile puis pnpm ci:quality sous Node 24 : la CI en local, avant la première PR [src:ci.md] [src:manifest.md].

## Comment le projet vit-il ?
<!-- chart: commits_per_week -->
12 commits sur les douze semaines relevées, tous de jordanvalnet : bus factor 1, une seule personne porte le projet [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.bus_factor] [facts:risks.2.note].
Un rythme par rafales : 11 commits la semaine 2026-W36, 0 les semaines précédentes du relevé, dernier commit le 2026-09-06 [facts:activity.commits_per_week.10.week] [facts:activity.commits_per_week.10.count] [facts:activity.commits_per_week.9.count] [facts:activity.last_commit].
Cette rafale correspond à la PR #3 « ci: three-OS quality matrix, multi-OS release smoke, per-OS perf budget (T-021) », fusionnée le 2026-09-06 : la CI est passée d'un runner Linux à ubuntu, windows et macos, ce qui a fait remonter un bug de canonicalisation de chemin dans `collectWorkspaceFiles` [facts:pulls.merged_30d.0.number] [facts:pulls.merged_30d.0.title] [facts:pulls.merged_30d.0.merged_at] [src:changelog.md] [gh:https://github.com/jordanvalnet/code-dev-intel.ts/pull/3].
Releases : une seule taguée sur GitHub, v0.1.6 du 2026-03-26, alors que `CHANGELOG.md` et `package.json` documentent des versions ultérieures et une section Unreleased ; la version publiée sur npm est à vérifier dans https://github.com/jordanvalnet/code-dev-intel.ts/blob/main/CHANGELOG.md [facts:releases.0.tag] [facts:releases.0.date] [src:changelog.md] [src:manifest.md].
Repères pour agents IA à la racine (AGENTS.md, CLAUDE.md, .cursorrules, .mcp.json…) : 0 sur 7, alors que le projet impose un protocole de mémoire partagée dans `docs/ai/` ; pas de SECURITY.md ni de CODEOWNERS non plus [facts:ai_docs.score] [facts:ai_docs.max] [src:ai-docs.md] [src:contributing.md] [facts:business.security_policy] [facts:business.codeowners].
Jalons et CVE : données non relevées le 2026-09-10 ; à vérifier dans https://github.com/jordanvalnet/code-dev-intel.ts/milestones et https://github.com/jordanvalnet/code-dev-intel.ts/security [facts:collected.at] [facts:risks.1.note].
> Un projet d'une seule personne qui avance par rafales : la dernière, 11 commits, s'est terminée le 2026-09-06 [facts:activity.bus_factor] [facts:activity.commits_per_week.10.count] [facts:activity.last_commit].

## Quelle première contribution ?
Aucune issue « good first issue », aucun label : 1 issue ouverte, 0 fermée sur 30 jours, 0 PR ouverte [facts:issues.good_first] [facts:issues.by_label] [facts:issues.open] [facts:issues.closed_30d] [facts:pulls.open].
L'unique issue, #1 « Anti-Amnesia & Workflow Hardening for code-dev-intel.ts », 0 commentaire, est le chantier ouvert : lis-la avant de choisir ta tâche [facts:issues.hot.0.number] [facts:issues.hot.0.title] [facts:issues.hot.0.comments] [gh:https://github.com/jordanvalnet/code-dev-intel.ts/issues/1].
Le process est strict : suivre `docs/ai/04-executable-task-backlog.md` dans l'ordre, une branche `task/T-00X-short-name` par tâche et par PR, chaque événement ajouté à `docs/ai/memory/AGENT_MEMORY.md`, ce que `pnpm pr:check-memory-reference` (`services/governance/pr-memory-reference-check.ts`) contrôle [src:contributing.md] [src:manifest.md] [facts:build.ci.2.path].
| Chantier | Pourquoi maintenant |
|---|---|
| Ajouter `SECURITY.md` | aucun canal déclaré pour signaler une faille, risque noté moyen [facts:risks.1.note] [facts:business.security_policy] |
| Ajouter `AGENTS.md` à la racine, pointant sur `docs/ai/` | 0 repère IA sur 7 alors que le projet est fait pour des agents [facts:ai_docs.score] [src:ai-docs.md] |
| Taguer la version du manifeste | une seule release GitHub, v0.1.6, loin derrière le changelog [facts:releases.0.tag] [src:changelog.md] |
Définition de fini : critères du backlog remplis, preuves (commandes et sorties), mémoire partagée à jour, prochaine action de handoff écrite, `pnpm lint`, `pnpm type-check` et `pnpm test` verts [src:contributing.md].
> Pas de good first issue : ta première PR sera petite, sur une branche task/T-00X, et elle passera par la mémoire partagée [facts:issues.good_first] [src:contributing.md].

## Vos 3 premières actions
1. Aligner ton poste sur la CI, sous Node 24 : `git clone https://github.com/jordanvalnet/code-dev-intel.ts && cd code-dev-intel.ts && pnpm install --frozen-lockfile && pnpm ci:quality` ; vert = tu as le même résultat que `.github/workflows/ci.yml` [src:ci.md] [src:manifest.md] [facts:risks.4.note] [facts:build.ci.0.path].
2. Faire tourner le serveur et le lire : `pnpm mcp:self-test`, puis `pnpm mcp:start:logs` avec le README à « Typical agent workflow », en suivant `services/code-intel-mcp/src/server.ts` puis `services/code-intel-mcp/src/contracts.ts` [src:manifest.md] [src:readme.md] [facts:entrypoints.0.path] [facts:entrypoints.2.path].
3. Ouvrir ta première PR dans le process : lire l'issue #1 et `docs/ai/04-executable-task-backlog.md`, créer `task/T-0XX-security-md`, ajouter `SECURITY.md`, noter l'événement dans `docs/ai/memory/AGENT_MEMORY.md`, pousser [gh:https://github.com/jordanvalnet/code-dev-intel.ts/issues/1] [src:contributing.md] [facts:risks.1.note].
