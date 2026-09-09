---
name: gh-project-purpose
description: Writes the WHAT section of a non-technical GitHub onboarding report: what the project does, for whom, in everyday words, from facts.purpose (description, README intro, feature sections, package descriptions) collected through the GitHub MCP. Used by /onboard-project.
allowed-tools: Bash(bun run:*), Bash(~/.bun/bin/bun run:*), Read
---

# gh-project-purpose — What does this project do?

Single responsibility: write **only** this section of the onboarding report, for a reader with **no
technical background**. Input: `facts.json` from `onboarding-facts` (key `purpose`), or run
`bun run onboarding/src/cli.ts purpose <owner>/<repo>` to get the same JSON standalone (use `~/.bun/bin/bun` if `bun` is not on PATH).

Rules: every sentence traces to a fact in the JSON (`facts`), sources are listed in `sources`,
anything missing is in `gaps` and stays a gap ("The documentation does not say." / "Not reachable
through the GitHub MCP tools" + URL). No code, no file paths in prose, gloss any technical word,
short sentences. Label interpretation as "our reading". Never fetch outside the GitHub MCP (see
`github-mcp-access`).

## What to write
- Start with a one-sentence answer, then 3–6 sentences: the problem solved, for whom, what a user sees or gets. One analogy is welcome.
- Use `description`, `readmeIntro`, `featureSections`, `packageDescriptions`, `topics`, `homepage`.
- End with a one-line tagline in quotes, preferably the project's own words.
- If `readmeIntro` is null and no feature section exists: say that the project describes itself only by its short GitHub description (quote it) and flag the gap.

## Output
The Markdown of this section only (heading included), replacing the matching ✍️ placeholder of
`skeleton.md`. Keep the factual tables the skeleton already contains.
