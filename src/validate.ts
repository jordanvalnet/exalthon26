// Validations dures entre les étapes (onboard/WORKFLOW.md). `bun run validate <facts|narrative|deck> <cache> <profil>`.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { Facts } from "./facts.ts";

export const CHARTS = ["languages", "commits_per_week", "contributors", "issues_by_label", "releases", "tree", "risks", "roadmap"];
const CITATION = /\[(facts|src|gh):([^\]]+)\]/g;

export type Profile = {
  name: string;
  questions: { text: string; chart?: string }[];
  facts: string[];
  sources: string[];
  pages?: number;
  finale?: string;
};

export function readProfile(name: string, root = "onboard/profiles"): Profile {
  const file = path.join(root, `${name}.json`);
  if (!existsSync(file)) {
    const known = readdirSync(root).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
    throw new Error(`profil inconnu : ${name}. Profils : ${known.join(", ")}`);
  }
  const p = JSON.parse(readFileSync(file, "utf8")) as {
    priorities: { question: string; chart?: string; facts?: string[]; sources?: string[] }[];
    deck?: { pages?: number; finale?: string };
  };
  const questions = p.priorities.map((e) => ({ text: e.question, ...(e.chart ? { chart: e.chart } : {}) }));
  const facts = [...new Set(p.priorities.flatMap((e) => e.facts ?? []))];
  const sources = [...new Set(p.priorities.flatMap((e) => e.sources ?? []))];
  return { name, questions, facts, sources, ...(p.deck?.pages ? { pages: p.deck.pages } : {}), ...(p.deck?.finale ? { finale: p.deck.finale } : {}) };
}

export function validateFacts(dir: string, profile: Profile): string[] {
  const file = path.join(dir, "facts.json");
  if (!existsSync(file)) return [`${file} manquant`];
  let json: unknown;
  try {
    json = JSON.parse(readFileSync(file, "utf8"));
  } catch (err) {
    return [`${file} : JSON invalide : ${(err as Error).message}`];
  }
  const parsed = Facts.safeParse(json);
  if (!parsed.success) return parsed.error.issues.map((i) => `facts.json ${i.path.join(".") || "(racine)"} : ${i.message}`);
  const facts = parsed.data;
  const errors: string[] = [];
  for (const lens of ["core", profile.name]) {
    if (!facts.collected.lenses.includes(lens)) errors.push(`collected.lenses ne contient pas « ${lens} »`);
  }
  for (const key of profile.facts) {
    if (!(key in facts)) errors.push(`bloc « ${key} » demandé par le profil ${profile.name}, absent de facts.json`);
  }
  for (const f of ["readme.md", "tree.md"]) {
    if (!existsSync(path.join(dir, "sources", f))) errors.push(`sources/${f} manquant`);
  }
  const missing = profile.sources.filter((f) => !existsSync(path.join(dir, "sources", f)));
  if (missing.length) console.error(`avertissement : sources absentes (${missing.join(", ")}), à mentionner dans « Manques »`);
  return errors;
}

export function validateNarrative(dir: string, profile: Profile): string[] {
  const file = path.join(dir, "narrative", `${profile.name}.md`);
  if (!existsSync(file)) return [`${file} manquant`];
  const md = readFileSync(file, "utf8");
  const errors: string[] = [];
  const head = md.match(/^---\n([\s\S]*?)\n---/);
  if (!head) errors.push("en-tête YAML manquant");
  else for (const k of ["repo", "profile", "generated_at"]) if (!new RegExp(`^${k}:`, "m").test(head[1]!)) errors.push(`en-tête : champ ${k} manquant`);
  if (!/^# .+/m.test(md)) errors.push("titre H1 manquant");
  const sections = md.split(/^## /m).slice(1).map((s) => {
    const nl = s.indexOf("\n");
    return { title: s.slice(0, nl).trim(), body: s.slice(nl + 1) };
  });
  const factsFile = path.join(dir, "facts.json");
  const facts = existsSync(factsFile) ? JSON.parse(readFileSync(factsFile, "utf8")) : null;
  profile.questions.forEach((q, i) => {
    const n = i + 1;
    const s = sections[i];
    if (!s) return errors.push(`section ${n} manquante : « ${q.text} »`);
    if (s.title !== q.text) errors.push(`section ${n} : titre « ${s.title} » au lieu de « ${q.text} »`);
    const charts = [...s.body.matchAll(/<!--\s*chart\s*:\s*([a-z_]+)\s*-->/g)].map((m) => m[1]!);
    if (charts.length > 1) errors.push(`section ${n} : plusieurs directives chart`);
    if (q.chart && charts[0] !== q.chart) errors.push(`section ${n} : directive chart « ${q.chart} » attendue, trouvé « ${charts[0] ?? "aucune"} »`);
    for (const c of charts) if (!CHARTS.includes(c)) errors.push(`section ${n} : graphique inconnu « ${c} »`);
    const cites = [...s.body.matchAll(CITATION)];
    if (!cites.length) errors.push(`section ${n} : aucune citation [facts:…] [src:…] [gh:…]`);
    for (const [, kind, ref] of cites) {
      if (kind === "src" && !existsSync(path.join(dir, "sources", ref!))) errors.push(`section ${n} : [src:${ref}] absent de sources/`);
      if (kind === "facts" && facts && !resolves(facts, ref!)) errors.push(`section ${n} : [facts:${ref}] ne correspond à rien dans facts.json`);
    }
  });
  if (sections.length > profile.questions.length) errors.push(`${sections.length - profile.questions.length} section(s) en trop après les questions du profil`);
  const glossary = path.join(dir, "glossary.md");
  const terms = existsSync(glossary) ? (readFileSync(glossary, "utf8").match(/^- \*\*/gm)?.length ?? 0) : 0;
  if (terms < 5) errors.push(`glossary.md : ${terms} terme(s), au moins 5 lignes « - **terme** : … » attendues`);
  return errors;
}

export function validateDeck(dir: string, profile: Profile): string[] {
  const file = path.join(dir, `deck-${profile.name}.html`);
  if (!existsSync(file)) return [`${file} manquant`];
  const html = readFileSync(file, "utf8");
  const errors: string[] = [];
  if (/<script[^>]+src=|<link[^>]+href=|url\(\s*["']?https?:/i.test(html)) errors.push("ressource externe détectée : le deck doit être autonome");
  const pages = html.match(/<section\b/g)?.length ?? 0;
  const min = profile.questions.length + 2;
  if (pages < min) errors.push(`${pages} <section> trouvée(s), au moins ${min} attendues (titre, questions, sources)`);
  if (/\[(facts|src|gh):[^\]]+\]/.test(html.replace(/<[^>]+>/g, ""))) errors.push("citation brute [facts:…] visible dans le texte : à convertir en note");
  if (!/@media\s+print/.test(html)) errors.push("pas de règle @media print");
  return errors;
}

function resolves(obj: unknown, ref: string): boolean {
  let cur: unknown = obj;
  for (const key of ref.split(".")) {
    if (cur === null || typeof cur !== "object") return false;
    cur = (cur as Record<string, unknown>)[key];
    if (cur === undefined) return false;
  }
  return true;
}

if (import.meta.main) {
  const [kind, dir, profileName] = process.argv.slice(2);
  const usage = "Usage : bun run validate <facts|narrative|deck> <dossier du cache> <profil>";
  const runners = { facts: validateFacts, narrative: validateNarrative, deck: validateDeck };
  const run = runners[kind as keyof typeof runners];
  if (!run || !dir || !profileName) {
    console.error(usage);
    process.exit(2);
  }
  let errors: string[];
  try {
    errors = run(dir, readProfile(profileName));
  } catch (err) {
    console.error((err as Error).message);
    process.exit(2);
  }
  if (errors.length) {
    console.error(`ÉCHEC ${kind} (${errors.length}) :\n- ${errors.join("\n- ")}`);
    process.exit(1);
  }
  console.log(`OK ${kind} : ${dir} / ${profileName}`);
}
