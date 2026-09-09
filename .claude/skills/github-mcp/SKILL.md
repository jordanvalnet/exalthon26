---
name: github-mcp
description: Utiliser le serveur MCP GitHub distant (api.githubcopilot.com) déclaré dans .mcp.json - toolsets, mode lecture seule, en-têtes, outils fréquents pour issues et pull requests, alternative Docker.
---
# Serveur MCP GitHub distant

Déclaré dans `.mcp.json` sous `github`, authentifié par `GITHUB_PAT` (scope `repo`).
Exporter le token avant `claude` : `set -a; source .env; set +a`.

## Réduire le nombre d'outils (contexte plus léger, choix plus fiable)
En-têtes à ajouter dans `.mcp.json` à côté de `Authorization` :
- `"X-MCP-Toolsets": "repos,issues,pull_requests"`
- `"X-MCP-Readonly": "true"`
- `"X-MCP-Tools": "get_file_contents,issue_read"` (liste explicite d'outils)

Ou par URL : `https://api.githubcopilot.com/mcp/x/<toolset>`, suffixe `/readonly` possible.

## Toolsets
Courants : `context` (qui suis-je), `repos`, `issues`, `pull_requests`, `actions`, `labels`, `discussions`, `notifications`, `users`, `orgs`, `projects`, `gists`, `git`.
Autres : `code_security`, `secret_protection`, `dependabot`, `security_advisories`, `code_quality`, `governance`, `stargazers`, `copilot`.

## Outils fréquents
- Issues : `list_issues`, `search_issues`, `issue_read`, `issue_write`, `add_issue_comment`, `sub_issue_write`
- Pull requests : `list_pull_requests`, `search_pull_requests`, `pull_request_read`, `create_pull_request`, `update_pull_request`, `pull_request_review_write`, `merge_pull_request`
- Repos : `get_file_contents`, `search_code`, `create_branch`, `push_files`, `create_or_update_file`

## Réseau bloqué : serveur local Docker
```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT -- \
  docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
```
