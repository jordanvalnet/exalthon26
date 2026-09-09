// Single responsibility: ALL pull requests (proposed changes), with an explicit cap and merge dynamics.
import type { GitHubMcp } from "../github/GitHubMcp.ts";
import type { Collected, RepoMetadata } from "../types.ts";

export interface PrRow { number: number; title: string; status: "open" | "draft" | "merged" | "closed"; author: string; createdAt: string; mergedAt: string | null; url: string }
export interface PullRequests { rows: PrRow[]; capped: boolean; counts: { open: number; draft: number; merged: number; closed: number }; authors: Array<{ login: string; prs: number }>; medianDaysToMerge: number | null }

export const MAX_PR_PAGES = 3;   // 300

export async function collectPullRequests(gh: GitHubMcp, meta: RepoMetadata): Promise<Collected<PullRequests>> {
  const rows: PrRow[] = [];
  let capped = false;
  for (let page = 1; page <= MAX_PR_PAGES; page++) {
    const batch = await gh.listPullRequests(meta.owner, meta.repo, page);
    rows.push(...batch.map(toRow));
    if (batch.length < 100) break;
    if (page === MAX_PR_PAGES) capped = true;
  }
  const counts = { open: 0, draft: 0, merged: 0, closed: 0 };
  for (const r of rows) counts[r.status]++;
  const byAuthor = new Map<string, number>();
  for (const r of rows) byAuthor.set(r.author, (byAuthor.get(r.author) ?? 0) + 1);
  const days = rows.filter((r) => r.mergedAt).map((r) => (Date.parse(r.mergedAt!) - Date.parse(r.createdAt)) / 86_400_000).sort((a, b) => a - b);
  return {
    facts: {
      rows, capped, counts,
      authors: [...byAuthor].map(([login, prs]) => ({ login, prs })).sort((a, b) => b.prs - a.prs).slice(0, 10),
      medianDaysToMerge: days.length ? Math.round(days[Math.floor(days.length / 2)] * 10) / 10 : null,
    },
    sources: [{ what: `${rows.length} pull requests (all states)`, via: "list_pull_requests" }],
    gaps: capped ? [{ what: "complete list of pull requests", reason: `capped at ${rows.length}`, url: `${meta.htmlUrl}/pulls?q=is%3Apr` }] : [],
  };
}

function toRow(p: any): PrRow {
  const status = p.merged || p.merged_at ? "merged" : p.state === "open" ? (p.draft ? "draft" : "open") : "closed";
  return { number: p.number, title: p.title, status, author: p.user?.login ?? "unknown", createdAt: p.created_at, mergedAt: p.merged_at ?? null, url: p.html_url };
}
