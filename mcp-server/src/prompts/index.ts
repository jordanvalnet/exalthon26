// Prompts : gabarits de conversation que l'utilisateur invoque depuis le client
// (dans Claude Code : /mcp__hackathon__summarize_repo).
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPrompts(server: McpServer) {
  server.registerPrompt(
    "summarize_repo",
    {
      title: "Résumer un dépôt",
      description: "Demande un résumé structuré d'un dépôt GitHub en s'appuyant sur l'outil github_repo.",
      argsSchema: { repo: z.string().describe("Dépôt au format owner/name") },
    },
    ({ repo }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text:
              `Utilise l'outil github_repo pour récupérer la fiche du dépôt ${repo}, ` +
              `puis résume en cinq lignes : objet du projet, activité récente, santé (issues, étoiles), ` +
              `et une recommandation.`,
          },
        },
      ],
    }),
  );
}
