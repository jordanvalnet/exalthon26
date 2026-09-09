// Outil minimal de référence : schéma d'entrée, schéma de sortie, annotations.
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerEcho(server: McpServer) {
  server.registerTool(
    "echo",
    {
      title: "Echo",
      description:
        "Renvoie le texte reçu, éventuellement en majuscules. À utiliser en premier pour vérifier que le serveur répond.",
      inputSchema: {
        text: z.string().min(1).describe("Texte à renvoyer"),
        upper: z.boolean().optional().describe("Mettre en majuscules (défaut : non)"),
      },
      outputSchema: {
        text: z.string(),
        length: z.number().int(),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ text, upper }) => {
      const out = upper ? text.toUpperCase() : text;
      const structuredContent = { text: out, length: out.length };
      return {
        content: [{ type: "text", text: JSON.stringify(structuredContent) }],
        structuredContent,
      };
    },
  );
}
