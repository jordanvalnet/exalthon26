---
name: github-mcp-access
description: The single source of truth on HOW this repository reaches GitHub — exclusively through the GitHub MCP server (read-only tools), either from the TypeScript/bun collectors in onboarding/ or via the mcp__github__* tools directly. Lists what the MCP server can and cannot do (no wiki, no Projects, no Discussions, no Actions runs) and forbids any other access path. Load before any GitHub read.
---

# github-mcp-access — one access path: the GitHub MCP server

Server `github` (`.mcp.json`) → `https://api.githubcopilot.com/mcp/`, token `GITHUB_PAT` (`.env`).

## The rule
GitHub data is obtained **only** by:
1. the TypeScript collectors `onboarding/src/**` run with **bun** (they are an MCP client of that same
   server: `onboarding/src/mcp/client.ts` → `onboarding/src/github/GitHubMcp.ts`), or
2. the `mcp__github__*` read tools of the session, for a targeted follow-up read (one more file, one issue).

Forbidden: `gh`, `curl`, `git clone`, web browsing, the GitHub REST API by hand, memory of the project.
If none of the two allowed paths can answer, the answer is a **gap**, written as
"Not reachable through the GitHub MCP tools" + the GitHub URL. **Never improvise.**

## Read-only tools we use (47 tools exposed; `bun run onboarding/src/cli.ts tools` prints the live list)

| Need | MCP tool | Wrapper method (GitHubMcp.ts) |
|---|---|---|
| token check / login | `get_me` | `getMe()` |
| repository card (description, owner, license, dates, stars, `has_wiki`, `has_projects`, `has_discussions`) | `search_repositories` `query:"repo:o/r"` `minimal_output:false` | `searchRepositories()` |
| file text / directory listing | `get_file_contents` | `getFileText()`, `listDirectory()` |
| word search in files (default branch) | `search_code` | `searchCode()` |
| commit history & authors | `list_commits` | `listCommits()` |
| collaborators (needs push rights) | `list_repository_collaborators` | `listCollaborators()` |
| public profile | `search_users` | `searchUsers()` |
| all issues (cursor pagination) | `list_issues` | `listIssues()` |
| one issue / its comments | `issue_read` | (direct tool) |
| all pull requests (page pagination) | `list_pull_requests` | `listPullRequests()` |
| one PR | `pull_request_read` | (direct tool) |
| releases, tags, branches | `list_releases`, `list_tags`, `list_branches` | `listReleases()`, `listTags()`, `listBranches()` |

Write tools (`issue_write`, `create_*`, `push_files`, `merge_*`, `delete_*`…) are **never** used for onboarding.

## What the server CANNOT do → report as a gap with the URL

| Information | Tool? | What to write |
|---|---|---|
| Wiki pages (list, content) | none | "Wiki enabled (flag) but pages not reachable through MCP → https://github.com/o/r/wiki" or "No wiki." |
| GitHub Projects boards | none (`list_issue_fields` is about issue custom fields, not boards) | "Boards may exist; not reachable through MCP → https://github.com/o/r/projects" or "No project boards." |
| Discussions | none | flag + https://github.com/o/r/discussions |
| Actions runs, CI minutes, billing | none (workflow *files* are readable) | link https://github.com/o/r/actions |
| Traffic, insights, language %, contributors graph | none | approximate from commits, say so, link /graphs/contributors |
| Sponsors / cloud costs | documentation only (`.github/FUNDING.yml`, README) | "Not documented" when absent |
| Milestones list | no dedicated tool | mention names seen on issues/PRs only |
