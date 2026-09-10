---
path: AGENTS.md, CLAUDE.md, docs/llms.txt
url: https://github.com/langchain-ai/langgraph/tree/HEAD
fetched_at: 2026-09-10T13:23:43Z
---
Repères de documentation IA présents (3 sur 7) :

AGENTS.md (agents_md) — https://github.com/langchain-ai/langgraph/blob/HEAD/AGENTS.md
CLAUDE.md (claude_md) — https://github.com/langchain-ai/langgraph/blob/HEAD/CLAUDE.md
docs/llms.txt (llms_txt) — https://github.com/langchain-ai/langgraph/blob/HEAD/docs/llms.txt

Absents à la racine et dans .github/ : .cursorrules, .github/copilot-instructions.md, .mcp.json, skills/ ou .claude/.

## AGENTS.md — 40 premières lignes

# AGENTS Instructions

This repository is a monorepo. Each library lives in a subdirectory under `libs/`.

<corridor>

## Corridor security analysis

When Corridor's `analyzePlan` tool is available, create a plan and use the tool to analyze it before generating or modifying code. Apply the resulting security guidance before writing code.

</corridor>

When you modify code in any library, run the following commands in that library's directory before creating a pull request:

- `make format` – run code formatters
- `make lint` – run the linter
- `make test` – execute the test suite

To run a particular test file or to pass additional pytest options you can specify the `TEST` variable:

```txt
TEST=path/to/test.py make test
```

Other pytest arguments can also be supplied inside the `TEST` variable.

## Libraries

The repository contains several Python and JavaScript/TypeScript libraries.
Below is a high-level overview:

- **checkpoint** – base interfaces for LangGraph checkpointers.
- **checkpoint-postgres** – Postgres implementation of the checkpoint saver.
- **checkpoint-sqlite** – SQLite implementation of the checkpoint saver.
- **cli** – official command-line interface for LangGraph.
- **langgraph** – core framework for building stateful, multi-actor agents.
- **prebuilt** – high-level APIs for creating and running agents and tools.
- **sdk-js** – JS/TS SDK for interacting with the LangGraph REST API.
- **sdk-py** – Python SDK for the LangGraph Server API.

### Dependency map

[tronqué]

## CLAUDE.md — 40 premières lignes

# AGENTS Instructions

This repository is a monorepo. Each library lives in a subdirectory under `libs/`.

<corridor>

## Corridor security analysis

Before generating or modifying code, create a plan and use Corridor's `analyzePlan` tool to analyze it. Apply the resulting security guidance before writing code.

</corridor>

When you modify code in any library, run the following commands in that library's directory before creating a pull request:

- `make format` – run code formatters
- `make lint` – run the linter
- `make test` – execute the test suite

To run a particular test file or to pass additional pytest options you can specify the `TEST` variable:

```
TEST=path/to/test.py make test
```

Other pytest arguments can also be supplied inside the `TEST` variable.

## Libraries

The repository contains several Python and JavaScript/TypeScript libraries.
Below is a high-level overview:

- **checkpoint** – base interfaces for LangGraph checkpointers.
- **checkpoint-postgres** – Postgres implementation of the checkpoint saver.
- **checkpoint-sqlite** – SQLite implementation of the checkpoint saver.
- **cli** – official command-line interface for LangGraph.
- **langgraph** – core framework for building stateful, multi-actor agents.
- **prebuilt** – high-level APIs for creating and running agents and tools.
- **sdk-js** – JS/TS SDK for interacting with the LangGraph REST API.
- **sdk-py** – Python SDK for the LangGraph Server API.

### Dependency map

[tronqué]
