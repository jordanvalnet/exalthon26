---
name: gh-project-releases
description: Writes the RELEASES and recent-activity subsection of a non-technical GitHub onboarding report: published versions, rhythm, last change, activity over 90 days and number of active people, from facts.releases collected through the GitHub MCP. Used by /onboard-project.
allowed-tools: Bash(bun run:*), Bash(~/.bun/bin/bun run:*), Read
---

# gh-project-releases — Releases (published versions) and recent activity

Single responsibility: write **only** this section of the onboarding report, for a reader with **no
technical background**. Input: `facts.json` from `onboarding-facts` (key `releases`), or run
`bun run onboarding/src/cli.ts releases <owner>/<repo>` to get the same JSON standalone (use `~/.bun/bin/bun` if `bun` is not on PATH).

Rules: every sentence traces to a fact in the JSON (`facts`), sources are listed in `sources`,
anything missing is in `gaps` and stays a gap ("The documentation does not say." / "Not reachable
through the GitHub MCP tools" + URL). No code, no file paths in prose, gloss any technical word,
short sentences. Label interpretation as "our reading". Never fetch outside the GitHub MCP (see
`github-mcp-access`).

## What to write
- Keep the skeleton table. Say how many releases, first and latest dates (`first`, `latest`), and the rhythm in words ('a version every few weeks', 'no formal release').
- Health today: `lastCommitDate`, `commitsLast90Days` of `commitsSeen`, `distinctAuthorsSeen` → one plain sentence ('actively worked on by a handful of people' / 'quiet for months').
- Fill the placeholder under the "Recent activity" line of the skeleton.
- Remind the reader: a release is a numbered, published version users can install.

## Output
The Markdown of this section only (heading included), replacing the matching ✍️ placeholder of
`skeleton.md`. Keep the factual tables the skeleton already contains.
