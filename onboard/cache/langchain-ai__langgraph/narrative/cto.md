---
repo: langchain-ai/langgraph
profile: cto
generated_at: 2026-09-10T14:05:00Z
---
# LangGraph : socle modulaire, MIT, tenu par une entreprise et peu de mains — adopter oui, dépendre aveuglément non

## Que fait ce projet et quelle est son architecture ?

<!-- chart: tree -->

LangGraph est un framework d'orchestration bas niveau pour agents à état : exécution durable, reprise après panne exactement au point d'arrêt, interruption pour validation humaine, mémoire courte et longue [src:readme.md].

Ce n'est pas un produit clé en main mais une couche d'infrastructure : le modèle raisonne, LangGraph tient l'état, la reprise et le contrôle [facts:repo.description].

L'architecture est un monorepo de neuf paquets sous `libs/`, publiés séparément : le cœur, quatre paquets de persistance, les briques préconstruites, la CLI et deux SDK [facts:tree.10.role].

Le cœur tient dans `libs/langgraph/langgraph` — `graph/`, `pregel/`, `runtime.py` — et se distribue en wheel MIT versionnée 1.2.11 [facts:entrypoints.0.path] [facts:entrypoints.0.why].

Conséquence directe pour une adoption : la persistance est un point d'extension, pas un choix imposé. Postgres, SQLite et une interface de conformité sont des paquets distincts, remplaçables par le vôtre [facts:tree.10.role].

Le monorepo est piloté par un `Makefile` racine et `uv` : `make install` crée l'environnement et installe chaque lib en editable, `make lint`, `make lock` et `make test` délèguent à chaque paquet [facts:entrypoints.2.why].

Le modèle d'exécution est emprunté à Pregel et Apache Beam, l'interface publique à NetworkX : rien d'exotique, des fondations documentées depuis quinze ans [src:readme.md].

> Neuf paquets séparés, un cœur MIT de 6 dépendances : on adopte LangGraph par morceaux, pas en bloc [facts:tree.10.role] [facts:deps.runtime].

## Quelle est sa santé technique ?

<!-- chart: commits_per_week -->

112 modifications sur les douze dernières semaines, la dernière la veille du relevé : le projet est actif, sans ambiguïté [facts:activity.commits_per_week] [facts:activity.last_commit].

Le rythme est irrégulier — de 2 à 25 modifications par semaine — signature d'un développement par vagues autour des livraisons, pas d'un essoufflement [facts:activity.commits_per_week].

33 propositions de changement ont été intégrées en trente jours, mais 23 d'entre elles sont des montées de version de dépendances : le débit réel de fonctionnalités est de l'ordre de dix changements par mois [facts:pulls.merged_30d].

Dix livraisons en deux mois, réparties sur les paquets : le cœur est passé de 1.2.9 (10 juillet 2026) à 1.2.11 (11 août 2026), la plus récente relevée est le SDK Python 0.4.4 du 27 août 2026 [facts:releases.8.date] [facts:releases.2.name] [facts:releases.0.name].

À noter pour un plan de montée de version : le cœur n'a pas été republié depuis un mois au moment du relevé, alors que les SDK et checkpointers bougent toutes les deux semaines [facts:releases.2.date] [facts:releases.0.date].

L'intégration continue est sérieuse : `ci.yml` filtre par chemins modifiés, puis lint et tests sur huit paquets Python, vérification du schéma de la CLI, tests d'intégration CLI et SDK, job agrégateur `ci_success` ; les actions sont épinglées par SHA et les exécutions concurrentes annulées [facts:build.ci.0.path] [src:ci.md].

Les tests se lancent par `make test`, en `pytest`, avec `--strict-markers --strict-config` et des snapshots `syrupy` [facts:build.test] [src:manifest.md].

Donnée non relevée : le taux de couverture et le nombre de fichiers de test, aucun outil ne les expose ici ; à vérifier dans https://github.com/langchain-ai/langgraph/tree/main/libs/langgraph/tests.

> 112 modifications en 12 semaines mais 23 des 33 intégrations du mois sont des bumps : le projet est entretenu plus qu'il n'accélère [facts:activity.commits_per_week] [facts:pulls.merged_30d].

## Qui porte le projet et quel est le bus factor ?

<!-- chart: contributors -->

Bus factor relevé : 4 [facts:activity.bus_factor]. Quatre départs simultanés suffisent à faire décrocher le rythme.

La distribution est plate et mince : la personne la plus active signe 11 modifications sur douze semaines, la deuxième et la troisième 5 chacune [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.contributors.2.commits].

Personne n'est à plein temps sur le cœur visible : les dix noms relevés totalisent 36 des 112 modifications de la période, le reste vient d'une traîne non relevée nominativement [facts:activity.contributors] [facts:activity.commits_per_week].

L'éditeur est une organisation, LangChain Inc, pas un individu ; plusieurs comptes actifs portent d'ailleurs un suffixe maison (`nick-hollon-lc`, `saad-supports-langchain`) [facts:repo.owner_type] [facts:activity.contributors.4.login] [facts:activity.contributors.7.login].

Aucun fichier CODEOWNERS : personne n'est désigné responsable d'une zone du code, ni pour la relecture, ni pour l'astreinte [facts:business.codeowners].

Parade : ne jamais dépendre d'une correction amont. Prévoyez une personne capable de lire `pregel/` et de tenir un fork temporaire pendant six semaines [facts:entrypoints.0.path].

> Un éditeur solide derrière, mais quatre personnes couvrent la moitié du travail et aucune zone n'a de responsable désigné [facts:activity.bus_factor] [facts:business.codeowners].

## Quelles dépendances et quelle dette ?

Le manifeste du cœur déclare 33 dépendances, dont 27 servent au développement : pytest et ses plugins, ruff, ty, jupyter [facts:deps.count] [facts:risks.2.note].

À l'exécution il n'en reste que six, et trois sont des paquets internes du monorepo [facts:deps.runtime] :

| Dépendance | Version | Nature |
|---|---|---|
| `langchain-core` | `>=1.4.7,<2` | externe, couplage structurant [facts:deps.runtime.0.version] |
| `pydantic` | `>=2.7.4` | externe, standard [facts:deps.runtime.5.version] |
| `xxhash` | `>=3.5.0` | externe, hachage [facts:deps.runtime.4.version] |
| `langgraph-checkpoint` | `>=4.1.0,<5.0.0` | interne au dépôt [facts:deps.runtime.1.version] |
| `langgraph-sdk` | `>=0.4.2,<0.5.0` | interne au dépôt [facts:deps.runtime.2.version] |
| `langgraph-prebuilt` | `>=1.1.0,<1.2.0` | interne au dépôt [facts:deps.runtime.3.version] |

Trois dépendances externes seulement : la surface d'attaque et le risque de conflit de versions sont faibles pour un projet de cette taille [facts:deps.runtime].

La vraie dépendance est `langchain-core`, borné à la majeure 1 : votre montée vers `langchain-core` 2 sera conditionnée par le calendrier de LangChain, pas par le vôtre [facts:deps.runtime.0.version].

Pas de manifeste racine, chaque paquet a son `pyproject.toml` et son `uv.lock` versionné (712 Ko pour le cœur) : les versions sont verrouillées, reproductibles, et montées par lots [facts:risks.2.note] [src:tree.md].

Dette relevée dans le code : quatre TODO structurels sur le cœur — signatures `config`/`store` à remplacer par un argument de contexte dans `graph/_node.py`, gestionnaire de contexte du `runtime.py`, paramètre `exiting` explicite dans `pregel/_loop.py` — plus un `# TODO: add more tests` dans `tests/test_algo.py` [src:todo.md].

Donnée non relevée : les dépendances transitives et les alertes de vulnérabilité ; à vérifier dans https://github.com/langchain-ai/langgraph/security.

> Six dépendances à l'exécution dont trois internes : la dette n'est pas dans les paquets, elle est dans le couplage à `langchain-core` [facts:deps.count] [facts:deps.runtime.0.version].

## Quels risques ?

<!-- chart: risks -->

Quatre risques ont été évalués, un seul sort du vert [facts:risks].

| Risque | Niveau | Constat | Parade |
|---|---|---|---|
| Licence | faible | MIT, produit fermé autorisé [facts:risks.0.note] | garder la mention de copyright |
| Sécurité | moyen | pas de SECURITY.md [facts:risks.1.note] [facts:risks.1.level] | passer par le support de l'éditeur |
| Dépendances | faible | 6 à l'exécution, `uv.lock` versionné [facts:risks.2.note] | épingler le cœur, rejouer vos tests |
| Intégration continue | faible | 17 workflows, actions épinglées par SHA [facts:risks.3.note] | aucune, c'est un point fort |

Deux risques absents de cette grille pèsent plus lourd pour une mise en production.

**Concentration humaine, niveau élevé.** Bus factor de 4, aucun CODEOWNERS : la parade est interne — une compétence maison sur le cœur et la capacité à tenir un fork temporaire [facts:activity.bus_factor] [facts:business.codeowners].

**File d'attente du support, niveau élevé.** 528 tickets ouverts contre 7 refermés en trente jours, 245 propositions en attente : budgétez votre propre support plutôt que d'attendre l'amont [facts:issues.open] [facts:issues.closed_30d] [facts:pulls.open].

Les tickets les plus discutés sont des sujets de production : réexécution silencieuse d'appels longs depuis un checkpoint, ordre de persistance non garanti en `durability="sync"` [gh:https://github.com/langchain-ai/langgraph/issues/7417] [gh:https://github.com/langchain-ai/langgraph/issues/8039].

> Le code et la licence ne posent pas de problème ; ce sont l'absence de canal de sécurité, quatre porteurs et 528 tickets ouverts qui doivent entrer dans votre plan [facts:risks.1.level] [facts:activity.bus_factor] [facts:issues.open].

## Adopter, contribuer ou forker ?

**Adopter** est le choix par défaut, et il est peu risqué juridiquement : MIT, `pip install -U langgraph`, cœur en 1.x donc engagement de stabilité de l'interface [facts:repo.license] [facts:build.install] [facts:releases.2.name].

Le coût d'adoption réel n'est pas l'installation mais l'exploitation : les trois tickets les plus lourds portent sur la sémantique de reprise après panne, exactement ce que vous achetez en choisissant ce framework [gh:https://github.com/langchain-ai/langgraph/issues/8039].

**Contribuer** est possible mais lent : 245 propositions de changement sont ouvertes, dont des correctifs sur le cœur toujours en attente, et aucun ticket n'est étiqueté « bonne première contribution » [facts:pulls.open] [facts:roadmap.open_prs.7.title] [facts:issues.good_first].

Le dépôt est en revanche bien outillé pour contribuer vite, y compris avec des agents : `AGENTS.md`, `CLAUDE.md` et `docs/llms.txt` sont présents, et deux workflows imposent le format des propositions et le lien vers un ticket [facts:ai_docs.files] [src:tree.md].

**Forker** ne se justifie pas : rattraper 112 modifications par trimestre sur neuf paquets coûte plus cher qu'un correctif ciblé remonté en amont [facts:activity.commits_per_week] [facts:tree.10.role].

La demande de la communauté dessine la trajectoire, et elle est alignée avec des besoins d'entreprise : preuves auditables de fin d'exécution (64 échanges), exemple de validation humaine en environnement réglementé, interception des appels d'outil avant exécution pour appliquer une politique [facts:roadmap.requests.0.comments] [gh:https://github.com/langchain-ai/langgraph/issues/7844] [gh:https://github.com/langchain-ai/langgraph/issues/7687] [gh:https://github.com/langchain-ai/langgraph/issues/8102].

Donnée non relevée : aucune feuille de route publiée ni jalon daté [facts:roadmap.themes] ; à suivre dans https://github.com/langchain-ai/langgraph/milestones.

> Adopter en épinglant, contribuer en ciblé, ne pas forker : le dépôt absorbe mal les contributions mais l'amont va dans votre sens [facts:pulls.open] [facts:roadmap.requests.0.comments].

## Décision

1. **Adopter, en épinglant le cœur.** Figez `langgraph` 1.2.11 et le checkpointer, rejouez vos tests à chaque montée : 23 des 33 intégrations du mois sont des bumps, le flux est constant [facts:releases.2.name] [facts:pulls.merged_30d].
2. **Budgéter le support en interne.** 528 tickets ouverts pour 7 refermés en trente jours : personne ne corrigera votre incident à votre place [facts:issues.open] [facts:issues.closed_30d].
3. **Une compétence maison sur `pregel/`.** Bus factor de 4, aucun CODEOWNERS : il faut une personne capable de lire le cœur et de tenir un fork temporaire six semaines [facts:activity.bus_factor] [facts:business.codeowners].
4. **Deux points à instruire avant la production.** L'ordre de persistance en `durability="sync"` et la perte possible d'une exécution avant le premier checkpoint durable conditionnent votre promesse de reprise [gh:https://github.com/langchain-ai/langgraph/issues/8039] [gh:https://github.com/langchain-ai/langgraph/issues/8764].
5. **Un point de vigilance non technique.** Aucun canal de divulgation de faille n'est publié : décidez dès maintenant par où vous signalerez une vulnérabilité [facts:risks.1.note].
