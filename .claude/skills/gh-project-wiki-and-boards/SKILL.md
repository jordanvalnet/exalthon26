---
name: gh-project-wiki-and-boards
description: Writes the WIKI PAGES and PROJECT BOARDS subsections of a non-technical GitHub onboarding report from facts.wikiAndBoards: on/off flags and URLs only, because the GitHub MCP server has no tool to read wiki pages, Projects boards or Discussions — never fetched another way. Used by /onboard-project.
allowed-tools: Bash(bun run:*), Bash(~/.bun/bin/bun run:*), Read
---

# gh-project-wiki-and-boards — Wiki pages and project boards

Single responsibility: write **only** this section of the onboarding report, for a reader with **no
technical background**. Input: `facts.json` from `onboarding-facts` (key `wiki-and-boards`), or run
`bun run onboarding/src/cli.ts wiki-and-boards <owner>/<repo>` to get the same JSON standalone (use `~/.bun/bin/bun` if `bun` is not on PATH).

Rules: every sentence traces to a fact in the JSON (`facts`), sources are listed in `sources`,
anything missing is in `gaps` and stays a gap ("The documentation does not say." / "Not reachable
through the GitHub MCP tools" + URL). No code, no file paths in prose, gloss any technical word,
short sentences. Label interpretation as "our reading". Never fetch outside the GitHub MCP (see
`github-mcp-access`).

## What to write
- Wiki: `wiki.enabled` → 'The repository has a wiki enabled. Its pages cannot be listed or read through the GitHub MCP tools available here. Browse them at <url>.' else 'No wiki.'
- Project boards: `projects.enabled` → 'Project boards may exist. They cannot be listed through the GitHub MCP tools. Open <url>.' else 'No project boards.'
- Discussions: same pattern when `discussions.enabled`.
- Copy these items into section 9 (gaps). Do NOT try `gh`, `curl`, web fetch or memory to fill them.

## Output
The Markdown of this section only (heading included), replacing the matching ✍️ placeholder of
`skeleton.md`. Keep the factual tables the skeleton already contains.
