import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { readProfile, validateDeck, validateFacts, validateNarrative } from "../src/validate.ts";

const example = "onboard/cache/example";

describe("readProfile", () => {
  test("lit questions, graphiques, sources et deck", () => {
    const dev = readProfile("dev");
    expect(dev.questions).toHaveLength(6);
    expect(dev.questions[1]).toEqual({ text: "Comment le code est-il organisé ?", chart: "tree" });
    expect(dev.facts).toContain("activity");
    expect(dev.pages).toBe(9);
  });
  test("profil inconnu : liste les profils", () => {
    expect(() => readProfile("pirate")).toThrow("Profils : ");
  });
});

describe("validateFacts", () => {
  test("l'exemple passe pour tous les profils", () => {
    for (const p of ["dev", "qa", "cto", "ceo", "investisseur", "enfant"]) expect(validateFacts(example, readProfile(p))).toEqual([]);
  });
  test("dossier vide : facts.json manquant", () => {
    expect(validateFacts(mkdtempSync(path.join(tmpdir(), "onb-")), readProfile("dev"))[0]).toContain("manquant");
  });
});

describe("validateNarrative", () => {
  test("l'exemple dev passe", () => {
    expect(validateNarrative(example, readProfile("dev"))).toEqual([]);
  });
  test("titre différent, citation absente, chemin facts faux et glossaire vide sont signalés", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "onb-"));
    mkdirSync(path.join(dir, "narrative"));
    writeFileSync(path.join(dir, "facts.json"), JSON.stringify({ activity: { bus_factor: 2 } }));
    writeFileSync(path.join(dir, "glossary.md"), "");
    const md = ["---", "repo: a/b", "profile: enfant", "generated_at: 2026-09-09", "---", "# T",
      "## C'est quoi ce projet ?", "sans citation", "## Qui s'en sert et pour quoi faire ?", "[facts:activity.nope]"].join("\n");
    writeFileSync(path.join(dir, "narrative", "enfant.md"), md);
    const errors = validateNarrative(dir, readProfile("enfant"));
    expect(errors).toContain("section 1 : titre « C'est quoi ce projet ? » au lieu de « C'est quoi, ce projet ? »");
    expect(errors).toContain("section 1 : aucune citation [facts:…] [src:…] [gh:…]");
    expect(errors).toContain("section 2 : [facts:activity.nope] ne correspond à rien dans facts.json");
    expect(errors).toContain("section 3 manquante : « Combien de personnes le fabriquent ? »");
    expect(errors.at(-1)).toContain("glossary.md : 0 terme(s)");
  });
});

describe("validateDeck", () => {
  test("deck autonome avec assez de sections passe, externe échoue", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "onb-"));
    const profile = { name: "enfant", questions: readProfile("enfant").questions, facts: [], sources: [] };
    const sections = "<section></section>".repeat(7);
    writeFileSync(path.join(dir, "deck-enfant.html"), `<style>@media print{}</style>${sections}`);
    expect(validateDeck(dir, profile)).toEqual([]);
    writeFileSync(path.join(dir, "deck-enfant.html"), `<script src="https://x/y.js"></script>${sections}`);
    expect(validateDeck(dir, profile)).toContain("ressource externe détectée : le deck doit être autonome");
  });
});
