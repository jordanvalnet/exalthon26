// Accès GitHub pour le code : uniquement via le serveur MCP GitHub (le même que .mcp.json). Aucun appel REST.
// Le protocole et les outils typés vivent dans onboarding/src/ ; ici on ne fait que brancher le token GITHUB_PAT.
import { McpClient } from "../onboarding/src/mcp/client.ts";
import { GitHubMcp, GITHUB_MCP_URL } from "../onboarding/src/github/GitHubMcp.ts";

export { GitHubMcp, GITHUB_MCP_URL };

function token(): string {
  const t = process.env.GITHUB_PAT;
  if (!t) throw new Error("GITHUB_PAT manquant : copier .env.example en .env et y coller le token");
  return t.replace(/^Bearer\s+/i, "");
}

export function mcp(): McpClient {
  return new McpClient(GITHUB_MCP_URL, `Bearer ${token()}`);
}

export function github(): GitHubMcp {
  return new GitHubMcp(mcp());
}

export async function whoami(): Promise<string> {
  const me = await github().getMe();
  return me.login;
}
