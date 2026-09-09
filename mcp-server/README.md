# mcp-server

Serveur MCP maison : bun + TypeScript + `@modelcontextprotocol/sdk`.
Structure, règles et conventions : `../AGENTS.md`. Ajouter un outil : skill `mcp-tool`.

## Commandes
```bash
bun install
bun run check                     # typecheck + tests + smoke
bun run smoke                     # liste tools / resources / prompts
bun run smoke echo '{"text":"x"}' # appelle un outil
bun run inspect                   # MCP Inspector (UI web)
bun run http                      # HTTP sur :3333, rechargement auto
```

## Brancher le serveur
- **Claude Code** : déjà fait via `../.mcp.json` (`hackathon`). Vérifier : `claude mcp list`.
- **VS Code / Copilot** : `.vscode/mcp.json` →
  `{"servers": {"hackathon": {"type": "stdio", "command": "bun", "args": ["run", "mcp-server/src/index.ts"]}}}`
- **HTTP** : `bun run http` puis pointer un client sur `http://localhost:3333/mcp` (stateless, réponses JSON).
  Test rapide : `curl -s localhost:3333/health`.

## Variables d'environnement
| Variable | Rôle | Défaut |
|---|---|---|
| `GITHUB_PAT` | token pour `github_repo` (dépôts privés) | vide : dépôts publics seulement |
| `MCP_FILES_ROOT` | racine autorisée pour `read_file` | dossier courant au lancement |
| `LOG_LEVEL` | debug / info / warn / error | info |
| `PORT` | port du mode HTTP | 3333 |
