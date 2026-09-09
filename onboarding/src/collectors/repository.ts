// Single responsibility: the repository's identity card (metadata), via search_repositories.
import type { GitHubMcp } from "../github/GitHubMcp.ts";
import type { Collected, RepoMetadata, RepoRef } from "../types.ts";

export async function collectRepository(gh: GitHubMcp, ref: RepoRef): Promise<Collected<RepoMetadata>> {
  const res = await gh.searchRepositories(`repo:${ref.owner}/${ref.repo}`);
  const r = res.items?.[0];
  if (!r) throw new Error(`Repository ${ref.owner}/${ref.repo} not found or not visible to this token.`);
  const facts: RepoMetadata = {
    owner: ref.owner, repo: ref.repo, fullName: r.full_name, htmlUrl: r.html_url,
    description: r.description ?? null, homepage: r.homepage || null,
    ownerLogin: r.owner?.login, ownerType: r.owner?.type, ownerUrl: r.owner?.html_url,
    defaultBranch: r.default_branch, language: r.language ?? null, topics: r.topics ?? [],
    license: r.license ? { key: r.license.key, name: r.license.name } : null,
    createdAt: r.created_at, pushedAt: r.pushed_at, updatedAt: r.updated_at,
    stars: r.stargazers_count ?? 0, forks: r.forks_count ?? 0, watchers: r.subscribers_count ?? r.watchers_count ?? 0,
    openIssuesAndPrs: r.open_issues_count ?? 0, archived: !!r.archived, visibility: r.visibility ?? (r.private ? "private" : "public"),
    hasWiki: !!r.has_wiki, hasProjects: !!r.has_projects, hasDiscussions: !!r.has_discussions, hasPages: !!r.has_pages, hasIssues: !!r.has_issues,
  };
  return { facts, sources: [{ what: `metadata of ${facts.fullName}`, via: "search_repositories" }], gaps: [] };
}
