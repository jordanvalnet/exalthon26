---
repo: n8n-io/n8n
profile: dev
generated_at: 2026-09-10T13:41:37Z
---
# n8n : un monorepo pnpm massif et très vivant, prêt pour votre première PR si vous suivez le cadre

## Que fait ce projet et pour qui ?
n8n est une plateforme d'automatisation de workflows « fair-code » avec des capacités IA natives : un canevas visuel combiné à du code (JavaScript, Python, packages npm), auto-hébergé ou en cloud [facts:repo.description] [src:readme.md].
Le README annonce 1500+ intégrations et 9 000+ modèles de workflows ; la description GitHub, plus ancienne, dit 400+ intégrations [src:readme.md] [facts:repo.description].
Public : les équipes qui automatisent et déploient des agents IA (OpenAI, Anthropic, Google ou modèles ouverts, sans lock-in), et les développeurs qui étendent la plateforme avec leurs propres nœuds [src:readme.md].
Relevé le 2026-09-10 : 203 920 étoiles, 60 628 forks, 1 131 tickets ouverts (issues et PR confondues), dépôt créé le 2019-06-22, porté par l'organisation n8n-io, non archivé, branche par défaut `master` [facts:repo.stars] [facts:repo.forks] [facts:repo.open_issues] [facts:repo.created_at] [facts:repo.owner_type] [facts:repo.archived] [facts:repo.default_branch].
Licence relevée le 2026-09-10 : Sustainable Use License, version 1.0, usage et modification limités à vos besoins internes, non commerciaux ou personnels, redistribution gratuite seulement ; les fichiers `.ee.` et les branches autres que `master` en sont exclus et relèvent de la n8n Enterprise License, ce que le README résume en « fair-code » [facts:repo.license] [src:license.md] [src:readme.md] [gh:https://github.com/n8n-io/n8n/blob/master/LICENSE.md] [gh:https://github.com/n8n-io/n8n/blob/master/LICENSE_EE.md].
Pour voir le produit avant de toucher au code, le README propose un lancement Docker, éditeur sur http://localhost:5678 [src:readme.md] :
```
docker volume create n8n_data
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
```
> Une plateforme d'automatisation fair-code à 203 920 étoiles, sous Sustainable Use License : lisez LICENSE.md avant d'y bâtir un produit [facts:repo.stars] [src:readme.md].

## Comment le code est-il organisé ?
<!-- chart: tree -->
Un monorepo pnpm workspaces piloté par Turborepo : 53 entrées à la racine, dont `packages/` (le code), `docker/` (images), `scripts/` (build et dev), `docs/` (schéma de base de données), `patches/` (patches pnpm) et `security/` [facts:tree] [src:tree.md] [src:manifest.md].
Le `package.json` racine ne déclare que 28 devDependencies et aucune dépendance runtime : chaque package porte les siennes (`pnpm-workspace.yaml`, `pnpm-lock.yaml`) [facts:deps.count] [facts:risks.1.note].
Les packages, selon le guide de contribution et l'arborescence [src:contributing.md] [src:tree.md] [src:tests.md] :
| Package | Rôle |
|---|---|
| `packages/cli` | backend, API et binaire `n8n` ; sert aussi le front |
| `packages/core` | moteur d'exécution des workflows et webhooks : **contacter n8n avant tout changement** |
| `packages/workflow` | interfaces partagées front et back |
| `packages/nodes-base` | les nœuds intégrés |
| `packages/frontend/editor-ui` | éditeur Vue ; `packages/frontend/@n8n/design-system` pour les composants |
| `packages/node-dev` | CLI pour créer un nœud |
| `packages/testing` | tests end-to-end Playwright |
| `packages/@n8n/`, `packages/modules`, `packages/extensions` | présents dans l'arborescence, rôle non relevé |
Outillage à la racine : `turbo.json` (pipeline), `vitest.workspace.ts` (tests), `biome.jsonc` et `.prettierrc.js` (format), `lefthook.yml` et `.githooks/` (hooks), `OWNERS` (propriétaires par zone), `.devcontainer/` [src:tree.md] [facts:business.codeowners].
Le dépôt est écrit pour les agents IA autant que pour les humains : `AGENTS.md`, `CLAUDE.md` (qui ne fait qu'inclure `AGENTS.md`), `.github/CLAUDE.md`, `.claude/`, plus `.agents/` et `.opencode/` ; 3 repères sur 7 reconnus [facts:ai_docs.files] [facts:ai_docs.score] [facts:ai_docs.max] [src:ai-docs.md].
> Tout est dans `packages/` : `cli` et `frontend/editor-ui` sont vos terrains de jeu, `core` est chasse gardée sans accord préalable [src:contributing.md].

## Par où commencer à lire ?
Parcours conseillé, du plus court au plus profond [facts:entrypoints] [src:contributing.md] [src:ai-docs.md] :
1. `README.md` puis `CONTRIBUTING.md` : structure des packages, setup, cycle de dev, règles des PR communautaires, CLA [src:readme.md] [src:contributing.md].
2. `AGENTS.md` : les règles maison (toujours pnpm, anglais technique simplifié ASD-STE100, tickets dans Linear, feature flags Posthog, jamais de secret sur la ligne de commande, travail v3 sur la branche `3.x` derrière un flag) [src:ai-docs.md].
3. `packages/cli/bin/n8n` : le binaire visé par `pnpm start`, `webhook` et `worker` ; il vérifie la version de Node, charge la config puis le registre de commandes [facts:entrypoints.0.path] [facts:entrypoints.0.why].
4. `packages/cli/src` : le backend, cible de `pnpm dev:be` ; `packages/cli/AGENTS.md` et `packages/cli/BREAKING-CHANGES.md` sont à côté [facts:entrypoints.1.path] [src:tests.md].
5. `packages/workflow` puis `packages/core` : les interfaces partagées, puis le moteur d'exécution (`n8n-core`) [src:contributing.md] [facts:entrypoints.3.why].
6. `packages/nodes-base` : les nœuds intégrés, le modèle à copier pour en écrire un [facts:entrypoints.4.why] [src:contributing.md].
7. `packages/frontend/editor-ui` : l'éditeur Vue, cible de `pnpm dev:fe:editor` [facts:entrypoints.2.why].
Pour la base de données, `docs/db.md` et les schémas générés dans `docs/generated/` (tbls, SQLite et Postgres) [src:docs.md] [src:contributing.md] [src:tree.md].
> Lisez `CONTRIBUTING.md` et `AGENTS.md` avant la première ligne de code : ils fixent l'outillage, la langue des PR et où vous n'avez pas le droit d'aller seul [src:contributing.md] [src:ai-docs.md].

## Comment builder, tester et lancer ?
Prérequis : Node.js 24 ou plus et pnpm 12.3.4 exactement (`packageManager` du `package.json` racine) ; un script `preinstall` bloque `npm install` [src:manifest.md] [src:contributing.md].
Installation, build et lancement en mode production local, depuis votre fork [facts:build.install] [facts:build.run] [src:contributing.md] :
```
npm i -g pnpm@12.3.4
git clone https://github.com/<votre_login>/n8n.git && cd n8n
git remote add upstream https://github.com/n8n-io/n8n.git
pnpm install
pnpm build
pnpm start
```
Boucle de dev : `pnpm dev:be` (backend, port 5678) et `pnpm dev:fe:editor` (éditeur, port 8080) dans deux terminaux ; `pnpm dev` à la racine n'existe plus, il affiche un avis et sort ; `pnpm dev:ai` pour les nœuds LangChain ; `N8N_DEV_RELOAD=true pnpm dev:be` recharge les nœuds à chaud [src:contributing.md] [src:manifest.md].
Tests : `pnpm test` lance `turbo run test` dans tous les packages ; les tests vivent dans chaque package (Vitest : `packages/cli/test/` et six `vitest.config.*.ts` unit, integration, migration, testcontainers ; e2e Playwright dans `packages/testing`, `pnpm dev:e2e`) ; le nombre de fichiers de test n'a pas été relevé [facts:build.test] [src:tests.md] [src:manifest.md].
Qualité avant de pousser : `pnpm lint`, `pnpm typecheck`, `pnpm format` ; les hooks git lancent `actionlint` si vous touchez `.github/workflows/*.yml` et `tbls` si vous touchez une migration [src:manifest.md] [src:contributing.md].
CI : `.github/workflows/ci-pull-requests.yml` sur `pull_request` et `merge_group` enchaîne install et build, tests unitaires, typecheck, lint, packaging, e2e Playwright, tests BDD SQLite et Postgres, sécurité ; le job `required-checks` bloque le merge [facts:build.ci.0.path] [facts:build.ci.0.triggers] [src:ci.md] [facts:risks.2.note].
Les autres workflows (`release-*`, `sec-*`, `test-*-nightly`, `ci-check-pr-title.yml`, `ci-cla-check.yml`) sont listés dans `.github/workflows/` [src:ci.md].
> `pnpm install && pnpm build && pnpm start`, puis `pnpm dev:be` et `pnpm dev:fe:editor` ; la CI rejoue build, tests, typecheck, lint et e2e sur chaque PR [src:contributing.md] [src:ci.md].

## Comment le projet vit-il ?
<!-- chart: commits_per_week -->
Dernier commit relevé le 2026-09-10 à 13:00 UTC, dernier push à 13:17 UTC le même jour [facts:activity.last_commit] [facts:repo.pushed_at].
Les deux dernières semaines relevées comptent 251 puis 249 commits ; les dix semaines précédentes apparaissent à 0, ce qui ne colle pas avec des releases quotidiennes : lisez ces zéros comme une limite du relevé, pas comme une pause, et vérifiez sur https://github.com/n8n-io/n8n/graphs/commit-activity [facts:activity.commits_per_week.10.count] [facts:activity.commits_per_week.11.count] [facts:releases].
Sur ces semaines, le premier contributeur (bjorger) signe 24 commits et il faut 16 personnes pour atteindre la moitié des commits : l'activité est répartie, pas de dépendance à une seule personne [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.bus_factor].
Releases : 10 tags relevés entre le 7 et le 10 septembre 2026, trois lignes maintenues en parallèle (`n8n@2.39.2`, `n8n@2.38.6` et `n8n@1.123.79` publiés le 10 septembre) plus les pointeurs `stable` et `beta` ; une branche `3.x` se prépare (« Resolve master→3.x sync conflict », « 3.x comparison PR ») [facts:releases.3.tag] [facts:releases.1.tag] [facts:releases.2.tag] [facts:releases.0.tag] [facts:releases.4.tag] [facts:pulls.merged_30d.21.title] [facts:roadmap.open_prs.2.title].
Flux : 167 PR fusionnées relevées entre le 7 et le 10 septembre (la fenêtre relevée fait quatre jours, pas trente), 756 PR ouvertes, 375 issues ouvertes, 300 fermées en 30 jours [facts:pulls.merged_30d] [facts:pulls.open] [facts:issues.open] [facts:issues.closed_30d].
Le CHANGELOG n'a pas été relevé (fichier trop volumineux) : https://github.com/n8n-io/n8n/blob/master/CHANGELOG.md et https://github.com/n8n-io/n8n/releases font foi [src:tree.md].
Sécurité et gouvernance : `SECURITY.md` renvoie au programme de divulgation de vulnérabilités, un fichier `OWNERS` attribue les zones, pas de fichier de financement [src:security.md] [facts:business.security_policy] [facts:business.codeowners] [facts:business.funding].
> 251 puis 249 commits par semaine, 167 PR fusionnées en quatre jours, trois lignes de release en parallèle : rebasez souvent, votre branche vieillit vite [facts:activity.commits_per_week.11.count] [facts:pulls.merged_30d] [facts:releases].

## Quelle première contribution ?
Aucune issue « good first issue » relevée le 2026-09-10 : la liste est vide ; cherchez sur https://github.com/n8n-io/n8n/issues [facts:issues.good_first].
Les labels sont surtout des marqueurs d'équipe et de statut (status:in-linear 297, status:team-assigned 280, team:cats 93, team:nodes 92, team:ai 61, Needs Feedback 41) : le triage se fait dans Linear, hors GitHub [facts:issues.by_label] [src:ai-docs.md].
Les issues les plus discutées sont déjà assignées à une équipe : #31837 « Webhook trigger firing multiple times » (17 commentaires), #29127 objet imbriqué muté entre branches sœurs (15) ; bonnes lectures pour comprendre le moteur, mauvais premiers tickets [facts:issues.hot.1] [facts:issues.hot.2].
La voie du guide de contribution : fork, remote `upstream`, tests, PR depuis le fork, CLA signé ; les PR communautaires ont leurs règles (Community PR Guidelines) et deux workflows dédiés existent, `community-pr-close-stale.yml` et `ci-cla-check.yml` : une PR inactive risque la fermeture, le CLA est vérifié ; le titre est contrôlé (`ci-check-pr-title.yml`) au format `type(scope): sujet`, par exemple `fix(AI Agent Node): …` [src:contributing.md] [src:ci.md] [facts:pulls.merged_30d.5.title].
| Vous voulez | Où | Garde-fou |
|---|---|---|
| Corriger ou ajouter un nœud | `packages/nodes-base`, section « Create custom nodes » du guide | `pnpm dev` dans `packages/nodes-base` + `N8N_DEV_RELOAD=true pnpm dev` dans `packages/cli` |
| Un bug d'éditeur | `packages/frontend/editor-ui` | `pnpm dev:fe:editor`, tests Vitest du package |
| Une commande ou une route API | `packages/cli/src` | `pnpm dev:be`, tests d'intégration dans `packages/cli/test/` |
| Le moteur d'exécution | `packages/core` | contacter n8n avant de commencer |
Tableau fondé sur le guide de contribution et l'arborescence ; les PR s'écrivent en anglais technique simplifié, phrases courtes, voix active [src:contributing.md] [src:tests.md] [facts:entrypoints] [src:ai-docs.md].
> Pas de « good first issue » relevée : choisissez un nœud ou un bug d'éditeur reproductible, restez hors de `packages/core`, signez le CLA et respectez le titre `type(scope): sujet` [facts:issues.good_first] [src:contributing.md] [src:ci.md].

## Vos 3 premières actions
1. Installer et lancer en local, puis ouvrir http://localhost:5678 : `npm i -g pnpm@12.3.4`, `pnpm install`, `pnpm build`, `pnpm start` ; Node 24 minimum, jamais npm dans le dépôt [facts:build.install] [facts:build.run] [src:contributing.md] [src:manifest.md].
2. Lire `CONTRIBUTING.md`, `AGENTS.md` et `packages/cli/AGENTS.md`, puis lancer la boucle de dev `pnpm dev:be` + `pnpm dev:fe:editor` et faire tourner `pnpm test` une fois pour connaître la durée de référence [src:contributing.md] [src:ai-docs.md] [src:tests.md] [facts:build.test].
3. Choisir un premier ticket sur https://github.com/n8n-io/n8n/issues (aucune « good first issue » relevée le 2026-09-10), de préférence un nœud dans `packages/nodes-base` ou un bug d'éditeur, signer le CLA, ouvrir la PR depuis votre fork avec un titre `type(scope): sujet` [facts:issues.good_first] [src:contributing.md] [src:ci.md].
