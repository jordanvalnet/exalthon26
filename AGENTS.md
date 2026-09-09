# exalthon26 — contexte projet

Hackathon « Agent + MCP GitHub » (eXaltemps, 2026-09-09). Consignes du jury : `HACKATHON.md`. Repos cibles : `CIBLES.md`.

## Objectif
Onboard : un skill `/onboard owner/repo profil` qui parcourt n'importe quel repo GitHub avec les outils `github:*`,
construit un cache documentaire réutilisable (`onboard/cache/<owner>__<repo>/`) et en tire un deck adapté au profil
(dev, qa, cto, ceo, investisseur, enfant), puis répond aux questions en citant ses sources.
Lire dans l'ordre : `onboard/WORKFLOW.md`, `onboard/SCHEMA.md`, `onboard/PLAN.md` (rôles), `onboard/agents/`, `onboard/profiles/`.

## Outillage : chat d'équipe (IA ↔ IA)
Les 6 assistants de l'équipe se parlent via l'issue <https://github.com/jordanvalnet/exalthon26/issues/1> :
un commentaire = un message, l'auteur est le compte GitHub du token. Client : `chat/chat.mjs` (node ou bun, zéro dépendance).
- Lire : `node chat/chat.mjs read`. Envoyer : `node chat/chat.mjs send "🤖 …"`. Qui est là : `node chat/chat.mjs who`.
- Un message écrit par une IA commence par `🤖`. `@login` pour interpeller quelqu'un. Court, factuel, en français.
- « Écoute le chat » : lance `node chat/chat.mjs wait` **en tâche de fond** ; il se termine au premier message d'un
  autre et tu es réveillé. Traite le message (réponds via `send` si on t'interpelle), puis relance `wait`.
- Sans terminal : outils `github:*` (`issue_read` method `get_comments`, `add_issue_comment`) sur cette issue.
- Ne jamais fermer l'issue. Doc : `chat/README.md`.

## Stack
- **bun** (jamais npm), TypeScript strict. bun charge `.env` tout seul : `process.env.GITHUB_PAT` est disponible.
- Outils GitHub : le serveur MCP `github` de `.mcp.json` (outils `github:*`) pour l'agent, `src/github.ts` pour le code, qui parle au **même serveur MCP** (client dans `onboarding/src/mcp/`). Jamais d'appel REST direct.

## Commandes (racine du repo)
| Commande | Effet |
|---|---|
| `bun install` | dépendances |
| `bun run dev` | lance `src/index.ts`, relance à chaque modification |
| `bun run check` | typecheck + tests. **À lancer avant de rendre la main.** |
| `bun onboard owner/repo profil` | pipeline complet via Claude Code, sort `onboard/cache/<owner>__<repo>/deck-<profil>.html` |
| `bun run merge <cache> <profil>` | assemble `parts/*.json` dans `facts.json` et valide |
| `bun run validate facts\|narrative\|deck <cache> <profil>` | validation dure d'une étape |
| `bun run render <cache> <profil>` | deck HTML à partir du cache |
| `bun run gh <outil> '<args JSON>'` | appel brut d'un outil du serveur MCP GitHub ; `bun run gh tools` les liste |
| `bun run chat read` | le chat d'équipe (voir `chat/README.md`) |

## Structure
```
onboard/WORKFLOW.md   chaîne d'agents : IN, OUT, validation dure, chaînage par fichiers
onboard/SCHEMA.md     contrat du cache (facts.json, sources/, narrative/, faq, glossaire, graphiques) : se change en l'annonçant sur le chat
onboard/PLAN.md       morceaux, définition de fini, qui fait quoi
onboard/agents/       prompt de chaque agent (0-onboard, 1-collect + 1a…1e, 2-write, 3-render, 4-ask)
onboard/profiles/     un JSON par profil (input : description, éléments priorisés), lu par src/validate.ts
onboard/cache/        caches produits, versionnés ; example/ est fictif, écrit à la main
.claude/skills/       /onboard, /onboard-collect, /onboard-write, /onboard-render, /onboard-ask : pointent sur onboard/agents/
src/facts.ts          schéma zod de facts.json
src/validate.ts       validations facts, narrative, deck
src/merge.ts          fusion des parts des sous-agents de collecte
src/render/           deck HTML (à implémenter, M4)
src/cli.ts            bun onboard
src/github.ts         accès GitHub via le serveur MCP (token GITHUB_PAT), src/gh.ts l'expose en ligne de commande
onboarding/           collecteurs TypeScript (bun, zéro dépendance) qui parlent au serveur MCP GitHub : src/mcp/client.ts, src/github/GitHubMcp.ts
test/                 tests bun (bun:test)
chat/chat.mjs         client du chat, fichier unique sans dépendance : le laisser en .mjs, node doit pouvoir le lancer
```

## Règles
- Code sobre : pas d'abstraction avant le deuxième usage, pas de commentaire qui répète le code.
- Pas de tests pendant le hackathon : le temps va au produit. `bun run check` (typecheck) avant de pousser.
- Recherche dans le code : `rg motif .` (ripgrep), pas `grep -r`. Toujours donner le chemin.
- Tout le monde sur `main`, pas de PR. Commits petits et fréquents, `git pull --rebase` avant de pousser, chacun ne touche qu'à ses fichiers (`onboard/PLAN.md`).
- Un agent du pipeline n'écrit que dans ses OUT et ne lit que ses IN (`onboard/WORKFLOW.md`). Il n'invente jamais un chiffre.
