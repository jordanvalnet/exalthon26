---
path: .github/workflows/ci.yml
url: https://github.com/langchain-ai/langgraph/blob/main/.github/workflows/ci.yml
fetched_at: 2026-09-10T13:24:00Z
---
17 workflows dans .github/workflows/ : _integration_test.yml, _lint.yml, _sdk_integration_test.yml, _test.yml, _test_langgraph.yml, _test_release.yml, baseline.yml, bench.yml, ci.yml, deploy-redirects.yml, pr_lint.yml, release.yml, reopen_on_assignment.yml, require_issue_link.yml, tag-external-issues.yml, tag-external-prs.yml, uv_lock_ugprade.yml. Seul ci.yml a été lu.

```yaml
---
name: CI

on:
  workflow_dispatch:
  push:
    branches:
      - main
  pull_request:
  

permissions:
  contents: read

# If another push to the same PR or branch happens while this workflow is still running,
# cancel the earlier run in favor of the next run.
#
# There's no point in testing an outdated version of the code. GitHub only allows
# a limited number of job runners to be active at the same time, so it's better to cancel
# pointless jobs early so that more useful jobs can run sooner.
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      python: ${{ steps.filter.outputs.python || 'true' }}
      deps: ${{ steps.filter.outputs.deps || 'true' }}
      sdk_py: ${{ steps.filter.outputs.sdk_py || 'true' }}
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: dorny/paths-filter@ceb8a2b8f2d89434be7ff52d3de7ec3738c5cc9d # v4
        if: github.event_name != 'workflow_dispatch'
        id: filter
        with:
          filters: |
            python:
              - 'libs/langgraph/**'
              - 'libs/sdk-py/**'
              - 'libs/cli/**'
              - 'libs/checkpoint/**'
              - 'libs/checkpoint-sqlite/**'
              - 'libs/checkpoint-postgres/**'
              - 'libs/checkpoint-conformance/**'
              - 'libs/prebuilt/**'
            deps:
              - '**/pyproject.toml'
              - '**/uv.lock'
            sdk_py:
              - 'libs/sdk-py/**'
              # The integration suite runs the local langgraph core inside the
              # server (see libs/sdk-py/integration/Dockerfile), so any core
              # change is now exercised end-to-end and should trigger it.
              - 'libs/langgraph/**'

  lint:
    needs: changes
    name: cd ${{ matrix.working-directory }}
    strategy:
      matrix:
        working-directory:
          [
            "libs/langgraph",
```
[tronqué]

Jobs vus dans la suite du fichier : `lint` (matrice de 8 libs, réutilise _lint.yml), `test` (matrice de 7 libs : cli, checkpoint, checkpoint-sqlite, checkpoint-postgres, checkpoint-conformance, prebuilt, sdk-py ; réutilise _test.yml), `test-langgraph` (libs/langgraph seul, matrice distincte, _test_langgraph.yml), `check-sdk-methods` (python .github/scripts/check_sdk_methods.py), `check-schema` (Python 3.13, `cd libs/cli && uv sync && uv run python generate_schema.py`, échoue si schemas/schema.json change), `integration-test` (CLI, _integration_test.yml), `sdk-py-integration-test` (_sdk_integration_test.yml), `ci_success` (agrège les résultats, `always()`). Actions épinglées par SHA.

---
path: .github/workflows/_test_langgraph.yml
url: https://github.com/langchain-ai/langgraph/blob/main/.github/workflows/_test_langgraph.yml
fetched_at: 2026-09-10T14:03:00Z
---
Le workflow réutilisable qui exécute la suite de tests du paquet principal, appelé par le job `test-langgraph` de ci.yml.

```yaml
name: test

on:
  workflow_call:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version:
          - "3.10"
          - "3.11"
          - "3.12"
          - "3.13"
          - "3.14"

    defaults:
      run:
        working-directory: libs/langgraph
    name: "test #${{ matrix.python-version }}"
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - name: Set up Python ${{ matrix.python-version }}
        uses: ./.github/actions/uv_setup
        with:
          python-version: ${{ matrix.python-version }}
          cache-suffix: "test-langgraph"
          working-directory: libs/langgraph
      - name: Login to Docker Hub
        uses: docker/login-action@dbcb813823bdd20940b903addbd779551569679f # v4
        if: ${{ !github.event.pull_request.head.repo.fork }}
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_RO_TOKEN }}

      - name: Install dependencies
        shell: bash
        run: uv sync --frozen --group test --no-dev

      - name: Run tests
        shell: bash
        run: make test_parallel

      - name: Run strict msgpack pregel tests
        if: ${{ matrix.python-version == '3.13' }}
        shell: bash
        env:
          LANGGRAPH_STRICT_MSGPACK: "true"
        run: make test TEST="tests/test_pregel.py tests/test_pregel_async.py"

      - name: Ensure the tests did not create any additional files
        shell: bash
        run: |
          set -eu
          STATUS="$(git status)"
          echo "$STATUS"
          echo "$STATUS" | grep 'nothing to commit, working tree clean'
```

À retenir : 5 versions de Python (3.10 à 3.14), dépendances gelées (`uv sync --frozen`), exécution parallèle
(`make test_parallel`, pytest-xdist), une passe supplémentaire en sérialisation msgpack stricte sur Python 3.13 pour les
deux gros fichiers Pregel, et un garde-fou final : la suite doit laisser l'arbre de travail propre.
Aucun seuil de couverture n'apparaît dans ce workflow.
