---
path: libs/langgraph/tests
url: https://github.com/langchain-ai/langgraph/tree/main/libs/langgraph/tests
fetched_at: 2026-09-10T14:03:00Z
---
Relevé sur le commit e539ac122f4126f6dd850581c1494948cf620e31 (main). Monorepo : les tests vivent sous `libs/<paquet>/tests/`,
il n'y a pas de dossier `tests/` à la racine. Les 8 dossiers de tests ci-dessous ont été listés un par un (un appel chacun).

## libs/langgraph/tests (paquet principal) — 66 entrées

64 fichiers et 2 dossiers (`__snapshots__`, `example_app`, non listés). Parmi les fichiers : **51 modules `test_*.py`**,
11 utilitaires Python (`conftest.py`, `conftest_checkpointer.py`, `conftest_store.py`, `fake_chat.py`, `fake_tracer.py`,
`memory_assert.py`, `messages.py`, `agents.py`, `any_str.py`, `any_int.py`, `__init__.py`) et 2 fichiers Docker Compose
(`compose-postgres.yml`, `compose-redis.yml` : Postgres et Redis sont montés pour les tests).

Les 51 modules, avec leur taille en octets :

| Module | Octets | Module | Octets |
|---|---|---|---|
| test_pregel.py | 309499 | test_stream_events_v3.py | 48969 |
| test_pregel_async.py | 309167 | test_remote_graph.py | 45455 |
| test_large_cases.py | 214154 | test_runtime.py | 38871 |
| test_time_travel.py | 135977 | test_stream_messages_transformer.py | 33103 |
| test_large_cases_async.py | 127454 | test_stream_events_v3_e2e.py | 30080 |
| test_time_travel_async.py | 109860 | test_delta_channel_migration.py | 29460 |
| test_retry.py | 95871 | test_channels.py | 28019 |
| test_checkpoint_migration.py | 70609 | test_utils.py | 27507 |
| test_pregel_stream_events_v3.py | 62310 | test_stream_subgraph_transformer.py | 26573 |
| test_stream_lifecycle_transformer.py | 26470 | test_subgraph_persistence_async.py | 24168 |

Les 31 autres : test_subgraph_persistence.py (23318), test_remote_graph_v3.py (22633), test_stream_data_transformers.py (21214),
test_delta_channel_exit_mode.py (14096), test_deprecation.py (12971), test_runnable.py (12805), test_delta_channel_update_state.py (12171),
test_interleave_arrival_order.py (12018), test_graph_callbacks.py (11417), test_pydantic.py (11204), test_messages_state.py (10989),
test_state.py (10983), test_delta_channel_benchmark.py (10996), test_stream_before_builtins.py (9697), test_tool_stream_handler.py (9473),
test_subgraph_detection.py (7762), test_delta_channel_supersteps_bound.py (7135), test_pregel_debug.py (5903),
test_serde_allowlist.py (4932), test_type_checking.py (4922), test_delta_channel_id_stability.py (4583), test_trace_policy.py (4427),
test_config_async.py (4331), test_tracing_interops.py (3744), test_interruption.py (3470), test_interrupt_migration.py (2352),
test_parent_command_async.py (1918), test_algo.py (1840), test_parent_command.py (1696), test_managed_values.py (683),
test_stream_events_v3_kwarg_forwarding.py (3523).

## Les autres paquets

| Dossier | Entrées | Modules `test_*.py` | Notes |
|---|---|---|---|
| libs/langgraph/tests | 66 | 51 | + 2 dossiers (`__snapshots__`, `example_app`) |
| libs/prebuilt/tests | 21 | 10 | agent ReAct, ToolNode, ValidationNode ; `__snapshots__` |
| libs/sdk-py/tests | 18 | 15 | + 3 dossiers non listés : `fixtures/`, `integration/`, `streaming/` |
| libs/checkpoint-postgres/tests | 10 | 6 | `compose-postgres.yml`, `conftest.py` |
| libs/checkpoint-sqlite/tests | 9 | 8 | sync et async (`test_sqlite.py`, `test_aiosqlite.py`) |
| libs/checkpoint/tests | 8 | 6 | mémoire, sérialisation, chiffrement, store, cache Redis |
| libs/cli/tests | 3 | non énuméré | `__init__.py` + `unit_tests/` et `integration_tests/`, non listés |
| libs/checkpoint-conformance/tests | 1 | 1 | `test_validate_memory.py` seul |
| libs/sdk-js | — | — | **le dossier ne contient qu'un `README.md`** : aucun code ni test JS dans ce repo |

**97 modules `test_*.py` dénombrés** dans les 7 dossiers énumérés (51 + 15 + 10 + 8 + 6 + 6 + 1), sans compter `libs/cli/tests`
(2 sous-dossiers non listés) ni les sous-dossiers de `libs/sdk-py/tests`.

## Concentration

`test_pregel.py` et `test_pregel_async.py` pèsent 619 Ko à eux deux ; avec `test_large_cases*.py` et `test_time_travel*.py`,
6 fichiers représentent l'essentiel du volume de test du paquet principal. Le moteur Pregel (la boucle d'exécution du graphe)
est donc testé de façon massive et centralisée, pas éclatée par module.

Une suite de conformité partagée existe : `test_conformance_delta.py` apparaît à l'identique dans `libs/checkpoint/tests`,
`libs/checkpoint-sqlite/tests` et `libs/checkpoint-postgres/tests`, et `libs/checkpoint-conformance/` est un paquet à part entière
— les trois implémentations de checkpointer sont vérifiées contre le même contrat.

## Framework et lancement

pytest, d'après le groupe `test` de `libs/langgraph/pyproject.toml` : pytest, pytest-cov, pytest-dotenv, pytest-mock,
syrupy (tests par instantané, d'où les dossiers `__snapshots__`), pytest-watcher, pytest-xdist[psutil] (parallélisme),
pytest-repeat, httpx, psycopg[binary], redis, uvloop.
`[tool.pytest.ini_options] addopts = "--full-trace --strict-markers --strict-config --durations=5 --snapshot-warn-unused"`.
Pour `libs/cli` : pytest, pytest-asyncio (`asyncio_mode = "auto"`), pytest-mock, msgspec.

En local : `make test` à la racine appelle `make -C libs/<lib> test` pour chaque lib qui a un Makefile.

En CI (`.github/workflows/_test_langgraph.yml`, lu) : matrice **Python 3.10, 3.11, 3.12, 3.13 et 3.14** sur ubuntu-latest,
`uv sync --frozen --group test --no-dev` puis `make test_parallel` (pytest-xdist). Sur 3.13 seulement, une seconde passe
`LANGGRAPH_STRICT_MSGPACK=true make test TEST="tests/test_pregel.py tests/test_pregel_async.py"`. Dernière étape :
`git status` doit dire `nothing to commit, working tree clean` — les tests ne doivent laisser aucun fichier derrière eux.
Connexion à Docker Hub (sauf sur les PR issues d'un fork) pour les conteneurs Postgres et Redis.
Les 7 autres paquets Python passent par `_test.yml`, plus `integration-test` (CLI) et `sdk-py-integration-test`.

## Ce qui n'a pas été relevé

Aucun taux de couverture : `pytest-cov` est installé mais aucun seuil ni rapport de couverture n'apparaît dans `ci.yml`
ni dans `_test_langgraph.yml`. Le contenu de `libs/cli/tests/unit_tests/`, `libs/cli/tests/integration_tests/`,
`libs/sdk-py/tests/integration/`, `libs/sdk-py/tests/streaming/` et `libs/langgraph/tests/example_app/` n'a pas été listé.
