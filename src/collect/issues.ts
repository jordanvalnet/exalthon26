// Sous-agent 1b-issues en code : `bun run issues owner/repo [profil] [cache] [--budget N] [--deadline S]` : issues, PR et
// roadmap, sans lire de fichier. Le profil est accepté pour la symétrie avec meta mais n'est pas utilisé.
// GitHub uniquement via le serveur MCP, chaque appel passant par src/quota.ts avec sa priorité (le plan ci-dessous, exécuté
// dans l'ordre). Écrit <cache>/parts/issues.json (blocs issues, pulls, roadmap), un bilan parts/issues.md (aussi sur stdout)
// et l'état du quota dans parts/quota.json. L'activité et les risques restent à 1a-meta.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { IssueRow } from "../../onboarding/src/collectors/issues.ts";
import type { PrRow } from "../../onboarding/src/collectors/pullRequests.ts";
import { Facts } from "../facts.ts";
import { quota } from "../github.ts";
import { type Planned, type Quota, quotaArgs } from "../quota.ts";

const DAY = 86_400_000;
const THEME = /enhancement|feature|proposal|rfc|discussion|idea/i;
const BUDGET = 12;
const DEADLINE = 60;

type Repo = { full_name: string; html_url: string; open_issues_count: number };
type RawIssue = { number: number; title: string; user?: { login: string } | null; labels?: ({ name: string } | string)[]; created_at: string; updated_at: string; comments?: number };
type RawPr = { number: number; title: string; state: string; draft?: boolean; merged?: boolean; user?: { login: string } | null; created_at: string; merged_at?: string | null; html_url: string };
type Page<T> = { issues: T[]; pageInfo: { hasNextPage: boolean; endCursor?: string } };
export type OpenPr = { number: number; title: string; html_url: string; updated_at: string; draft?: boolean };
export type Counts = { open_issues?: number; closed_30d?: number; open_prs?: number };

function plan(full: string): Planned[] {
  const gh = `https://github.com/${full}`;
  return [
    { label: "repo", priority: "P0", count: 1, url: gh },
    { label: "issues", priority: "P1", count: 3, url: `${gh}/issues` },
    { label: "pulls", priority: "P1", count: 3, url: `${gh}/pulls?q=is%3Apr` },
    { label: "open_prs", priority: "P1", count: 1, url: `${gh}/pulls` },
    { label: "open_pr_count", priority: "P1", count: 1, url: `${gh}/pulls` },
    { label: "closed_30d", priority: "P2", count: 3, url: `${gh}/issues?q=is%3Aissue+is%3Aclosed` },
  ];
}

const toIssue = (i: RawIssue): IssueRow => ({
  number: i.number,
  title: i.title,
  state: "open",
  author: i.user?.login ?? "unknown",
  labels: (i.labels ?? []).map((l) => (typeof l === "string" ? l : l.name)),
  createdAt: i.created_at,
  updatedAt: i.updated_at,
  comments: i.comments ?? 0,
});
const toPr = (p: RawPr): PrRow => ({
  number: p.number,
  title: p.title,
  status: p.merged || p.merged_at ? "merged" : p.state === "open" ? (p.draft ? "draft" : "open") : "closed",
  author: p.user?.login ?? "unknown",
  createdAt: p.created_at,
  mergedAt: p.merged_at ?? null,
  url: p.html_url,
});

// Construit les blocs issues, pulls et roadmap à partir des lignes brutes. Pur, testable sans réseau.
// Une liste null (appel jeté) ou un compte absent = les champs qui en dépendent sont omis, jamais mis à zéro.
export function buildIssuesPart(url: string, open: IssueRow[] | null, prs: PrRow[] | null, openPrs: OpenPr[] | null, counts: Counts, now = Date.now()) {
  const link = (i: IssueRow) => ({ number: i.number, title: i.title, url: `${url}/issues/${i.number}` });
  const byComments = [...(open ?? [])].sort((a, b) => b.comments - a.comments);
  const labels = new Map<string, number>();
  for (const i of open ?? []) for (const l of i.labels) labels.set(l, (labels.get(l) ?? 0) + 1);
  const sorted = [...labels].sort((a, b) => b[1] - a[1]);
  const since = now - 30 * DAY;
  const issues =
    counts.open_issues === undefined
      ? undefined
      : {
          open: counts.open_issues,
          ...(counts.closed_30d === undefined ? {} : { closed_30d: counts.closed_30d }),
          ...(open
            ? {
                by_label: Object.fromEntries(sorted.slice(0, 15)),
                good_first: open.filter((i) => i.labels.some((l) => /good first issue/i.test(l))).slice(0, 5).map(link),
                hot: byComments.slice(0, 10).map((i) => ({ ...link(i), comments: i.comments })),
              }
            : {}),
        };
  const pulls =
    counts.open_prs === undefined
      ? undefined
      : {
          open: counts.open_prs,
          ...(prs
            ? {
                merged_30d: prs
                  .filter((p): p is PrRow & { mergedAt: string } => !!p.mergedAt && Date.parse(p.mergedAt) >= since)
                  .map((p) => ({ number: p.number, title: p.title, url: p.url, merged_at: p.mergedAt })),
              }
            : {}),
        };
  const roadmap =
    open || openPrs
      ? {
          ...(openPrs ? { open_prs: openPrs.map((p) => ({ number: p.number, title: p.title, url: p.html_url, updated_at: p.updated_at, draft: p.draft ?? false })) } : {}),
          ...(open
            ? {
                requests: byComments
                  .filter((i) => !i.labels.some((l) => /bug/i.test(l)))
                  .slice(0, 10)
                  .map((i) => ({ ...link(i), comments: i.comments, labels: i.labels })),
                themes: sorted.filter(([l]) => THEME.test(l)).map(([label, count]) => ({ label, count })),
              }
            : {}),
        }
      : undefined;
  return { ...(issues ? { issues } : {}), ...(pulls ? { pulls } : {}), ...(roadmap ? { roadmap } : {}) };
}

// Issues fermées mises à jour depuis `since` : approximation de « fermées sur 30 jours », closed_at n'étant pas exposé.
async function closedSince(q: Quota, owner: string, repo: string, since: number) {
  let count = 0;
  let after: string | undefined;
  for (let page = 1; page <= 3; page++) {
    const res = await q.json<Page<{ updated_at: string }>>("closed_30d", "list_issues", {
      owner, repo, state: "CLOSED", orderBy: "UPDATED_AT", direction: "DESC", perPage: 100, fields: ["number", "updated_at"], ...(after ? { after } : {}),
    });
    if (!res) return page === 1 ? null : { count, capped: true };
    const recent = res.issues.filter((i) => Date.parse(i.updated_at) >= since);
    count += recent.length;
    if (recent.length < res.issues.length || !res.pageInfo.hasNextPage || !res.pageInfo.endCursor) return { count, capped: false };
    after = res.pageInfo.endCursor;
  }
  return { count, capped: true };
}

export async function collectIssuesPart(full: string, dir: string, opts: { budget?: number; deadline?: number } = {}) {
  const q = quota({ by: "1b-issues", dir, budget: opts.budget ?? BUDGET, deadline: opts.deadline ?? DEADLINE, plan: plan(full) });
  try {
    return await collect(q, full, dir);
  } finally {
    q.save();
  }
}

async function collect(q: Quota, full: string, dir: string) {
  const [owner, repo] = full.split("/") as [string, string];
  const gh = `https://github.com/${full}`;
  const at = new Date().toISOString();
  const now = Date.now();
  const missing = ["milestones (pas d'outil MCP)", "pulls.awaiting_review (reviews non exposées)", "closed_30d approximé sur updated_at"];
  mkdirSync(path.join(dir, "parts"), { recursive: true });

  const found = await q.json<{ items: Repo[] }>("repo", "search_repositories", { query: `repo:${full}`, minimal_output: false, perPage: 1 });
  const r = found?.items.find((x) => x.full_name.toLowerCase() === full.toLowerCase());
  if (!r) throw new Error(`repo introuvable : ${full}`);

  // Issues ouvertes, 3 pages de 100 au plus, curseur GraphQL. Les fermées ne servent qu'à closed_30d, plus bas.
  let open: IssueRow[] | null = [];
  let after: string | undefined;
  for (let page = 1; page <= 3; page++) {
    const res = await q.json<Page<RawIssue>>("issues", "list_issues", {
      owner, repo, state: "OPEN", orderBy: "CREATED_AT", direction: "DESC", perPage: 100, ...(after ? { after } : {}),
      fields: ["number", "title", "state", "user", "labels", "created_at", "updated_at", "comments"],
    });
    if (!res) {
      if (page === 1) open = null;
      else missing.push(`issues ouvertes tronquées à ${open.length} : ${gh}/issues`);
      break;
    }
    open.push(...res.issues.map(toIssue));
    if (!res.pageInfo.hasNextPage || !res.pageInfo.endCursor) break;
    if (page === 3) missing.push(`issues ouvertes plafonnées à 300 : ${gh}/issues`);
    after = res.pageInfo.endCursor;
  }

  // PR tous états, 3 pages de 100 au plus.
  let prs: PrRow[] | null = [];
  for (let page = 1; page <= 3; page++) {
    const batch = await q.json<RawPr[]>("pulls", "list_pull_requests", {
      owner, repo, state: "all", perPage: 100, page, sort: "created", direction: "desc",
      fields: ["number", "title", "state", "draft", "merged", "user", "created_at", "merged_at", "closed_at", "html_url"],
    });
    if (!batch) {
      if (page === 1) prs = null;
      else missing.push(`PR tronquées à ${prs.length} : ${gh}/pulls?q=is%3Apr`);
      break;
    }
    prs.push(...batch.map(toPr));
    if (batch.length < 100) break;
    if (page === 3) missing.push(`PR plafonnées à 300 : ${gh}/pulls?q=is%3Apr`);
  }

  const openPrs = await q.json<OpenPr[]>("open_prs", "list_pull_requests", {
    owner, repo, state: "open", sort: "updated", direction: "desc", perPage: 10, fields: ["number", "title", "html_url", "updated_at", "draft"],
  });
  const openPrCount = (await q.json<{ total_count: number }>("open_pr_count", "search_pull_requests", { query: `repo:${full} is:open`, perPage: 1, fields: ["number"] }))?.total_count;
  const closed = await closedSince(q, owner, repo, now - 30 * DAY);
  if (closed?.capped) missing.push(`closed_30d tronqué à ${closed.count} : ${gh}/issues?q=is%3Aissue+is%3Aclosed`);

  // open_issues_count de GitHub compte aussi les PR ouvertes : sans leur total, issues.open les inclut et le dit.
  const openPrsExact = openPrCount ?? (openPrs && openPrs.length < 10 ? openPrs.length : undefined);
  if (openPrsExact === undefined) missing.push(`issues.open inclut les PR ouvertes, pulls.open absent (search_pull_requests jeté) : ${gh}/pulls`);
  const counts: Counts = {
    open_issues: Math.max(0, r.open_issues_count - (openPrsExact ?? 0)),
    ...(openPrsExact === undefined ? {} : { open_prs: openPrsExact }),
    ...(closed ? { closed_30d: closed.count } : {}),
  };
  const blocks = buildIssuesPart(r.html_url, open, prs, openPrs, counts, now);
  const parsed = Facts.omit({ schema: true, collected: true }).partial().safeParse(blocks);
  if (!parsed.success) throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")} : ${i.message}`).join("\n"));
  writeFileSync(path.join(dir, "parts", "issues.json"), JSON.stringify({ ...blocks, collected: { by: "1b-issues", at } }, null, 2) + "\n");

  const days = (prs ?? []).filter((p) => p.mergedAt).map((p) => (Date.parse(p.mergedAt!) - Date.parse(p.createdAt)) / DAY).sort((a, b) => a - b);
  const median = days.length ? Math.round(days[Math.floor(days.length / 2)]! * 10) / 10 : null;
  const list = (xs: string[] | undefined, empty: string) => (xs ? xs.join(", ") || empty : "non lu");
  const bilan = [
    `# ${r.full_name} : issues et PR`,
    "",
    `- Issues ouvertes : ${counts.open_issues} · fermées sur 30 jours : ${counts.closed_30d ?? "non lu"}`,
    `- Labels ouverts : ${list(blocks.issues?.by_label && Object.entries(blocks.issues.by_label).slice(0, 8).map(([l, n]) => `${l} ${n}`), "aucun")}`,
    `- Les plus discutées : ${list(blocks.issues?.hot?.slice(0, 5).map((i) => `#${i.number} (${i.comments})`), "aucune")}`,
    `- Good first issues : ${blocks.issues?.good_first?.length ?? "non lu"}`,
    `- PR ouvertes : ${counts.open_prs ?? "non lu"} · fusionnées sur 30 jours : ${blocks.pulls?.merged_30d?.length ?? "non lu"}${median === null ? "" : ` · médiane de fusion ${median} j`}`,
    `- Roadmap : ${blocks.roadmap?.requests?.length ?? "non lu"} demandes hors bug · thèmes : ${list(blocks.roadmap?.themes?.map((t) => `${t.label} ${t.count}`), "aucun")}`,
    "",
    `1b-issues : OK · ${q.summary()} · manques : ${[...missing, ...q.missing()].join(", ")}`,
  ].join("\n");
  writeFileSync(path.join(dir, "parts", "issues.md"), bilan + "\n");
  return bilan;
}

if (import.meta.main) {
  const { budget, deadline, rest } = quotaArgs(process.argv.slice(2));
  const [full, , dirArg] = rest;
  if (!full?.includes("/")) {
    console.error("Usage : bun run issues owner/repo [profil] [dossier du cache] [--budget N] [--deadline S]");
    process.exit(2);
  }
  const dir = dirArg ?? path.join("onboard/cache", full.replace("/", "__"));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  try {
    console.log(await collectIssuesPart(full, dir, { budget, deadline }));
  } catch (err) {
    console.error(`1b-issues : ÉCHEC · ${(err as Error).message}`);
    process.exit(1);
  }
}
