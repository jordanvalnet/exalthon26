import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { mergeParts } from "../src/merge.ts";

test("merge assemble les parts et unit les loupes", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "onb-"));
  mkdirSync(path.join(dir, "parts"));
  writeFileSync(path.join(dir, "parts", "meta.json"), JSON.stringify({ languages: { TypeScript: 10 }, collected: { by: "1a", at: "2026-09-09", lenses: ["cto"] } }));
  writeFileSync(path.join(dir, "parts", "code.json"), JSON.stringify({ risks: [{ kind: "ci", level: "mid", note: "pas de CI" }] }));
  const { facts, errors } = mergeParts(dir, "dev");
  expect(errors).toEqual([]);
  const f = facts as { languages: object; risks: unknown[]; collected: { lenses: string[] } };
  expect(f.languages).toEqual({ TypeScript: 10 });
  expect(f.risks).toHaveLength(1);
  expect(f.collected.lenses.sort()).toEqual(["core", "cto", "dev"]);
});
