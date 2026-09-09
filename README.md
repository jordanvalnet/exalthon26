# exalthon26

Équipe eXaltemps, hackathon « Agent + MCP GitHub » du 2026-09-09. Consignes du jury : `HACKATHON.md`. Repos cibles : `CIBLES.md`.
Le projet : **Onboard**, un agent qui parcourt n'importe quel repo GitHub avec le MCP GitHub, construit un cache documentaire
et en tire un deck adapté au profil (dev, qa, cto, ceo, investisseur, enfant), puis répond aux questions en citant ses sources.
Dans Claude Code : `/onboard owner/repo profil`. Plan et contrat : `onboard/`.

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
| `bun onboard owner/repo profil` | onboarding complet, deck dans `onboard/cache/<owner>__<repo>/` |
| `bun run validate facts\|narrative\|deck <cache> <profil>` | validation d'une étape du pipeline |
| `bun run chat …` | le chat d'équipe |

## Structure
```
onboard/          workflow, contrat, plan, prompts des agents, profils, caches produits
src/validate.ts   validations dures entre étapes ; src/merge.ts fusion des collectes ; src/render/ deck HTML
src/index.ts      point d'entrée
src/github.ts     appels à l'API GitHub (token GITHUB_PAT)
test/             tests bun
chat/             client du chat d'équipe, fichier unique (node ou bun)
.mcp.json         serveur MCP GitHub (outils github:*)
AGENTS.md         contexte et consignes pour les agents
```
