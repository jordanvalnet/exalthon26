---
path: AGENTS.md, CLAUDE.md, .mcp.json, .claude/skills/
url: https://github.com/jordanvalnet/exalthon26/tree/main
fetched_at: 2026-09-10T09:43:25Z
---
Repères de documentation IA présents (4 sur 7) :

AGENTS.md (agents_md, 5178 octets)
CLAUDE.md (claude_md, 69 octets)
.mcp.json (mcp_json, 196 octets)
.claude/skills/ (skills_dir, dossier)

Absents : .cursorrules, .github/copilot-instructions.md (pas de dossier .github/), llms.txt.

## AGENTS.md — 40 premières lignes

# exalthon26 — contexte projet

Hackathon « Agent + MCP GitHub » (eXaltemps, 2026-09-09). Consignes du jury : `HACKATHON.md`. Repos cibles : `CIBLES.md`.

## Objectif
Onboard : un skill `/onboard owner/repo profil` qui parcourt n'importe quel repo GitHub avec les outils `github:*`,
construit un cache documentaire réutilisable (`onboard/cache/<owner>__<repo>/`) et en tire un deck adapté au profil
(dev, qa, cto, ceo, investisseur, enfant), puis répond aux questions en citant ses sources.
Lire dans l'ordre : `onboard/README.md` (schéma du flux), `onboard/WORKFLOW.md`, `onboard/SCHEMA.md`, `onboard/PLAN.md` (rôles), `onboard/agents/`, `onboard/profiles/`.

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
| `bun run meta owner/repo profil [cache]` | sous-agent 1a en code, via MCP : fiche du repo, activité, risques → `parts/meta.json` + bilan `parts/meta.md` |
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
[tronqué]

## .mcp.json — fichier entier (11 lignes)

{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ${GITHUB_PAT}"
      }
    }
  }
}
