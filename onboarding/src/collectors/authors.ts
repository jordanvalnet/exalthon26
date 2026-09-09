// Single responsibility: WHO — owner, commit authors, authorship files, collaborators (when permitted).
import type { GitHubMcp } from "../github/GitHubMcp.ts";
import type { Collected, RepoMetadata } from "../types.ts";
import type { Docs } from "./docs.ts";

export interface Authors {
  owner: { login: string; type: string; url: string; displayName: string | null };
  commitsSeen: number; firstCommit: { author: string; date: string } | null; lastCommit: { author: string; date: string } | null;
  topCommitters: Array<{ login: string; commits: number }>;
  authorshipFiles: Array<{ path: string; excerpt: string }>;
  licenseCopyright: string | null;
  collaborators: string[] | null;                  // null = not permitted
}

const MAX_COMMIT_PAGES = 3;

export async function collectAuthors(gh: GitHubMcp, meta: RepoMetadata, docs: Docs): Promise<Collected<Authors>> {
  const sources = [], gaps = [];
  let displayName: string | null = null;
  try { const u = await gh.searchUsers(meta.ownerLogin); displayName = u.items?.[0]?.name ?? null; sources.push({ what: `profile of ${meta.ownerLogin}`, via: "search_users" }); } catch {}

  const commits: any[] = [];
  for (let page = 1; page <= MAX_COMMIT_PAGES; page++) {
    const batch = await gh.listCommits(meta.owner, meta.repo, page);
    commits.push(...batch);
    if (batch.length < 100) break;
  }
  sources.push({ what: `${commits.length} most recent commits`, via: "list_commits" });
  if (commits.length >= 100 * MAX_COMMIT_PAGES) gaps.push({ what: "full commit history", reason: `only the ${commits.length} most recent commits were read; the first author is approximate`, url: `${meta.htmlUrl}/commits/${meta.defaultBranch}` });

  const counts = new Map<string, number>();
  const nameOf = (c: any) => c.author?.login ?? c.commit?.author?.name ?? "unknown";
  for (const c of commits) counts.set(nameOf(c), (counts.get(nameOf(c)) ?? 0) + 1);
  const top = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([login, n]) => ({ login, commits: n }));
  const oldest = commits.at(-1), newest = commits[0];

  const authorshipFiles = docs.files.filter((f) => /^(AUTHORS|CONTRIBUTORS|MAINTAINERS|CITATION)/i.test(f.path)).map((f) => ({ path: f.path, excerpt: f.text.slice(0, 800) }));
  const license = docs.files.find((f) => /^LICENSE/i.test(f.path));
  const copyright = license?.text.match(/copyright.*$/im)?.[0]?.trim() ?? null;

  let collaborators: string[] | null = null;
  try { const c = await gh.listCollaborators(meta.owner, meta.repo); const list = Array.isArray(c) ? c : c.collaborators ?? c.items ?? []; collaborators = list.map((x: any) => x.login); sources.push({ what: "collaborators", via: "list_repository_collaborators" }); }
  catch (e) { gaps.push({ what: "collaborators list", reason: `not permitted for this token (${String(e).slice(0, 80)})`, url: `${meta.htmlUrl}/graphs/contributors` }); }

  return {
    facts: {
      owner: { login: meta.ownerLogin, type: meta.ownerType, url: meta.ownerUrl, displayName },
      commitsSeen: commits.length,
      firstCommit: oldest ? { author: nameOf(oldest), date: oldest.commit?.author?.date } : null,
      lastCommit: newest ? { author: nameOf(newest), date: newest.commit?.author?.date } : null,
      topCommitters: top, authorshipFiles, licenseCopyright: copyright, collaborators,
    },
    sources, gaps,
  };
}
