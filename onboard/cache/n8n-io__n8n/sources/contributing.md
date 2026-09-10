---
path: CONTRIBUTING.md
url: https://github.com/n8n-io/n8n/blob/master/CONTRIBUTING.md
fetched_at: 2026-09-10T13:23:45Z
---
# Contributing to n8n

Great that you are here and you want to contribute to n8n

## Contents

- [Contributing to n8n](#contributing-to-n8n)
	- [Contents](#contents)
	- [Code of conduct](#code-of-conduct)
	- [Directory structure](#directory-structure)
	- [Development setup](#development-setup)
		- [Dev Container](#dev-container)
		- [Requirements](#requirements)
			- [Node.js](#nodejs)
			- [pnpm](#pnpm)
				- [pnpm workspaces](#pnpm-workspaces)
			- [Build tools](#build-tools)
		- [Actual n8n setup](#actual-n8n-setup)
		- [Start](#start)
	- [Development cycle](#development-cycle)
		- [Stacked pull requests](#stacked-pull-requests)
			- [Enabling `gh stack`](#enabling-gh-stack)
			- [Splitting work into a stack yourself](#splitting-work-into-a-stack-yourself)
			- [Asking an agent to do it](#asking-an-agent-to-do-it)
		- [Community PR Guidelines](#community-pr-guidelines)
			- [**1. Change Request/Comment**](#1-change-requestcomment)
			- [**2. General Requirements**](#2-general-requirements)
			- [**3. PR Specific Requirements**](#3-pr-specific-requirements)
			- [**4. Workflow Summary for Non-Compliant PRs**](#4-workflow-summary-for-non-compliant-prs)
		- [Test suite](#test-suite)
			- [Unit tests](#unit-tests)
			- [Code Coverage](#code-coverage)
			- [E2E tests](#e2e-tests)
	- [Releasing](#releasing)
	- [Create custom nodes](#create-custom-nodes)
	- [Extend documentation](#extend-documentation)
	- [Contribute workflow templates](#contribute-workflow-templates)
	- [Contributor License Agreement](#contributor-license-agreement)

## Code of conduct

This project and everyone participating in it are governed by the Code of
Conduct which can be found in the file [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report
unacceptable behavior to jan@n8n.io.

## Directory structure

n8n is split up in different modules which are all in a single mono repository.

The most important directories:

- [/docker/images](/docker/images) - Dockerfiles to create n8n containers
- [/packages](/packages) - The different n8n modules
- [/packages/cli](/packages/cli) - CLI code to run front- & backend; this also contains the code for n8n's APIs
- [/packages/core](/packages/core) - Core code which handles workflow
  execution, active webhooks and
  workflows. **Contact n8n before
  starting on any changes here**
- [/packages/frontend/@n8n/design-system](/packages/frontend/@n8n/design-system) - Vue frontend components
- [/packages/frontend/editor-ui](/packages/frontend/editor-ui) - Vue frontend workflow editor
- [/packages/node-dev](/packages/node-dev) - CLI to create new n8n-nodes
- [/packages/nodes-base](/packages/nodes-base) - Base n8n nodes
- [/packages/workflow](/packages/workflow) - Workflow code with interfaces which
  get used by front- & backend

## Development setup

If you want to change or extend n8n you have to make sure that all the needed
dependencies are installed and the packages get linked correctly. Here's a short guide on how that can be done:

### Dev Container

If you already have VS Code and Docker installed, you can click [here](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/n8n-io/n8n) to get started. Clicking these links will cause VS Code to automatically install the Dev Containers extension if needed, clone the source code into a container volume, and spin up a dev container for use.

### Requirements

#### Node.js

[Node.js](https://nodejs.org/en/) version 24 or newer is required for development purposes.

#### pnpm

[pnpm](https://pnpm.io/) is required for development. Install it globally with npm:

```bash
npm i -g pnpm@12.3.4
```

The root [package.json](package.json) pins the exact version in its `packageManager` field. Always install that version, and update your global install when the pin changes.

If `npm` is not available on your machine, use one of the other methods in the [pnpm installation guide](https://pnpm.io/installation).

##### pnpm workspaces

n8n is split up into different modules which are all in a single mono repository.
To facilitate the module management, [pnpm workspaces](https://pnpm.io/workspaces) are used.
This automatically sets up file-links between modules which depend on each other.

#### Build tools

The packages which n8n uses depend on a few build tools:

Debian/Ubuntu:

```bash
apt-get install -y build-essential python
```

CentOS:

```bash
yum install gcc gcc-c++ make
```

Windows:

```bash
npm add -g windows-build-tools
```

MacOS:

No additional packages required.

#### actionlint (for GitHub Actions workflow development)

If you plan to modify GitHub Actions workflow files (`.github/workflows/*.yml`), you'll need [actionlint](https://github.com/rhysd/actionlint) for workflow validation:

**macOS (Homebrew):**
```bash
brew install actionlint
```
> **Note:** actionlint is only required if you're modifying workflow files. It runs automatically via git hooks when workflow files are changed.

#### tbls (for database schema docs)

The database schema docs under [`docs/generated/`](docs/generated) are generated from the migrations with [tbls](https://github.com/k1LoW/tbls). If you plan to modify DB migrations, you'll need **either** tbls installed **or** Docker available.

**macOS (Homebrew):**
```bash
brew install tbls
```

For other platforms, see the [tbls install guide](https://github.com/k1LoW/tbls#install).

> **Note:** tbls is only required if you're modifying DB migrations. It runs automatically via git hooks when migration files are changed.

---

### Actual n8n setup

> **IMPORTANT**: All the steps below have to get executed at least once to get the development setup up and running!

Now that everything n8n requires to run is installed, the actual n8n code can be
checked out and set up:

#### For external contributors

1. [Fork](https://guides.github.com/activities/forking/#fork) the n8n repository.

2. Clone your forked repository:

   ```
   git clone https://github.com/<your_github_username>/n8n.git
   ```

3. Go into repository folder:

   ```
   cd n8n
   ```

4. Add the original n8n repository as `upstream` to your forked repository:

   ```
   git remote add upstream https://github.com/n8n-io/n8n.git
   ```

#### For everyone

1. Go into the cloned repository folder

2. Install all dependencies of all modules and link them together:

   ```
   pnpm install
   ```

3. Build all the code:
   ```
   pnpm build
   ```

### Start

To start n8n execute:

```bash
pnpm start
```

### Environment variables (optional)

Most environment variables have default values, but if you needed to modify any a template for local environment variables is provided at `.env.local.example`. Copy it and fill in any values you need.

```bash
cp .env.local.example .env.local
```

Then prefix any dev command with `dotenvx` to load it, for example:

```bash
cd packages/cli && pnpm exec dotenvx run -f ../../.env.local -- pnpm dev

pnpm exec dotenvx run -f .env.local -- pnpm dev:be
```

> **Note:** dotenvx supports variable expansion (e.g. `$HOME`) but not shell
> tilde expansion. Use `$HOME` instead of `~` for paths
> (e.g. `N8N_USER_FOLDER=$HOME/.n8n-dev`).

## Development cycle

While iterating on n8n modules code, run `pnpm dev:be` for the backend and
`pnpm dev:fe:editor` for the editor UI. They build your code, restart the
backend, and refresh the frontend on each change you make. The root `pnpm dev`
does not exist: it prints a notice and exits with code 0.
Given the size of the code base and the number of modules, we recommend only watching the modules you're
actively working on.

The dev servers default to 5678 (backend) and 8080 (editor). Set `N8N_PORT` and
`N8N_EDITOR_PORT` to relocate them, for example to run a second instance beside
your main one. The editor derives its REST base URL from `N8N_PORT`, so pass it
to both commands:

```bash
N8N_PORT=5699 pnpm dev:be
N8N_PORT=5699 N8N_EDITOR_PORT=8082 pnpm dev:fe:editor
```

### Basic Development Workflow Example (most used within n8n)

If you're working on API and FE, a lot of team members run the following steps:

1. Start n8n in development mode:
```bash
# Terminal 1: CLI code runs the backend
cd packages/cli
pnpm dev
```
```bash
# Terminal 2: Vue frontend workflow editor
cd packages/frontend/editor-ui
pnpm dev
```
2. Hack, hack, hack
3. Check if everything still runs in production mode:
   ```
   pnpm build
   pnpm start
   ```
4. Create tests
5. Run all [tests](#test-suite):
   ```
   pnpm test
   ```
6. Commit code and [create a pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)

Note: If you're changing code outside of `packages/cli` and `packages/frontend/editor-ui` in this setup, please re-run `pnpm build`

### Selective Package Development

Running all packages in development mode can be resource-intensive. For better performance, run only the packages relevant to your work:

#### Available Filtered Commands

- **Backend-only development:**
  ```bash
  pnpm dev:be
  ```
  Excludes frontend packages like editor-ui and design-system

- **Frontend-only development:**
  ```bash
  pnpm dev:fe
  ```
  Runs editor-ui & design system development server

- **AI/LangChain nodes development:**
  ```bash
  pnpm dev:ai
  ```
  Runs only essential packages for AI node development

#### Custom Selective Development

For even more focused development, you can run packages individually:

**Example 1: Working on custom nodes**
```bash
# Terminal 1: Build and watch nodes package
cd packages/nodes-base
pnpm dev

# Terminal 2: Run the CLI with hot reload
cd packages/cli
N8N_DEV_RELOAD=true pnpm dev
```

**Example 2: Pure frontend development**
```bash
# Terminal 1: Start the backend server (no watching)
pnpm start

# Terminal 2: Run frontend dev server
cd packages/frontend/editor-ui
pnpm dev
```

**Example 3: Working on a specific node package**
```bash
# Terminal 1: Watch your node package
cd packages/nodes-base  # or your custom node package
pnpm watch

# Terminal 2: Run CLI with hot reload
cd packages/cli
N8N_DEV_RELOAD=true pnpm dev
```

#### Running the BE server with a clean database

If you want to flush your existing database, you can delete the `~/.n8n` folder.
However, there might be times where you want to test a feature in a clean n8n set-up without losing your existing local setup.
In such use cases, you can specify another `N8N_USER_FOLDER`, e.g.:

```bash
packages/cli$ N8N_USER_FOLDER=~/.n8n3/ pnpm run dev
packages/cli$ N8N_USER_FOLDER=~/.n8n4/ pnpm run dev
```


### Hot Reload for Nodes (N8N_DEV_RELOAD)

When developing custom nodes or credentials, you can enable hot reload to automatically detect changes without restarting the server by setting

```bash
N8N_DEV_RELOAD=true pnpm dev:be
```

**Performance considerations:**
- File watching adds overhead to your system, especially on slower machines
- The watcher monitors potentially thousands of files, which can impact CPU and memory usage
- On resource-constrained systems, consider developing without hot reload and manually restarting when needed

### Run local instances in different configurations

We use [**Testcontainers**](https://testcontainers.com/) to easily and quickly spin up a local instance with multiple different configurations for testing.

**1. Get a Docker image**

You can either build one from your own branch:

```bash
pnpm build:docker
```

or set an environment variable to use a different image:

```bash
N8N_DOCKER_IMAGE=n8nio/n8n:latest
```

**2. Run a stack**

- **SQLite:**

  ```bash
  pnpm --filter n8n-containers stack:sqlite
  ```

- **Postgres:**

  ```bash
  pnpm --filter n8n-containers stack:postgres
  ```

- **Queue:**

  ```bash
  pnpm --filter n8n-containers stack:queue
  ```

- **Multi-Main:**

  ```bash
  pnpm --filter n8n-containers stack:multi-main
  ```

[tronqué]
