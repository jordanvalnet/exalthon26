---
path: .github/workflows/ci.yml
url: https://github.com/mksglu/context-mode/blob/main/.github/workflows/ci.yml
fetched_at: 2026-09-09T14:56:42Z
---
name: CI

on:
  workflow_dispatch:
  push:
    branches: [main, next]
  pull_request:
    branches: [main, next]

jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    name: test (${{ matrix.os }})

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "22.5"

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - uses: actions/setup-go@v5
        with:
          go-version: "stable"
          cache: false

      - uses: erlef/setup-beam@v1
        if: runner.os != 'Windows'
        with:
          elixir-version: "1.17"
          otp-version: "27"

      - name: Install Elixir (Windows)
        if: runner.os == 'Windows'
        shell: pwsh
        run: choco install elixir --yes --no-progress

      - name: Install dependencies
        run: npm install

      - name: Typecheck
        run: npx tsc -b --noEmit

      - name: Build
        run: npm run build

      - name: Bundle
        run: npm run bundle

      - name: Assert bundle invariants (G3 — Issue #511 guardrail)
        run: npm run assert-bundle

[tronqué à 60 lignes ; la suite analyse la sortie vitest puis lance `npx tsx src/cli.ts doctor` en continue-on-error]

Contenu de .github/workflows/ (5 fichiers, seul ci.yml a été lu) :
- bundle.yml
- ci.yml
- openclaw-e2e.yml
- tier2-e2e-smoke.yml
- update-stats.yml
