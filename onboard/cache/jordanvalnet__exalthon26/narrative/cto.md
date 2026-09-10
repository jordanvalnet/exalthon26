---
repo: jordanvalnet/exalthon26
profile: cto
generated_at: 2026-09-10T09:32:00Z
---
# Onboard : un pipeline d'agents bien contraint, à adopter en pilote interne, pas à forker tant qu'il n'a ni licence ni second mainteneur

## Que fait ce projet et quelle est son architecture ?
<!-- chart: tree -->
Onboard parcourt n'importe quel dépôt GitHub par le serveur MCP GitHub, construit un cache documentaire vérifié et en tire une présentation par public : dev, qa, cto, ceo, investisseur, enfant. Chaque chiffre renvoie à sa source, et un guide répond ensuite aux questions à partir du cache [src:readme.md] [facts:repo.description].

Livrable d'un hackathon d'une journée : dépôt créé le 2026-09-09, dernier push le 2026-09-10, propriétaire individuel, branche `main`, 0 étoile, 0 fork [facts:repo.created_at] [facts:repo.pushed_at] [facts:repo.owner_type] [facts:repo.default_branch] [facts:repo.stars] [facts:repo.forks].

Architecture en quatre étapes chaînées par fichiers : collecter (5 sous-agents en parallèle, outils `github:*`), rédiger (lit le cache, jamais GitHub), rendre (code, une identité visuelle par profil), guider (réponse citée, FAQ enrichie). Chaque étape ne lit que les sorties de la précédente et ne démarre que si une validation en code passe [src:readme.md].

21 entrées à la racine, 8 dossiers : `src/` (CLI, collecte, rendu, validation), `onboard/` (prompts des agents, profils JSON, caches versionnés), `onboarding/` (second package bun, collecteurs MCP), `chat/` (client du chat d'équipe), `test/` (2 tests bun) [src:tree.md] [facts:tree.18.role] [facts:tree.13.role] [facts:tree.14.role] [facts:tree.11.role] [facts:tree.19.role].

Choix structurant : les prompts vivent dans `onboard/agents/`, en texte, pour que Claude Code, Copilot et Codex exécutent le même texte ; les validations sont du code, `src/validate.ts`, `src/merge.ts`, schéma zod `src/facts.ts`. Un seul chemin vers GitHub, le serveur MCP, jamais REST [src:readme.md] [src:ai-docs.md].

> Un pipeline d'agents à validation dure entre chaque étape, dont le cœur est du texte versionné (prompts, cache) et non un service : auditable en une heure, reprenable sans l'auteur [src:readme.md] [facts:ai_docs.score].

## Quelle est sa santé technique ?
<!-- chart: commits_per_week -->
58 commits sur 12 semaines, dont 57 la semaine du hackathon (2026-W37) et 1 en 2026-W35 : toute l'activité tient en deux jours, dernier commit le 2026-09-10 [facts:activity.commits_per_week.11.count] [facts:activity.commits_per_week.9.count] [facts:activity.last_commit].

Aucune release, aucun tag : le seul numéro de version est le `0.1.0` du manifeste, et le package est `private` [facts:releases] [src:manifest.md].

Aucune intégration continue : pas de dossier `.github`, donc aucun workflow GitHub Actions. La seule vérification est locale, `bun run check`, soit `tsc --noEmit` puis `bun test` [facts:build.ci] [src:ci.md].

Tests : 2 fichiers dans `test/`, `github.test.ts` et `issues.test.ts`, framework `bun test` ; à en juger par leurs noms, ils couvrent l'accès GitHub et la collecte des issues, pas le rendu ni les validations [facts:tests.files] [facts:tests.framework] [src:tests.md].

Ce qui est solide : TypeScript strict, bun sans npm, un seul chemin vers GitHub, une validation en code à chaque étape, et 4 repères de documentation IA sur 7 (AGENTS.md, CLAUDE.md, .mcp.json, .claude/skills/) [src:ai-docs.md] [facts:ai_docs.score] [facts:ai_docs.max].

```
bun install
bun onboard owner/repo profil
bun run check
```
Les trois commandes du README : installer, lancer, vérifier [facts:build.install] [facts:build.run] [facts:build.test].

> Code discipliné mais sans filet automatique : zéro CI, zéro release, 2 tests ; la qualité repose sur `bun run check` lancé à la main [facts:build.ci] [facts:tests.files] [facts:releases].

## Qui porte le projet et quel est le bus factor ?
<!-- chart: contributors -->
5 contributeurs humains sur 12 semaines : jordanvalnet 41 commits, PrincyExaltIT 8, Sacane 4, radomd92 3, loic.vyncke 2 [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.contributors.2.commits] [facts:activity.contributors.3.commits] [facts:activity.contributors.4.commits].

Bus factor 1 : une seule personne signe plus de la moitié des 58 commits, plus que les quatre autres réunies [facts:activity.bus_factor] [facts:risks.2.note].

Aucun CODEOWNERS, aucune politique de sécurité, aucun financement déclaré : la gouvernance est implicite, portée par l'équipe du hackathon [facts:business.codeowners] [facts:business.security_policy] [facts:business.funding].

À lire avec le contexte : une équipe constituée pour une journée (« Équipe eXaltemps, hackathon du 9 septembre 2026 »), pas une communauté ; la concentration des commits est celle d'un intégrateur qui assemble le travail des autres, ce qui ne dit rien de la capacité de chacun à reprendre le code [src:readme.md] [facts:repo.created_at].

Parade : un second mainteneur avec droits d'écriture et un fichier CODEOWNERS sur `src/` et `onboard/` avant tout usage au-delà du pilote [facts:activity.bus_factor] [facts:business.codeowners].

> Bus factor 1, 41 commits sur 58 pour une personne : sans second mainteneur nommé, le projet s'arrête avec son auteur [facts:activity.bus_factor] [facts:activity.contributors.0.commits].

## Quelles dépendances et quelle dette ?
3 dépendances déclarées dans `package.json`, `bun.lock` versionné à la racine [facts:deps.count] [facts:deps.manifest] [src:manifest.md].

| Dépendance | Type | Version | Remarque |
|---|---|---|---|
| zod | runtime | ^4.5.4 | schéma de facts.json, seule dépendance d'exécution [facts:deps.runtime.0.name] [facts:deps.runtime.0.version] |
| typescript | dev | ^5 | typecheck `tsc --noEmit` [src:manifest.md] |
| @types/bun | dev | latest | non épinglée : le typecheck peut casser sans changement du code [src:manifest.md] |

Dépendances hors manifeste, invisibles au lock : le runtime bun, l'assistant Claude Code que `bun onboard` lance en non interactif, le serveur MCP GitHub hébergé `https://api.githubcopilot.com/mcp/`, et Chrome ou Edge en headless pour les PDF [src:readme.md] [src:ai-docs.md] [facts:entrypoints.1.why].

Un second `onboarding/package.json` (379 octets) coexiste avec le principal : deux packages bun dans un même dépôt, deux arbres de dépendances à suivre [src:tree.md] [facts:risks.4.note].

Dette repérée : 12 résultats pour « TODO » dans le dépôt, 10 listés, un seul dans un fichier de code (`onboarding/src/report/skeleton.ts`), les 9 autres dans la doc et les caches, où c'est un mot du texte [src:todo.md].

> Dette de dépendances quasi nulle (1 runtime), mais dette d'exploitation réelle : le pipeline dépend d'un agent IA tiers et d'un serveur MCP hébergé, hors de votre contrôle [facts:deps.count] [src:readme.md].

## Quels risques ?
<!-- chart: risks -->
Cinq risques collectés, deux au niveau high, chacun avec sa parade [facts:risks].

| Risque | Niveau | Constat | Parade |
|---|---|---|---|
| Licence | high | Pas de fichier LICENSE : réutilisation juridiquement incertaine [facts:risks.0.level] [facts:risks.0.note] | Obtenir de l'auteur un LICENSE (MIT ou Apache-2.0) avant tout fork ou usage hors de l'équipe |
| Bus factor | high | Une personne porte la moitié des commits sur 12 semaines [facts:risks.2.level] [facts:risks.2.note] | Second mainteneur, CODEOWNERS |
| CI | mid | Aucun workflow GitHub Actions, vérification locale seule [facts:risks.3.level] [facts:risks.3.note] | Un workflow qui lance `bun run check` à chaque push |
| Sécurité | mid | Pas de SECURITY.md, aucun canal de signalement [facts:risks.1.level] [facts:risks.1.note] | Un SECURITY.md avec un contact |
| Dépendances | low | 3 déclarées, lock versionné [facts:risks.4.level] [facts:risks.4.note] | Épingler `@types/bun` |

Donnée non relevée : `SECURITY.md` ; le dépôt n'a pas de politique de sécurité ; à vérifier dans https://github.com/jordanvalnet/exalthon26/security/policy [facts:business.security_policy] [gh:https://github.com/jordanvalnet/exalthon26/security/policy].

Données non relevées : les CVE des dépendances et la répartition des langages ; à vérifier dans https://github.com/jordanvalnet/exalthon26/security/dependabot [gh:https://github.com/jordanvalnet/exalthon26/security/dependabot].

Risque propre à l'architecture : le secret `GITHUB_PAT` (scope repo) part vers un serveur MCP hébergé par GitHub, en en-tête `Authorization: Bearer` ; à cadrer par un jeton à granularité fine, limité aux dépôts à onboarder [src:ai-docs.md] [src:readme.md].

> Deux risques bloquants pour un fork ou un usage externe, licence absente et bus factor 1 ; les trois autres sont des fichiers à ajouter : un workflow, un SECURITY.md, une version épinglée [facts:risks.0.level] [facts:risks.2.level] [facts:risks.3.level].

## Adopter, contribuer ou forker ?
Feuille de route : aucune PR ouverte, aucun thème étiqueté ; la seule issue ouverte, #1 « 💬 Chat équipe — canal IA ↔ IA » (22 commentaires), est le canal où les assistants IA de l'équipe se parlent, pas une demande produit [facts:roadmap.open_prs] [facts:roadmap.themes] [facts:roadmap.requests.0.title] [facts:roadmap.requests.0.comments] [src:ai-docs.md].

Pas de ROADMAP.md ni de docs/roadmap.md dans le dépôt, et les jalons ne sont pas exposés par le serveur MCP ; à vérifier dans https://github.com/jordanvalnet/exalthon26/milestones [src:docs.md] [gh:https://github.com/jordanvalnet/exalthon26/milestones].

58 commits pour 1 PR fusionnée sur 30 jours, #2 « Onboard : workflow agentique, contrat du cache, profils, agents, validations », le 2026-09-09 : le travail passe par des commits directs sur `main`, pas par relecture [facts:pulls.merged_30d.0.title] [facts:pulls.merged_30d.0.merged_at] [facts:pulls.open] [facts:activity.commits_per_week.11.count].

Adopter : oui, en pilote interne sur vos propres dépôts. Le produit est utilisable en trois commandes, le cache est du texte que l'on peut relire et corriger, et six profils sont livrés [src:readme.md] [facts:build.run].

Contribuer : le dépôt s'y prête, prompts en texte dans `onboard/agents/`, profils JSON, consignes pour les agents dans AGENTS.md ; mais pas de CONTRIBUTING.md à la racine ni de good first issue [src:tree.md] [facts:ai_docs.files.0.path] [facts:issues.good_first].

Forker : non, tant qu'il n'y a pas de LICENSE : sans licence, aucun droit de copie ni de redistribution n'est accordé [facts:risks.0.note] [facts:risks.0.level].

> Adopter en pilote, contribuer si l'équipe reste active, ne pas forker : le blocage est juridique, pas technique [facts:risks.0.level] [src:readme.md].

## Décision
Recommandation : **adopter en pilote interne**, sur vos propres dépôts, sans fork ni redistribution, jusqu'à la levée de deux conditions, la licence et le bus factor [facts:risks.0.level] [facts:risks.2.level].
1. Licence : obtenir de l'auteur un fichier LICENSE ; sans lui, aucun droit de réutilisation n'est acquis, même en interne [facts:risks.0.note] [src:tree.md].
2. Bus factor : nommer un second mainteneur et un CODEOWNERS ; aujourd'hui une personne signe 41 commits sur 58 [facts:activity.bus_factor] [facts:activity.contributors.0.commits] [facts:business.codeowners].
3. Filet minimal avant tout usage régulier : un workflow qui lance `bun run check`, un SECURITY.md, `@types/bun` épinglé, et un `GITHUB_PAT` à granularité fine limité aux dépôts onboardés [facts:build.ci] [facts:business.security_policy] [src:manifest.md] [src:ai-docs.md].
Ce que vous achetez : une architecture lisible, des prompts et un cache en texte versionné, une seule dépendance runtime ; ce que vous n'achetez pas encore : une garantie de maintenance [src:readme.md] [facts:deps.count] [facts:activity.bus_factor].
