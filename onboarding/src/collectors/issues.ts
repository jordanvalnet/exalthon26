// Single responsibility: ALL issues (tickets), open and closed, with an explicit cap and honest totals.
import type { GitHubMcp } from "../github/GitHubMcp.ts";
import type { Collected, RepoMetadata } from "../types.ts";

export interface IssueRow { number: number; title: string; state: string; author: string; labels: string[]; createdAt: string; updatedAt: string; comments: number }
export interface Issues { open: IssueRow[]; closed: IssueRow[]; openCapped: boolean; closedCapped: boolean; labelCounts: Array<{ label: string; count: number }>; mostDiscussed: IssueRow[]; oldestOpen: IssueRow | null }

export const MAX_ISSUE_PAGES = 3;   // 300 per state

export async function collectIssues(gh: GitHubMcp, meta: RepoMetadata): Promise<Collected<Issues>> {
  const gaps = [];
  const [open, openCapped] = await allIssues(gh, meta, "OPEN");
  const [closed, closedCapped] = await allIssues(gh, meta, "CLOSED");
  const url = `${meta.htmlUrl}/issues`;
  if (openCapped) gaps.push({ what: "complete list of open issues", reason: `capped at ${open.length}; see GitHub for the rest`, url });
  if (closedCapped) gaps.push({ what: "complete list of closed issues", reason: `capped at ${closed.length}`, url: `${url}?q=is%3Aissue+is%3Aclosed` });
  const labelCounts = new Map<string, number>();
  for (const i of [...open, ...closed]) for (const l of i.labels) labelCounts.set(l, (labelCounts.get(l) ?? 0) + 1);
  return {
    facts: {
      open, closed, openCapped, closedCapped,
      labelCounts: [...labelCounts].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 15),
      mostDiscussed: [...open, ...closed].sort((a, b) => b.comments - a.comments).slice(0, 5),
      oldestOpen: open.length ? open.reduce((a, b) => (a.createdAt < b.createdAt ? a : b)) : null,
    },
    sources: [{ what: `${open.length} open + ${closed.length} closed issues`, via: "list_issues" }],
    gaps,
  };
}

async function allIssues(gh: GitHubMcp, meta: RepoMetadata, state: "OPEN" | "CLOSED"): Promise<[IssueRow[], boolean]> {
  const rows: IssueRow[] = [];
  let after: string | undefined; let capped = false;
  for (let page = 1; ; page++) {
    const res = await gh.listIssues(meta.owner, meta.repo, state, after);
    const items: any[] = Array.isArray(res) ? res : res.issues ?? res.items ?? res.nodes ?? [];
    rows.push(...items.map(toRow));
    const info = res.pageInfo ?? {};
    if (!info.hasNextPage || !info.endCursor) break;
    if (page >= MAX_ISSUE_PAGES) { capped = true; break; }
    after = info.endCursor;
  }
  return [rows, capped];
}

function toRow(i: any): IssueRow {
  return {
    number: i.number, title: i.title, state: String(i.state ?? "").toLowerCase(), author: i.user?.login ?? "unknown",
    labels: (i.labels ?? []).map((l: any) => (typeof l === "string" ? l : l.name)), createdAt: i.created_at, updatedAt: i.updated_at, comments: i.comments ?? 0,
  };
}
