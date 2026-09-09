// Single responsibility: WHY the project exists — motivation/background sections, first commit message, first release notes.
import type { GitHubMcp } from "../github/GitHubMcp.ts";
import type { Collected, RepoMetadata } from "../types.ts";
import { excerpts, sectionsMatching, type Docs } from "./docs.ts";

export interface Rationale {
  sections: Array<{ file: string; heading: string; text: string }>;
  excerpts: Array<{ file: string; heading: string; excerpt: string; matched: string }>;
  firstReleaseNotes: { tag: string; date: string; text: string } | null;
  documented: boolean;
}

const HEADINGS = /^(why|motivation|background|rationale|goals?|vision|mission|about|history|context|the problem|problem statement|purpose|philosophy|objectives?)\b/i;
const WORDS = /\b(because|motivat|we built|we created|was created|was born|the goal|our goal|aims? to|in order to|the problem|to solve|born out of)\b/i;

export async function collectRationale(gh: GitHubMcp, meta: RepoMetadata, docs: Docs): Promise<Collected<Rationale>> {
  const sources = [], gaps = [];
  const sections = sectionsMatching(docs.sections, HEADINGS).map((s) => ({ file: s.file, heading: s.heading, text: s.text.slice(0, 3000) }));
  const ex = excerpts(docs.sections, WORDS, 8);
  if (docs.readme) sources.push({ what: docs.readme.path, via: "get_file_contents" });

  let firstReleaseNotes = null;
  try {
    const releases = await gh.listReleases(meta.owner, meta.repo, 100);
    const first = releases.at(-1);
    if (first && releases.length < 100) { firstReleaseNotes = { tag: first.tag_name, date: first.published_at, text: (first.body ?? "").slice(0, 1200) }; sources.push({ what: `first release ${first.tag_name}`, via: "list_releases" }); }
  } catch {}

  const documented = sections.length > 0 || ex.length > 0;
  if (!documented) gaps.push({ what: "motivation / reason for the project", reason: "no Motivation/Why/Background section and no explanatory sentence found in the documentation read" });
  return { facts: { sections, excerpts: ex, firstReleaseNotes, documented }, sources, gaps };
}
