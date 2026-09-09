---
repo: mksglu/context-mode
profile: dev
generated_at: 2026-09-09T15:30:00Z
---
# Context Mode : un serveur MCP qui met les sorties d'outils en bac à sable pour économiser la fenêtre de contexte des agents de code

## Que fait ce projet et pour qui ?
Context Mode est un serveur MCP plus des hooks qui interceptent les sorties d'outils (snapshots Playwright, listes d'issues, logs), les indexent dans une base FTS5 et ne renvoient à l'agent qu'un résumé recherchable, au lieu du dump brut [src:readme.md]. Il persiste aussi la mémoire de session pour survivre à la compaction et impose des règles de routage sur 17 plateformes [facts:repo.description].

Le public : les gens qui utilisent des agents de code (Claude Code, Codex CLI, Gemini CLI, VS Code Copilot, OpenCode, Cursor, Pi, OpenClaw…) et veulent garder leur contexte utile plus longtemps [src:manifest.md]. Le paquet npm s'appelle `context-mode`, version 1.0.169, sous licence Elastic 2.0, auteur Mert Koseoğlu [src:manifest.md] [facts:repo.license].

Le repo a 21 624 étoiles, 1 555 forks et 226 issues ouvertes ; il est né le 2026-02-23 et son dernier push date du 2026-09-08 [facts:repo.stars] [facts:repo.forks] [facts:repo.open_issues] [facts:repo.created_at] [facts:repo.pushed_at].

## Comment le code est-il organisé ?
<!-- chart: tree -->
Trois zones à retenir : `src/` (TypeScript : serveur MCP, CLI, adaptateurs), `hooks/` (hooks par plateforme en `.mjs`, sans build) et `configs/` (fichiers d'installation par plateforme) [facts:tree] [src:contributing.md]. `src/` est plat : `server.ts`, `store.ts` (FTS5), `executor.ts` (exécution polyglotte, 12 langages), `security.ts`, `runtime.ts`, `cli.ts`, plus `src/session/` (SessionDB, extracteurs, snapshot de reprise) et `src/adapters/` (un dossier par plateforme) [src:contributing.md] [src:tree.md].

Les dossiers cachés `.claude-plugin`, `.codex-plugin`, `.cursor-plugin`, `.openclaw-plugin`, `.pi` sont les manifestes de plugin de chaque hôte [facts:tree]. `.github/` porte 5 workflows GitHub Actions [facts:tree] [src:ci.md]. Les tests sont dans `tests/`, en vitest, 255 fichiers [facts:tests.dir] [facts:tests.framework] [facts:tests.files].

À la racine, `server.bundle.mjs` et `cli.bundle.mjs` sont les bundles esbuild publiés ; `start.mjs` charge le bundle s'il existe, sinon `build/server.js` [facts:tree] [src:contributing.md].

## Par où commencer à lire ?
1. `src/server.ts` : le serveur MCP, les handlers d'outils et l'auto-indexation ; c'est aussi le script `dev` (`npx tsx src/server.ts`) et la source de `server.bundle.mjs` [facts:entrypoints.0.path] [facts:entrypoints.0.why].
2. `src/cli.ts` : la CLI `context-mode` (`setup`, `doctor`), bundlée en `cli.bundle.mjs` ; la CI lance `npx tsx src/cli.ts doctor` [facts:entrypoints.1.path] [facts:entrypoints.1.why].
3. `src/adapters/opencode/index.ts` : l'adaptateur OpenCode, cible du `main` de package.json, classe `OpenCodeAdapter` qui implémente `HookAdapter` [facts:entrypoints.2.path] [facts:entrypoints.2.why]. Lire d'abord `src/adapters/types.ts` pour l'interface [src:contributing.md].
4. `src/adapters/openclaw/index.ts` et `start.mjs` sont les deux autres entrées listées, déduites de leur chemin et non lues par le collecteur [facts:entrypoints.3.why] [facts:entrypoints.4.why].

Le README explique le problème (un snapshot Playwright coûte 56 KB, vingt issues GitHub 59 KB) avant l'architecture : à lire en premier pour la motivation [src:readme.md]. CONTRIBUTING.md contient le schéma de `src/` et le flux de restauration de session : à lire en second [src:contributing.md].

## Comment builder, tester et lancer ?
```
npm install                       # install
npm run build                     # tsc + bundle esbuild + assertions sur les bundles
npm test                          # vitest run (pretest = npm run build)
npx tsx src/server.ts             # script dev
claude mcp add context-mode -- npx -y context-mode   # lancer comme serveur MCP dans Claude Code
```
Commandes issues de `facts.build` et des scripts de package.json [facts:build.install] [facts:build.test] [facts:build.run] [src:manifest.md]. Node ≥ 22.5.0 est requis ; le `packageManager` déclaré est pnpm 10.23.0 alors que la CI fait `npm install` [src:manifest.md] [src:ci.md].

Piège documenté : en local, supprimer `server.bundle.mjs` sinon `start.mjs` charge le bundle et ignore vos changements dans `build/server.js` [src:contributing.md].

La CI (`.github/workflows/ci.yml`) tourne sur push, pull_request et workflow_dispatch, sur ubuntu, macos et windows, avec Node 22.5, Python 3.12, Go et Elixir installés pour l'exécuteur polyglotte ; elle enchaîne typecheck, build, bundle et assertions sur les bundles [facts:build.ci.0.path] [facts:build.ci.0.triggers] [src:ci.md]. Quatre autres workflows existent (bundle, openclaw-e2e, tier2-e2e-smoke, update-stats) mais n'ont pas été lus [src:ci.md].

## Comment le projet vit-il ?
<!-- chart: commits_per_week -->
Sur 12 semaines, le rythme est passé de 57 commits en semaine 26 à 9 en semaine 36 et 2 en semaine 37 (semaine en cours), avec un plateau autour de 11 à 13 commits par semaine entre les deux [facts:activity.commits_per_week]. Dernier commit le 2026-09-08 [facts:activity.last_commit].

Le bus factor est de 1 : `mksglu` signe 60 commits sur la période, le deuxième contributeur `ken-jo` en a 6, les huit suivants 1 ou 2 [facts:activity.bus_factor] [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits]. CONTRIBUTING.md le confirme : « I'm a solo maintainer with limited time » [src:contributing.md].

Les 10 dernières releases vont de v1.0.160 (2026-06-01) à v1.0.169 (2026-06-29) : dix versions en un mois, aucune release listée depuis fin juin [facts:releases.0.tag] [facts:releases.0.date] [facts:releases.9.date]. Le cache ne contient pas les releases postérieures au 2026-06-29 ; à vérifier dans https://github.com/mksglu/context-mode/releases.

## Quelle première contribution ?
Il n'y a aucune issue étiquetée good first issue [facts:issues.good_first]. 119 issues sont ouvertes, 6 fermées sur 30 jours, et seules 11 portent un label (6 enhancement, 4 bug, 1 help wanted) [facts:issues.open] [facts:issues.closed_30d] [facts:issues.by_label]. Côté PR : 107 ouvertes et aucune fusionnée sur 30 jours dans le cache [facts:pulls.open] [facts:pulls.merged_30d]. La file est longue, la revue est lente : une petite PR ciblée, avec test, a plus de chances qu'une grosse.

Pistes concrètes tirées des issues les plus discutées : le bug de `ctx_stats` qui se contredit dans un même rendu (#950) et le timeout de `ctx_batch_execute` qui ne borne pas l'indexation (#947) sont bien délimités [facts:issues.hot.3.url] [facts:issues.hot.4.url]. L'issue #45 (154 commentaires) cherche des beta-testeurs sur 15 plateformes × 3 OS : tester une plateforme et rapporter est une contribution sans code [facts:issues.hot.0.url] [facts:issues.hot.0.comments].

Avant d'envoyer : suivre les templates, lancer `bash scripts/ctx-debug.sh`, écrire des tests ; le mainteneur le demande explicitement [src:contributing.md].
