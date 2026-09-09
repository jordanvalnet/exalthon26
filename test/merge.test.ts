import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { deepMerge, mergeParts } from "../src/merge.ts";

describe("deepMerge", () => {
  test("objets fusionnés, tableaux concaténés sans doublon, scalaire : le dernier gagne", () => {
    expect(deepMerge({ a: { x: 1 }, r: [1], s: "old" }, { a: { y: 2 }, r: [1, 2], s: "new" })).toEqual({ a: { x: 1, y: 2 }, r: [1, 2], s: "new" });
  });
});

describe("mergeParts", () => {
  test("assemble les parts, unit les loupes, signale une part invalide", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "onb-"));
    mkdirSync(path.join(dir, "parts"));
    writeFileSync(path.join(dir, "parts", "meta.json"), JSON.stringify({ languages: { TypeScript: 10 }, collected: { by: "1a", at: "2026-09-09", lenses: ["cto"] } }));
    writeFileSync(path.join(dir, "parts", "code.json"), JSON.stringify({ risks: [{ kind: "ci", level: "mid", note: "pas de CI" }] }));
    writeFileSync(path.join(dir, "parts", "history.json"), JSON.stringify({ activity: { bus_factor: "deux" } }));
    const { facts, errors } = mergeParts(dir, "dev");
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.join("\n")).toContain("parts/history.json activity.bus_factor");
    const f = facts as { languages: object; risks: unknown[]; collected: { lenses: string[] } };
    expect(f.languages).toEqual({ TypeScript: 10 });
    expect(f.risks).toHaveLength(1);
    expect(f.collected.lenses.sort()).toEqual(["core", "cto", "dev"]);
  });
});
