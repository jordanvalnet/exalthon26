// Single responsibility: typed, logic-free access to the GitHub MCP tools we are allowed to use (read-only).
// One method per MCP tool. Nothing else in the code base may talk to GitHub.
import { McpClient, toolText, type McpToolResult } from "../mcp/client.ts";
import { findGitHubToken } from "../env.ts";

export const GITHUB_MCP_URL = "https://api.githubcopilot.com/mcp/";

export class GitHubMcp {
  constructor(private readonly client: McpClient = new McpClient(GITHUB_MCP_URL, `Bearer ${findGitHubToken()}`)) {}

  static fromEnv(): GitHubMcp { return new GitHubMcp(); }

  getMe() { return this.json<{ login: string; profile_url: string }>("get_me", {}); }

  searchRepositories(query: string) {
    return this.json<{ total_count: number; items: any[] }>("search_repositories", { query, minimal_output: false, perPage: 1 });
  }

  /** File text, or null when the path does not exist. */
  async getFileText(owner: string, repo: string, path: string, ref?: string): Promise<string | null> {
    const r = await this.client.callTool("get_file_contents", { owner, repo, path, ...(ref ? { ref } : {}) });
    if (r.isError) return null;
    const resource = (r.content ?? []).find((c) => c.type === "resource");
    if (resource) return toolText({ content: [resource] });
    return toolText(r);
  }

  /** Directory entries, or null when the path does not exist. */
  async listDirectory(owner: string, repo: string, path: string): Promise<Array<{ name: string; path: string; type: string }> | null> {
    const r = await this.client.callTool("get_file_contents", { owner, repo, path, fields: ["name", "type", "path"] });
    if (r.isError) return null;
    try { const v = JSON.parse(toolText(r)); return Array.isArray(v) ? v : null; } catch { return null; }
  }

  searchCode(query: string, perPage = 10) {
    return this.json<{ total_count: number; items: any[] }>("search_code", { query, perPage, fields: ["name", "path"] });
  }

  listCommits(owner: string, repo: string, page = 1, perPage = 100) {
    return this.json<any[]>("list_commits", { owner, repo, page, perPage, fields: ["sha", "commit", "author", "html_url"] });
  }

  listCollaborators(owner: string, repo: string) {
    return this.json<any>("list_repository_collaborators", { owner, repo, perPage: 100 });
  }

  searchUsers(login: string) {
    return this.json<{ items: any[] }>("search_users", { query: `${login} in:login`, perPage: 1 });
  }

  listIssues(owner: string, repo: string, state: "OPEN" | "CLOSED", after?: string) {
    return this.json<any>("list_issues", {
      owner, repo, state, perPage: 100, orderBy: "CREATED_AT", direction: "DESC", ...(after ? { after } : {}),
      fields: ["number", "title", "state", "user", "labels", "created_at", "updated_at", "comments"],
    });
  }

  listPullRequests(owner: string, repo: string, page = 1) {
    return this.json<any[]>("list_pull_requests", {
      owner, repo, state: "all", perPage: 100, page, sort: "created", direction: "desc",
      fields: ["number", "title", "state", "draft", "merged", "user", "created_at", "merged_at", "closed_at", "html_url"],
    });
  }

  listReleases(owner: string, repo: string, perPage = 30) {
    return this.json<any[]>("list_releases", { owner, repo, perPage, fields: ["tag_name", "name", "published_at", "prerelease", "draft", "html_url"] });
  }

  listTags(owner: string, repo: string, perPage = 10) { return this.json<any[]>("list_tags", { owner, repo, perPage }); }
  listBranches(owner: string, repo: string, perPage = 30) { return this.json<any[]>("list_branches", { owner, repo, perPage }); }

  /** Calls a tool and parses its JSON text. Throws with the tool's message on error. */
  private async json<T>(name: string, args: Record<string, unknown>): Promise<T> {
    const r: McpToolResult = await this.client.callTool(name, args);
    const text = toolText(r);
    if (r.isError) throw new Error(`${name}: ${text.slice(0, 300)}`);
    try { return JSON.parse(text) as T; } catch { throw new Error(`${name}: non-JSON answer: ${text.slice(0, 200)}`); }
  }
}
