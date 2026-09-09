// Accès GitHub pour le code : uniquement via le serveur MCP GitHub (le même que .mcp.json). Aucun appel REST.
// Le protocole et les outils typés vivent dans onboarding/src/ ; ici on ne fait que brancher le token GITHUB_PAT.
import { McpClient } from "../onboarding/src/mcp/client.ts";
import { GitHubMcp, GITHUB_MCP_URL } from "../onboarding/src/github/GitHubMcp.ts";

<<<<<<< Updated upstream
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
=======
export async function ghRes(path: string, init: RequestInit = {}): Promise<Response> {
  const token = process.env.GITHUB_PAT;
  if (!token) throw new Error("GITHUB_PAT manquant : copier .env.example en .env et y coller le token");
  return fetch(API + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "exalthon26",
      ...(init.headers ?? {}),
    },
  });
}

export async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await ghRes(path, init);
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status} sur ${path}`);
  return res.json() as Promise<T>;
>>>>>>> Stashed changes
}

export async function whoami(): Promise<string> {
  const me = await github().getMe();
  return me.login;
}
