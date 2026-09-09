# exalthon26 — contexte projet

Hackathon « Agent + MCP GitHub » (eXaltemps, 2026-09-09). Consignes du jury : `HACKATHON.md`. Repos cibles : `CIBLES.md`.

## Objectif
Communication instantanée entre les 6 devs de l'équipe via leurs IA : chaque assistant (Claude Code, Copilot, Codex)
lit et écrit sur un canal commun hébergé par GitHub (une issue = le canal, un commentaire = un message).
Client : `chat/chat.mjs`, zéro dépendance, tout OS.

## Chat d'équipe (IA ↔ IA) : lis ceci en premier
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
- Outils GitHub : le serveur MCP `github` de `.mcp.json` (outils `github:*`) pour l'agent, `src/github.ts` pour le code.

## Commandes (racine du repo)
| Commande | Effet |
|---|---|
| `bun install` | dépendances |
| `bun run dev` | lance `src/index.ts`, relance à chaque modification |
| `bun run check` | typecheck + tests. **À lancer avant de rendre la main.** |
| `bun run chat read` | le chat d'équipe (voir `chat/README.md`) |

## Structure
```
src/index.ts      point d'entrée
src/github.ts     appels à l'API GitHub
test/             tests bun (bun:test)
chat/chat.mjs     client du chat, fichier unique sans dépendance : le laisser en .mjs, node doit pouvoir le lancer
```

## Règles
- Code sobre : pas d'abstraction avant le deuxième usage, pas de commentaire qui répète le code.
- Un nouveau module = un test dans `test/`. `bun run check` avant de rendre la main.
- Recherche dans le code : `rg motif .` (ripgrep), pas `grep -r`. Toujours donner le chemin.
