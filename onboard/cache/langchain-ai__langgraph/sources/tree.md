---
path: /
url: https://github.com/langchain-ai/langgraph/tree/main
fetched_at: 2026-09-10T13:24:00Z
---
Relevé sur le commit e539ac122f4126f6dd850581c1494948cf620e31 (main). Premier niveau, un chemin par ligne, taille en octets pour les fichiers.

.github/
.gitignore (1285)
.markdownlint.json (195)
AGENTS.md (2113)
CLAUDE.md (2083)
LICENSE (1072)
Makefile (1403)
README.md (6395)
docs/
examples/
libs/

## libs/ (9 paquets)

libs/checkpoint-conformance/
libs/checkpoint-postgres/
libs/checkpoint-sqlite/
libs/checkpoint/
libs/cli/
libs/langgraph/
libs/prebuilt/
libs/sdk-js/
libs/sdk-py/

## libs/langgraph/ (paquet principal)

libs/langgraph/.gitignore (31)
libs/langgraph/LICENSE (1072)
libs/langgraph/Makefile (4484)
libs/langgraph/README.md (3364)
libs/langgraph/bench/
libs/langgraph/langgraph/
libs/langgraph/pyproject.toml (4466)
libs/langgraph/tests/
libs/langgraph/uv.lock (712087)

## libs/cli/ (commande `langgraph`)

libs/cli/.gitignore (16)
libs/cli/LICENSE (1072)
libs/cli/Makefile (1141)
libs/cli/README.md (4240)
libs/cli/examples/
libs/cli/generate_schema.py (10203)
libs/cli/js-examples/
libs/cli/js-monorepo-example/
libs/cli/langgraph_cli/
libs/cli/pyproject.toml (2423)
libs/cli/python-monorepo-example/
libs/cli/schemas/
libs/cli/tests/
libs/cli/uv-examples/
libs/cli/uv.lock (518506)

## .github/workflows/ (17 fichiers)

_integration_test.yml
_lint.yml
_sdk_integration_test.yml
_test.yml
_test_langgraph.yml
_test_release.yml
baseline.yml
bench.yml
ci.yml
deploy-redirects.yml
pr_lint.yml
release.yml
reopen_on_assignment.yml
require_issue_link.yml
tag-external-issues.yml
tag-external-prs.yml
uv_lock_ugprade.yml

## Makefile (racine, 66 lignes, lu en entier)

Cibles : `all` (lint format lock test), `install` (`uv venv` puis `uv pip install -e` sur chaque `libs/*` qui a un pyproject.toml), `lint`, `format`, `lock` (`uv lock`), `lock-upgrade`, `test` : chacune délègue à `make -C libs/<lib> <cible>` pour chaque lib qui a un Makefile.
