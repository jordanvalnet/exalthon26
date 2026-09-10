---
path: package.json
url: https://github.com/n8n-io/n8n/blob/master/package.json
fetched_at: 2026-09-10T13:25:00Z
---
{
  "name": "n8n-monorepo",
  "version": "2.39.0",
  "private": true,
  "engines": {
    "node": ">=24.0.0",
    "pnpm": ">=12.3.4"
  },
  "packageManager": "pnpm@12.3.4",
  "scripts": {
    "prepare": "node scripts/prepare.mjs",
    "preinstall": "node scripts/block-npm-install.js",
    "build": "turbo run build",
    "build:unchecked": "turbo run build:unchecked",
    "build:n8n": "node scripts/build-n8n.mjs",
    "build:deploy": "node scripts/build-n8n.mjs",
    "build:docker": "node scripts/build-n8n.mjs && node scripts/dockerize-n8n.mjs",
    "build:docker:coverage": "BUILD_WITH_COVERAGE=true node scripts/build-n8n.mjs && node scripts/dockerize-n8n.mjs",
    "build:docker:scan": "node scripts/build-n8n.mjs && node scripts/dockerize-n8n.mjs && node scripts/scan-n8n-image.mjs",
    "build:docker:smoke": "node scripts/smoke-n8n-image.mjs",
    "build:docker:clean": "TURBO_FORCE=true node scripts/build-n8n.mjs && DOCKER_BUILD_NO_CACHE=true DOCKER_BUILD_BASE_IMAGE=true node scripts/dockerize-n8n.mjs",
    "build:docker:test": "node scripts/build-n8n.mjs && node scripts/dockerize-n8n.mjs && turbo run test:container:standard --filter=n8n-playwright",
    "typecheck": "turbo typecheck",
    "dev": "node scripts/dev-command-removed-notice.mjs",
    "dev:up": "node scripts/dev-up.mjs",
    "dev:be": "turbo run dev --env-mode=loose --log-prefix=none --filter=n8n",
    "dev:ai": "turbo run dev --concurrency=150 --env-mode=loose --filter=@n8n/n8n-nodes-langchain --filter=n8n --filter=n8n-core",
    "dev:fe": "run-p start dev:fe:editor",
    "dev:fe:editor": "turbo run dev --env-mode=loose --filter=n8n-editor-ui",
    "dev:design-system": "turbo run dev --env-mode=loose --filter=@n8n/design-system",
    "dev:e2e": "pnpm --filter=n8n-playwright dev --ui",
    "dev-metrics:opt-in": "node scripts/dev-metrics/setup.mjs --enable",
    "dev-metrics:status": "node scripts/dev-metrics/setup.mjs --status",
    "dev-metrics:reset": "node scripts/dev-metrics/setup.mjs --reset",
    "clean": "turbo run clean",
    "session": "node scripts/cloud-session.mjs",
    "preview": "node scripts/preview.mjs",
    "preview:serve": "node scripts/preview-serve.mjs",
    "session:opencode": "node scripts/cloud-session.mjs --opencode",
    "session:shell": "node scripts/cloud-session.mjs --shell",
    "reset": "node scripts/ensure-zx.mjs && zx scripts/reset.mjs",
    "format": "turbo run format && node scripts/format.mjs",
    "grind": "node scripts/grind.mjs",
    "inspect:activity": "node scripts/instance-seeding/inspectActivity.mjs",
    "seed:account": "node scripts/instance-seeding/seedInstance.mjs",
    "seed:history": "node scripts/instance-seeding/seedHistory.mjs",
    "seed:preference": "cross-env PROFILE=preference pnpm seed:account && pnpm seed:history",
    "seed:account:check": "node scripts/instance-seeding/checkPreferenceProfile.mjs",
    "seed:test": "node --test scripts/instance-seeding/*.test.mjs",
    "nathan": "node scripts/nathan.mjs",
    "agent:setup": "node scripts/agent-setup.mjs",
    "format:check": "turbo run format:check",
    "lint": "turbo run lint",
    "lint:styles": "turbo run lint:styles",
    "lint:styles:fix": "turbo run lint:styles:fix",
    "lint:affected": "turbo run lint --affected",
    "lint:fix": "turbo run lint:fix",
    "lint:ci": "turbo run lint lint:styles --concurrency=2 --cache=local:r,remote:r && pnpm boundaries:check && pnpm check:workspace-private-deps",
    "boundaries": "turbo boundaries",
    "boundaries:check": "node scripts/check-boundaries.mjs",
[tronqué]

Suite du même fichier, résumée : scripts `start` (`node scripts/os-normalize.mjs --dir packages/cli/bin n8n`),
`test` (`turbo run test`), `test:ci:frontend` et `test:ci:backend` (turbo, filtres sur `packages/frontend/**`),
`webhook` et `worker` (`./packages/cli/bin/n8n webhook` / `worker`), `watch` (`turbo run watch`).
Bloc `devDependencies` : 28 entrées (turbo 2.9.15, typescript 6.0.2, eslint, prettier, biome, vitest via @stryker-mutator/vitest-runner, lefthook, zx…).
Pas de bloc `dependencies` : les dépendances runtime sont dans chaque package du monorepo.
