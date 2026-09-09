#!/usr/bin/env bun
// CLI: one command per responsibility. Every command talks to GitHub ONLY through the GitHub MCP server.
//   bun run src/cli.ts <section> <owner>/<repo>            → JSON facts for one section
//   bun run src/cli.ts all <owner>/<repo> [--out dir]      → facts.json + skeleton.md in dir (default onboarding/out/<owner>-<repo>/)
//   bun run src/cli.ts skeleton <facts.json>               → Markdown skeleton from an existing facts file
//   bun run src/cli.ts tools                               → list the MCP tools the server exposes (proof of what exists / does not)
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { GitHubMcp, GITHUB_MCP_URL } from "./github/GitHubMcp.ts";
import { McpClient } from "./mcp/client.ts";
import { findGitHubToken } from "./env.ts";
import { collectAll, collectSection, type SectionName } from "./collectors/all.ts";
import { renderSkeleton } from "./report/skeleton.ts";
import type { RepoRef } from "./types.ts";

const SECTIONS: SectionName[] = ["repository", "purpose", "authors", "rationale", "implementation", "cost", "goals", "issues", "pull-requests", "releases", "wiki-and-boards"];
const USAGE = `Usage: bun run src/cli.ts <command> ...
  ${SECTIONS.join(" | ")}  <owner>/<repo>     facts (JSON) for one section
  all <owner>/<repo> [--out <dir>]                write facts.json + skeleton.md
  skeleton <facts.json>                           Markdown skeleton from a facts file
  tools                                           MCP tools exposed by the GitHub server`;

const [cmd, ...rest] = process.argv.slice(2);
if (!cmd || cmd === "-h" || cmd === "--help") { console.log(USAGE); process.exit(cmd ? 0 : 1); }

try {
  if (cmd === "tools") {
    const client = new McpClient(GITHUB_MCP_URL, `Bearer ${findGitHubToken()}`);
    for (const t of await client.listTools()) console.log(t.name);
  } else if (cmd === "skeleton") {
    const file = rest[0] ?? fail("skeleton needs a facts.json path");
    process.stdout.write(renderSkeleton(JSON.parse(readFileSync(file, "utf8"))));
  } else if (cmd === "all") {
    const ref = parseRef(rest[0]);
    const outIdx = rest.indexOf("--out");
    const dir = outIdx >= 0 ? rest[outIdx + 1] : path.resolve(import.meta.dir, "../out", `${ref.owner}-${ref.repo}`);
    const facts = await collectAll(GitHubMcp.fromEnv(), ref, (s) => console.error(`✓ ${s}`));
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "facts.json"), JSON.stringify(facts, null, 2));
    writeFileSync(path.join(dir, "skeleton.md"), renderSkeleton(facts));
    console.log(JSON.stringify({ facts: path.join(dir, "facts.json"), skeleton: path.join(dir, "skeleton.md"), gaps: facts.gaps.length, issues: facts.issues.facts.open.length + facts.issues.facts.closed.length, pullRequests: facts.pullRequests.facts.rows.length }));
  } else if ((SECTIONS as string[]).includes(cmd)) {
    const result = await collectSection(GitHubMcp.fromEnv(), parseRef(rest[0]), cmd as SectionName);
    console.log(JSON.stringify(result, null, 2));
  } else fail(`Unknown command "${cmd}".\n${USAGE}`);
} catch (e) { fail(e instanceof Error ? e.message : String(e)); }

function parseRef(arg?: string): RepoRef {
  if (!arg) fail("Missing <owner>/<repo>.\n" + USAGE);
  const m = /(?:github\.com[/:])?([^/\s]+)\/([^/\s#?]+?)(?:\.git)?(?:[/?#].*)?$/.exec(arg!.trim());
  if (!m) fail(`Cannot parse "${arg}" as owner/repo.`);
  return { owner: m![1], repo: m![2] };
}

function fail(message: string): never { console.error(message); process.exit(1); }
