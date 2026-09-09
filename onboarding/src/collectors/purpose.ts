// Single responsibility: WHAT the project does — description, intro of the README, feature-like sections.
import type { Collected, RepoMetadata } from "../types.ts";
import { sectionsMatching, type Docs } from "./docs.ts";

export interface Purpose {
  description: string | null; homepage: string | null; topics: string[];
  readmeIntro: string | null;                        // first ~1500 chars of prose before the first "how to" heading
  featureSections: Array<{ heading: string; text: string }>;
  packageDescriptions: Array<{ file: string; description: string }>;
}

export function collectPurpose(meta: RepoMetadata, docs: Docs, descriptors: Array<{ file: string; description: string }>): Collected<Purpose> {
  const gaps = [];
  const intro = docs.readme ? introOf(docs.readme.text) : null;
  if (!intro) gaps.push({ what: "README introduction", reason: "no README or empty introduction" });
  const features = sectionsMatching(docs.sections, /^(features?|what (is|does)|overview|introduction|about|key features|highlights|use cases?|description|summary)\b/i)
    .map((s) => ({ heading: s.heading, text: s.text.slice(0, 2500) }));
  return {
    facts: { description: meta.description, homepage: meta.homepage, topics: meta.topics, readmeIntro: intro, featureSections: features, packageDescriptions: descriptors },
    sources: [{ what: "repository description/topics", via: "search_repositories" }, ...(docs.readme ? [{ what: docs.readme.path, via: "get_file_contents" }] : [])],
    gaps,
  };
}

function introOf(readme: string): string | null {
  const stop = /^#{1,6}\s+(installation|install|getting started|quick ?start|usage|setup|requirements|prerequisites|table of contents|contents)\b/im;
  const idx = readme.search(stop);
  const head = (idx > 0 ? readme.slice(0, idx) : readme).replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/<[^>]+>/g, "").trim();
  if (!head) return null;
  return head.length > 1500 ? head.slice(0, 1500) + " […truncated]" : head;
}
