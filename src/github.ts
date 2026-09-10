// Accès GitHub pour le code : uniquement le serveur MCP GitHub (le même que .mcp.json), jamais l'API REST en direct.
// Le protocole MCP et les outils typés vivent dans onboarding/src/ ; ici on branche le token GITHUB_PAT et la couche
// de quota (src/quota.ts), par laquelle passe tout appel d'outil du code.
import { McpClient } from "../onboarding/src/mcp/client.ts";
import { GitHubMcp, GITHUB_MCP_URL } from "../onboarding/src/github/GitHubMcp.ts";
import { Quota, type QuotaOptions } from "./quota.ts";

export { GitHubMcp, GITHUB_MCP_URL };

function token(): string {
  const t = process.env.GITHUB_PAT;
  if (!t) throw new Error("GITHUB_PAT manquant : copier .env.example en .env et y coller le token");
  return t.replace(/^Bearer\s+/i, "");
}

// Connexion brute : ne sert qu'à `quota()` et à lister les outils. Les appels d'outils passent par `quota()`.
export function mcp(): McpClient {
  return new McpClient(GITHUB_MCP_URL, `Bearer ${token()}`);
}

export function quota(opts: QuotaOptions): Quota {
  return new Quota(mcp(), opts);
}

export function github(): GitHubMcp {
  return new GitHubMcp(quota({ by: "github" }).client("github"));
}

export async function whoami(): Promise<string> {
  const me = await github().getMe();
  return me.login;
}
