---
name: gh-project-pull-requests
description: Writes the PULL REQUESTS subsection of a non-technical GitHub onboarding report: all proposed changes (table already in the skeleton), counts by status, who proposes, how fast they are accepted, from facts.pullRequests collected through the GitHub MCP. Used by /onboard-project.
allowed-tools: Bash(bun run:*), Bash(~/.bun/bin/bun run:*), Read, mcp__github__pull_request_read
---

# gh-project-pull-requests — Pull requests (proposed changes)

Single responsibility: write **only** this section of the onboarding report, for a reader with **no
technical background**. Input: `facts.json` from `onboarding-facts` (key `pull-requests`), or run
`bun run onboarding/src/cli.ts pull-requests <owner>/<repo>` to get the same JSON standalone (use `~/.bun/bin/bun` if `bun` is not on PATH).

Rules: every sentence traces to a fact in the JSON (`facts`), sources are listed in `sources`,
anything missing is in `gaps` and stays a gap ("The documentation does not say." / "Not reachable
through the GitHub MCP tools" + URL). No code, no file paths in prose, gloss any technical word,
short sentences. Label interpretation as "our reading". Never fetch outside the GitHub MCP (see
`github-mcp-access`).

## What to write
- Keep the skeleton table. State `counts` (open, draft, merged, closed without merge) and the cap notice if `capped`.
- Dynamics: who proposes (`authors` vs the maintainers from facts.authors → insiders or outsiders), typical acceptance delay (`medianDaysToMerge`, phrase qualitatively: 'usually within a day / a week / months').
- Allowed follow-up: `mcp__github__pull_request_read` `method:"get"` on up to 3 notable PRs to describe them in one sentence each.
- Remind the reader: a pull request is a proposed change waiting for review; 'merged' means accepted.

## Output
The Markdown of this section only (heading included), replacing the matching ✍️ placeholder of
`skeleton.md`. Keep the factual tables the skeleton already contains.
