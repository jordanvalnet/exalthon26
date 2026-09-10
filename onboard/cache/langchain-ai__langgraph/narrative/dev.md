---
repo: langchain-ai/langgraph
profile: dev
generated_at: 2026-09-10T13:45:00Z
---
# LangGraph : le framework d'agents à état de LangChain, un monorepo Python de 9 paquets piloté au Makefile, où votre première PR passe par `make test` dans la lib touchée

## Que fait ce projet et pour qui ?
LangGraph se présente en trois mots, « Build resilient agents », et en une phrase dans le README : un framework d'orchestration bas niveau pour construire, gérer et déployer des agents à état, de longue durée [facts:repo.description] [src:readme.md] [gh:https://github.com/langchain-ai/langgraph/blob/main/README.md].
Le README revendique trois briques : l'exécution durable (l'agent reprend exactement où il s'est arrêté après une panne), l'humain dans la boucle (inspecter et modifier l'état en cours d'exécution) et la mémoire, courte pendant le raisonnement et longue entre les sessions [src:readme.md].
Le public visé est le développeur Python qui construit des agents LLM. Le README cite Klarna, Replit et Elastic parmi les utilisateurs, et renvoie vers Deep Agents pour qui veut un niveau plus haut, vers LangGraph.js pour l'équivalent TypeScript [src:readme.md].
Le projet est autonome mais s'intègre à LangChain (composants), LangSmith (traces, évaluations) et LangSmith Deployment (hébergement). Il est inspiré de Pregel et Apache Beam, avec une interface publique dans l'esprit de NetworkX [src:readme.md].
| Repère | Valeur |
|---|---|
| Étoiles | 41 384 [facts:repo.stars] |
| Forks | 6 990 [facts:repo.forks] |
| Licence | MIT [facts:repo.license] |
| Créé le | 2023-08-09 [facts:repo.created_at] |
| Propriétaire | organisation langchain-ai, branche par défaut `main` [facts:repo.owner_type] [facts:repo.default_branch] |
| Dernier push | 2026-09-09 [facts:repo.pushed_at] |
Parmi les 18 topics déclarés : agents, multiagent, llm, rag, python, pydantic, openai, gemini [facts:repo.topics].
> Un framework bas niveau, Python, MIT, pour des agents à état qui survivent aux pannes : vous y contribuez si les mots graphe, checkpoint et LLM vous parlent [src:readme.md] [facts:repo.license]

## Comment le code est-il organisé ?
<!-- chart: tree -->
Onze entrées à la racine et aucun manifeste : tout le code vit dans `libs/`, un dossier par paquet publié, chacun avec son `pyproject.toml`, son `uv.lock`, son `Makefile` et son `tests/` ; le `Makefile` racine ne fait que déléguer à chaque lib [facts:tree] [src:tree.md] [src:manifest.md].
| Paquet | Rôle d'après `AGENTS.md` |
|---|---|
| `libs/langgraph` | le cœur : agents à état, multi-acteurs, version 1.2.11 [src:ai-docs.md] [src:manifest.md] |
| `libs/checkpoint` | interfaces de base des checkpointers [src:ai-docs.md] |
| `libs/checkpoint-postgres`, `libs/checkpoint-sqlite` | implémentations Postgres et SQLite du checkpointer [src:ai-docs.md] |
| `libs/checkpoint-conformance` | suite de conformité des checkpointers [src:tree.md] |
| `libs/prebuilt` | API haut niveau pour créer et lancer agents et outils [src:ai-docs.md] |
| `libs/cli` | la commande `langgraph`, exemples Python et JS, schéma de `langgraph.json` [src:ai-docs.md] [src:tree.md] |
| `libs/sdk-py`, `libs/sdk-js` | SDK Python et JS/TS pour l'API LangGraph Server [src:ai-docs.md] |
Le cœur dépend de trois paquets frères, `langgraph-checkpoint`, `langgraph-sdk` et `langgraph-prebuilt`, liés en editable via `[tool.uv.sources]`, plus `langchain-core`, `pydantic` et `xxhash` : 6 dépendances d'exécution sur 33 déclarées [facts:deps.runtime] [facts:deps.count] [src:manifest.md] [gh:https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/pyproject.toml].
Autour : 17 workflows dans `.github/`, des notebooks dans `examples/`, un `docs/` réduit à des redirections et un `llms.txt` (la doc vit sur docs.langchain.com). `AGENTS.md` et `CLAUDE.md` donnent aux agents IA la carte des dépendances entre libs et les commandes à lancer avant une PR [facts:tree.0.role] [src:docs.md] [facts:ai_docs.score] [src:ai-docs.md] [gh:https://github.com/langchain-ai/langgraph/blob/main/AGENTS.md].
> Un paquet = un dossier de `libs/` avec son `pyproject.toml`, son `Makefile` et son `tests/` ; `libs/langgraph` est le cœur, les huit autres gravitent autour [src:tree.md] [src:ai-docs.md]

## Par où commencer à lire ?
Avant le code, dix minutes sur `AGENTS.md` : la carte des dépendances entre libs et les trois commandes attendues avant une PR. Le README pointe ensuite le quickstart et la référence d'API sur docs.langchain.com, et un cours gratuit sur LangChain Academy [src:ai-docs.md] [src:readme.md].
1. `libs/langgraph/langgraph/` : le paquet Python `langgraph`, le cœur. Les sous-dossiers `graph/` (construction du graphe), `pregel/` (la boucle d'exécution) et `runtime.py` sont ceux que la recherche fait remonter [facts:entrypoints.0.why] [gh:https://github.com/langchain-ai/langgraph/tree/main/libs/langgraph/langgraph]
2. `Makefile` à la racine : `make install` crée un venv uv et installe chaque `libs/*` en editable ; `lint`, `format`, `lock`, `test` délèguent au `Makefile` de chaque lib [facts:entrypoints.2.why] [gh:https://github.com/langchain-ai/langgraph/blob/main/Makefile]
3. `libs/cli/langgraph_cli/cli.py` : la commande `langgraph`, déclarée par `[project.scripts]` dans `libs/cli/pyproject.toml`, construite sur click [facts:entrypoints.1.why] [gh:https://github.com/langchain-ai/langgraph/blob/main/libs/cli/pyproject.toml]
4. `libs/cli/generate_schema.py` : génère `libs/cli/schemas/schema.json`, le schéma de `langgraph.json` ; la CI le relance et échoue si le schéma a changé sans commit [facts:entrypoints.3.why]
5. `.github/workflows/ci.yml` : l'orchestration de la CI, filtre par chemins modifiés puis lint et tests par lib [facts:entrypoints.4.why]
Les `TODO` laissés dans le cœur disent ce qui bouge : la signature des nœuds dans `libs/langgraph/langgraph/graph/_node.py` (« once we move to adding a context arg »), un gestionnaire de contexte pour le runtime dans `runtime.py`, un paramètre `exiting` explicite dans `pregel/_loop.py` [src:todo.md] [gh:https://github.com/search?q=repo%3Alangchain-ai%2Flanggraph+TODO&type=code].
Donnée non relevée : le contenu des fichiers d'entrée eux-mêmes, les rôles ci-dessus sont déduits des manifestes et de la CI ; à vérifier dans https://github.com/langchain-ai/langgraph/tree/main/libs/langgraph/langgraph [facts:entrypoints.0.path].
> Commencez par `libs/langgraph/langgraph/` (`graph/`, `pregel/`, `runtime.py`), le `Makefile` racine ensuite : tout le reste en découle [facts:entrypoints.0.path] [facts:entrypoints.2.path]

## Comment builder, tester et lancer ?
Pour utiliser la bibliothèque : `pip install -U langgraph`, Python 3.10 ou plus [facts:build.install] [src:manifest.md].
Pour y contribuer, le monorepo se pilote avec uv depuis le `Makefile` racine, puis lib par lib. `AGENTS.md` fixe la règle : formater, linter et tester dans le dossier de la lib modifiée avant toute PR [src:tree.md] [src:ai-docs.md] [facts:build.test].
```
make install                          # uv venv, puis chaque libs/* en editable
cd libs/langgraph
make format && make lint && make test # ce que la CI rejoue
TEST=tests/test_algo.py make test     # un seul fichier, autres options pytest dans TEST
```
Les tests sont en pytest, avec `pytest-xdist` pour paralléliser, `syrupy` pour les snapshots, et des options strictes (`--strict-markers --strict-config`). Le dossier est `libs/langgraph/tests`, `libs/cli/tests` pour la CLI [facts:tests.framework] [facts:tests.dir] [src:tests.md] [src:manifest.md].
Donnée non relevée : le nombre de fichiers de test ; à vérifier dans https://github.com/langchain-ai/langgraph/tree/main/libs/langgraph/tests [src:tests.md].
Le lint est ruff (règles E, F, I, UP, TID251, ligne à 88, cible py310) et le typage ty ; la CLI ajoute codespell [src:manifest.md].
Pas de commande de lancement à proprement parler : c'est une bibliothèque, on l'importe. La commande `langgraph` de `libs/cli` sert à servir et déployer un projet, avec l'extra `inmem` pour un serveur local [facts:entrypoints.1.why] [src:manifest.md].
La CI, `.github/workflows/ci.yml`, part sur `push` vers `main`, sur chaque `pull_request` et à la demande. Elle filtre par chemins modifiés, puis lance le lint sur 8 libs, les tests sur 7 libs via `_test.yml` et sur `libs/langgraph` via `_test_langgraph.yml`, vérifie le schéma de la CLI, joue les tests d'intégration CLI et sdk-py, et un job `ci_success` agrège le tout. Actions épinglées par SHA, runs concurrents annulés [facts:build.ci.0.path] [facts:build.ci.0.triggers] [src:ci.md] [gh:https://github.com/langchain-ai/langgraph/blob/main/.github/workflows/ci.yml].
Donnée non relevée : pas de `CONTRIBUTING.md` dans le dépôt, le guide de contribution est externe ; à vérifier dans https://docs.langchain.com/oss/python/contributing/overview [src:readme.md].
> `make install` à la racine, puis `make format && make lint && make test` dans la lib touchée : c'est exactement ce que `ci.yml` rejoue sur chaque PR [src:ai-docs.md] [facts:build.ci.0.path]

## Comment le projet vit-il ?
<!-- chart: commits_per_week -->
Dernier commit sur `main` le 2026-09-09. Sur les 12 dernières semaines, le rythme est irrégulier : 25 commits la semaine 32, 2 la semaine suivante, 19 la semaine 36 [facts:activity.last_commit] [facts:activity.commits_per_week.6.count] [facts:activity.commits_per_week.7.count] [facts:activity.commits_per_week.10.count] [gh:https://github.com/langchain-ai/langgraph/commits/main].
Les commits sont répartis : eliornl en tête avec 11, puis ccurme et longquanzheng à 5 chacun ; il faut 4 personnes pour atteindre la moitié des commits de la période (bus factor 4) [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.contributors.2.commits] [facts:activity.bus_factor].
Les releases sont par paquet, chacune avec son tag. Les 10 dernières relevées tiennent en sept semaines [facts:releases] [gh:https://github.com/langchain-ai/langgraph/releases] :
| Paquet | Versions récentes | Dates |
|---|---|---|
| langgraph | 1.2.9, 1.2.10, 1.2.11 | 2026-07-10, 2026-07-28, 2026-08-11 [facts:releases.8] [facts:releases.7] [facts:releases.2] |
| langgraph-sdk | 0.4.3, 0.4.4 | 2026-08-19, 2026-08-27 [facts:releases.1] [facts:releases.0] |
| langgraph-checkpoint | 4.2.0 | 2026-08-07 [facts:releases.4] |
| langgraph-checkpoint-postgres | 3.1.1, 3.1.2 | 2026-07-30, 2026-08-07 [facts:releases.6] [facts:releases.3] |
| langgraph-checkpoint-sqlite | 3.1.1 | 2026-07-30 [facts:releases.5] |
| langgraph-cli | 0.4.31 | 2026-07-10 [facts:releases.9] |
Sur les 33 PR fusionnées en 30 jours, la majorité sont des montées de dépendances par dependabot ; les changements de fond sont ciblés : détection des sous-graphes depuis le bytecode (#8569), type de `Store.put` élargi (#8617), typage des projections de stream v3 (#8596), traces LangSmith depuis les streams (#8723) [facts:pulls.merged_30d] [facts:pulls.merged_30d.31.title] [facts:pulls.merged_30d.27.title] [facts:pulls.merged_30d.29.title] [facts:pulls.merged_30d.23.title] [gh:https://github.com/langchain-ai/langgraph/pulls?q=is%3Apr+is%3Amerged].
Côté risques : licence MIT sans surprise, CI solide, dépendances maîtrisées (uv.lock versionné). Un point orange : pas de `SECURITY.md`, donc aucun canal déclaré pour signaler une faille [facts:risks.0.note] [facts:risks.3.level] [facts:risks.2.level] [facts:risks.1.note].
> Un dépôt vivant : dernier commit le 2026-09-09, une release de `langgraph` toutes les deux à quatre semaines cet été, quatre personnes pour la moitié des commits [facts:activity.last_commit] [facts:releases] [facts:activity.bus_factor]

## Quelle première contribution ?
Le volume est celui d'un gros projet : 528 issues ouvertes, 7 fermées sur les 30 derniers jours, 245 PR ouvertes. Les labels ne trient pas par difficulté : `external` 297, `bug` 81, `internal` 3, et aucune issue étiquetée « good first issue » [facts:issues.open] [facts:issues.closed_30d] [facts:pulls.open] [facts:issues.by_label.external] [facts:issues.by_label.bug] [facts:issues.by_label.internal] [facts:issues.good_first] [gh:https://github.com/langchain-ai/langgraph/issues].
Le README renvoie au guide de contribution externe, https://docs.langchain.com/oss/python/contributing/overview, pour trouver de bonnes premières issues [src:readme.md].
Trois pistes concrètes, tirées de ce qui est relevé :
- Une correction en une ligne : #8130, la coquille « GraphRecusionError » dans la docstring de `create_react_agent`, 17 commentaires, toujours ouverte [facts:issues.hot.9.title] [facts:issues.hot.9.comments] [gh:https://github.com/langchain-ai/langgraph/issues/8130]
- Des tests à compléter, signalés par les mainteneurs eux-mêmes : `# TODO: add more tests` dans `libs/langgraph/tests/test_algo.py`, `# TODO: test before and limit params` dans `libs/checkpoint/tests/test_memory.py` [src:todo.md]
- Un bug de sérialisation bien cadré : #8185, le checkpoint rejette `fractions.Fraction` et `complex` alors que `Decimal` passe, 11 commentaires [facts:roadmap.requests.9.title] [facts:roadmap.requests.9.comments] [gh:https://github.com/langchain-ai/langgraph/issues/8185]
Les sujets chauds sont ailleurs et demandent du contexte : reçus auditables de fin d'exécution (#7844, 64 commentaires), longs appels d'outils rejoués depuis le checkpoint (#7417, 51), un `ApprovalNode` pour l'humain dans la boucle (#8026, 45), ordre de persistance en mode `durability="sync"` (#8039, 36) [facts:issues.hot.0.comments] [facts:issues.hot.1.comments] [facts:issues.hot.2.comments] [facts:issues.hot.3.comments] [gh:https://github.com/langchain-ai/langgraph/issues/7844].
Les PR fusionnées suivent un titre `type(scope): sujet`, par exemple `fix(cli): clarify missing deploy config` ; les workflows `require_issue_link.yml` et `pr_lint.yml` existent dans `.github/workflows/`, non lus, leur nom suffit à deviner la règle [facts:pulls.merged_30d.3.title] [src:tree.md].
Les PR ouvertes les plus récentes montrent où le cœur bouge : rejeu d'une branche abandonnée dans un `DeltaChannel` (#8548), `stream_mode="messages"` restreint à certaines clés d'état (#8868), et deux brouillons sur les sous-graphes parallèles et le pilotage d'un graphe en cours (#8819, #8838) [facts:roadmap.open_prs.0.title] [facts:roadmap.open_prs.1.title] [facts:roadmap.open_prs.3.draft] [facts:roadmap.open_prs.4.draft] [gh:https://github.com/langchain-ai/langgraph/pulls].
> Pas d'étiquette « good first issue » : prenez un `TODO` de tests ou une issue bien cadrée comme #8130, avec un titre `fix(scope): …` et un lien vers l'issue [facts:issues.good_first] [facts:issues.hot.9.number] [src:todo.md]

## Vos 3 premières actions
1. Cloner, puis `make install` à la racine et `cd libs/langgraph && make test` : si la suite passe, votre environnement est celui de la CI [facts:build.test] [facts:entrypoints.2.why] [src:ai-docs.md]
2. Lire `AGENTS.md` en entier, puis `libs/langgraph/langgraph/graph/`, `pregel/` et `runtime.py` avec les `TODO` sous les yeux : c'est là que la prochaine version se décide [src:ai-docs.md] [facts:entrypoints.0.why] [src:todo.md]
3. Ouvrir une première PR sur #8130 ou un `TODO` de `tests/test_algo.py`, titre `fix(langgraph): …`, issue liée, `make format && make lint && make test` verts dans la lib avant de pousser [gh:https://github.com/langchain-ai/langgraph/issues/8130] [src:todo.md] [facts:pulls.merged_30d.3.title] [facts:build.ci.0.path]
