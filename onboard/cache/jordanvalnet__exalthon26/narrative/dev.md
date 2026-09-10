---
repo: jordanvalnet/exalthon26
profile: dev
generated_at: 2026-09-10T08:47:07Z
---
# Onboard, pipeline d'agents Claude Code sur le serveur MCP GitHub : né le 9 septembre 2026, sans CI ni licence, mais assez balisé pour commiter dès la première heure

## Que fait ce projet et pour qui ?
Onboard parcourt n'importe quel dépôt GitHub par le serveur MCP GitHub, construit un cache documentaire vérifié et en tire une présentation par public : dev, qa, cto, ceo, investisseur, enfant ; chaque chiffre renvoie à sa source et un guide répond ensuite aux questions à partir du cache [src:readme.md].
La commande unique est `bun onboard owner/repo profil` : elle lance Claude Code en non interactif avec le skill `/onboard` ; dans une session Claude Code, les mêmes étapes sont des skills (`/onboard`, `/onboard-collect`, `/onboard-write`, `/onboard-render`, `/onboard-ask`) et les prompts vivent dans `onboard/agents/`, exécutables aussi par Copilot et Codex [src:readme.md].
Fiche GitHub : `jordanvalnet/exalthon26`, « Hackathon eXaltemps 2026 : agent + MCP GitHub » [facts:repo.description], compte personnel [facts:repo.owner_type], branche `main` [facts:repo.default_branch], créé le 2026-09-09 [facts:repo.created_at], 0 star et 0 fork [facts:repo.stars] [facts:repo.forks], aucun topic [facts:repo.topics], aucun fichier LICENSE [facts:risks.0.note].
Pour qui : le lecteur final est l'un des six publics ; vous, vous rejoignez le livrable de l'équipe eXaltemps au hackathon « Agent + MCP GitHub » du 9 septembre 2026, consignes du jury dans `HACKATHON.md`, dépôts cibles dans `CIBLES.md` [src:readme.md] [facts:tree.7.role] [facts:tree.5.role].
Contrainte d'architecture à connaître avant d'écrire une ligne : GitHub n'est joint que par le serveur MCP `github` déclaré dans `.mcp.json` (`https://api.githubcopilot.com/mcp/`, en-tête `Bearer ${GITHUB_PAT}`), depuis l'agent comme depuis `src/github.ts`, jamais par appel REST direct [src:ai-docs.md].
> Un CLI `bun onboard owner/repo profil` qui fait tourner des agents Claude Code sur le serveur MCP GitHub pour produire un deck sourcé par public [src:readme.md] ; c'est un livrable de hackathon, sans licence à ce jour [facts:risks.0.note].

## Comment le code est-il organisé ?
<!-- chart: tree -->
Racine de 21 entrées, sans dossier `.github/` [src:tree.md] [facts:tree]. Deux mondes : le code TypeScript dans `src/` (CLI, collecte, rendu, validation, fusion) [facts:tree.18.role] et le pipeline documentaire dans `onboard/` (agents, profils, cache, contrats) [facts:tree.13.role].
| Chemin | Contenu | Source |
|---|---|---|
| `src/` | cli.ts, collect/, facts.ts, gh.ts, github.ts, index.ts, merge.ts, render/, validate.ts | [src:tree.md] |
| `onboard/` | PLAN.md, README.md, SCHEMA.md, WORKFLOW.md, agents/, cache/, profiles/ | [src:tree.md] |
| `onboarding/` | second package bun, collecteurs dans src | [facts:tree.14.role] |
| `.claude/` | skills Claude Code du pipeline | [facts:tree.0.role] |
| `chat/` | client du chat d'équipe, chat.mjs | [facts:tree.11.role] |
| `test/` | 2 tests bun | [facts:tree.19.role] |
| `docs/`, `pitch/`, `pitch_fr.html` | documentation, supports du pitch, pitch HTML en français | [facts:tree.12.role] [facts:tree.16.role] [facts:tree.17.role] |
Deux `package.json` : celui de la racine, 15 scripts, une dépendance runtime (zod) et deux de dev (@types/bun, typescript) [src:manifest.md] ; celui d'`onboarding/`, 379 octets, non lu par la collecte [facts:risks.4.note].
Le repo est balisé pour les agents : `AGENTS.md`, `CLAUDE.md`, `.mcp.json`, `.claude/skills/`, soit 4 repères sur 7 [facts:ai_docs.score] [facts:ai_docs.max] ; manquent `.cursorrules`, `.github/copilot-instructions.md` et `llms.txt` [src:ai-docs.md].
Le cache ne contient pas le contenu de `.claude/`, `chat/`, `docs/`, `pitch/`, `src/collect/`, `src/render/`, `onboarding/src/`, `onboard/agents/`, `onboard/cache/`, `onboard/profiles/` : non descendus par la collecte, à parcourir dans le repo [src:tree.md].
> Tout le code est dans `src/` (9 entrées), tout le pipeline dans `onboard/` : prompts, profils, contrats, caches [src:tree.md] [facts:tree.13.role].

## Par où commencer à lire ?
Ordre de lecture prescrit par `AGENTS.md` : `onboard/README.md` (schéma du flux), `onboard/WORKFLOW.md`, `onboard/SCHEMA.md`, `onboard/PLAN.md` (rôles), `onboard/agents/`, `onboard/profiles/` [src:ai-docs.md]. Le README de la racine en donne la version courte : quatre étapes, collecter, rédiger, rendre, guider, chacune ne lisant que les sorties de la précédente et ne démarrant que si la validation en code passe [src:readme.md].
Puis le code, dans cet ordre :
1. `src/cli.ts` : script `onboard` de package.json, `bun onboard owner/repo profil [--force]` ; vérifie les arguments, le profil (`readProfile` de `./validate.ts`), `GITHUB_PAT` et la présence de `claude` dans le PATH, puis lance `onboard/agents/0-onboard.md` via Claude Code ; cache = `onboard/cache/<owner>__<repo>` [facts:entrypoints.0.why].
2. `src/validate.ts` : script `validate`, exporte `readProfile`, le plus gros fichier de `src/` (8324 octets) [facts:entrypoints.3.why] ; à lire avec `src/facts.ts` (schéma zod du cache) et `src/merge.ts` (fusion des collectes) [src:readme.md].
3. `src/render/index.ts` : script `render`, produit le deck HTML depuis le cache ; voisins `pdf.ts` et `screenshot.ts` [facts:entrypoints.2.why] ; `theme.ts` une identité par profil, `kpi.ts` tuiles, `charts.ts` SVG, `deck.ts` assemblage [src:readme.md].
4. `src/index.ts` : scripts `dev` et `start`, appelle `whoami()` de `./github.ts`, affiche « GitHub OK : <login> » ou sort en code 1 [facts:entrypoints.1.why].
5. `chat/chat.mjs` : script `chat`, client du chat d'équipe, seul `.mjs` cité par les scripts [facts:entrypoints.4.why].
Honnêteté du cache : seuls `src/cli.ts` (40 premières lignes) et `src/index.ts` ont été lus ; `src/render/index.ts`, `src/validate.ts` et `chat/chat.mjs` sont déduits du manifeste, à confirmer en ouvrant les fichiers [facts:entrypoints.0.why] [facts:entrypoints.2.why] [facts:entrypoints.3.why].
> Ouvrez `src/cli.ts` puis `onboard/agents/0-onboard.md` : le CLI n'est qu'un lanceur, la logique est dans les prompts d'agents [facts:entrypoints.0.why] [src:readme.md].

## Comment builder, tester et lancer ?
```bash
curl -fsSL https://bun.sh/install | bash        # Windows : powershell -c "irm bun.sh/install.ps1 | iex"
cp .env.example .env                            # GITHUB_PAT=<token GitHub, scope repo>
bun install && bun run check                    # tsc --noEmit && bun test
bun onboard owner/repo dev                      # collecte, rédaction, rendu : quelques minutes
bun run pdf onboard/cache/<owner>__<repo> dev   # le PDF, via Chrome ou Edge en headless
```
Les commandes viennent du README [src:readme.md] ; installer = `bun install`, lancer = `bun onboard owner/repo profil`, tester = `bun run check` [facts:build.install] [facts:build.run] [facts:build.test].
Runtime bun, jamais npm, TypeScript strict ; bun charge `.env` tout seul, `process.env.GITHUB_PAT` est disponible [src:ai-docs.md]. Pour que le serveur MCP voie le token dans une session Claude Code : `set -a; source .env; set +a` avant de lancer l'assistant, puis `/mcp` pour vérifier que `github` est connecté [src:readme.md].
Tests : `bun test`, 2 fichiers dans `test/` (`github.test.ts`, `issues.test.ts`), ni vitest ni jest [facts:tests.framework] [facts:tests.files] [src:tests.md] ; `check` = `bun run typecheck && bun test`, soit `tsc --noEmit` puis `bun test` [src:manifest.md].
CI : aucune. Pas de `.github/workflows/`, `build.ci` est vide, la seule vérification est locale [facts:build.ci] [src:ci.md] [facts:risks.3.note]. Dépendances : 3 déclarées, 1 runtime (zod ^4.5.4), `bun.lock` versionné [facts:deps.count] [facts:deps.runtime.0.name] [facts:deps.runtime.0.version] [facts:risks.4.note].
Autres scripts : `render`, `validate facts|narrative|deck`, `merge`, `meta`, `issues`, `gh`, `screenshot`, `pdf` ; 15 au total [src:manifest.md]. Le cache ne contient pas `sources/contributing.md` : il n'y a pas de CONTRIBUTING.md à la racine, les règles de travail sont dans `AGENTS.md` [src:tree.md] [src:ai-docs.md].
> Aucune CI : `bun run check` (`tsc --noEmit && bun test`) avant chaque push est la seule barrière [facts:risks.3.note] [src:readme.md].

## Comment le projet vit-il ?
<!-- chart: commits_per_week -->
Le repo a été créé le 2026-09-09T13:24:36Z et le dernier commit date du 2026-09-10T08:37:39Z : il a l'âge du hackathon [facts:repo.created_at] [facts:activity.last_commit].
Sur 12 semaines, 57 commits en 2026-W37, 1 commit daté 2026-W35, 0 partout ailleurs [facts:activity.commits_per_week.11.count] [facts:activity.commits_per_week.9.count] [facts:activity.commits_per_week].
| Compte | Commits | Source |
|---|---|---|
| jordanvalnet | 41 | [facts:activity.contributors.0.commits] |
| PrincyExaltIT | 8 | [facts:activity.contributors.1.commits] |
| Sacane | 4 | [facts:activity.contributors.2.commits] |
| radomd92 | 3 | [facts:activity.contributors.3.commits] |
| loic.vyncke | 2 | [facts:activity.contributors.4.commits] |
Bus factor 1 : un seul contributeur porte la moitié des commits des 12 semaines [facts:activity.bus_factor] [facts:risks.2.note]. Aucune release [facts:releases] ; version `0.1.0` dans package.json [src:manifest.md].
Flux de travail : 0 PR ouverte [facts:pulls.open] et 1 PR fusionnée le 2026-09-09T14:16:45Z, #2 « Onboard : workflow agentique, contrat du cache, profils, agents, validations » [facts:pulls.merged_30d.0.title] [facts:pulls.merged_30d.0.merged_at], ce qui indique des pushes directs sur `main` pour le reste des commits [facts:repo.default_branch].
L'équipe coordonne ses assistants par l'issue #1, 22 commentaires : un commentaire = un message, `node chat/chat.mjs read|send|who|wait` [facts:issues.hot.0.comments] [src:ai-docs.md].
> Un sprint de hackathon : 57 commits en une semaine, cinq comptes, jordanvalnet en porte 41, bus factor 1 [facts:activity.commits_per_week.11.count] [facts:activity.contributors] [facts:activity.contributors.0.commits] [facts:activity.bus_factor].

## Quelle première contribution ?
Pas de piste balisée : 1 issue ouverte, 0 fermée sur 30 jours, aucun label, aucune « good first issue » [facts:issues.open] [facts:issues.closed_30d] [facts:issues.by_label] [facts:issues.good_first].
L'unique issue ouverte, #1 « 💬 Chat équipe — canal IA ↔ IA », 22 commentaires, n'est pas une demande : c'est le canal de chat des assistants de l'équipe, un commentaire = un message, à ne jamais fermer [facts:issues.hot.0.title] [facts:issues.hot.0.comments] [facts:issues.hot.0.url] [src:ai-docs.md].
Côté PR : 0 ouverte [facts:pulls.open], 1 fusionnée, #2, le 2026-09-09 [facts:pulls.merged_30d.0.number] [facts:pulls.merged_30d.0.merged_at]. Le cache ne contient pas `sources/contributing.md` (pas de CONTRIBUTING.md à la racine) ; les règles connues sont celles d'`AGENTS.md` : bun jamais npm, GitHub uniquement par le serveur MCP, `bun run check` avant de rendre la main [src:tree.md] [src:ai-docs.md].
Les manques relevés par la collecte font de bonnes premières contributions, petites et vérifiables :
| Piste | Pourquoi | Source |
|---|---|---|
| Workflow GitHub Actions qui lance `bun run check` | aucun workflow, vérification locale seulement | [facts:risks.3.note] |
| Fichier `LICENSE` | réutilisation juridiquement incertaine | [facts:risks.0.note] |
| `SECURITY.md` | aucun canal déclaré pour signaler une faille | [facts:risks.1.note] |
| Tests pour `merge`, `validate`, `render` | 2 tests seulement, `github` et `issues` | [facts:tests.files] [src:tests.md] |
| `llms.txt`, `.github/copilot-instructions.md` | 4 repères IA sur 7 | [facts:ai_docs.score] [src:ai-docs.md] |
Aucun `TODO` de dette technique dans le code : les 10 résultats de la recherche sont des artefacts du pipeline ou un identifiant dans `onboarding/src/report/skeleton.ts` ; `FIXME` n'a pas été cherché [src:todo.md].
> Pas de good first issue : la contribution la plus utile est un workflow CI qui lance `bun run check`, aujourd'hui absent [facts:issues.good_first] [facts:risks.3.note].

## Vos 3 premières actions
1. Installer et vérifier l'accès GitHub : `cp .env.example .env` (GITHUB_PAT, scope repo), `bun install && bun run check`, puis `bun run dev` qui doit afficher « GitHub OK : <login> » [src:readme.md] [facts:build.install] [facts:entrypoints.1.why].
2. Lire `onboard/README.md`, `onboard/WORKFLOW.md`, `onboard/SCHEMA.md`, `onboard/PLAN.md`, puis `src/cli.ts` et `onboard/agents/0-onboard.md`, et lancer `bun onboard owner/repo dev` sur un dépôt de `CIBLES.md` pour voir le cache se remplir dans `onboard/cache/<owner>__<repo>/` [src:ai-docs.md] [facts:entrypoints.0.why] [facts:tree.5.role].
3. Se signaler sur le chat d'équipe, `node chat/chat.mjs send "🤖 …"` (issue #1) [src:ai-docs.md] [facts:issues.hot.0.url], puis proposer le workflow GitHub Actions qui lance `bun run check` : premier manque relevé par la collecte, sans risque pour le pipeline [facts:risks.3.note] [facts:build.test].
> Terminal ouvert, `bun run check` vert, un premier commit utile dès la première heure : le workflow CI qui manque [facts:risks.3.note].
