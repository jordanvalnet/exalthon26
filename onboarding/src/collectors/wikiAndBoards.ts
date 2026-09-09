// Single responsibility: wiki pages, GitHub Projects boards, Discussions — features the GitHub MCP server cannot read.
// We only report the on/off flags and the URLs. We never fetch them another way.
import type { Collected, RepoMetadata } from "../types.ts";

export interface WikiAndBoards {
  wiki: { enabled: boolean; url: string; readable: false };
  projects: { enabled: boolean; url: string; readable: false };
  discussions: { enabled: boolean; url: string; readable: false };
  pages: { enabled: boolean };
}

export function collectWikiAndBoards(meta: RepoMetadata): Collected<WikiAndBoards> {
  const facts: WikiAndBoards = {
    wiki: { enabled: meta.hasWiki, url: `${meta.htmlUrl}/wiki`, readable: false },
    projects: { enabled: meta.hasProjects, url: `${meta.htmlUrl}/projects`, readable: false },
    discussions: { enabled: meta.hasDiscussions, url: `${meta.htmlUrl}/discussions`, readable: false },
    pages: { enabled: meta.hasPages },
  };
  const gaps = [];
  if (meta.hasWiki) gaps.push({ what: "wiki pages (list and content)", reason: "the GitHub MCP server exposes no wiki tool", url: facts.wiki.url });
  if (meta.hasProjects) gaps.push({ what: "GitHub Projects boards", reason: "the GitHub MCP server exposes no Projects tool", url: facts.projects.url });
  if (meta.hasDiscussions) gaps.push({ what: "Discussions", reason: "the GitHub MCP server exposes no Discussions tool", url: facts.discussions.url });
  return { facts, sources: [{ what: "feature flags has_wiki / has_projects / has_discussions", via: "search_repositories" }], gaps };
}
