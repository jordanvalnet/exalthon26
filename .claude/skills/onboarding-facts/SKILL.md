---
name: onboarding-facts
description: Collects ALL the raw facts about a GitHub repository in one pass (metadata, docs, authors, implementation, cost, goals, issues, PRs, releases, wiki/boards flags) by running the TypeScript/bun collectors, which talk only to the GitHub MCP server. Produces facts.json and a factual Markdown skeleton with explicit "to write" placeholders. First step of /onboard-project.
allowed-tools: Bash(bun run:*), Bash(~/.bun/bin/bun run:*), Read
---

# onboarding-facts — collect once, in JSON

Single responsibility: **gather facts**. No prose, no interpretation.

> bun must be on PATH (`bun --version`). If the shell cannot find it, use the full path
> `~/.bun/bin/bun run …` instead of `bun run …`. Do not install anything else.

From the repository root:

```
bun run onboarding/src/cli.ts all <owner>/<repo> [--out <dir>]
```

- Default output dir: `onboarding/out/<owner>-<repo>/` → `facts.json` (every section with `facts`,
  `sources`, `gaps`) and `skeleton.md` (tables + ✍️ placeholders).
- The last stdout line is a JSON summary `{facts, skeleton, gaps, issues, pullRequests}`.
- Progress goes to stderr (`✓ issues (…)`). Typical run: 15 s for a small repo, 1–2 min for a large one.
- Caps (stated in `gaps` when hit): 300 open + 300 closed issues, 300 PRs, 300 commits, 100 releases.

One section only (standalone use by a `gh-project-*` skill):
```
bun run onboarding/src/cli.ts <repository|purpose|authors|rationale|implementation|cost|goals|issues|pull-requests|releases|wiki-and-boards> <owner>/<repo>
```

Failure modes: "GitHub token not found" → `GITHUB_PAT` missing in env/.env; "not found or not
visible to this token" → wrong owner/repo, or private without access. Report them, do not work around.

Hand to the next skills: the paths of `facts.json` and `skeleton.md`. Never edit `facts.json`.
