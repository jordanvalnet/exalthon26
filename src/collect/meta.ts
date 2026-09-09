// Sous-agent 1a-meta en code : `bun run meta owner/repo profil [cache]` remplit la fiche du repo sans lire son contenu.
// Écrit <cache>/parts/meta.json, sources/{license,funding,security}.md, et un bilan parts/meta.md (aussi sur stdout).
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Facts } from "../facts.ts";
import { gh, ghRes } from "../github.ts";
import { readProfile } from "../validate.ts";

type Repo = {
  full_name: string;
  html_url: string;
  description: string | null;
  created_at: string;
  pushed_at: string;
  default_branch: string;
  license: { spdx_id: string | null; name: string } | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics?: string[];
  owner: { type: string };
  archived: boolean;
};
type Release = { tag_name: string; published_at: string | null; created_at: string; name: string | null };
type Advisory = { ghsa_id: string; cve_id: string | null; severity: string; summary: string; published_at: string | null };
type ContribStats = { author: { login: string } | null; total: number; weeks: { w: number; c: number }[] };
type Content = { path: string; html_url: string; content: string; encoding: string };

const DAY = 86_400_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let calls = 0;

// Lit un fichier du repo, null si 404. Contenu décodé, tronqué à `lines` lignes.
async function file(repo: string, p: string, lines: number): Promise<{ path: string; url: string; text: string } | null> {
  calls++;
  const res = await ghRes(`/repos/${repo}/contents/${p}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status} sur ${p}`);
  const c = (await res.json()) as Content;
  const all = Buffer.from(c.content, c.encoding === "base64" ? "base64" : "utf8").toString("utf8").split("\n");
  const text = all.length > lines ? all.slice(0, lines).join("\n") + "\n[tronqué]" : all.join("\n");
  return { path: c.path, url: c.html_url, text };
}

// Les /stats/* répondent 202 tant que GitHub calcule : on réessaie trois fois.
async function stats<T>(p: string): Promise<T | null> {
  for (let i = 0; i < 4; i++) {
    calls++;
    const res = await ghRes(p);
    if (res.status === 202) {
      await sleep(1500);
      continue;
    }
    if (res.status === 404 || res.status === 204) return null;
    if (!res.ok) throw new Error(`GitHub HTTP ${res.status} sur ${p}`);
    return (await res.json()) as T;
  }
  return null;
}

async function first(repo: string, paths: string[], lines: number) {
  for (const p of paths) {
    const f = await file(repo, p, lines);
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
  const at = new Date().toISOString();
  const now = Date.now();
  const missing: string[] = [];
  for (const d of ["parts", "sources"]) mkdirSync(path.join(dir, d), { recursive: true });

  calls++;
  const r = await gh<Repo>(`/repos/${full}`);
  calls++;
  const languages = await gh<Record<string, number>>(`/repos/${full}/languages`);
  calls++;
  const rel = await gh<Release[]>(`/repos/${full}/releases?per_page=10`);
  const releases = rel.map((x) => ({ tag: x.tag_name, date: x.published_at ?? x.created_at, name: x.name }));

  const license = await first(full, ["LICENSE", "LICENSE.md", "LICENSE.txt"], 40);
  if (license) source(dir, "license.md", license, at);
  const funding = await file(full, ".github/FUNDING.yml", 400);
  if (funding) source(dir, "funding.md", funding, at);
  const security = await first(full, ["SECURITY.md", ".github/SECURITY.md"], 400);
  if (security) source(dir, "security.md", security, at);
  const codeowners = await first(full, [".github/CODEOWNERS", "CODEOWNERS"], 1);

  // CVE / avis de sécurité publiés par le repo lui-même.
  calls++;
  const advRes = await ghRes(`/repos/${full}/security-advisories?state=published&per_page=20`);
  const advisories: Advisory[] = advRes.ok ? ((await advRes.json()) as Advisory[]) : [];
  if (!advRes.ok) missing.push(`security-advisories (HTTP ${advRes.status})`);

  // Activité : 12 dernières semaines, contributeurs, bus factor (définition de SCHEMA.md).
  const weekly = await stats<{ week: number; total: number }[]>(`/repos/${full}/stats/commit_activity`);
  const contrib = await stats<ContribStats[]>(`/repos/${full}/stats/contributors`);
  calls++;
  const last = await gh<{ commit: { committer: { date: string } } }[]>(`/repos/${full}/commits?per_page=1`);
  const since = now - 12 * 7 * DAY;
  let activity: Facts["activity"] | undefined;
  if (weekly && contrib) {
    const commits_per_week = weekly.slice(-12).map((w) => ({ week: isoWeek(new Date(w.week * 1000)), count: w.total }));
    const recent = contrib
      .map((c) => ({
        login: c.author?.login ?? "anonyme",
        commits: c.weeks.filter((w) => w.w * 1000 >= since).reduce((n, w) => n + w.c, 0),
      }))
      .filter((c) => c.commits > 0 && !c.login.endsWith("[bot]"))
      .sort((a, b) => b.commits - a.commits);
    const half = recent.reduce((n, c) => n + c.commits, 0) / 2;
    let acc = 0;
    let bus_factor = 0;
    for (const c of recent) {
      acc += c.commits;
      bus_factor++;
      if (acc >= half) break;
    }
    activity = {
      commits_per_week,
      last_commit: last[0]?.commit.committer.date ?? r.pushed_at,
      contributors: recent.slice(0, 10),
      bus_factor,
    };
  } else missing.push("activity (stats GitHub pas prêtes, relancer)");

  let competitors: { full_name: string; stars: number; description: string | null }[] | undefined;
  const topic = r.topics?.[0];
  if (profile.facts.includes("business") && topic) {
    calls++;
    const s = await gh<{ items: { full_name: string; stargazers_count: number; description: string | null }[] }>(
      `/search/repositories?q=${encodeURIComponent(`topic:${topic} stars:>100`)}&per_page=6`,
    );
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
  for (const a of advisories.slice(0, 5)) {
    const level = /critical|high/i.test(a.severity) ? "high" : /medium|moderate/i.test(a.severity) ? "mid" : "low";
    risks.push({ kind: "security", level, note: `${a.cve_id ?? a.ghsa_id} (${a.severity}) : ${a.summary}` });
  }
  if (activity) {
    if (activity.bus_factor <= 1) risks.push({ kind: "bus_factor", level: "high", note: "Un seul contributeur porte la moitié des commits sur 12 semaines." });
    else if (activity.bus_factor === 2) risks.push({ kind: "bus_factor", level: "mid", note: "Deux contributeurs portent la moitié des commits sur 12 semaines." });
    const age = Math.floor((now - Date.parse(activity.last_commit)) / DAY);
    if (age > 90) risks.push({ kind: "activity", level: "high", note: `Dernier commit il y a ${age} jours.` });
  }

  const part = {
    repo: {
      full_name: r.full_name,
      url: r.html_url,
      description: r.description,
      created_at: r.created_at,
      pushed_at: r.pushed_at,
      default_branch: r.default_branch,
      license: spdx,
      stars: r.stargazers_count,
      forks: r.forks_count,
      open_issues: r.open_issues_count,
      topics: r.topics ?? [],
      owner_type: r.owner.type === "Organization" ? "org" : "user",
      archived: r.archived,
    },
    languages,
    releases,
    ...(activity ? { activity } : {}),
    business: {
      funding: !!funding,
      security_policy: !!security,
      codeowners: !!codeowners,
      ...(competitors ? { competitors } : {}),
    },
    risks,
    collected: { by: "1a-meta", at, lenses: ["core", ...(competitors ? [profileName] : [])] },
  };
  const parsed = Facts.partial().safeParse(part);
  if (!parsed.success) throw new Error(parsed.error.issues.map((i) => `${i.path.join(".")} : ${i.message}`).join("\n"));
  writeFileSync(path.join(dir, "parts", "meta.json"), JSON.stringify(part, null, 2) + "\n");

  const contributorsTotal = contrib?.length ?? null;
  const bilan = [
    `# ${r.full_name}`,
    r.description ?? "(pas de description)",
    "",
    `- URL : ${r.html_url}${r.archived ? " — **archivé**" : ""}`,
    `- Propriétaire : ${part.repo.owner_type} · créé le ${r.created_at.slice(0, 10)} · dernier push ${r.pushed_at.slice(0, 10)}`,
    `- ⭐ ${r.stargazers_count} · forks ${r.forks_count} · issues ouvertes ${r.open_issues_count}`,
    `- Licence : ${spdx ?? "absente"} · topics : ${(r.topics ?? []).join(", ") || "aucun"}`,
    `- Langages : ${Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k} (${v} o)`).join(", ") || "aucun"}`,
    `- Releases : ${releases.length ? `${releases.length} dernières, ${releases[0]!.tag} le ${releases[0]!.date.slice(0, 10)}` : "aucune"}`,
    activity
      ? `- Activité 12 semaines : ${activity.commits_per_week.reduce((n, w) => n + w.count, 0)} commits · ${contributorsTotal} contributeurs (tous temps, 100 max, bots exclus du bus factor) · bus factor ${activity.bus_factor} · dernier commit ${activity.last_commit.slice(0, 10)}`
      : "- Activité : non disponible",
    `- CVE / avis publiés : ${advisories.length ? advisories.map((a) => `${a.cve_id ?? a.ghsa_id} (${a.severity})`).join(", ") : "aucun"}`,
    `- Financement : ${funding ? "oui" : "non"} · politique de sécurité : ${security ? "oui" : "non"} · CODEOWNERS : ${codeowners ? "oui" : "non"}`,
    ...(competitors ? [`- Voisins (topic ${topic}) : ${competitors.map((c) => `${c.full_name} (⭐ ${c.stars})`).join(", ")}`] : []),
    "",
    "## Risques",
    ...risks.map((k) => `- ${k.level} · ${k.kind} : ${k.note}`),
    "",
    `1a-meta : OK · ${calls} appels · manques : ${missing.join(", ") || "aucun"}`,
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
