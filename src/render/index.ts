// `bun run render <cache> <profil>` : facts.json + narrative/<profil>.md → deck-<profil>.html. Morceau M4 de onboard/PLAN.md.
// Validation : `bun run validate deck <cache> <profil>`. PDF : `bun run pdf <cache> <profil>`.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Facts } from "../facts.ts";
import { readProfile } from "../validate.ts";
import { buildDeck } from "./deck.ts";

const [dir, profileName] = process.argv.slice(2);
if (!dir || !profileName) {
  console.error("Usage : bun run render <dossier du cache> <profil>");
  process.exit(2);
}

const profile = readProfile(profileName);
const factsFile = path.join(dir, "facts.json");
const narrativeFile = path.join(dir, "narrative", `${profile.name}.md`);
for (const file of [factsFile, narrativeFile]) {
  if (!existsSync(file)) {
    console.error(`${file} manquant : l'étape précédente n'a pas tourné.`);
    process.exit(1);
  }
}

const parsed = Facts.safeParse(JSON.parse(readFileSync(factsFile, "utf8")));
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `- facts.json ${i.path.join(".") || "(racine)"} : ${i.message}`);
  console.error(`facts.json invalide, étape 1 à refaire :\n${issues.join("\n")}`);
  process.exit(1);
}

const out = path.join(dir, `deck-${profile.name}.html`);
writeFileSync(out, buildDeck(parsed.data, readFileSync(narrativeFile, "utf8"), profile));
console.log(`OK render : ${out}`);
