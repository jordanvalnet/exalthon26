import { expect, test } from "bun:test";
import { readProfile, validateFacts, validateNarrative } from "../src/validate.ts";

const example = "onboard/cache/example";

test("le cache exemple passe : facts pour tous les profils, narratif dev", () => {
  for (const p of ["dev", "qa", "cto", "ceo", "investisseur", "enfant"]) expect(validateFacts(example, readProfile(p))).toEqual([]);
  expect(validateNarrative(example, readProfile("dev"))).toEqual([]);
});
