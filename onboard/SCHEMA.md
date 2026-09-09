# Contrat du cache documentaire

Un dossier par repo : `onboard/cache/<owner>__<repo>/`. Tout est du texte versionné.

```
facts.json               chiffres et faits structurés, validés par `bun run validate facts <cache> <profil>`
parts/<sous-agent>.json  ce que chaque sous-agent de collecte a produit ; `bun run merge <cache> <profil>` les assemble dans facts.json
sources/                 extraits bruts du repo, un fichier par source, tels que lus
  readme.md  tree.md  contributing.md  ci.md  manifest.md  license.md  tests.md  todo.md  funding.md  security.md
narrative/<profil>.md    texte rédigé pour un profil, une section H2 par question du profil
faq.md                   questions et réponses accumulées, tous profils confondus
glossary.md              termes du projet, une ligne par terme
deck-<profil>.html       présentation autonome, imprimable en PDF
```

## facts.json

Schéma zod de référence : `src/facts.ts`. Tout est optionnel sauf `schema`, `repo`, `collected`.
Chaque sous-agent de collecte écrit sa part dans `parts/`, `merge` les assemble ; `collected.lenses` dit quels profils ont été collectés.

| Bloc | Rempli par | Contenu |
|---|---|---|
| `repo` | core | full_name, url, description, created_at, pushed_at, default_branch, license, stars, forks, open_issues, topics[], owner_type (org ou user), archived |
| `collected` | core | at, by, lenses[] |
| `languages` | core | `{ "TypeScript": 123456 }` en octets |
| `tree` | core | dossiers et fichiers de premier niveau : `{ path, type, role }`, role est une annotation de 2 à 6 mots |
| `releases` | core | `{ tag, date, name }`, les 10 dernières |
| `activity` | core | commits_per_week `{ week: "2026-W30", count }` sur 12 semaines, last_commit, contributors `{ login, commits }` top 10, bus_factor |
| `entrypoints` | dev | `{ path, why }` |
| `build` | dev, qa | install, run, test (commandes), ci `{ name, path, triggers[] }` |
| `tests` | qa | dir, framework, files |
| `ai_docs` | docs | `files` : `{ path, kind }` parmi agents_md, claude_md, cursorrules, copilot_instructions, llms_txt, mcp_json, skills_dir ; `score` et `max` : combien de ces repères existent. Aucun trouvé = `files: []`, `score: 0` |
| `issues` | dev, qa, ceo | open, closed_30d, by_label `{ label: count }`, good_first `{ number, title, url }`, hot `{ number, title, url, comments }` |
| `pulls` | dev, qa | open, awaiting_review, merged_30d `{ number, title, url, merged_at }` |
| `deps` | cto | manifest, count, runtime `{ name, version }` |
| `risks` | cto, investisseur | `{ kind: license, bus_factor, ci, deps, security ou activity ; level: low, mid ou high ; note }` |
| `business` | investisseur, ceo | funding, security_policy, codeowners, competitors `{ full_name, stars, description }` |
| `roadmap` | ceo, cto, investisseur | open_prs `{ number, title, url, updated_at, draft }`, requests `{ number, title, url, comments, labels[] }` (issues ouvertes hors bug), themes `{ label, count }`, milestones `{ title, open, closed, due }` |

Dates en ISO 8601. Chiffres bruts, jamais de pourcentage calculé : le rendu s'en charge.
Le bus factor est le nombre minimal de contributeurs qui totalisent la moitié des commits des 12 semaines.

## sources/

Un fichier par source. En-tête YAML `path`, `url`, `fetched_at`, puis le contenu brut, tronqué à 400 lignes
avec la mention `[tronqué]`. `tree.md` liste l'arborescence de premier niveau, un chemin par ligne.
Le rédacteur et le guide citent ces fichiers.

## narrative/<profil>.md

```
---
repo: owner/repo
profile: dev
generated_at: 2026-09-09T16:00:00Z
---
# Titre en une phrase

## Question 1 telle qu'écrite dans le profil
<!-- chart: languages -->
Paragraphes courts. Chaque affirmation chiffrée cite sa source : [facts:activity.bus_factor], [src:readme.md], [gh:https://…].

## Question 2
…
```

Règles : une H2 par question du profil, dans l'ordre et avec le libellé exact du profil (sans la mention du graphique).
Au plus une directive `<!-- chart: … -->` par section, prise dans la liste ci-dessous. Le rendu convertit les citations
en notes de bas de page.

## Graphiques disponibles

| Nom | Données | Forme |
|---|---|---|
| `languages` | languages | barres horizontales, top 6 |
| `commits_per_week` | activity.commits_per_week | barres, 12 semaines |
| `contributors` | activity.contributors | barres horizontales, top 10, le bus factor est mis en évidence |
| `issues_by_label` | issues.by_label | barres, top 8 |
| `releases` | releases | frise chronologique |
| `tree` | tree | liste annotée, pas un graphique |
| `risks` | risks | feux tricolores |
| `roadmap` | roadmap.themes, roadmap.milestones | barres des thèmes demandés, jalons en frise |
| `ai_readiness` | ai_docs | jauge : un pavé par repère, plein si présent |

## faq.md

```
## Q : question telle que posée (profil, 2026-09-09)
Réponse en 3 à 6 lignes, avec citations [facts:…] [src:…] [gh:…].
```

Ajout en fin de fichier, jamais de réécriture.

## Profils

`onboard/profiles/<profil>.json`, l'input du pipeline. Une description du public, puis la liste des éléments à traiter,
**dans l'ordre de priorité** : cet ordre est celui des sections du narratif et des pages du deck.
Chaque élément dit quels blocs de `facts.json` et quels fichiers de `sources/` il lui faut : c'est la liste de courses des collecteurs.

```json
{
  "name": "dev",
  "description": "Développeur ou développeuse qui rejoint le projet la semaine prochaine.",
  "tone": "Direct, technique, chemins de fichiers exacts, commandes copiables.",
  "deck": { "pages": 9, "finale": "Vos 3 premières actions" },
  "priorities": [
    { "question": "Que fait ce projet et pour qui ?", "facts": ["repo", "languages"], "sources": ["readme.md"] },
    { "question": "Comment le code est-il organisé ?", "chart": "tree", "facts": ["tree"], "sources": ["tree.md"] }
  ]
}
```

`question` devient le titre H2 du narratif, à l'identique. `chart` est optionnel, pris dans la liste des graphiques.
`facts` : noms de blocs du tableau ci-dessus. `sources` : noms de fichiers de `sources/`.
