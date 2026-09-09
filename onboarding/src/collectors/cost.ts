// Single responsibility: COST — price for users, running cost, funding/sponsors, documented effort. Documentation only.
import type { GitHubMcp } from "../github/GitHubMcp.ts";
import type { Collected, RepoMetadata } from "../types.ts";
import { excerpts, sectionsMatching, type Docs } from "./docs.ts";

export interface Cost {
  license: { key: string; name: string } | null;
  pricingSections: Array<{ file: string; heading: string; text: string }>;
  priceExcerpts: Array<{ file: string; heading: string; excerpt: string; matched: string }>;
  runningCostExcerpts: Array<{ file: string; heading: string; excerpt: string; matched: string }>;
  fundingFile: string | null; fundingExcerpts: Array<{ file: string; heading: string; excerpt: string; matched: string }>;
  effortExcerpts: Array<{ file: string; heading: string; excerpt: string; matched: string }>;
  codeSearchHits: Array<{ query: string; files: string[] }>;
}

export async function collectCost(gh: GitHubMcp, meta: RepoMetadata, docs: Docs): Promise<Collected<Cost>> {
  const sources = [], gaps = [];
  const pricingSections = sectionsMatching(docs.sections, /^(pricing|price|plans?|cost|billing|license|licen[cs]ing|commercial|enterprise|sponsors?|funding|support (us|this project)|donat)/i)
    .map((s) => ({ file: s.file, heading: s.heading, text: s.text.slice(0, 2000) }));
  const priceExcerpts = excerpts(docs.sections, /\b(free|paid|pricing|price|subscription|per (month|year|seat|user)|\$\d|€\d|£\d|commercial license|enterprise plan|open[- ]source)\b/i, 10);
  const runningCostExcerpts = excerpts(docs.sections, /\b(hosting|cloud|aws|gcp|azure|vercel|netlify|free tier|quota|rate limit|api key|token cost|infrastructure|server cost|compute)\b/i, 10);
  const funding = docs.files.find((f) => /FUNDING\.yml$|^SPONSORS|^BACKERS/i.test(f.path));
  const fundingExcerpts = excerpts(docs.sections, /\b(sponsor|funding|donate|donation|open ?collective|patreon|github sponsors|grant|backed by|funded by)\b/i, 8);
  const effortExcerpts = excerpts(docs.sections, /\b(hackathon|team of|person[- ]?(months?|years?)|built (in|during|over)|weekend project|side project|full[- ]time|volunteers?)\b/i, 6);

  const codeSearchHits = [];
  for (const q of [`pricing OR price OR cost OR billing repo:${meta.fullName} extension:md`, `sponsor OR funding OR donate repo:${meta.fullName} extension:md`]) {
    try { const r = await gh.searchCode(q, 10); codeSearchHits.push({ query: q, files: (r.items ?? []).map((i: any) => i.path) }); sources.push({ what: `code search "${q.split(" repo:")[0]}"`, via: "search_code" }); }
    catch (e) { gaps.push({ what: `code search for cost words`, reason: String(e).slice(0, 120) }); }
  }
  if (docs.readme) sources.push({ what: docs.readme.path, via: "get_file_contents" });
  if (funding) sources.push({ what: funding.path, via: "get_file_contents" });
  if (!pricingSections.length && !priceExcerpts.length) gaps.push({ what: "price for users", reason: "no pricing/cost statement found in the documentation read (license only)" });
  if (!runningCostExcerpts.length) gaps.push({ what: "running / infrastructure cost", reason: "not documented" });
  if (!funding && !fundingExcerpts.length) gaps.push({ what: "funding / sponsors", reason: "no FUNDING file or sponsor mention found" });

  return { facts: { license: meta.license, pricingSections, priceExcerpts, runningCostExcerpts, fundingFile: funding?.path ?? null, fundingExcerpts, effortExcerpts, codeSearchHits }, sources, gaps };
}
