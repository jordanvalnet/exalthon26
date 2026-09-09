// Sous-agent 1b-issues en code : `bun run issues owner/repo [profil] [cache]` : issues, PR et roadmap, sans lire de fichier.
// Le profil est accepté pour la symétrie avec meta mais n'est pas utilisé.
// GitHub uniquement via le serveur MCP : collecteurs de Rado (onboarding/src/collectors) plus list_issues,
// list_pull_requests et search_pull_requests en direct. Écrit <cache>/parts/issues.json (blocs issues, pulls, roadmap)
// et un bilan parts/issues.md (aussi sur stdout). L'activité et les risques restent à 1a-meta.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { collectIssues, type IssueRow } from "../../onboarding/src/collectors/issues.ts";
import { collectPullRequests, type PrRow } from "../../onboarding/src/collectors/pullRequests.ts";
import { collectRepository } from "../../onboarding/src/collectors/repository.ts";
import { GitHubMcp } from "../../onboarding/src/github/GitHubMcp.ts";
import { toolText, type McpClient } from "../../onboarding/src/mcp/client.ts";
import { Facts } from "../facts.ts";
import { mcp } from "../github.ts";

const DAY = 86_400_000;
const THEME = /enhancement|feature|proposal|rfc|discussion|idea/i;

export type OpenPr = { number: number; title: string; html_url: string; updated_at: string; draft?: boolean };
export type Counts = { open_issues: number; closed_30d: number; open_prs: number };

// Construit les blocs issues, pulls et roadmap à partir des lignes brutes. Pur, testable sans réseau.
export function buildIssuesPart(url: string, open: IssueRow[], prs: PrRow[], openPrs: OpenPr[], counts: Counts, now = Date.now()) {
  const link = (i: IssueRow) => ({ number: i.number, title: i.title, url: `${url}/issues/${i.number}` });
  const byComments = [...open].sort((a, b) => b.comments - a.comments);
  const labels = new Map<string, number>();
  for (const i of open) for (const l of i.labels) labels.set(l, (labels.get(l) ?? 0) + 1);
  const sorted = [...labels].sort((a, b) => b[1] - a[1]);
  const since = now - 30 * DAY;
  return {
    issues: {
      open: counts.open_issues,
      closed_30d: counts.closed_30d,
      by_label: Object.fromEntries(sorted.slice(0, 15)),
      good_first: open.filter((i) => i.labels.some((l) => /good first issue/i.test(l))).slice(0, 5).map(link),
      hot: byComments.slice(0, 10).map((i) => ({ ...link(i), comments: i.comments })),
    },
    pulls: {
      open: counts.open_prs,
      merged_30d: prs
        .filter((p): p is PrRow & { mergedAt: string } => !!p.mergedAt && Date.parse(p.mergedAt) >= since)
        .map((p) => ({ number: p.number, title: p.title, url: p.url, merged_at: p.mergedAt })),
    },
    roadmap: {
      open_prs: openPrs.map((p) => ({ number: p.number, title: p.title, url: p.html_url, updated_at: p.updated_at, draft: p.draft ?? false })),
      requests: byComments
        .filter((i) => !i.labels.some((l) => /bug/i.test(l)))
        .slice(0, 10)
        .map((i) => ({ ...link(i), comments: i.comments, labels: i.labels })),
      themes: sorted.filter(([l]) => THEME.test(l)).map(([label, count]) => ({ label, count })),
    },
  };
}

async function tool<T>(client: McpClient, name: string, args: Record<string, unknown>): Promise<T> {
  const r = await client.callTool(name, args);
  const text = toolText(r);
  if (r.isError) throw new Error(`${name} : ${text.slice(0, 200)}`);
  return JSON.parse(text) as T;
}

// Issues fermées mises à jour depuis `since` : approximation de « fermées sur 30 jours », closed_at n'étant pas exposé.
async function closedSince(client: McpClient, owner: string, repo: string, since: number) {
  let count = 0;
  let after: string | undefined;
  for (let page = 1; page <= 3; page++) {
    const res = await tool<{ issues: { updated_at: string }[]; pageInfo: { hasNextPage: boolean; endCursor?: string } }>(client, "list_issues", {
      owner, repo, state: "CLOSED", orderBy: "UPDATED_AT", direction: "DESC", perPage: 100, fields: ["number", "updated_at"], ...(after ? { after } : {}),
    });
    const recent = res.issues.filter((i) => Date.parse(i.updated_at) >= since);
    count += recent.length;
    if (recent.length < res.issues.length || !res.pageInfo.hasNextPage || !res.pageInfo.endCursor) return { count, capped: false };
    after = res.pageInfo.endCursor;
  }
  return { count, capped: true };
}

export async function collectIssuesPart(full: string, dir: string) {
  const [owner, repo] = full.split("/") as [string, string];
  const at = new Date().toISOString();
  const now = Date.now();
  const client = mcp();
  let calls = 0;
  const raw = client.callTool.bind(client);
  client.callTool = (name, args) => (calls++, raw(name, args));
  const gh = new GitHubMcp(client);
  const missing = ["milestones (pas d'outil MCP)", "pulls.awaiting_review (reviews non exposées)", "closed_30d approximé sur updated_at"];
  mkdirSync(path.join(dir, "parts"), { recursive: true });

  const r = (await collectRepository(gh, { owner, repo })).facts;
  const issues = await collectIssues(gh, r);
  const prs = await collectPullRequests(gh, r);
  const openPrs = await tool<OpenPr[]>(client, "list_pull_requests", {
    owner, repo, state: "open", sort: "updated", direction: "desc", perPage: 10, fields: ["number", "title", "html_url", "updated_at", "draft"],
  });
  const openPrCount = (await tool<{ total_count: number }>(client, "search_pull_requests", { query: `repo:${full} is:open`, perPage: 1, fields: ["number"] })).total_count;
  const closed = await closedSince(client, owner, repo, now - 30 * DAY);
  if (closed.capped) missing.push("closed_30d tronqué à 300");
  for (const g of [...issues.gaps, ...prs.gaps]) missing.push(`${g.what} : ${g.reason}`);

  // open_issues_count de GitHub compte aussi les PR ouvertes.
  const counts = { open_issues: Math.max(0, r.openIssuesAndPrs - openPrCount), closed_30d: closed.count, open_prs: openPrCount };
  const blocks = buildIssuesPart(r.htmlUrl, issues.facts.open, prs.facts.rows, openPrs, counts, now);
  const parsed = Facts.omit({ schema: true, collected: true }).partial().safeParse(blocks);
  if (!parsed.success) throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")} : ${i.message}`).join("\n"));
  writeFileSync(path.join(dir, "parts", "issues.json"), JSON.stringify({ ...blocks, collected: { by: "1b-issues", at } }, null, 2) + "\n");

  const median = prs.facts.medianDaysToMerge;
  const bilan = [
    `# ${r.fullName} : issues et PR`,
    "",
    `- Issues ouvertes : ${counts.open_issues} · fermées sur 30 jours : ${counts.closed_30d}`,
    `- Labels ouverts : ${Object.entries(blocks.issues.by_label).slice(0, 8).map(([l, n]) => `${l} ${n}`).join(", ") || "aucun"}`,
    `- Les plus discutées : ${blocks.issues.hot.slice(0, 5).map((i) => `#${i.number} (${i.comments})`).join(", ") || "aucune"}`,
    `- Good first issues : ${blocks.issues.good_first.length}`,
    `- PR ouvertes : ${counts.open_prs} · fusionnées sur 30 jours : ${blocks.pulls.merged_30d.length}${median === null ? "" : ` · médiane de fusion ${median} j`}`,
    `- Roadmap : ${blocks.roadmap.requests.length} demandes hors bug · thèmes : ${blocks.roadmap.themes.map((t) => `${t.label} ${t.count}`).join(", ") || "aucun"}`,
    "",
    `1b-issues : OK · ${calls} appels MCP · manques : ${missing.join(", ")}`,
  ].join("\n");
  writeFileSync(path.join(dir, "parts", "issues.md"), bilan + "\n");
  return bilan;
}

if (import.meta.main) {
  const [full, , dirArg] = process.argv.slice(2);
  if (!full?.includes("/")) {
    console.error("Usage : bun run issues owner/repo [profil] [dossier du cache]");
    process.exit(2);
  }
  const dir = dirArg ?? path.join("onboard/cache", full.replace("/", "__"));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  console.log(await collectIssuesPart(full, dir));
}
