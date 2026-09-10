---
path: AGENTS.md, CLAUDE.md, .github/CLAUDE.md, .claude/
url: https://github.com/n8n-io/n8n/blob/master/AGENTS.md
fetched_at: 2026-09-10T13:23:45Z
---
AGENTS.md (agents_md) https://github.com/n8n-io/n8n/blob/master/AGENTS.md
CLAUDE.md (claude_md) https://github.com/n8n-io/n8n/blob/master/CLAUDE.md
.github/CLAUDE.md (claude_md) https://github.com/n8n-io/n8n/blob/master/.github/CLAUDE.md
.claude/ (skills_dir) https://github.com/n8n-io/n8n/tree/master/.claude

## AGENTS.md, 40 premières lignes

# AGENTS.md

This file provides guidance on how to work with the n8n repository.

## Project Overview

n8n is a workflow automation platform written in TypeScript, using a monorepo
structure managed by pnpm workspaces. It consists of a Node.js backend, Vue.js
frontend, and extensible node-based workflow engine.

## General Guidelines

- Always use pnpm
- Write all technical text (code comments, PR descriptions, issue and ticket
  descriptions, docs) in ASD-STE100 Simplified Technical English: use short
  sentences, the active voice, and one instruction for each sentence
- **Secrets on the command line:** if a developer opted into anonymous dev
  metrics (`scripts/dev-metrics`), pnpm command arguments are recorded. Arguments
  of secret-carrying words (`config`, `login`, `publish`, `token`) — whether a
  subcommand or baked into a flag — are dropped, and the home dir is stripped from
  paths, but other args are sent as-is — so never put secrets in a command. Pass
  sensitive values via environment variables, which are never captured.
- When adding comments, keep them concise and to the point - explain the "why"
  in a line or two; don't be overly verbose. Comments should be scoped and
  relevant to the surrounding code, not just to the current task
- We use Linear as a ticket tracking system
- We use Posthog for feature flags
- To find registered telemetry events (names, descriptions, properties), run
  `pnpm --filter @n8n/telemetry catalog` (`--json` for structured output). The
  registry is being adopted incrementally, so search call sites if the catalog
  has no match. The `n8n:telemetry` skill covers adding or changing events
- When starting to work on a new ticket – create a new branch from fresh
  master with the name specified in Linear ticket
- When creating a new branch for a ticket in Linear - use the branch name
  suggested by Linear, **unless it is a security fix** (see Security Fix
  Hygiene below)
- Use mermaid diagrams in MD files when you need to visualise something
- **Developing v3 features:** land normal feature work on `master` behind an
  opt-in flag; introduce breaking changes only on the `3.x` branch. See
  [.github/DEVELOPING_V3.md](.github/DEVELOPING_V3.md).

[tronqué]

## CLAUDE.md, fichier entier (1 ligne)

@AGENTS.md
