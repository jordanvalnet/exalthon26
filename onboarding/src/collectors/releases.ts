// Single responsibility: releases (published versions) and recent activity rhythm from commits.
import type { GitHubMcp } from "../github/GitHubMcp.ts";
import type { Collected, RepoMetadata } from "../types.ts";

export interface Releases {
  releases: Array<{ tag: string; name: string; date: string; prerelease: boolean }>;
  latest: { tag: string; date: string } | null; first: { tag: string; date: string } | null; capped: boolean;
  lastCommitDate: string | null; commitsLast90Days: number; commitsSeen: number; distinctAuthorsSeen: number;
}

export async function collectReleases(gh: GitHubMcp, meta: RepoMetadata): Promise<Collected<Releases>> {
  const sources = [], gaps = [];
  let rel: any[] = [];
  try { rel = await gh.listReleases(meta.owner, meta.repo, 100); sources.push({ what: "releases", via: "list_releases" }); }
  catch (e) { gaps.push({ what: "releases", reason: String(e).slice(0, 100), url: `${meta.htmlUrl}/releases` }); }
  const releases = rel.filter((r) => !r.draft).map((r) => ({ tag: r.tag_name, name: r.name ?? r.tag_name, date: r.published_at, prerelease: !!r.prerelease }));

  const commits = await gh.listCommits(meta.owner, meta.repo, 1, 100);
  sources.push({ what: `${commits.length} most recent commits`, via: "list_commits" });
  const cutoff = Date.now() - 90 * 86_400_000;
  const dates = commits.map((c) => c.commit?.author?.date).filter(Boolean);
  const authors = new Set(commits.map((c) => c.author?.login ?? c.commit?.author?.name));

  return {
    facts: {
      releases, latest: releases[0] ? { tag: releases[0].tag, date: releases[0].date } : null,
      first: releases.length && rel.length < 100 ? { tag: releases.at(-1)!.tag, date: releases.at(-1)!.date } : null, capped: rel.length >= 100,
      lastCommitDate: dates[0] ?? null, commitsLast90Days: dates.filter((d) => Date.parse(d) > cutoff).length, commitsSeen: commits.length, distinctAuthorsSeen: authors.size,
    },
    sources, gaps,
  };
}
