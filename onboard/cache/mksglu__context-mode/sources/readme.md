---
path: README.md
url: https://github.com/mksglu/context-mode/blob/main/README.md
fetched_at: 2026-09-09T14:56:01Z
---
# Context Mode

**The other half of the context problem.**

[![users](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fmksglu%2Fcontext-mode%40main%2Fstats.json&query=%24.message&label=users&color=brightgreen)](https://www.npmjs.com/package/context-mode) [![npm](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fmksglu%2Fcontext-mode%40main%2Fstats.json&query=%24.npm&label=npm&color=blue)](https://www.npmjs.com/package/context-mode) [![marketplace](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fmksglu%2Fcontext-mode%40main%2Fstats.json&query=%24.marketplace&label=marketplace&color=blue)](https://github.com/mksglu/context-mode) [![GitHub stars](https://img.shields.io/github/stars/mksglu/context-mode?style=flat&color=yellow)](https://github.com/mksglu/context-mode/stargazers) [![GitHub forks](https://img.shields.io/github/forks/mksglu/context-mode?style=flat&color=blue)](https://github.com/mksglu/context-mode/network/members) [![Last commit](https://img.shields.io/github/last-commit/mksglu/context-mode?color=green)](https://github.com/mksglu/context-mode/commits) [![License: ELv2](https://img.shields.io/badge/License-ELv2-blue.svg)](LICENSE)
[![Discord](https://img.shields.io/discord/1478479412700909750?label=Discord&logo=discord&color=5865f2)](https://discord.gg/DCN9jUgN5v)
[![Hacker News #1](https://img.shields.io/badge/Hacker%20News-%231%20%E2%80%A2%20570%2B%20points-ff6600?logo=ycombinator&logoColor=white)](https://news.ycombinator.com/item?id=47193064)

<p align="center">
<sub>Used across teams at</sub>
<br><br>
<a href="#"><img src="https://img.shields.io/badge/Microsoft-141414?style=flat" alt="Microsoft" /></a>
<a href="#"><img src="https://img.shields.io/badge/Google-141414?style=flat&logo=google&logoColor=white" alt="Google" /></a>
<a href="#"><img src="https://img.shields.io/badge/Meta-141414?style=flat&logo=meta&logoColor=white" alt="Meta" /></a>
<a href="#"><img src="https://img.shields.io/badge/Amazon-141414?style=flat" alt="Amazon" /></a>
<a href="#"><img src="https://img.shields.io/badge/IBM-141414?style=flat" alt="IBM" /></a>
<a href="#"><img src="https://img.shields.io/badge/NVIDIA-141414?style=flat&logo=nvidia&logoColor=white" alt="NVIDIA" /></a>
<a href="#"><img src="https://img.shields.io/badge/ByteDance-141414?style=flat&logo=bytedance&logoColor=white" alt="ByteDance" /></a>
<a href="#"><img src="https://img.shields.io/badge/Stripe-141414?style=flat&logo=stripe&logoColor=white" alt="Stripe" /></a>
<a href="#"><img src="https://img.shields.io/badge/Datadog-141414?style=flat&logo=datadog&logoColor=white" alt="Datadog" /></a>
<a href="#"><img src="https://img.shields.io/badge/Salesforce-141414?style=flat" alt="Salesforce" /></a>
<a href="#"><img src="https://img.shields.io/badge/GitHub-141414?style=flat&logo=github&logoColor=white" alt="GitHub" /></a>
<a href="#"><img src="https://img.shields.io/badge/Red%20Hat-141414?style=flat&logo=redhat&logoColor=white" alt="Red Hat" /></a>
<a href="#"><img src="https://img.shields.io/badge/Supabase-141414?style=flat&logo=supabase&logoColor=white" alt="Supabase" /></a>
<a href="#"><img src="https://img.shields.io/badge/Canva-141414?style=flat" alt="Canva" /></a>
<a href="#"><img src="https://img.shields.io/badge/Notion-141414?style=flat&logo=notion&logoColor=white" alt="Notion" /></a>
<a href="#"><img src="https://img.shields.io/badge/Hasura-141414?style=flat&logo=hasura&logoColor=white" alt="Hasura" /></a>
<a href="#"><img src="https://img.shields.io/badge/Framer-141414?style=flat&logo=framer&logoColor=white" alt="Framer" /></a>
<a href="#"><img src="https://img.shields.io/badge/Cursor-141414?style=flat&logo=cursor&logoColor=white" alt="Cursor" /></a>
</p>

## The Problem

Every MCP tool call dumps raw data into your context window. A Playwright snapshot costs 56 KB. Twenty GitHub issues cost 59 KB. One access log — 45 KB. After 30 minutes, 40% of your context is gone. And when the agent compacts the conversation to free space, it forgets which files it was editing, what tasks are in progress, and what you last asked for. On top of that, the agent wastes output tokens on filler, pleasantries, and verbose explanations — burning context from both sides.

### How Context Mode Solves It

Context Mode is an MCP server that solves all four sides of this problem:

1. **Context Saving** — Sandbox tools keep raw data out of the context window. 315 KB becomes 5.4 KB. 98% reduction.
2. **Session Continuity** — Every file edit, git operation, task, error, and user decision is tracked in SQLite. When the conversation compacts, context-mode doesn't dump this data back into context — it indexes events into FTS5 and retrieves only what's relevant via BM25 search. The model picks up exactly where you left off. If you don't `--continue`, previous session data is deleted immediately — a fresh session means a clean slate.
3. **Think in Code** — The LLM should program the analysis, not compute it. Instead of reading 50 files into context to count functions, the agent writes a script that does the counting and `console.log()`s only the result. One script replaces ten tool calls and saves 100x context. This is a mandatory paradigm across all 17 supported clients, plus the OpenClaw gateway integration: stop treating the LLM as a data processor, treat it as a code generator.

   ```js
   // Before: 47 × Read() = 700 KB.  After: 1 × ctx_execute() = 3.6 KB.
   ctx_execute("javascript", `
     const files = fs.readdirSync('src').filter(f => f.endsWith('.ts'));
     files.forEach(f => console.log(f + ': ' + fs.readFileSync('src/'+f,'utf8').split('\\n').length + ' lines'));
   `);
   ```
4. **No prose-style enforcement** — context-mode keeps raw data out of context but never dictates how the model writes its final answer. Brevity, completeness, formatting — your model's call (or yours via your own `CLAUDE.md` / `AGENTS.md`). Aggressive brevity prompts have been shown to degrade coding/reasoning benchmarks ([Moonshot AI on `kimi-k2.5`](https://github.com/anomalyco/opencode/issues/20258)) — the routing block stays focused on *where data goes*, not on *how the model talks*.

<a href="https://www.youtube.com/watch?v=QUHrntlfPo4">
  <picture>
    <img src="https://img.youtube.com/vi/QUHrntlfPo4/maxresdefault.jpg" alt="Watch context-mode demo on YouTube" width="100%">
  </picture>
</a>
<p align="center"><a href="https://www.youtube.com/watch?v=QUHrntlfPo4"><img src="https://img.shields.io/badge/%E2%96%B6%EF%B8%8F_Watch_Demo-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch on YouTube"></a></p>

## Install

Platforms are grouped by install complexity. Hook-capable platforms get automatic routing enforcement. Non-hook platforms need a one-time routing file copy.

<details open>
<summary><strong>Claude Code</strong> — plugin marketplace, fully automatic</summary>

**Prerequisites:** Claude Code v1.0.33+ (`claude --version`). If `/plugin` is not recognized, update first: `brew upgrade claude-code` or `npm update -g @anthropic-ai/claude-code`.

**Install:**

```bash
/plugin marketplace add mksglu/context-mode
/plugin install context-mode@context-mode
```

Restart Claude Code (or run `/reload-plugins`).

**Verify:**

```
/context-mode:ctx-doctor
```

All checks should show `[x]`. The doctor validates runtimes, hooks, FTS5, and plugin registration.

**Routing:** Automatic. The SessionStart hook injects routing instructions at runtime — no file is written to your project. The plugin registers all hooks (PreToolUse, PostToolUse, UserPromptSubmit, PreCompact, SessionStart, Stop) and 11 MCP tools — six sandbox tools (`ctx_batch_execute`, `ctx_execute`, `ctx_execute_file`, `ctx_index`, `ctx_search`, `ctx_fetch_and_index`) plus five meta-tools (`ctx_stats`, `ctx_doctor`, `ctx_upgrade`, `ctx_purge`, `ctx_insight`).

| Slash Command | What it does |
|---|---|
| `/context-mode:ctx-stats` | Context savings — per-tool breakdown, tokens consumed, savings ratio. |
| `/context-mode:ctx-doctor` | Diagnostics — runtimes, hooks, FTS5, plugin registration, versions. |
| `/context-mode:ctx-index` | Index a local file or directory into the persistent FTS5 knowledge base. |
| `/context-mode:ctx-search` | Search previously indexed content. |
| `/context-mode:ctx-upgrade` | Pull latest, rebuild, migrate cache, fix hooks. |
| `/context-mode:ctx-purge` | Permanently delete all indexed content from the knowledge base. |
| `/context-mode:ctx-insight` | Opens the hosted Insight dashboard ([context-mode.com/insight](https://context-mode.com/insight)) in your browser — org analytics for AI-assisted engineering teams. |

> **Note:** Slash commands are a Claude Code plugin feature. On other platforms, type `ctx stats`, `ctx doctor`, `ctx index`, `ctx search`, `ctx upgrade`, or `ctx insight` in the chat — the model calls the MCP tool automatically. See [Utility Commands](#utility-commands).

**Status line (optional):** Claude Code's plugin manifest cannot declare a status line, so this is a one-time manual edit to `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "context-mode statusline"
  }
}
```

After saving, restart Claude Code. The bar shows `$ saved this session · $ saved across sessions · % efficient` so you can see savings accumulate in real time. The wiring is path-free — `context-mode statusline` resolves through the bundled CLI regardless of where the plugin cache lives.

<details>
<summary>Alternative — MCP-only install (no hooks or slash commands)</summary>

```bash
claude mcp add context-mode -- npx -y context-mode
```

This gives you all 11 MCP tools without automatic routing. The model can still use them — it just won't be nudged to prefer them over raw Bash/Read/WebFetch. Good for trying it out before committing to the full plugin.

</details>

</details>

<details>
<summary><strong>Gemini CLI</strong> — one config file, hooks included</summary>

**Prerequisites:** Node.js >= 22.5 (or Bun), Gemini CLI installed.

**Install:**

1. Install context-mode globally:

   ```bash
   npm install -g context-mode
   ```

2. Add the following to `~/.gemini/settings.json`. This single file registers the MCP server and all four hooks:

   ```json
   {
     "mcpServers": {
       "context-mode": {
         "command": "context-mode"
       }
     },
     "hooks": {
       "BeforeTool": [
         {
           "matcher": "run_shell_command|read_file|read_many_files|grep_search|search_file_content|web_fetch|activate_skill|mcp__plugin_context-mode|mcp__context-mode|mcp__(?!.*context-mode)",
           "hooks": [{ "type": "command", "command": "context-mode hook gemini-cli beforetool" }]
         }
       ],
       "AfterTool": [
         {
           "matcher": "",
           "hooks": [{ "type": "command", "command": "context-mode hook gemini-cli aftertool" }]
         }
       ],
       "PreCompress": [
         {
           "matcher": "",
           "hooks": [{ "type": "command", "command": "context-mode hook gemini-cli precompress" }]
         }
       ],
       "SessionStart": [
         {
           "matcher": "",
           "hooks": [{ "type": "command", "command": "context-mode hook gemini-cli sessionstart" }]
         }
       ]
     }
   }
   ```

3. Restart Gemini CLI.

**Verify:**

```
/mcp list
```

You should see `context-mode: ... - Connected`.

**Routing:** Automatic via SessionStart hook. Optionally copy routing instructions for full model awareness:

```bash
cp node_modules/context-mode/configs/gemini-cli/GEMINI.md ./GEMINI.md
```

> **Why the BeforeTool matcher?** It targets only tools that produce large output (`run_shell_command`, `read_file`, `read_many_files`, `grep_search`, `search_file_content`, `web_fetch`, `activate_skill`) plus context-mode's own tools (`mcp__plugin_context-mode`). This avoids unnecessary hook overhead on lightweight tools while intercepting every tool that could flood your context window.

Full config reference: [`configs/gemini-cli/settings.json`](configs/gemini-cli/settings.json)

</details>

<details>
<summary><strong>VS Code Copilot</strong> — hooks with SessionStart</summary>

**Prerequisites:** Node.js >= 22.5 (or Bun), VS Code with Copilot Chat v0.32+.

**Install:**

1. Install context-mode globally:

   ```bash
   npm install -g context-mode
   ```

2. Create `.vscode/mcp.json` in your project root:

   ```json
   {
     "servers": {
       "context-mode": {
         "command": "context-mode"
       }
     }
   }
   ```

3. Create `.github/hooks/context-mode.json`:

   ```json
   {
     "hooks": {
       "PreToolUse": [
         { "type": "command", "command": "context-mode hook vscode-copilot pretooluse" }
       ],
       "PostToolUse": [
         { "type": "command", "command": "context-mode hook vscode-copilot posttooluse" }
       ],
       "SessionStart": [
         { "type": "command", "command": "context-mode hook vscode-copilot sessionstart" }
       ]
     }
   }
   ```

4. Restart VS Code.

**Verify:** Open Copilot Chat and type `ctx stats`. Context-mode tools should appear and respond.

**Routing:** Automatic via SessionStart hook. Optionally copy routing instructions for full model awareness:

```bash
cp node_modules/context-mode/configs/vscode-copilot/copilot-instructions.md .github/copilot-instructions.md
```

Full hook config including PreCompact: [`configs/vscode-copilot/hooks.json`](configs/vscode-copilot/hooks.json)

</details>

<details>
<summary><strong>JetBrains Copilot</strong> — hooks with SessionStart</summary>

**Prerequisites:** Node.js >= 22.5 (or Bun), JetBrains IDE with GitHub Copilot plugin v1.5.57+.

**Install:**

1. Install context-mode globally:

   ```bash
   npm install -g context-mode
   ```

2. Add MCP server via Settings UI: **Settings > Tools > AI Assistant > Model Context Protocol (MCP) > Add Server**:
   - **Name:** `context-mode`
   - **Command:** `context-mode`

3. Create `.github/hooks/context-mode.json`:

   ```json
   {
     "hooks": {
       "PreToolUse": [
         { "type": "command", "command": "context-mode hook jetbrains-copilot pretooluse" }
       ],
       "PostToolUse": [
         { "type": "command", "command": "context-mode hook jetbrains-copilot posttooluse" }
       ],
       "SessionStart": [
         { "type": "command", "command": "context-mode hook jetbrains-copilot sessionstart" }
       ]
     }
   }
   ```

4. Restart the JetBrains IDE.

**Verify:** Open Copilot Chat and type `ctx stats`. Context-mode tools should appear and respond.

**Routing:** Automatic via SessionStart hook. Optionally copy routing instructions for full model awareness:

```bash
cp node_modules/context-mode/configs/jetbrains-copilot/copilot-instructions.md .github/copilot-instructions.md
```

Full hook config including PreCompact: [`configs/jetbrains-copilot/hooks.json`](configs/jetbrains-copilot/hooks.json)

Full setup guide: [`docs/jetbrains-copilot.md`](docs/jetbrains-copilot.md)

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — MCP + hooks</summary>

**Prerequisites:** Node.js >= 22.5 (or Bun), GitHub Copilot CLI (`copilot`) installed. Set `COPILOT_HOME` first if you use an isolated Copilot home.

**Install — Option A (plugin, one command — recommended):**

```bash
npm install -g context-mode                                     # the plugin's MCP server runs the global binary
copilot plugin install mksglu/context-mode:configs/copilot-cli  # registers MCP + hooks + routing skill
```

The bundle's `.mcp.json` pins `CONTEXT_MODE_PLATFORM=copilot-cli`, so context-mode self-identifies as Copilot — `ctx_upgrade` and platform detection resolve `copilot-cli` even when Claude Code is co-installed (whose `~/.claude/` would otherwise win). No `context-mode upgrade` / agent call needed. To try it from a local clone before it lands on the default branch, point Copilot at the bundle directory: `copilot --plugin-dir /path/to/context-mode/configs/copilot-cli`.

**Install — Option B (manual, no plugin):**

1. Install context-mode globally:

   ```bash
   npm install -g context-mode
   ```

2. Register the MCP server with Copilot CLI's built-in command (writes `~/.copilot/mcp-config.json` for you):

   ```bash
   copilot mcp add context-mode -- context-mode
   ```

3. Configure hooks in `~/.copilot/hooks/context-mode.json` (or `$COPILOT_HOME/hooks/context-mode.json`). The config uses flat `{ "type": "command", "command": "..." }` entries; context-mode also writes a top-level `"version": 1`, but that field is **optional** — the Copilot CLI accepts hook configs that omit it (it is pinned only for self-documentation). Copilot CLI fires six events context-mode uses:

   ```json
   {
     "version": 1,
     "hooks": {
      "preToolUse":          [{ "type": "command", "command": "context-mode hook copilot-cli pretooluse" }],
      "postToolUse":         [{ "type": "command", "command": "context-mode hook copilot-cli posttooluse" }],
      "preCompact":          [{ "type": "command", "command": "context-mode hook copilot-cli precompact" }],
      "sessionStart":        [{ "type": "command", "command": "context-mode hook copilot-cli sessionstart" }],
      "userPromptSubmitted": [{ "type": "command", "command": "context-mode hook copilot-cli userpromptsubmit" }],
      "agentStop":           [{ "type": "command", "command": "context-mode hook copilot-cli stop" }]
     }
   }
   ```

   Or let context-mode write **this hooks file** for you: `context-mode upgrade` (run from a Copilot CLI context, or with `CONTEXT_MODE_PLATFORM=copilot-cli`). `upgrade` writes the **hooks file only** — register the MCP server with `copilot mcp add` in step 2.

4. Restart Copilot CLI.

> **Plugins:** Option A above uses Copilot CLI's plugin system, which registers MCP servers (`.mcp.json`), hooks (`hooks.json`), and skills (`skills/`) together — not just skills/agents. The shipped bundle is `configs/copilot-cli/`; `copilot plugin install owner/repo:path` installs it in one command (no clone). Option B is the equivalent without a plugin.

> **Version note:** the hook commands run the **global** `context-mode` (`context-mode hook copilot-cli …`), so they need a context-mode version with Copilot CLI support. On an older global the hooks are inert (no routing/capture) until you upgrade — but they do **not** block your tools (context-mode fails open). Upgrade with `npm install -g context-mode@latest`.

**Verify:** In a Copilot CLI session, type `ctx stats`. Context-mode tools should appear and respond. Run `context-mode doctor` to confirm hook + MCP registration.

**Routing:** Automatic via hooks (PreToolUse interception + SessionStart routing block). Auto-detected via MCP `clientInfo.name` (`GitHub Copilot CLI`) or, in a bare shell, a context-mode-written marker (`~/.copilot/mcp-config.json` or `~/.copilot/hooks/context-mode.json`) — not a bare `~/.copilot/` dir, so a co-installed-but-unconfigured Copilot CLI is not mis-detected as context-mode-on-copilot.

See [`docs/platform-support.md`](docs/platform-support.md#github-copilot-cli) for the full reference. Tracking: [#775](https://github.com/mksglu/context-mode/issues/775).

</details>

<details>
<summary><strong>Cursor</strong> — hooks with stop support</summary>

**Prerequisites:** Node.js >= 22.5 (or Bun), Cursor with agent mode.

> **🚧 Work in progress** — the Marketplace plugin is **awaiting Cursor team review**. Until it's listed, install via the local-folder path described in Option A. Tracking in [#485](https://github.com/mksglu/context-mode/issues/485) / [#489](https://github.com/mksglu/context-mode/pull/489).

### Option A — Marketplace plugin (recommended once published)

After Cursor lists context-mode in the [Marketplace](https://cursor.com/marketplace), install with one click. The plugin auto-registers MCP, hooks (`preToolUse`, `postToolUse`, `sessionStart`, `stop`, `afterAgentResponse`), rules, and skills. No manual config required.

**Until then, use the local-folder path:**

**Windows (PowerShell)** — Cursor does not follow Windows symlinks/junctions, so use `robocopy`:

```powershell
git clone https://github.com/mksglu/context-mode.git
cd context-mode
robocopy . "$env:USERPROFILE\.cursor\plugins\local\context-mode" /MIR `
  /XD node_modules .git build web tests scripts .vscode `
  /XF *.log .gitignore *.bundle.mjs.map
```

**macOS / Linux:**

```bash
git clone https://github.com/mksglu/context-mode.git
ln -s "$PWD/context-mode" ~/.cursor/plugins/local/context-mode
```

Restart Cursor. The plugin appears in **Settings → Plugins** as "Context Mode (Local)". To pull updates, re-run the same `robocopy` / `ln -s` line.

> **Note:** if `.cursor/hooks.json` already contains context-mode entries from a prior `Option B` install, `context-mode doctor` will warn about duplicate hook firings. Remove one configuration to keep events single-fire.

[tronqué]
