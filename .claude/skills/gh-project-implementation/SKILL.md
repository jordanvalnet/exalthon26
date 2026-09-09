---
name: gh-project-implementation
description: Writes the HOW section of a non-technical GitHub onboarding report: shape of the product, building blocks with analogies, technologies glossed, delivery and maturity signals, at a high altitude with no deep technical detail, from facts.implementation collected through the GitHub MCP. Used by /onboard-project.
allowed-tools: Bash(bun run:*), Bash(~/.bun/bin/bun run:*), Read
---

# gh-project-implementation — How is it implemented? (no technical background required)

Single responsibility: write **only** this section of the onboarding report, for a reader with **no
technical background**. Input: `facts.json` from `onboarding-facts` (key `implementation`), or run
`bun run onboarding/src/cli.ts implementation <owner>/<repo>` to get the same JSON standalone (use `~/.bun/bin/bun` if `bun` is not on PATH).

Rules: every sentence traces to a fact in the JSON (`facts`), sources are listed in `sources`,
anything missing is in `gaps` and stays a gap ("The documentation does not say." / "Not reachable
through the GitHub MCP tools" + URL). No code, no file paths in prose, gloss any technical word,
short sentences. Label interpretation as "our reading". Never fetch outside the GitHub MCP (see
`github-mcp-access`).

## What to write
- **Shape**: website / mobile app / command-line tool / library for developers / service on servers / data pipeline / documentation only — deduce from `language`, `descriptors`, `topLevel`, `mainFolders`, and say what evidence you used.
- **Building blocks table**: fill the 'what it contains' column of the skeleton table for each folder in `mainFolders`, one plain-language line each (kitchen / dining room style analogies are fine). Never list file names in prose.
- **Technologies, glossed**: cross-check `language` (GitHub's label) with `fileExtensions` (what the folders actually contain, e.g. `.ts` = TypeScript, a stricter flavour of JavaScript); name the one the files support. 'written mostly in … (a popular programming language for…)'. No versions.
- **Delivery & usage**: from `delivery` — releases count and latest date, container packaging, automated workflows count, branches.
- **Quality & maturity**: from `quality` — tests, contribution guide, security policy, docs; rate maturity (prototype / actively developed / mature / dormant) **with the evidence** (dates, releases, activity from facts.releases).

## Output
The Markdown of this section only (heading included), replacing the matching ✍️ placeholder of
`skeleton.md`. Keep the factual tables the skeleton already contains.
