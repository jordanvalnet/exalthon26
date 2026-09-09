---
path: package.json
url: https://github.com/mksglu/context-mode/blob/main/package.json
fetched_at: 2026-09-09T14:56:42Z
---
{
  "name": "context-mode",
  "version": "1.0.169",
  "type": "module",
  "description": "MCP plugin that saves 98% of your context window. Works with Claude Code, Gemini CLI, VS Code Copilot, OpenCode, and Codex CLI. Sandboxed code execution, FTS5 knowledge base, and intent-driven search.",
  "author": "Mert Koseoğlu",
  "license": "Elastic-2.0",
  "keywords": [
    "mcp",
    "model-context-protocol",
    "claude",
    "claude-code",
    "gemini-cli",
    "vscode-copilot",
    "opencode",
    "openclaw",
    "codex-cli",
    "context-window",
    "sandbox",
    "code-execution",
    "fts5",
    "bm25",
    "pi-package"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/mksglu/context-mode"
  },
  "homepage": "https://github.com/mksglu/context-mode#readme",
  "pi": {
    "extensions": [
      "./build/adapters/pi/extension.js"
    ],
    "skills": [
      "./skills"
    ]
  },
  "openclaw": {
    "extensions": [
      "./build/adapters/openclaw/plugin.js"
    ]
  },
  "omp": {
    "name": "context-mode",
    "description": "Save 98% of your context window in OMP — sandboxed code execution, FTS5 search, hard-block curl/wget, session continuity across compaction.",
    "extensions": [
      "./build/adapters/omp/plugin.js"
    ]
  },
  "bugs": "https://github.com/mksglu/context-mode/issues",
  "main": "./build/adapters/opencode/plugin.js",
  "exports": {
    ".": "./build/adapters/opencode/plugin.js",
    "./plugin": "./build/adapters/opencode/plugin.js",
    "./openclaw": "./build/adapters/openclaw/plugin.js",
    "./cli": "./cli.bundle.mjs"
  },
  "bin": {
    "context-mode": "./cli.bundle.mjs"
  },
[tronqué à 60 lignes]

Extrait hors des 60 premières lignes (sections scripts clés, dependencies, devDependencies, packageManager, engines) :
  "scripts": {
    "build": "tsc && node -e \"...chmod build/cli.js...\" && npm run bundle && npm run assert-bundle && npm run assert-asymmetric-drift",
    "bundle": "esbuild src/server.ts --bundle ... --outfile=server.bundle.mjs ... && esbuild src/cli.ts --bundle ... --outfile=cli.bundle.mjs ... && esbuild src/session/extract.ts ... && esbuild src/session/snapshot.ts ... && esbuild src/session/db.ts ... && esbuild src/security.ts ... --outfile=hooks/security.bundle.mjs --minify",
    "dev": "npx tsx src/server.ts",
    "setup": "npx tsx src/cli.ts setup",
    "doctor": "npx tsx src/cli.ts doctor",
    "typecheck": "tsc --noEmit",
    "pretest": "npm run build",
    "test": "vitest run",
    "test:watch": "vitest",
    "benchmark": "npx tsx tests/benchmark.ts",
    "postinstall": "node scripts/postinstall.mjs"
  },
  "dependencies": {
    "@clack/prompts": "^1.0.1",
    "@mixmark-io/domino": "^2.2.0",
    "@modelcontextprotocol/sdk": "^1.26.0",
    "better-sqlite3": "^12.6.2",
    "picocolors": "^1.1.1",
    "turndown": "^7.2.0",
    "turndown-plugin-gfm": "^1.0.2",
    "zod": "^3.25.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.13",
    "@types/node": "^22.19.11",
    "@types/turndown": "^5.0.5",
    "esbuild": "^0.27.3",
    "tsx": "^4.21.0",
    "typescript": "^5.7.0",
    "vitest": "^4.0.18"
  },
  "packageManager": "pnpm@10.23.0+sha512.…",
  "engines": {
    "node": ">=22.5.0"
  }
