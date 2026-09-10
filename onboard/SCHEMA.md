# Contrat du cache documentaire

Un dossier par repo : `onboard/cache/<owner>__<repo>/`. Tout est du texte versionné.

```
facts.json               chiffres et faits structurés, validés par `bun run validate facts <cache> <profil>`
parts/<sous-agent>.json  ce que chaque sous-agent de collecte a produit ; `bun run merge <cache> <profil>` les assemble dans facts.json
sources/                 extraits bruts du repo, un fichier par source, tels que lus
  readme.md  tree.md  contributing.md  ci.md  manifest.md  license.md  tests.md  todo.md  funding.md  security.md
narrative/<profil>.md    texte rédigé pour un profil, une section H2 par question du profil, un « à retenir » par section, une finale
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
en notes de bas de page (profil enfant : les citations disparaissent, pas de page Sources).

Deux éléments font le deck « agence de com » ; le rendu les met en scène, le rédacteur les écrit :
- **À retenir** : chaque section se termine par une ligne `> …`, la phrase que le lecteur doit garder, citée comme le reste.
  Le rendu l'affiche en exergue, en tête de page. Une seule par section.
- **Finale** : après la dernière question, une section `## <deck.finale du profil>` (libellé exact), 3 à 5 lignes ou puces,
  citées, dans le ton du profil : les 3 premières actions du dev, le plan de test du QA, la décision du CTO, la thèse de
  l'investisseur… Absente, le rendu se rabat sur les faits (`build`, `entrypoints`, `issues.good_first`).

Markdown compris par le rendu : une ligne = un paragraphe, listes `- ` et `1. `, tableaux `| a | b |`, blocs ```` ``` ````,
`**gras**`, `` `code` ``, `> à retenir`, URL nues (rendues cliquables). Rien d'autre : pas de H3, pas d'image, pas de HTML.

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
  "design": {
    "brief": "Un guide de prise en main, pas une plaquette : dense, précis, copiable.",
    "eyebrow": "Guide d'onboarding développeur",
    "kpis": ["repo.stars", "activity.contributors", "pulls.open", "activity.last_commit"]
  },
  "priorities": [
    { "question": "Que fait ce projet et pour qui ?", "facts": ["repo", "languages"], "sources": ["readme.md"] },
    { "question": "Comment le code est-il organisé ?", "chart": "tree", "facts": ["tree"], "sources": ["tree.md"] }
  ]
}
```

`question` devient le titre H2 du narratif, à l'identique. `chart` est optionnel, pris dans la liste des graphiques.
`facts` : noms de blocs du tableau ci-dessus. `sources` : noms de fichiers de `sources/`.

`design` dit au rendu comment parler à ce public ; l'identité visuelle elle-même (palette, typographie, mise en page) est
dans le code, `src/render/theme.ts`, une par profil :
- `brief` : la direction artistique en une phrase, lue par le rédacteur (ton des « à retenir », de la finale) et par qui retouche le thème.
- `eyebrow` : le sur-titre de la couverture, le nom du document tel que le public l'attend (« Mémo d'investissement »).
- `kpis` : 3 à 4 chemins de `facts.json` affichés en tuiles sur la couverture, dans l'ordre. Chemins connus du rendu
  (`src/render/kpi.ts`) : `repo.stars`, `repo.forks`, `repo.open_issues`, `repo.license`, `repo.created_at`, `activity.bus_factor`,
  `activity.contributors`, `activity.commits_per_week`, `activity.last_commit`, `releases`, `issues.open`, `issues.closed_30d`,
  `issues.by_label.bug`, `pulls.open`, `tests.files`, `build.ci`, `deps.count`, `ai_docs.score`. Une valeur absente du cache = tuile omise, jamais inventée.
