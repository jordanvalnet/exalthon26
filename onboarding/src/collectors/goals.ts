// Single responsibility: what the project seeks to OPTIMIZE — stated goals and optimization vocabulary in the docs.
import type { Collected } from "../types.ts";
import { excerpts, sectionsMatching, type Docs } from "./docs.ts";

export interface Goals {
  goalSections: Array<{ file: string; heading: string; text: string }>;
  optimizationExcerpts: Array<{ file: string; heading: string; excerpt: string; matched: string }>;
  vocabulary: Array<{ word: string; hits: number }>;
}

const WORDS = ["faster", "speed", "performance", "cheaper", "cost", "save time", "saves time", "reduce", "automate", "automation", "simplify", "simple", "productivity", "accuracy", "reliable", "reliability", "scalable", "secure", "security", "quality", "efficien", "latency", "energy", "instant"];

export function collectGoals(docs: Docs): Collected<Goals> {
  const goalSections = sectionsMatching(docs.sections, /^(goals?|objectives?|benefits|why use|advantages|value|key benefits|what you get|design (goals|principles)|principles|non-goals)\b/i)
    .map((s) => ({ file: s.file, heading: s.heading, text: s.text.slice(0, 2000) }));
  const optimizationExcerpts = excerpts(docs.sections, /\b(optimi[sz]|faster|cheaper|reduce|save[sd]? (time|money|cost)|automat|simplif|productiv|efficien|performance|scal(e|able)|reliab|accura)\w*/i, 12);
  const all = docs.sections.map((s) => s.text).join("\n").toLowerCase();
  const vocabulary = WORDS.map((w) => ({ word: w, hits: all.split(w).length - 1 })).filter((v) => v.hits > 0).sort((a, b) => b.hits - a.hits);
  const gaps = goalSections.length || optimizationExcerpts.length ? [] : [{ what: "optimization goals", reason: "the documentation does not state what the project optimizes" }];
  return { facts: { goalSections, optimizationExcerpts, vocabulary }, sources: docs.readme ? [{ what: docs.readme.path, via: "get_file_contents" }] : [], gaps };
}
