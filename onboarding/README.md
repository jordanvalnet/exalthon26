# onboarding/ — non-technical onboarding of a GitHub project (TypeScript · bun · zero dependency)

Produces the *facts* behind an **enhanced executive overview** of any GitHub repository, for a reader
with no technical background: what the project does, who made it, why, how it is built (plain
words), what it costs / optimizes, plus every issue, pull request, release, and the wiki / project
boards status.

**All GitHub access goes through the GitHub MCP server** (`https://api.githubcopilot.com/mcp/`, same
server as `.mcp.json`). `src/mcp/client.ts` is a minimal MCP client (JSON-RPC over Streamable HTTP);
`src/github/GitHubMcp.ts` is the only file allowed to name GitHub tools. No REST calls, no `gh`.

## Run

```bash
# token: GITHUB_PAT in the environment or in ../.env (same as chat/chat.mjs); bun ≥ 1.1 on PATH
bun run onboarding/src/cli.ts all owner/repo            # → onboarding/out/owner-repo/{facts.json,skeleton.md}
bun run onboarding/src/cli.ts issues owner/repo         # one section as JSON (see list below)
bun run onboarding/src/cli.ts skeleton path/facts.json  # Markdown skeleton from a facts file
bun run onboarding/src/cli.ts tools                     # the tools the MCP server exposes
```

Sections: `repository purpose authors rationale implementation cost goals issues pull-requests releases wiki-and-boards`.

The skeleton contains every factual table plus `✍️ TO WRITE` placeholders. The plain-language text is
written by the Claude Code skills in `.claude/skills/` (one skill per section), orchestrated by
`/onboard-project owner/repo` or the `onboarding-guide` agent.

## Design — one responsibility per file

| Layer | File | Does exactly |
|---|---|---|
| token | `src/env.ts` | find `GITHUB_PAT` |
| protocol | `src/mcp/client.ts` | speak MCP to one server |
| access | `src/github/GitHubMcp.ts` | one typed method per allowed read-only GitHub tool |
| facts | `src/collectors/<section>.ts` | answer one question; return `{facts, sources, gaps}` |
| facts | `src/collectors/docs.ts` | load README + well-known docs once, split into sections |
| facts | `src/collectors/all.ts` | run every collector once, merge sources and gaps |
| render | `src/report/skeleton.ts` | factual Markdown + placeholders (no prose) |
| entry | `src/cli.ts` | argument parsing and output files |

Honesty rules baked in: lists are capped (300 open + 300 closed issues, 300 PRs, 300 commits, 100
releases) and every cap is reported in `gaps`; features the MCP server cannot read (wiki pages,
Projects boards, Discussions, Actions runs) are reported as gaps with their URL, never fetched
another way; anything the documentation does not say stays "not documented".
