---
name: onboarding-profil-technique
description: >-
  Load this when the agent needs an output spec for an onboarding deliverable
  (guide, ONBOARDING.md, summary, ramp-up plan) aimed at a TECHNICAL profile:
  developer, architect, tech lead, DevOps/SRE, data engineer. Produces a JSON
  object that tells the agent what information to prioritize and how to talk to
  the target. Does not apply to non-technical profiles (PO, PM, design,
  leadership).
---

# Onboarding — output spec for a technical profile

This skill collects nothing about the repo. It emits a **JSON spec** that a later
step consumes to write the actual onboarding deliverable. The spec captures, for
a technical newcomer, what matters and how to address them.

## Specific profile

> **Slot to be filled by the caller.** Provide the description of the exact
> profile (precise role, mastered stack, seniority, mission on the project). If
> left empty, treat the person as a seasoned generalist developer.

```
{{PROFIL_SPECIFIQUE}}
```

Adapt the spec to that profile: an architect wants module boundaries and
structural decisions; a developer who writes code wants entry points and the
build/test loop; an SRE wants deployment and runbooks. When the profile is
specified, **drop** priorities outside their mission rather than listing
everything.

## Reference: information a technical profile cares about

Descending priority order. Use this as the pool to build `elements_to_prioritize`
— keep what fits the profile, in this order.

1. **Get the machine running** — prerequisites (language/tool versions, external
   services), install / build / run / test commands, for the person's OS.
2. **Entry points & code map** — where execution starts, the main modules and
   each one's responsibility, where the business logic lives vs the glue.
3. **Architecture & boundaries** — split into components/services, data and
   control flow, dependencies between modules, couplings, structural decisions
   (ADRs, architecture docs).
4. **Contribution conventions** — commit format, branch naming, PR process
   (required reviewers, blocking checks), code style and linters, expected test
   level.
5. **Who knows what** — area owners, from CODEOWNERS and commit frequency per
   directory.
6. **Project state** — hot PRs/issues, hotspot files, latest releases, what is
   being refactored, known technical debt.
7. **First missions** — realistic bounded issues for this profile, ranked by fit.
8. **Glossary** — acronyms and in-house terms from the docs and code.

Excluded regardless of profile: Git/GitHub reminders, definitions of generic
concepts, language history, tutorials for standard tools.

## Reference: how to talk to a technical profile

Use this as the pool to build `tone`.

- Peer to peer, dense, no performative warmth. No "feel free to", no
  congratulations, no decorative emojis.
- Generic jargon assumed (API, CI, DI, ORM, coupling, feature flag) — not
  defined. Every project-specific term spelled out on first use.
- Assertive and sourced: every non-trivial claim points to a `file:line`, a CI
  workflow name, a PR/issue number, a release tag. Missing info is stated
  ("undocumented — confirm with the team"), never guessed.
- Imperative, action-oriented: "Run `make test`", not "you can run the tests".
- Short: lists and tables over paragraphs; code snippets under 15 lines.
- English; technical terms stay in English.

## Output

Emit **only** a JSON object, no surrounding prose, with exactly these keys:

| Key | Type | Content |
|---|---|---|
| `profile_description` | string | The specific profile from the slot above, normalized to one sentence (role + stack + seniority + mission). If the slot was empty: `"Seasoned generalist developer, no stated mission"`. |
| `elements_to_prioritize` | array of strings | The information items this profile needs, drawn from the reference list, ordered most-important first, phrased for this profile. Drop anything outside their mission. |
| `tone` | array of strings | Concrete directives on vocabulary and register for addressing this profile — each item an actionable rule, not a vague adjective. |

### Example

```json
{
  "profile_description": "Mid-level backend developer, Python/FastAPI, joining to own the ingestion service",
  "elements_to_prioritize": [
    "Get the machine running: Python version, Poetry install, how to run the ingestion service locally and its test suite",
    "Entry points & code map: request lifecycle of the ingestion service, where handlers vs domain logic live",
    "Contribution conventions: commit format, required reviewers on the ingestion package, lint/test gates that block merge",
    "Architecture & boundaries: how ingestion talks to the queue and the storage layer, coupling to the shared schema package",
    "Who knows what: current owners of the ingestion and schema directories",
    "First missions: 2-3 bounded good-first-issue tickets touching the ingestion service"
  ],
  "tone": [
    "Address as a peer who already writes production Python; no basics, no encouragement filler",
    "Assume generic jargon (async, DI, ORM, backpressure); define only project-specific names on first use",
    "Every claim carries a source: file:line, PR number, CI workflow, or release tag",
    "Imperative phrasing for actions: 'Run poetry install', not 'you can install'",
    "Prefer short lists and code snippets under 15 lines over prose",
    "English; keep technical terms in English"
  ]
}
```
