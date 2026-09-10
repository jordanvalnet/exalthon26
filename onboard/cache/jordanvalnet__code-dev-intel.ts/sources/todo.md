---
path: search_code "repo:jordanvalnet/code-dev-intel.ts TODO"
url: https://github.com/search?q=repo%3Ajordanvalnet%2Fcode-dev-intel.ts+TODO&type=code
fetched_at: 2026-09-10T13:25:00Z
---
total_count: 2

services/code-intel-mcp/src/mcp-handler.ts
  '- who implements an interface/abstract/port -> findImplementations',
  '- what a file imports / coupling -> dependencyGraph; blast radius of changed files -> impactedFiles',
  '',
  'Reach for Grep only for non-symbol text (string literals, comments, config keys, TODOs).'
].join('\n');

services/code-intel-mcp/src/health-handler.ts
      name: 'searchText',
      endpoint: '/tools/searchText',
      description:
        'Repo-wide text/regex search (ripgrep), .gitignore-aware, returning file:line plus a compact snippet per match. Prefer the symbol tools above when searching for a SYMBOL (findReferences/findDefinitions/findSymbol) — they avoid false positives; use this for non-symbol text: literals, comments, config keys, TODOs.',
      requiredRequestFields: ['workspaceRoot', 'query'],
