---
name: onboarding-report
description: Assembles the final non-technical "enhanced executive overview" of a GitHub project — takes the factual skeleton from onboarding-facts and the sections written by the gh-project-* skills, enforces the plain-language rules, fills the "In one minute" summary, sections 8–10 (glossary, gaps, sources) and writes the report file. Last step of /onboard-project.
allowed-tools: Read, Write, Bash(bun run:*), Bash(~/.bun/bin/bun run:*)
---

# onboarding-report — assemble and finish

Single responsibility: **assemble** `skeleton.md` + the eleven section texts into one coherent report,
in one language, and write it. It writes no new facts.

## Inputs
`skeleton.md` and `facts.json` (from `onboarding-facts`), the section texts from
`gh-project-purpose`, `-authors`, `-rationale`, `-implementation`, `-cost`, `-goals`, `-issues`,
`-pull-requests`, `-releases`, `-wiki-and-boards`, the report language, the output path
(default `onboarding/<owner>-<repo>.md` at the repository root).

## Steps
1. Start from `skeleton.md`. Replace every `✍️ TO WRITE` placeholder and every `✍️ _to describe_` /
   `_to write_` cell with the corresponding section text. Keep all factual tables.
2. Write **"In one minute"**: exactly six bullets — what it is · who made it · why it exists · how
   it is built (nutshell) · what it costs / optimizes · health today. Each bullet one sentence, bold lead words.
3. Section 8 glossary: keep, translate if needed, add any technical word you had to use.
4. Section 9 "What we could not check": the skeleton's gaps list **plus** any gap reported by a
   section skill, each with a URL when one exists. Never remove a gap.
5. Section 10 sources: keep the list from the skeleton.
6. Final pass — the plain-language rules:
   - no code, no commands, no file paths in prose (folder names only inside the building-blocks table);
   - every technical term glossed once in parentheses; short sentences; one language throughout;
   - facts only, interpretations labelled "our reading"; dates written out in the report language (`9 September 2026`, `9 septembre 2026`);
   - the skeleton is generated in English: translate every fixed string, table header and gap line when the report language differs;
   - a bullet of "In one minute" whose section is "not documented" says exactly that, in one clause;
   - the reader's questions are answered in order: what → who → why → how → cost/optimize → facts → activity.
7. Write the file with the Write tool. Do not leave any ✍️ marker.

## Return to the orchestrator
Report path · the "In one minute" block · section 9 verbatim.
