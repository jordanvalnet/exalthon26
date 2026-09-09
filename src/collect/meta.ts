// Sous-agent 1a-meta en code : `bun run meta owner/repo profil [cache]` remplit la fiche du repo sans lire son contenu.
// GitHub uniquement via le serveur MCP (outils search_repositories, list_releases, get_file_contents, list_commits).
// Écrit <cache>/parts/meta.json, sources/{license,funding,security}.md, et un bilan parts/meta.md (aussi sur stdout).
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { toolText } from "../../onboarding/src/mcp/client.ts";
import { Facts } from "../facts.ts";
import { mcp } from "../github.ts";
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
const client = mcp();
let calls = 0;

async function tool<T>(name: string, args: Record<string, unknown>): Promise<T> {
  calls++;
  const r = await client.callTool(name, args);
  const text = toolText(r);
  if (r.isError) throw new Error(`${name} : ${text.slice(0, 200)}`);
  return JSON.parse(text) as T;
}

// Lit un fichier du repo, null s'il n'existe pas. Tronqué à `lines` lignes.
async function file(owner: string, repo: string, branch: string, p: string, lines: number) {
  calls++;
  const r = await client.callTool("get_file_contents", { owner, repo, path: p });
  if (r.isError) return null;
  const resource = (r.content ?? []).find((c: { type: string }) => c.type === "resource");
  const all = toolText(resource ? { content: [resource] } : r).split("\n");
  const text = all.length > lines ? all.slice(0, lines).join("\n") + "\n[tronqué]" : all.join("\n");
  return { path: p, url: `https://github.com/${owner}/${repo}/blob/${branch}/${p}`, text };
}

async function first(owner: string, repo: string, branch: string, paths: string[], lines: number) {
  for (const p of paths) {
    const f = await file(owner, repo, branch, p, lines);
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

export async function collectMeta(full: string, profileName: string, dir: string) {
  const profile = readProfile(profileName);
  const [owner, repo] = full.split("/") as [string, string];
  const at = new Date().toISOString();
  const now = Date.now();
  const missing: string[] = ["languages (pas d'outil MCP)", "CVE (pas d'outil MCP)"];
  for (const d of ["parts", "sources"]) mkdirSync(path.join(dir, d), { recursive: true });

  const found = await tool<{ items: Repo[] }>("search_repositories", { query: `repo:${full}`, minimal_output: false, perPage: 1 });
  const r = found.items.find((x) => x.full_name.toLowerCase() === full.toLowerCase());
  if (!r) throw new Error(`repo introuvable : ${full}`);
  const branch = r.default_branch;

  const rel = await tool<Release[]>("list_releases", { owner, repo, perPage: 10, fields: ["tag_name", "name", "published_at", "created_at"] });
  const releases = rel.map((x) => ({ tag: x.tag_name, date: x.published_at ?? x.created_at ?? r.pushed_at, name: x.name }));

  const license = await first(owner, repo, branch, ["LICENSE", "LICENSE.md", "LICENSE.txt"], 40);
  if (license) source(dir, "license.md", license, at);
  const funding = await file(owner, repo, branch, ".github/FUNDING.yml", 400);
  if (funding) source(dir, "funding.md", funding, at);
  const security = await first(owner, repo, branch, ["SECURITY.md", ".github/SECURITY.md"], 400);
  if (security) source(dir, "security.md", security, at);
  const codeowners = await first(owner, repo, branch, [".github/CODEOWNERS", "CODEOWNERS"], 1);

  // Activité : commits des 12 dernières semaines, 5 pages de 100 au plus (SCHEMA.md pour le bus factor).
  const since = new Date(now - 12 * 7 * DAY);
  const commits: Commit[] = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await tool<Commit[]>("list_commits", { owner, repo, since: since.toISOString(), page, perPage: 100, fields: ["sha", "commit", "author"] });
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
  const activity = {
    commits_per_week: [...weeks].map(([week, count]) => ({ week, count })),
    last_commit: commits[0]?.commit.author.date ?? r.pushed_at,
    contributors: contributors.slice(0, 10),
    bus_factor,
  };

  let competitors: { full_name: string; stars: number; description: string | null }[] | undefined;
  const topic = r.topics?.[0];
  if (profile.facts.includes("business") && topic) {
    const s = await tool<{ items: Repo[] }>("search_repositories", { query: `topic:${topic} stars:>100`, minimal_output: false, perPage: 6 });
    competitors = s.items
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
  if (!security) risks.push({ kind: "security", level: "mid", note: "Pas de SECURITY.md : aucun canal déclaré pour signaler une faille." });
  if (bus_factor <= 1) risks.push({ kind: "bus_factor", level: "high", note: "Un seul contributeur porte la moitié des commits sur 12 semaines." });
  else if (bus_factor === 2) risks.push({ kind: "bus_factor", level: "mid", note: "Deux contributeurs portent la moitié des commits sur 12 semaines." });
  const age = Math.floor((now - Date.parse(activity.last_commit)) / DAY);
  if (age > 90) risks.push({ kind: "activity", level: "high", note: `Dernier commit il y a ${age} jours.` });

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
    releases,
    activity,
    business: {
      funding: !!funding,
      security_policy: !!security,
      codeowners: !!codeowners,
      ...(competitors ? { competitors } : {}),
    },
    risks,
    collected: { by: "1a-meta", at },
  };
  const parsed = Facts.omit({ schema: true, collected: true }).partial().safeParse(part);
  if (!parsed.success) throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")} : ${i.message}`).join("\n"));
  writeFileSync(path.join(dir, "parts", "meta.json"), JSON.stringify(part, null, 2) + "\n");

  const bilan = [
    `# ${r.full_name}`,
    r.description ?? "(pas de description)",
    "",
    `- URL : ${r.html_url}${r.archived ? " — **archivé**" : ""}`,
    `- Propriétaire : ${part.repo.owner_type} · créé le ${r.created_at.slice(0, 10)} · dernier push ${r.pushed_at.slice(0, 10)}`,
    `- ⭐ ${r.stargazers_count} · forks ${r.forks_count} · issues ouvertes ${r.open_issues_count}`,
    `- Licence : ${spdx ?? "absente"} · topics : ${(r.topics ?? []).join(", ") || "aucun"}`,
    `- Releases : ${releases.length ? `${releases.length} dernières, ${releases[0]!.tag} le ${releases[0]!.date.slice(0, 10)}` : "aucune"}`,
    `- Activité 12 semaines : ${commits.length} commits · ${contributors.length} contributeurs humains · bus factor ${bus_factor} · dernier commit ${activity.last_commit.slice(0, 10)}`,
    `- Top contributeurs : ${contributors.slice(0, 5).map((c) => `${c.login} (${c.commits})`).join(", ") || "aucun"}`,
    `- Financement : ${funding ? "oui" : "non"} · politique de sécurité : ${security ? "oui" : "non"} · CODEOWNERS : ${codeowners ? "oui" : "non"}`,
    ...(competitors ? [`- Voisins (topic ${topic}) : ${competitors.map((c) => `${c.full_name} (⭐ ${c.stars})`).join(", ")}`] : []),
    "",
    "## Risques",
    ...risks.map((k) => `- ${k.level} · ${k.kind} : ${k.note}`),
    "",
    `1a-meta : OK · ${calls} appels MCP · manques : ${missing.join(", ")}`,
  ].join("\n");
  writeFileSync(path.join(dir, "parts", "meta.md"), bilan + "\n");
  return bilan;
}

if (import.meta.main) {
  const [full, profileName = "dev", dirArg] = process.argv.slice(2);
  if (!full?.includes("/")) {
    console.error("Usage : bun run meta owner/repo [profil] [dossier du cache]");
    process.exit(2);
  }
  const dir = dirArg ?? path.join("onboard/cache", full.replace("/", "__"));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  console.log(await collectMeta(full, profileName, dir));
}
