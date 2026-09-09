---
name: onboarding-profil-technique
description: >-
  Load this when authoring or refining a profile file for a TECHNICAL audience
  (developer, architect, tech lead, DevOps/SRE, QA, data engineer) under
  onboard/profiles/. Produces exactly one JSON object matching the profile
  contract in onboard/SCHEMA.md (section "Profils"), validated by src/validate.ts.
  Does not apply to non-technical audiences (ceo, investisseur, enfant).
---

# Onboarding — technical-audience profile

A profile is the **input** of the Onboard pipeline: `onboard/profiles/<name>.json`.
It names the audience, sets the tone, and lists the questions to answer **in
priority order** — that order drives the narrative sections and the deck pages.
Each question declares which `facts.json` blocks and which `sources/` files it
needs (the collectors' shopping list).

This skill emits one such JSON object, specialized for a technical reader.

## Specific profile

> **Slot filled by the caller.** Provide the exact persona (role, stack,
> seniority, mission on the project). If left empty, target a seasoned
> generalist developer joining to contribute.

```
{{PROFIL_SPECIFIQUE}}
```

Tune the profile to that persona: an architect leads with module boundaries and
structural decisions; a contributor leads with entry points and the build/test
loop; an SRE leads with CI, releases and operational risk. Keep 5–8 priorities;
drop questions outside the persona's mission rather than listing everything.

## Output contract

Emit **only** a JSON object, no surrounding prose, with these keys:

| Key | Type | Content |
|---|---|---|
| `name` | string | Filename-safe slug, unique in `onboard/profiles/` (e.g. `architecte`, `tech-lead`, `sre`). Do not reuse `dev`, `qa`, `cto`. |
| `description` | string | One sentence: who the reader is and what they want out of this. |
| `tone` | string | One sentence of comma-separated, concrete directives (see below). |
| `deck` | object | `{ "pages": <int 7–10>, "finale": "<closing page title>" }`. `pages` ≈ number of priorities + 3. |
| `priorities` | array | Ordered, most important first. Each item: `{ "question", "chart"?, "facts": [...], "sources": [...] }`. |

Per priority item:
- `question` — a real question in the reader's words. Used **verbatim** as the
  narrative H2 and the deck page title. No trailing "(chart)" mention.
- `chart` — optional, one value from the allowed list below.
- `facts` — block names from the allowed list; the collectors will fill them.
- `sources` — filenames from the allowed list.

Language: `description`, `tone` and every `question` are written in the project's
output language (**French**, matching the sibling profiles `dev.json` /
`cto.json` / `qa.json`). Only this skill's own prose is English.

## Allowed values (must match exactly)

`facts` blocks — technical-relevant subset:
`repo`, `languages`, `tree`, `releases`, `activity`, `entrypoints`, `build`,
`tests`, `issues`, `pulls`, `deps`, `risks`, `roadmap`.
(`business` exists but is for non-technical audiences.)

`sources` files:
`readme.md`, `tree.md`, `contributing.md`, `ci.md`, `manifest.md`, `license.md`,
`tests.md`, `todo.md`, `security.md`, `funding.md`.

`chart` values:
`languages`, `commits_per_week`, `contributors`, `issues_by_label`, `releases`,
`tree`, `risks`, `roadmap`.

Hard rules enforced by `src/validate.ts`:
- `readme.md` and `tree.md` are always collected — safe to cite anywhere.
- Every `facts` / `sources` / `chart` value outside the lists above fails validation.
- Section count in the narrative must equal `priorities.length`; keep the list tight.

## Writing `tone` for a technical reader

One sentence, comma-separated directives, each actionable. Draw from:
- Peer to peer, dense, no performative warmth, no encouragement filler.
- Exact file paths, copy-pasteable commands, real identifiers.
- Generic jargon assumed (API, CI, DI, ORM, coupling); project-specific terms
  spelled out on first use.
- Every claim sourced (`file:line`, PR number, CI workflow, release tag);
  missing info stated, never guessed.
- Imperative phrasing for actions; short lists and code snippets over prose.

Example: `"Direct, technique, chemins de fichiers exacts, commandes copiables, chaque affirmation sourcée, pas de marketing."`

## Choosing `priorities` for a technical reader

Menu of technical questions mapped to their data. Pick 5–8, order by what this
persona needs first.

| Intent | `facts` | `sources` | `chart` |
|---|---|---|---|
| What the project does, for whom | `repo`, `languages` | `readme.md` | `languages` (opt.) |
| How the code is organized | `tree` | `tree.md` | `tree` |
| Where to start reading | `entrypoints` | `readme.md` | — |
| How to build, test, run | `build` | `manifest.md`, `ci.md`, `contributing.md` | — |
| What the CI checks, when it runs | `build` | `ci.md` | — |
| How it is tested today, coverage gaps | `tests`, `activity` | `tests.md` | — |
| How the project lives (activity, releases) | `activity`, `releases` | — | `commits_per_week` |
| Known bugs | `issues` | — | `issues_by_label` |
| First contribution / open work | `issues`, `pulls` | `contributing.md` | — |
| Dependencies and technical debt | `deps` | `manifest.md`, `todo.md` | — |
| Risks and their mitigations | `risks` | `security.md`, `license.md` | `risks` |
| Direction and roadmap | `roadmap` | — | `roadmap` |
| Who owns what, bus factor | `activity` | — | `contributors` |

Use at most one `chart` per priority.

## Reference

`onboard/profiles/dev.json`, `cto.json`, `qa.json` already ship. Match their
shape and register. Only create a new profile for a persona these three do not
cover (architect, tech lead, SRE, staff engineer); otherwise refine the existing
file in place.

## Example output

```json
{
  "name": "architecte",
  "description": "Architecte qui évalue le projet avant de l'intégrer : veut les frontières de modules, les couplages et les décisions structurantes, pas le tutoriel de démarrage.",
  "tone": "Synthétique et technique, frontières et dépendances explicites, chaque affirmation sourcée (fichier, PR, ADR), une lecture assumée à la fin, pas de marketing.",
  "deck": { "pages": 9, "finale": "Intégrer, adapter ou éviter" },
  "priorities": [
    { "question": "Que fait ce projet et de quoi est-il fait ?", "facts": ["repo", "languages"], "sources": ["readme.md"] },
    { "question": "Comment le code est-il découpé en modules ?", "chart": "tree", "facts": ["tree", "entrypoints"], "sources": ["tree.md", "readme.md"] },
    { "question": "Quelles dépendances entre modules et vers l'extérieur ?", "facts": ["deps", "tree"], "sources": ["manifest.md"] },
    { "question": "Quelles décisions d'architecture sont documentées ?", "facts": ["tree"], "sources": ["readme.md", "contributing.md"] },
    { "question": "Comment build, CI et tests sont-ils organisés ?", "facts": ["build", "tests"], "sources": ["ci.md", "manifest.md", "tests.md"] },
    { "question": "Quelle est la santé du projet et qui le porte ?", "chart": "commits_per_week", "facts": ["activity", "releases"], "sources": [] },
    { "question": "Quels risques structurels et quelles parades ?", "chart": "risks", "facts": ["risks"], "sources": ["security.md", "license.md"] },
    { "question": "Où va le projet ?", "chart": "roadmap", "facts": ["roadmap"], "sources": [] }
  ]
}
```
