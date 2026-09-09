---
name: mcp-debug
description: Diagnostiquer le serveur MCP maison quand Claude Code ne le voit pas, qu'un outil manque, qu'un appel échoue ou que la connexion tombe. Ordre des vérifications, commandes, causes fréquentes.
---
# Diagnostic du serveur MCP

Dans cet ordre, s'arrêter au premier qui échoue :
1. `make check` : typecheck, tests, smoke. Si ça passe, le serveur est sain et le problème est côté branchement.
2. `claude mcp list` : `hackathon` doit être "Connected".
3. Logs stderr du serveur tel que lancé par Claude Code :
   `~/Library/Caches/claude-cli-nodejs/<slug-du-repo>/mcp-logs-hackathon/` (slug = chemin du repo avec `-` à la place de `/`).
4. `make inspect` : Inspector web, appelle chaque outil à la main.
5. `claude --debug` puis `/mcp` pour voir le handshake.

| Symptôme | Cause probable | Correctif |
|---|---|---|
| `hackathon` absent de `/mcp` | serveur non approuvé, ou `bun` hors du PATH de Claude Code | accepter le serveur au lancement ; lancer `claude` depuis un terminal où `bun --version` répond |
| `failed` ou `connecting` bloqué | crash au démarrage (erreur TS, import cassé) | `make smoke` affiche l'erreur exacte |
| Connexion coupée au premier appel | quelque chose écrit sur stdout | chercher `console.log` / `process.stdout` ; utiliser `log` |
| Nouvel outil invisible | le client garde la liste reçue à l'init | redémarrer la session ou `/mcp` |
| `github` : "invalid header value" | `GITHUB_PAT` vide ou multi-ligne | `set -a; source .env; set +a` avant `claude` |
| Réponse `isError: true` | l'outil a renvoyé une erreur volontaire | lire le texte : il dit quoi corriger |
| Refus avant d'atteindre l'outil | arguments non conformes au schéma zod | comparer avec `inputSchema` ; rendre les `.describe()` plus explicites |
