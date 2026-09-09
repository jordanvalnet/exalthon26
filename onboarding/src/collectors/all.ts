// Single responsibility: run every collector once, in the right order, and assemble the facts file.
import type { GitHubMcp } from "../github/GitHubMcp.ts";
import type { Collected, Gap, RepoRef, Source } from "../types.ts";
import { collectRepository } from "./repository.ts";
import { loadDocs } from "./docs.ts";
import { collectPurpose } from "./purpose.ts";
import { collectAuthors } from "./authors.ts";
import { collectRationale } from "./rationale.ts";
import { collectImplementation } from "./implementation.ts";
import { collectCost } from "./cost.ts";
import { collectGoals } from "./goals.ts";
import { collectIssues } from "./issues.ts";
import { collectPullRequests } from "./pullRequests.ts";
import { collectReleases } from "./releases.ts";
import { collectWikiAndBoards } from "./wikiAndBoards.ts";

export interface Facts {
  generatedAt: string; preparedBy: string; mcp: string;
  repository: Collected<any>; purpose: Collected<any>; authors: Collected<any>; rationale: Collected<any>;
  implementation: Collected<any>; cost: Collected<any>; goals: Collected<any>;
  issues: Collected<any>; pullRequests: Collected<any>; releases: Collected<any>; wikiAndBoards: Collected<any>;
  sources: Source[]; gaps: Gap[];
}

export type SectionName = "repository" | "purpose" | "authors" | "rationale" | "implementation" | "cost" | "goals" | "issues" | "pull-requests" | "releases" | "wiki-and-boards";

export async function collectSection(gh: GitHubMcp, ref: RepoRef, name: SectionName): Promise<Collected<any>> {
  const repository = await collectRepository(gh, ref);
  const meta = repository.facts;
  const needDocs = ["purpose", "authors", "rationale", "cost", "goals"].includes(name);
  const docs = needDocs ? await loadDocs(gh, ref) : null;
  switch (name) {
    case "repository": return repository;
    case "purpose": { const impl = await collectImplementation(gh, meta); return collectPurpose(meta, docs!.facts, descriptorsOf(impl)); }
    case "authors": return collectAuthors(gh, meta, docs!.facts);
    case "rationale": return collectRationale(gh, meta, docs!.facts);
    case "implementation": return collectImplementation(gh, meta);
    case "cost": return collectCost(gh, meta, docs!.facts);
    case "goals": return collectGoals(docs!.facts);
    case "issues": return collectIssues(gh, meta);
    case "pull-requests": return collectPullRequests(gh, meta);
    case "releases": return collectReleases(gh, meta);
    case "wiki-and-boards": return collectWikiAndBoards(meta);
  }
}

export async function collectAll(gh: GitHubMcp, ref: RepoRef, log: (s: string) => void = () => {}): Promise<Facts> {
  const me = await gh.getMe();
  log(`authenticated as ${me.login}`);
  const repository = await collectRepository(gh, ref); log("repository metadata");
  const meta = repository.facts;
  const docs = await loadDocs(gh, ref); log(`documentation (${docs.sources.length} files)`);
  const implementation = await collectImplementation(gh, meta); log("implementation");
  const purpose = collectPurpose(meta, docs.facts, descriptorsOf(implementation));
  const authors = await collectAuthors(gh, meta, docs.facts); log("authors");
  const rationale = await collectRationale(gh, meta, docs.facts); log("rationale");
  const cost = await collectCost(gh, meta, docs.facts); log("cost");
  const goals = collectGoals(docs.facts);
  const issues = await collectIssues(gh, meta); log(`issues (${issues.facts.open.length} open, ${issues.facts.closed.length} closed)`);
  const pullRequests = await collectPullRequests(gh, meta); log(`pull requests (${pullRequests.facts.rows.length})`);
  const releases = await collectReleases(gh, meta); log("releases");
  const wikiAndBoards = collectWikiAndBoards(meta);

  const parts = { repository, purpose, authors, rationale, implementation, cost, goals, issues, pullRequests, releases, wikiAndBoards };
  const all = [docs, ...Object.values(parts)];
  return {
    generatedAt: new Date().toISOString(), preparedBy: me.login, mcp: "github (https://api.githubcopilot.com/mcp/)",
    ...parts,
    sources: dedupe(all.flatMap((c) => c.sources), (s) => `${s.via}:${s.what}`),
    gaps: dedupe(all.flatMap((c) => c.gaps), (g) => g.what),
  };
}

function descriptorsOf(impl: Collected<any>) {
  return (impl.facts.descriptors ?? []).filter((d: any) => d.description).map((d: any) => ({ file: d.file, description: d.description }));
}

function dedupe<T>(items: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(key(i)) ? false : (seen.add(key(i)), true)));
}
