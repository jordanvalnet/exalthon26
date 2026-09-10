// Tuiles de couverture : un chemin de facts.json (profil, `design.kpis`) → un libellé et une valeur formatée en français.
// Rien n'est calculé qui ne soit une lecture directe, une somme ou un compte : aucun chiffre inventé.
import type { Facts } from "../facts.ts";

export type Kpi = { label: string; value: string; hint?: string; long?: boolean };

const nf = new Intl.NumberFormat("fr-FR");
const df = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export function formatNumber(n: number): string {
  return nf.format(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : df.format(d);
}

const KPIS: Record<string, (f: Facts) => Kpi | undefined> = {
  "repo.stars": (f) => ({ label: "étoiles GitHub", value: formatNumber(f.repo.stars) }),
  "repo.forks": (f) => ({ label: "forks", value: formatNumber(f.repo.forks) }),
  "repo.open_issues": (f) => ({ label: "issues ouvertes", value: formatNumber(f.repo.open_issues) }),
  "repo.license": (f) => (f.repo.license ? { label: "licence", value: shortLicense(f.repo.license) } : { label: "licence", value: "aucune" }),
  "repo.created_at": (f) => ({ label: "créé le", value: formatDate(f.repo.created_at), long: true }),
  "activity.bus_factor": (f) => f.activity && { label: "bus factor", value: String(f.activity.bus_factor), hint: "sur 12 semaines" },
  "activity.contributors": (f) => f.activity && { label: "contributeurs actifs", value: String(f.activity.contributors.length), hint: "sur 12 semaines" },
  "activity.commits_per_week": (f) =>
    f.activity && { label: "commits", value: formatNumber(f.activity.commits_per_week.reduce((s, w) => s + w.count, 0)), hint: "sur 12 semaines" },
  "activity.last_commit": (f) => f.activity && { label: "dernier commit", value: formatDate(f.activity.last_commit), long: true },
  releases: (f) => f.releases?.length ? { label: "versions récentes", value: String(f.releases.length), hint: `dernière ${f.releases[0]!.tag}` } : undefined,
  "issues.open": (f) => f.issues && { label: "issues ouvertes", value: formatNumber(f.issues.open) },
  "issues.closed_30d": (f) => f.issues?.closed_30d !== undefined ? { label: "issues fermées", value: formatNumber(f.issues.closed_30d), hint: "30 jours" } : undefined,
  "issues.by_label.bug": (f) => f.issues?.by_label?.bug !== undefined ? { label: "bugs étiquetés", value: formatNumber(f.issues.by_label.bug) } : undefined,
  "pulls.open": (f) => f.pulls && { label: "PR ouvertes", value: formatNumber(f.pulls.open) },
  "tests.files": (f) => f.tests && { label: "fichiers de test", value: formatNumber(f.tests.files), ...(f.tests.framework ? { hint: f.tests.framework } : {}) },
  "build.ci": (f) => f.build?.ci?.length ? { label: "workflows CI", value: String(f.build.ci.length) } : undefined,
  "deps.count": (f) => f.deps && { label: "dépendances", value: formatNumber(f.deps.count), hint: `${f.deps.runtime.length} en production` },
  "ai_docs.score": (f) => f.ai_docs && { label: "repères pour agents IA", value: `${f.ai_docs.score} / ${f.ai_docs.max}` },
};

export function kpis(facts: Facts, paths: string[], max = 4): Kpi[] {
  return paths
    .map((p) => KPIS[p]?.(facts))
    .filter((k): k is Kpi => Boolean(k))
    .slice(0, max);
}

// « Elastic License 2.0 (ELv2) » → « ELv2 » ; « MIT License » → « MIT » : la tuile doit tenir sur une ligne.
function shortLicense(name: string): string {
  const paren = name.match(/\(([^)]+)\)/)?.[1];
  return paren ?? name.replace(/\s*License\b/i, "").trim();
}
