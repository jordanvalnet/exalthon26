// Single responsibility: load the project's human-readable documentation (README + well-known docs) once,
// and split Markdown into headed sections so other collectors can pick what they need.
import type { GitHubMcp } from "../github/GitHubMcp.ts";
import type { Collected, DocFile, DocSection, RepoRef } from "../types.ts";

const README_CANDIDATES = ["README.md", "README", "README.rst", "readme.md", "Readme.md", "docs/README.md", "docs/index.md"];
const DOC_CANDIDATES = [
  "ABOUT.md", "OVERVIEW.md", "MOTIVATION.md", "VISION.md", "ROADMAP.md", "CHANGELOG.md", "CONTRIBUTING.md",
  "PRICING.md", "SPONSORS.md", "BACKERS.md", "AUTHORS", "AUTHORS.md", "CONTRIBUTORS.md", "MAINTAINERS.md",
  "CITATION.cff", "LICENSE", "LICENSE.md", ".github/FUNDING.yml", "docs/pricing.md", "docs/faq.md", "docs/FAQ.md",
];
const MAX_CHARS = 60_000;

export interface Docs { readme: DocFile | null; files: DocFile[]; sections: DocSection[]; rootEntries: string[] }

export async function loadDocs(gh: GitHubMcp, ref: RepoRef): Promise<Collected<Docs>> {
  const sources = [], gaps = [];
  const root = await gh.listDirectory(ref.owner, ref.repo, "/");
  const rootEntries = (root ?? []).map((e) => e.name);
  sources.push({ what: "root directory listing", via: "get_file_contents" });

  let readme: DocFile | null = null;
  for (const p of README_CANDIDATES) {
    const text = await gh.getFileText(ref.owner, ref.repo, p);
    if (text != null) { readme = { path: p, text: text.slice(0, MAX_CHARS) }; sources.push({ what: p, via: "get_file_contents" }); break; }
  }
  if (!readme) gaps.push({ what: "README", reason: "no README found at the usual locations" });

  const files: DocFile[] = [];
  // Only fetch well-known docs that exist at the root (or the fixed sub-paths), to keep the call count low.
  const candidates = DOC_CANDIDATES.filter((p) => p.includes("/") || rootEntries.includes(p));
  for (const p of candidates) {
    const text = await gh.getFileText(ref.owner, ref.repo, p);
    if (text != null) { files.push({ path: p, text: text.slice(0, MAX_CHARS) }); sources.push({ what: p, via: "get_file_contents" }); }
  }
  const all = [...(readme ? [readme] : []), ...files];
  const sections = all.flatMap((f) => splitMarkdown(f));
  return { facts: { readme, files, sections, rootEntries }, sources, gaps };
}

/** Split a Markdown file into sections (heading + body until the next heading). Non-markdown → one section. */
export function splitMarkdown(file: DocFile): DocSection[] {
  const lines = file.text.split(/\r?\n/);
  const sections: DocSection[] = [];
  let current: DocSection = { file: file.path, heading: "(top)", level: 0, text: "" };
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const m = !inFence && /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) {
      if (current.text.trim() || current.level) sections.push(current);
      current = { file: file.path, heading: m[2].trim(), level: m[1].length, text: "" };
    } else current.text += line + "\n";
  }
  sections.push(current);
  return sections.map((s) => ({ ...s, text: s.text.trim() }));
}

/** Sections whose heading matches any keyword (case-insensitive). */
export function sectionsMatching(sections: DocSection[], keywords: RegExp): DocSection[] {
  return sections.filter((s) => keywords.test(s.heading));
}

/** Paragraphs (from any section) containing a keyword; short excerpts for the reader. */
export function excerpts(sections: DocSection[], keywords: RegExp, max = 12): Array<{ file: string; heading: string; excerpt: string; matched: string }> {
  const out = [];
  for (const s of sections) {
    for (const para of s.text.split(/\n\s*\n/)) {
      const m = keywords.exec(para);
      if (m) out.push({ file: s.file, heading: s.heading, excerpt: para.trim().slice(0, 600), matched: m[0] });
      if (out.length >= max) return out;
    }
  }
  return out;
}
