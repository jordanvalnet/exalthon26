// `bun run merge <cache> <profil>` : reconstruit facts.json à partir de parts/*.json, puis validate facts.
// Règle : un bloc de premier niveau vient d'une seule part, sauf `build` (fusion des clés) et `risks` (concaténation).
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { Facts } from "./facts.ts";
import { readProfile, validateFacts } from "./validate.ts";

const ORDER = ["meta", "issues", "history", "docs", "code", "roadmap"];
const Part = Facts.omit({ schema: true, collected: true })
  .partial()
  .extend({ collected: z.object({ by: z.string().optional(), at: z.string().optional() }).optional() });

const isObject = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);

function mergeBlock(a: unknown, b: unknown): unknown {
  if (Array.isArray(a) && Array.isArray(b)) {
    const seen = new Set(a.map((x) => JSON.stringify(x)));
    return [...a, ...b.filter((x) => !seen.has(JSON.stringify(x)))];
  }
  if (isObject(a) && isObject(b)) return { ...a, ...b };
  return b;
}

export function mergeParts(dir: string, profile: string): { facts: Facts; parts: string[]; errors: string[] } {
  const errors: string[] = [];
  const partsDir = path.join(dir, "parts");
  const files = existsSync(partsDir) ? readdirSync(partsDir).filter((f) => f.endsWith(".json")) : [];
  const rank = (f: string) => {
    const i = ORDER.indexOf(f.slice(0, -5));
    return i === -1 ? ORDER.length : i;
  };
  files.sort((x, y) => rank(x) - rank(y) || x.localeCompare(y));

  const factsFile = path.join(dir, "facts.json");
  const previous = existsSync(factsFile) ? (JSON.parse(readFileSync(factsFile, "utf8")) as { collected?: { lenses?: string[] } }) : {};
  const lenses = new Set<string>(["core", profile, ...(previous.collected?.lenses ?? [])]);

  const blocks: Record<string, unknown> = {};
  const parts: string[] = [];
  for (const f of files) {
    let raw: unknown;
    try {
      raw = JSON.parse(readFileSync(path.join(partsDir, f), "utf8"));
    } catch (err) {
      errors.push(`parts/${f} : JSON invalide : ${(err as Error).message}`);
      continue;
    }
    const parsed = Part.safeParse(raw);
    if (!parsed.success) {
      errors.push(...parsed.error.issues.map((i) => `parts/${f} ${i.path.join(".") || "(racine)"} : ${i.message}`));
      continue;
    }
    const { collected, ...rest } = parsed.data;
    parts.push(collected?.by ?? f.slice(0, -5));
    for (const [k, v] of Object.entries(rest)) {
      if (v === undefined) continue;
      blocks[k] = k in blocks ? mergeBlock(blocks[k], v) : v;
    }
  }
  const facts = {
    schema: 1,
    ...blocks,
    collected: { at: new Date().toISOString(), by: `merge de ${parts.join(", ") || "rien"}`, lenses: [...lenses] },
  } as Facts;
  return { facts, parts, errors };
}

if (import.meta.main) {
  const [dir, profileName] = process.argv.slice(2);
  if (!dir || !profileName) {
    console.error("Usage : bun run merge <dossier du cache> <profil>");
    process.exit(2);
  }
  const profile = readProfile(profileName);
  const { facts, parts, errors } = mergeParts(dir, profile.name);
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
  const blocks = Object.keys(facts).filter((k) => k !== "schema" && k !== "collected");
  console.log(`OK merge : ${dir}/facts.json ← ${parts.join(", ")} · ${blocks.length} blocs · lenses ${facts.collected.lenses.join(", ")}`);
}
