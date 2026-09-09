---
name: gh-project-rationale
description: Writes the WHY section of a non-technical GitHub onboarding report: the documented motivation and history of the project, in the authors' words, or an explicit 'not documented' statement, from facts.rationale collected through the GitHub MCP. Used by /onboard-project.
allowed-tools: Bash(bun run:*), Bash(~/.bun/bin/bun run:*), Read, mcp__github__get_file_contents
---

# gh-project-rationale — Why does it exist?

Single responsibility: write **only** this section of the onboarding report, for a reader with **no
technical background**. Input: `facts.json` from `onboarding-facts` (key `rationale`), or run
`bun run onboarding/src/cli.ts rationale <owner>/<repo>` to get the same JSON standalone (use `~/.bun/bin/bun` if `bun` is not on PATH).

Rules: every sentence traces to a fact in the JSON (`facts`), sources are listed in `sources`,
anything missing is in `gaps` and stays a gap ("The documentation does not say." / "Not reachable
through the GitHub MCP tools" + URL). No code, no file paths in prose, gloss any technical word,
short sentences. Label interpretation as "our reading". Never fetch outside the GitHub MCP (see
`github-mcp-access`).

## What to write
- If `documented` is true: summarize `sections` (Motivation / Why / Background / Goals…) and `excerpts` in 3–6 sentences, quote one key sentence, cite the file. Use `firstReleaseNotes` for the origin story if useful.
- If `documented` is false: write exactly **'The documentation does not explain why the project was started.'** and nothing invented. You may add one labelled line 'our reading:' based only on the WHAT section.
- Allowed follow-up: if the README explicitly names a framing document (e.g. a hackathon brief, a charter), read **at most two** such files with `mcp__github__get_file_contents` and cite them. Nothing else.
- Never infer motives from the code or from general knowledge about similar projects.
- When the skeleton already contains the "not documented" sentence, keep it and fill the placeholder below it.

## Output
The Markdown of this section only (heading included), replacing the matching ✍️ placeholder of
`skeleton.md`. Keep the factual tables the skeleton already contains.
