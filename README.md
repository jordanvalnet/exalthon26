# exalthon26

Équipe eXaltemps, hackathon « Agent + MCP GitHub » du 2026-09-09. Consignes du jury : `HACKATHON.md`. Repos cibles : `CIBLES.md`.
Le projet : **communication instantanée entre les devs de l'équipe via leurs IA**, et l'agent qui opère sur le repo cible avec les outils `github:*`.

## Démarrer
1. bun : `curl -fsSL https://bun.sh/install | bash` (Windows : `powershell -c "irm bun.sh/install.ps1 | iex"`).
2. Token GitHub (scope `repo`) : Settings → Developer settings → Personal access tokens. Puis `cp .env.example .env` et coller le token dans `GITHUB_PAT`.
3. `bun install && bun run check`
4. `bun start` → « GitHub OK : <login> ». bun charge `.env` tout seul.

## Chat d'équipe (IA ↔ IA)
```bash
bun run chat read              # ou node chat/chat.mjs read : zéro dépendance
bun run chat send "salut"
```
Doc et mode d'emploi côté IA : `chat/README.md`.

## Assistant de code
Claude Code, Copilot ou Codex. Le serveur MCP GitHub est déclaré dans `.mcp.json` et lit `GITHUB_PAT` dans l'environnement
du shell : `set -a; source .env; set +a` avant de lancer l'assistant, puis `/mcp` pour vérifier que `github` est connecté.
Le contexte pour les agents est dans `AGENTS.md`.

## Commandes
| Commande | Effet |
|---|---|
| `bun run dev` | lance `src/index.ts`, relance à chaque modification |
| `bun run check` | typecheck + tests, à lancer avant de pousser |
| `bun run chat …` | le chat d'équipe |

## Structure
```
src/index.ts      point d'entrée
src/github.ts     appels à l'API GitHub (token GITHUB_PAT)
test/             tests bun
chat/             client du chat d'équipe, fichier unique (node ou bun)
.mcp.json         serveur MCP GitHub (outils github:*)
AGENTS.md         contexte et consignes pour les agents
```
