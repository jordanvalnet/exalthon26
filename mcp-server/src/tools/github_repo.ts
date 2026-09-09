// Outil qui appelle une API externe : fetch, token optionnel via l'environnement, erreurs HTTP.
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { errorResult } from "./_helpers.ts";
import { log } from "../log.ts";

type GithubRepo = {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  open_issues_count: number;
  default_branch: string;
  pushed_at: string;
  html_url: string;
};

export function registerGithubRepo(server: McpServer) {
  server.registerTool(
    "github_repo",
    {
      title: "Fiche d'un dépôt GitHub",
      description:
        "Retourne les informations principales d'un dépôt GitHub : description, étoiles, issues ouvertes, " +
        "branche par défaut, date du dernier push. Dépôts publics sans configuration ; dépôts privés si GITHUB_PAT est défini.",
      inputSchema: {
        owner: z.string().min(1).describe("Propriétaire, ex : anthropics"),
        repo: z.string().min(1).describe("Nom du dépôt, ex : claude-code"),
      },
      outputSchema: {
        full_name: z.string(),
        description: z.string().nullable(),
        stars: z.number().int(),
        open_issues: z.number().int(),
        default_branch: z.string(),
        pushed_at: z.string(),
        url: z.string(),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
    },
    async ({ owner, repo }) => {
      const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "User-Agent": "hackathon-mcp-server",
      };
      if (process.env.GITHUB_PAT) headers.Authorization = `Bearer ${process.env.GITHUB_PAT}`;

      const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
      let res: Response;
      try {
        res = await fetch(url, { headers });
      } catch (err) {
        log.warn("github_repo: réseau", { url, err: String(err) });
        return errorResult(`Impossible de joindre GitHub : ${(err as Error).message}`);
      }
      if (!res.ok) {
        return errorResult(`GitHub a répondu ${res.status} pour ${owner}/${repo}.`);
      }
      const data = (await res.json()) as GithubRepo;
      const structuredContent = {
        full_name: data.full_name,
        description: data.description,
        stars: data.stargazers_count,
        open_issues: data.open_issues_count,
        default_branch: data.default_branch,
        pushed_at: data.pushed_at,
        url: data.html_url,
      };
      return {
        content: [{ type: "text", text: JSON.stringify(structuredContent, null, 2) }],
        structuredContent,
      };
    },
  );
}
