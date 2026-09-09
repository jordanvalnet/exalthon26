# Hackathon MCP — contexte projet

Atelier "Agent + MCP GitHub" (eXaltemps). Livrable visé : un **serveur MCP maison** en TypeScript, dans `mcp-server/`.
Le sujet précis arrive le jour J dans `HACKATHON.md` : s'il existe, le lire en premier.

## Stack
- **bun** (jamais npm), TypeScript strict, `@modelcontextprotocol/sdk`, `zod`.
- stdio pour Claude Code / Copilot (`src/index.ts`), HTTP stateless pour curl ou un client distant (`src/http.ts`).
- Déclaré dans `.mcp.json` sous le nom `hackathon` : ses outils apparaissent dans la session sous `hackathon:*`.

## Commandes (racine du repo)
| Commande | Effet |
|---|---|
| `make check` | typecheck + tests + smoke. **À lancer avant de rendre la main.** |
| `make smoke` | lance le serveur en stdio, liste tools / resources / prompts |
| `cd mcp-server && bun run smoke echo '{"text":"x"}'` | appelle un outil, affiche le résultat brut |
| `make inspect` | MCP Inspector (UI web) |
| `make http` | serveur HTTP sur http://localhost:3333/mcp |
| `claude mcp list` | état des serveurs vus par Claude Code |

## Structure de mcp-server/
```
src/index.ts              entrée stdio
src/http.ts               entrée HTTP
src/server.ts             assemble tools + resources + prompts
src/meta.ts               nom, version, instructions envoyées au client
src/log.ts                logger stderr
src/tools/                un fichier par outil, enregistré dans tools/index.ts
src/resources/            ressources (statique + template)
src/prompts/              prompts
test/server.test.ts       tests in-memory (client ↔ serveur sans process)
scripts/smoke.ts          smoke test stdio
scripts/hook-typecheck.ts hook Claude Code : typecheck après chaque édition .ts
```

## Règles
- Un outil = un fichier `src/tools/<nom>.ts` + une ligne dans `src/tools/index.ts` + un test. Détail : skill `mcp-tool`.
- Jamais de `console.log` dans le serveur : `log` de `src/log.ts`. En stdio, stdout est le protocole.
- Un outil ne lève jamais d'exception : `errorResult("message actionnable")`.
- Code sobre : pas d'abstraction avant le deuxième usage, pas de commentaire qui répète le code.
- Recherche dans le code : `rg motif .` (ripgrep, `brew install ripgrep`), pas `grep -r` : il ignore `node_modules` et le `.gitignore`. Toujours donner le chemin : sans lui, `rg` lit stdin et bloque dans un shell d'agent.
- Après ajout ou modification d'un outil : `make check`, puis redémarrer la session (ou `/mcp`) pour que le client recharge la liste.
- Les dossiers `*-starter/` sont les squelettes fournis par l'atelier : inutilisés.

## Skills Claude Code (`.claude/skills/`)
- `mcp-tool` : ajouter ou modifier un outil, conventions, gabarit.
- `mcp-debug` : serveur absent, outil non listé, connexion qui tombe.
- `github-mcp` : serveur MCP GitHub distant, toolsets, lecture seule.
