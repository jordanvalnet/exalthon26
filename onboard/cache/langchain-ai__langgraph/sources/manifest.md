---
path: libs/langgraph/pyproject.toml
url: https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/pyproject.toml
fetched_at: 2026-09-10T13:24:00Z
---
Pas de manifeste à la racine du dépôt : le monorepo est piloté par le Makefile racine, chaque paquet de libs/ a son pyproject.toml et son uv.lock. Ci-dessous le manifeste du paquet principal, puis celui de la CLI.

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "langgraph"
version = "1.2.11"
description = "Building stateful, multi-actor applications with LLMs"
authors = []
requires-python = ">=3.10"
readme = "README.md"
license = "MIT"
license-files = ['LICENSE']
classifiers = [
    'Development Status :: 5 - Production/Stable',
    'Programming Language :: Python',
    'Programming Language :: Python :: Implementation :: CPython',
    'Programming Language :: Python :: Implementation :: PyPy',
    'Programming Language :: Python :: 3',
    'Programming Language :: Python :: 3 :: Only',
    'Programming Language :: Python :: 3.10',
    'Programming Language :: Python :: 3.11',
    'Programming Language :: Python :: 3.12',
    'Programming Language :: Python :: 3.13',
]
dependencies = [
    "langchain-core>=1.4.7,<2",
    "langgraph-checkpoint>=4.1.0,<5.0.0",
    "langgraph-sdk>=0.4.2,<0.5.0",
    "langgraph-prebuilt>=1.1.0,<1.2.0",
    "xxhash>=3.5.0",
    "pydantic>=2.7.4",
]


[project.urls]
Homepage = "https://docs.langchain.com/oss/python/langgraph/overview"
Documentation = "https://reference.langchain.com/python/langgraph/"
Source = "https://github.com/langchain-ai/langgraph/tree/main/libs/langgraph"
Changelog = "https://github.com/langchain-ai/langgraph/releases"
Twitter = "https://x.com/langchain_oss"
Slack = "https://www.langchain.com/join-community"
Reddit = "https://www.reddit.com/r/LangChain/"

[dependency-groups]
test = [
    "pytest",
    "pytest-cov",
    "pytest-dotenv",
    "pytest-mock",
    "syrupy",
    "httpx",
    "pytest-watcher",
    "pytest-xdist[psutil]",
    "pytest-repeat",
    "langchain-core>=1.0.0",
    "langgraph-prebuilt",
    "langgraph-checkpoint",
    "langgraph-checkpoint-sqlite",
    "langgraph-checkpoint-postgres",
    "langgraph-sdk",
```
[tronqué]

Au-delà : le groupe `test` compte 23 entrées en tout (suite : psycopg[binary], uvloop==0.22.1, pyperf, py-spy, pycryptodome, langgraph-cli, langgraph-cli[inmem], redis), le groupe `lint` 3 (ruff, ty, types-requests), le groupe `dev` inclut test et lint plus jupyter. `[tool.uv.sources]` lie en editable les paquets internes ../prebuilt, ../checkpoint, ../checkpoint-sqlite, ../checkpoint-postgres, ../sdk-py, ../cli. `[tool.hatch.build.targets.wheel] packages = ["langgraph"]`. `[tool.pytest.ini_options] addopts = "--full-trace --strict-markers --strict-config --durations=5 --snapshot-warn-unused"`. Lint : ruff (E, F, I, PLC0415, RUF100, TID251, UP, ligne 88, cible py310) et ty.

## libs/cli/pyproject.toml

url: https://github.com/langchain-ai/langgraph/blob/main/libs/cli/pyproject.toml

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "langgraph-cli"
dynamic = ["version"]
description = "CLI for interacting with LangGraph API"
authors = []
requires-python = ">=3.10"
readme = "README.md"
license = "MIT"
license-files = ['LICENSE']
dependencies = [
    "click>=8.1.7",
    "httpx>=0.24.0",
    "langgraph-sdk>=0.1.0 ; python_version >= '3.11'",
    "pathspec>=0.11.0",
    "python-dotenv>=0.8.0",
    "tomli>=2.0.1 ; python_version < '3.11'",
]
[tool.hatch.version]
path = "langgraph_cli/__init__.py"
[project.optional-dependencies]
inmem = [
    "langgraph-api>=0.5.35,<1.0.0 ; python_version >= '3.11'",
    "langgraph-runtime-inmem>=0.7 ; python_version >= '3.11'",
]

[project.urls]
Source = "https://github.com/langchain-ai/langgraph/tree/main/libs/cli"
Twitter = "https://x.com/langchain_oss"
Slack = "https://www.langchain.com/join-community"
Reddit = "https://www.reddit.com/r/LangChain/"

[project.scripts]
langgraph = "langgraph_cli.cli:cli"

[dependency-groups]
test = [
    "pytest",
    "pytest-asyncio",
    "pytest-mock",
    "pytest-watch",
    "msgspec",
]
lint = [
    "ruff",
    "codespell",
    "ty",
]
dev = [
    {include-group = "test"},
    {include-group = "lint"},
    "hatch>=1.16.2",
]

[tool.uv]
default-groups = ['dev']
```
[tronqué]
