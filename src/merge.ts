// `bun run merge <cache> <profil>` : fusionne parts/*.json (et le facts.json existant) dans facts.json, puis validate facts.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Facts } from "./facts.ts";
import { readProfile, validateFacts } from "./validate.ts";

const ORDER = ["meta", "docs", "code", "history", "roadmap"];

export function deepMerge(a: unknown, b: unknown): unknown {
  if (Array.isArray(a) && Array.isArray(b)) {
    const seen = new Set(a.map((x) => JSON.stringify(x)));
    return [...a, ...b.filter((x) => !seen.has(JSON.stringify(x)))];
  }
  if (isObject(a) && isObject(b)) {
    const out: Record<string, unknown> = { ...a };
    for (const [k, v] of Object.entries(b)) out[k] = k in out ? deepMerge(out[k], v) : v;
    return out;
  }
  return b === undefined ? a : b;
}

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);

export function mergeParts(dir: string, profile: string): { facts: unknown; errors: string[] } {
  const errors: string[] = [];
  const partsDir = path.join(dir, "parts");
  const files = existsSync(partsDir) ? readdirSync(partsDir).filter((f) => f.endsWith(".json")) : [];
  files.sort((x, y) => ORDER.indexOf(x.replace(/\.json$/, "")) - ORDER.indexOf(y.replace(/\.json$/, "")));
  const factsFile = path.join(dir, "facts.json");
  let facts: unknown = existsSync(factsFile) ? JSON.parse(readFileSync(factsFile, "utf8")) : {};
  const lenses = new Set<string>(["core", profile]);
  for (const l of (facts as { collected?: { lenses?: string[] } }).collected?.lenses ?? []) lenses.add(l);
  for (const f of files) {
    let part: unknown;
    try {
      part = JSON.parse(readFileSync(path.join(partsDir, f), "utf8"));
    } catch (err) {
      errors.push(`parts/${f} : JSON invalide : ${(err as Error).message}`);
      continue;
    }
    const parsed = Facts.partial().safeParse(part);
    if (!parsed.success) {
      errors.push(...parsed.error.issues.map((i) => `parts/${f} ${i.path.join(".") || "(racine)"} : ${i.message}`));
      continue;
    }
    for (const l of parsed.data.collected?.lenses ?? []) lenses.add(l);
    const { collected: _, ...rest } = part as Record<string, unknown>;
    facts = deepMerge(facts, rest);
  }
  facts = deepMerge(facts, {
    schema: 1,
    collected: { at: new Date().toISOString(), by: `merge de ${files.join(", ") || "rien"}`, lenses: [...lenses] },
  });
  return { facts, errors };
}

if (import.meta.main) {
  const [dir, profileName] = process.argv.slice(2);
  if (!dir || !profileName) {
    console.error("Usage : bun run merge <dossier du cache> <profil>");
    process.exit(2);
  }
  const profile = readProfile(profileName);
  const { facts, errors } = mergeParts(dir, profile.name);
  if (errors.length) {
    console.error(`ÉCHEC merge (${errors.length}) :\n- ${errors.join("\n- ")}`);
    process.exit(1);
  }
  writeFileSync(path.join(dir, "facts.json"), JSON.stringify(facts, null, 2) + "\n");
  const bad = validateFacts(dir, profile);
  if (bad.length) {
    console.error(`facts.json écrit, mais ÉCHEC facts (${bad.length}) :\n- ${bad.join("\n- ")}`);
    process.exit(1);
  }
  console.log(`OK merge : ${dir}/facts.json (${(facts as { collected: { lenses: string[] } }).collected.lenses.join(", ")})`);
}
