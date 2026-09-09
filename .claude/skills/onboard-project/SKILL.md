---
name: onboard-project
description: Orchestrator that onboards a NON-TECHNICAL person onto a GitHub project and produces an enhanced executive overview (what / who / why / how / cost & optimization + full list of issues, PRs, releases, wiki and project boards). Usage `/onboard-project owner/repo [--lang fr|en] [--out path]`. Delegates to one single-responsibility skill per section; GitHub is reached only through the GitHub MCP server (bun/TypeScript collectors in onboarding/).
allowed-tools: Skill, Read, Write, Bash(bun run:*), Bash(~/.bun/bin/bun run:*), mcp__github__get_me, mcp__github__get_file_contents, mcp__github__issue_read, mcp__github__pull_request_read
---

# /onboard-project — pipeline

Argument: `<owner>/<repo>` or a GitHub URL. Options: `--lang <language>` (default: the language of the
request), `--out <path>` (default `onboarding/<owner>-<repo>.md`).

Target reader: **no technical background**. Deliverable: an *enhanced executive overview*.

> bun must be on PATH (`bun --version`). If the shell cannot find it, use the full path
> `~/.bun/bin/bun run …` instead of `bun run …`. Do not install anything else.

## Ground rules
- Load `github-mcp-access` first. GitHub is reached **only** through the GitHub MCP server: the bun
  collectors, or `mcp__github__*` read tools for a targeted follow-up. No `gh`, `curl`, git, web, memory.
- Each step below is one skill with one responsibility. **If a step has no skill or the MCP has no tool
  for it, do not improvise**: it becomes a line in "What we could not check" with a URL.
- No invented facts. Silence in the docs → "The documentation does not say."
- Read-only on the target repository.

## Steps

| # | Skill | Responsibility | Output |
|---|---|---|---|
| 0 | `github-mcp-access` | know the one allowed access path and its limits | — |
| 1 | `onboarding-facts` | `bun run onboarding/src/cli.ts all <owner>/<repo>` | `facts.json`, `skeleton.md` |
| 2 | `gh-project-purpose` | §1 What does it do? | section text |
| 3 | `gh-project-authors` | §2 Who is behind it? | section text |
| 4 | `gh-project-rationale` | §3 Why does it exist? | section text |
| 5 | `gh-project-implementation` | §4 How is it implemented? (plain words) | section text + table cells |
| 6 | `gh-project-cost` | §5 rows: price, running cost, funding, effort | table rows |
| 7 | `gh-project-goals` | §5 paragraph: what it optimizes | paragraph |
| 8 | `gh-project-issues` | §7.1 all issues + themes | subsection |
| 9 | `gh-project-pull-requests` | §7.2 all PRs + dynamics | subsection |
| 10 | `gh-project-releases` | §7.3 releases + recent activity | subsection |
| 11 | `gh-project-wiki-and-boards` | §7.4–7.5 wiki, boards, discussions (flags + URLs only) | subsections |
| 12 | `onboarding-report` | assemble, "In one minute", glossary, gaps, sources, write file | the report |

Steps 2–11 are independent: they all read the same `facts.json`; run them in order or in parallel.
If step 1 fails (token, repo not found), stop and report the exact error.

## Final answer to the requester
- Path of the report.
- The six "In one minute" bullets.
- Section 9 (what could not be checked) verbatim, with URLs.
