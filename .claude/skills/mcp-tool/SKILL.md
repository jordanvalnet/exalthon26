---
name: mcp-tool
description: Ajouter ou modifier un outil, une ressource ou un prompt du serveur MCP maison (mcp-server/). Conventions de nommage, schémas zod, erreurs, tests, vérification.
---
# Ajouter un outil au serveur MCP

## Étapes
1. Créer `mcp-server/src/tools/<nom>.ts` en copiant `echo.ts` (cas simple) ou `github_repo.ts` (API externe, erreurs).
2. L'appeler dans `src/tools/index.ts`.
3. Ajouter au moins deux tests dans `test/server.test.ts` : cas nominal, cas d'erreur.
4. `make check` depuis la racine. Puis `cd mcp-server && bun run smoke <nom> '{"arg":"valeur"}'` pour voir la sortie réelle.
5. Dire à l'utilisateur de redémarrer la session (ou `/mcp`) pour voir le nouvel outil.

## Conventions
- **Nom** : snake_case, `verbe_objet` (`search_issues`, `create_note`). Stable : le modèle l'appelle tel quel.
- **Description** : dit quand l'utiliser et ce que ça renvoie, 1 à 3 phrases. C'est ce que lit le modèle pour choisir l'outil.
- **inputSchema** : zod, chaque champ avec `.describe()`, le minimum de champs. Optionnel = défaut indiqué dans la description.
- **outputSchema** si la sortie est structurée : renvoyer `structuredContent` et `content` texte (JSON.stringify du même objet).
- **annotations** honnêtes : `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`. Le client s'en sert pour demander confirmation.
- **Erreurs** : jamais `throw`, toujours `errorResult("message qui dit quoi corriger")`.
- **Logs** : `log.info/warn` de `src/log.ts`. Jamais `console.log`.
- **Secrets** : `process.env`, passés par `.mcp.json` (`"env": {"X": "${X:-}"}`).

## Gabarit
```ts
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { errorResult, textResult } from "./_helpers.ts";

export function registerMonOutil(server: McpServer) {
  server.registerTool(
    "mon_outil",
    {
      title: "Mon outil",
      description: "Fait X à partir de Y. À utiliser quand Z.",
      inputSchema: { y: z.string().min(1).describe("…") },
      annotations: { readOnlyHint: true },
    },
    async ({ y }) => {
      const r = await faireX(y);
      if (!r) return errorResult(`Rien trouvé pour ${y} : vérifier …`);
      return textResult(r);
    },
  );
}
```
Ressource statique ou à template : voir `src/resources/index.ts`. Prompt : `src/prompts/index.ts`.
