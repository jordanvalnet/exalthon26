---
name: gh-project-issues
description: Writes the ISSUES subsection of a non-technical GitHub onboarding report: all tickets (open and closed, full table already in the skeleton), counts, cap notice, recurring themes and the most discussed tickets in plain words, from facts.issues collected through the GitHub MCP. Used by /onboard-project.
allowed-tools: Bash(bun run:*), Bash(~/.bun/bin/bun run:*), Read, mcp__github__issue_read
---

# gh-project-issues — Issues (tickets)

Single responsibility: write **only** this section of the onboarding report, for a reader with **no
technical background**. Input: `facts.json` from `onboarding-facts` (key `issues`), or run
`bun run onboarding/src/cli.ts issues <owner>/<repo>` to get the same JSON standalone (use `~/.bun/bin/bun` if `bun` is not on PATH).

Rules: every sentence traces to a fact in the JSON (`facts`), sources are listed in `sources`,
anything missing is in `gaps` and stays a gap ("The documentation does not say." / "Not reachable
through the GitHub MCP tools" + URL). No code, no file paths in prose, gloss any technical word,
short sentences. Label interpretation as "our reading". Never fetch outside the GitHub MCP (see
`github-mcp-access`).

## What to write
- Keep the skeleton's full tables (open, closed). State counts and whether the list was capped (`openCapped`, `closedCapped`) with the GitHub URL.
- Themes: 3–5 recurring subjects from titles and `labelCounts`, in plain words ('problems when installing', 'requests for new languages').
- Describe `mostDiscussed` (up to 3) and `oldestOpen` in one sentence each. For detail, `mcp__github__issue_read` `method:"get"` is allowed.
- Remind the reader: an issue is a ticket (bug, question or request), not necessarily a defect.

## Output
The Markdown of this section only (heading included), replacing the matching ✍️ placeholder of
`skeleton.md`. Keep the factual tables the skeleton already contains.
