// Sous-agent 1a-meta en code : `bun run meta owner/repo profil [cache] [--budget N] [--deadline S]` remplit la fiche du
// repo sans lire son contenu. GitHub uniquement via le serveur MCP, chaque appel passant par src/quota.ts avec sa priorité
// (le plan ci-dessous, exécuté dans l'ordre). Écrit <cache>/parts/meta.json, sources/{license,funding,security}.md, un bilan
// parts/meta.md (aussi sur stdout) et l'état du quota dans parts/quota.json.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { toolText } from "../../onboarding/src/mcp/client.ts";
import { Facts } from "../facts.ts";
import { quota } from "../github.ts";
import { type Planned, type Quota, quotaArgs } from "../quota.ts";
import { readProfile } from "../validate.ts";

type Repo = {
  full_name: string;
  html_url: string;
  description: string | null;
  created_at: string;
  pushed_at: string;
  default_branch: string;
  license: { spdx_id: string | null } | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics?: string[];
  owner: { type: string };
  archived: boolean;
};
type Release = { tag_name: string; published_at: string | null; created_at?: string; name: string | null };
type Commit = { sha: string; author: { login: string } | null; commit: { author: { name: string; date: string } } };

const DAY = 86_400_000;
const BUDGET = 12;
const DEADLINE = 60;

function plan(full: string): Planned[] {
  const gh = `https://github.com/${full}`;
  return [
    { label: "repo", priority: "P0", count: 1, url: gh },
    { label: "commits", priority: "P1", count: 5, url: `${gh}/graphs/contributors` },
    { label: "releases", priority: "P1", count: 1, url: `${gh}/releases` },
    { label: "license", priority: "P1", count: 3, url: `${gh}/blob/HEAD/LICENSE` },
    { label: "security", priority: "P1", count: 2, url: `${gh}/security/policy` },
    { label: "funding", priority: "P2", count: 1, url: `${gh}/blob/HEAD/.github/FUNDING.yml` },
    { label: "codeowners", priority: "P2", count: 2, url: `${gh}/blob/HEAD/.github/CODEOWNERS` },
    { label: "competitors", priority: "P2", count: 1, url: "https://github.com/topics" },
  ];
}

// Lit un fichier du repo, null s'il n'existe pas ou si l'appel est jeté. Tronqué à `lines` lignes.
async function file(q: Quota, label: string, owner: string, repo: string, branch: string, p: string, lines: number) {
  const r = await q.call(label, "get_file_contents", { owner, repo, path: p });
  if (r.isError) return null;
  const resource = (r.content ?? []).find((c: { type: string }) => c.type === "resource");
  const all = toolText(resource ? { content: [resource] } : r).split("\n");
  const text = all.length > lines ? all.slice(0, lines).join("\n") + "\n[tronqué]" : all.join("\n");
  return { path: p, url: `https://github.com/${owner}/${repo}/blob/${branch}/${p}`, text };
}

async function first(q: Quota, label: string, owner: string, repo: string, branch: string, paths: string[], lines: number) {
  for (const p of paths) {
    if (q.dropped(label)) return null;
    const f = await file(q, label, owner, repo, branch, p, lines);
    if (f) return f;
  }
  return null;
}

function isoWeek(d: Date): string {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - jan1.getTime()) / DAY + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function source(dir: string, name: string, f: { path: string; url: string; text: string }, at: string) {
  writeFileSync(path.join(dir, "sources", name), `---\npath: ${f.path}\nurl: ${f.url}\nfetched_at: ${at}\n---\n${f.text}\n`);
}

export async function collectMeta(full: string, profileName: string, dir: string, opts: { budget?: number; deadline?: number } = {}) {
  const steps = plan(full);
  const q = quota({ by: "1a-meta", dir, budget: opts.budget ?? BUDGET, deadline: opts.deadline ?? DEADLINE, plan: steps });
  try {
    return await collect(q, steps, full, profileName, dir);
  } finally {
    q.save();
  }
}

async function collect(q: Quota, steps: Planned[], full: string, profileName: string, dir: string) {
  const profile = readProfile(profileName);
  const [owner, repo] = full.split("/") as [string, string];
  const at = new Date().toISOString();
  const now = Date.now();
  const missing: string[] = ["languages (pas d'outil MCP)", "CVE (pas d'outil MCP)"];
  for (const d of ["parts", "sources"]) mkdirSync(path.join(dir, d), { recursive: true });

  const found = await q.json<{ items: Repo[] }>("repo", "search_repositories", { query: `repo:${full}`, minimal_output: false, perPage: 1 });
  const r = found?.items.find((x) => x.full_name.toLowerCase() === full.toLowerCase());
  if (!r) throw new Error(`repo introuvable : ${full}`);
  const branch = r.default_branch;
  const topic = r.topics?.[0];
  if (topic) steps.find((s) => s.label === "competitors")!.url = `https://github.com/topics/${topic}`;

  // Activité : commits des 12 dernières semaines, 5 pages de 100 au plus (SCHEMA.md pour le bus factor).
  const since = new Date(now - 12 * 7 * DAY);
  const commits: Commit[] = [];
  let pages = 0;
  for (let page = 1; page <= 5; page++) {
    const batch = await q.json<Commit[]>("commits", "list_commits", { owner, repo, since: since.toISOString(), page, perPage: 100, fields: ["sha", "commit", "author"] });
    if (!batch) {
      if (pages) missing.push(`activity tronquée à ${commits.length} commits`);
      break;
    }
    pages++;
    commits.push(...batch);
    if (batch.length < 100) break;
    if (page === 5) missing.push("activity tronquée à 500 commits");
  }
  const weeks = new Map<string, number>();
  for (let i = 11; i >= 0; i--) weeks.set(isoWeek(new Date(now - i * 7 * DAY)), 0);
  const byAuthor = new Map<string, number>();
  for (const c of commits) {
    const w = isoWeek(new Date(c.commit.author.date));
    if (weeks.has(w)) weeks.set(w, weeks.get(w)! + 1);
    const login = c.author?.login ?? c.commit.author.name;
    if (!login.endsWith("[bot]")) byAuthor.set(login, (byAuthor.get(login) ?? 0) + 1);
  }
  const contributors = [...byAuthor].map(([login, n]) => ({ login, commits: n })).sort((a, b) => b.commits - a.commits);
  const half = contributors.reduce((n, c) => n + c.commits, 0) / 2;
  let acc = 0;
  let bus_factor = 0;
  for (const c of contributors) {
    acc += c.commits;
    bus_factor++;
    if (acc >= half) break;
  }
  const activity = pages
    ? {
        commits_per_week: [...weeks].map(([week, count]) => ({ week, count })),
        last_commit: commits[0]?.commit.author.date ?? r.pushed_at,
        contributors: contributors.slice(0, 10),
        bus_factor,
      }
    : undefined;

  const rel = await q.json<Release[]>("releases", "list_releases", { owner, repo, perPage: 10, fields: ["tag_name", "name", "published_at", "created_at"] });
  const releases = rel?.map((x) => ({ tag: x.tag_name, date: x.published_at ?? x.created_at ?? r.pushed_at, name: x.name }));

  // r.license est null quand GitHub n'a détecté aucun fichier de licence : inutile d'en chercher un.
  const license = r.license ? await first(q, "license", owner, repo, branch, ["LICENSE", "LICENSE.md", "LICENSE.txt"], 40) : null;
  if (license) source(dir, "license.md", license, at);
  const security = await first(q, "security", owner, repo, branch, ["SECURITY.md", ".github/SECURITY.md"], 400);
  if (security) source(dir, "security.md", security, at);

  const funding = await file(q, "funding", owner, repo, branch, ".github/FUNDING.yml", 400);
  if (funding) source(dir, "funding.md", funding, at);
  const codeowners = await first(q, "codeowners", owner, repo, branch, [".github/CODEOWNERS", "CODEOWNERS"], 1);

  let competitors: { full_name: string; stars: number; description: string | null }[] | undefined;
  if (profile.facts.includes("business") && topic) {
    const s = await q.json<{ items: Repo[] }>("competitors", "search_repositories", { query: `topic:${topic} stars:>100`, minimal_output: false, perPage: 6 });
    competitors = s?.items
      .filter((x) => x.full_name !== r.full_name)
      .slice(0, 5)
      .map((x) => ({ full_name: x.full_name, stars: x.stargazers_count, description: x.description }));
  }

  // GitHub ne reconnaît pas toutes les licences (ELv2, BUSL…) : on retient alors la première ligne du fichier LICENSE.
  const known = r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : null;
  const spdx = known ?? license?.text.split("\n").find((l) => l.trim())?.trim().slice(0, 60) ?? null;
  const risks: NonNullable<Facts["risks"]> = [];
  if (!spdx) risks.push({ kind: "license", level: "high", note: "Pas de fichier LICENSE : réutilisation juridiquement incertaine." });
  else if (!known) risks.push({ kind: "license", level: "mid", note: `Licence non standard « ${spdx} » : lire sources/license.md avant tout usage.` });
  else if (/GPL/i.test(spdx)) risks.push({ kind: "license", level: "high", note: `${spdx} : copyleft, contraignant pour un usage commercial.` });
  else risks.push({ kind: "license", level: "low", note: `${spdx} : licence permissive.` });
  if (r.archived) risks.push({ kind: "activity", level: "high", note: "Repo archivé : plus de maintenance." });
  if (!security && !q.dropped("security")) risks.push({ kind: "security", level: "mid", note: "Pas de SECURITY.md : aucun canal déclaré pour signaler une faille." });
  if (activity) {
    if (bus_factor <= 1) risks.push({ kind: "bus_factor", level: "high", note: "Un seul contributeur porte la moitié des commits sur 12 semaines." });
    else if (bus_factor === 2) risks.push({ kind: "bus_factor", level: "mid", note: "Deux contributeurs portent la moitié des commits sur 12 semaines." });
    const age = Math.floor((now - Date.parse(activity.last_commit)) / DAY);
    if (age > 90) risks.push({ kind: "activity", level: "high", note: `Dernier commit il y a ${age} jours.` });
  }

  // Un booléen n'est écrit que si le fichier a vraiment été cherché.
  const part = {
    repo: {
      full_name: r.full_name,
      url: r.html_url,
      description: r.description,
      created_at: r.created_at,
      pushed_at: r.pushed_at,
      default_branch: branch,
      license: spdx,
      stars: r.stargazers_count,
      forks: r.forks_count,
      open_issues: r.open_issues_count,
      topics: r.topics ?? [],
      owner_type: r.owner.type === "Organization" ? "org" : "user",
      archived: r.archived,
    },
    ...(releases ? { releases } : {}),
    ...(activity ? { activity } : {}),
    business: {
      ...(q.dropped("funding") ? {} : { funding: !!funding }),
      ...(q.dropped("security") ? {} : { security_policy: !!security }),
      ...(q.dropped("codeowners") ? {} : { codeowners: !!codeowners }),
      ...(competitors ? { competitors } : {}),
    },
    risks,
    collected: { by: "1a-meta", at },
  };
  const parsed = Facts.omit({ schema: true, collected: true }).partial().safeParse(part);
  if (!parsed.success) throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")} : ${i.message}`).join("\n"));
  writeFileSync(path.join(dir, "parts", "meta.json"), JSON.stringify(part, null, 2) + "\n");

  const yesNo = (label: string, v: unknown) => (q.dropped(label) ? "non lu" : v ? "oui" : "non");
  const bilan = [
    `# ${r.full_name}`,
    r.description ?? "(pas de description)",
    "",
    `- URL : ${r.html_url}${r.archived ? " — **archivé**" : ""}`,
    `- Propriétaire : ${part.repo.owner_type} · créé le ${r.created_at.slice(0, 10)} · dernier push ${r.pushed_at.slice(0, 10)}`,
    `- ⭐ ${r.stargazers_count} · forks ${r.forks_count} · issues ouvertes ${r.open_issues_count}`,
    `- Licence : ${spdx ?? "absente"} · topics : ${(r.topics ?? []).join(", ") || "aucun"}`,
    `- Releases : ${!releases ? "non lues" : releases.length ? `${releases.length} dernières, ${releases[0]!.tag} le ${releases[0]!.date.slice(0, 10)}` : "aucune"}`,
    activity
      ? `- Activité 12 semaines : ${commits.length} commits · ${contributors.length} contributeurs humains · bus factor ${bus_factor} · dernier commit ${activity.last_commit.slice(0, 10)}`
      : "- Activité 12 semaines : non lue",
    `- Top contributeurs : ${contributors.slice(0, 5).map((c) => `${c.login} (${c.commits})`).join(", ") || "aucun"}`,
    `- Financement : ${yesNo("funding", funding)} · politique de sécurité : ${yesNo("security", security)} · CODEOWNERS : ${yesNo("codeowners", codeowners)}`,
    ...(competitors ? [`- Voisins (topic ${topic}) : ${competitors.map((c) => `${c.full_name} (⭐ ${c.stars})`).join(", ")}`] : []),
    "",
    "## Risques",
    ...risks.map((k) => `- ${k.level} · ${k.kind} : ${k.note}`),
    "",
    `1a-meta : OK · ${q.summary()} · manques : ${[...missing, ...q.missing()].join(", ")}`,
  ].join("\n");
  writeFileSync(path.join(dir, "parts", "meta.md"), bilan + "\n");
  return bilan;
}

if (import.meta.main) {
  const { budget, deadline, rest } = quotaArgs(process.argv.slice(2));
  const [full, profileName = "dev", dirArg] = rest;
  if (!full?.includes("/")) {
    console.error("Usage : bun run meta owner/repo [profil] [dossier du cache] [--budget N] [--deadline S]");
    process.exit(2);
  }
  const dir = dirArg ?? path.join("onboard/cache", full.replace("/", "__"));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  try {
    console.log(await collectMeta(full, profileName, dir, { budget, deadline }));
  } catch (err) {
    console.error(`1a-meta : ÉCHEC · ${(err as Error).message}`);
    process.exit(1);
  }
}
