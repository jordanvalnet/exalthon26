# FAQ

## Q : Quel Python et quel outillage faut-il pour travailler sur le dépôt ? (dev, 2026-09-10)
Python 3.10 ou plus, déclaré par `requires-python = ">=3.10"` dans `libs/langgraph/pyproject.toml`, testé jusqu'à 3.13 d'après les classifiers [src:manifest.md].
Le monorepo se pilote avec uv : `make install` à la racine crée un venv (`uv venv`) et installe chaque lib de `libs/` en editable [src:tree.md] [facts:entrypoints.2.why].
Le build est hatchling, le lint ruff et ty, les tests pytest [src:manifest.md] [facts:tests.framework].
Le job `check-schema` de la CI tourne en Python 3.13 [src:ci.md].

## Q : Comment lancer un seul fichier de test sans toute la suite ? (dev, 2026-09-10)
Dans le dossier de la lib, `TEST=path/to/test.py make test` ; d'autres options pytest peuvent être passées dans la variable `TEST` [src:ai-docs.md].
Exemple pour le cœur : `cd libs/langgraph && TEST=tests/test_algo.py make test`, ce fichier existe [src:todo.md].
La suite complète utilise `pytest-xdist` pour paralléliser et `syrupy` pour les snapshots, avec `--strict-markers --strict-config` [src:tests.md] [src:manifest.md].

## Q : Y a-t-il des issues « good first issue » pour démarrer ? (dev, 2026-09-10)
Non : aucune issue ouverte ne porte cette étiquette, les labels relevés sont `external` (297), `bug` (81) et `internal` (3) [facts:issues.good_first] [facts:issues.by_label.external] [facts:issues.by_label.bug] [facts:issues.by_label.internal].
Le README renvoie au guide de contribution externe, https://docs.langchain.com/oss/python/contributing/overview, pour en trouver [src:readme.md].
Des pistes existent dans le code lui-même : `# TODO: add more tests` dans `libs/langgraph/tests/test_algo.py` et `# TODO: test before and limit params` dans `libs/checkpoint/tests/test_memory.py` [src:todo.md].
Et une correction en une ligne : #8130, coquille « GraphRecusionError » dans une docstring [facts:issues.hot.9.title] [facts:issues.hot.9.url].

## Q : Combien ça coûte, et qu'est-ce qui nous engage juridiquement ? (ceo, 2026-09-10)
Le logiciel est gratuit et sous licence MIT, la plus permissive des licences courantes : on peut l'intégrer dans un produit payant, le modifier et ne rien publier en retour, sans redevance [facts:repo.license] [facts:risks.0.note].
Aucun financement participatif n'est demandé aux utilisateurs : le projet est porté par l'entreprise qui l'édite [facts:business.funding] [src:readme.md].
Le coût réel est ailleurs : les compétences internes pour l'exploiter, et les services payants de l'éditeur (observation et déploiement des agents) proposés autour, qui eux ne sont pas gratuits [src:readme.md].
Ce relevé ne contient aucun tarif : les prix des services associés sont à vérifier sur https://www.langchain.com/langsmith.

## Q : Que se passe-t-il si l'éditeur abandonne le projet ? (ceo, 2026-09-10)
La licence MIT garantit que le code déjà publié reste utilisable pour toujours, même si l'entreprise disparaît : personne ne peut le retirer [facts:repo.license].
Ce qui s'arrêterait, c'est l'entretien : correctifs, mises à jour de sécurité et nouvelles versions, alors que le rythme actuel est de 112 modifications en douze semaines [facts:activity.commits_per_week].
Le risque est mesurable : quatre personnes représentent la moitié du travail de la période [facts:activity.bus_factor], et 6 990 équipes ont déjà une copie du projet, ce qui rend une reprise par la communauté plausible sans la garantir [facts:repo.forks].
La parade habituelle est de figer une version connue et de garder en interne les compétences pour la maintenir.

## Q : Si nous construisons dessus, quel est le principal point de vigilance ? (ceo, 2026-09-10)
Le support : 528 demandes sont ouvertes contre 7 refermées sur trente jours [facts:issues.open] [facts:issues.closed_30d]. Une équipe bloquée doit se débloquer seule.
Les sujets les plus discutés par les utilisateurs sont d'ailleurs des sujets de direction, pas de technique : preuve auditable qu'un agent a terminé son travail [gh:https://github.com/langchain-ai/langgraph/issues/7844], validation humaine en environnement réglementé [gh:https://github.com/langchain-ai/langgraph/issues/7687].
Enfin, aucun canal de signalement de faille de sécurité n'est publié [facts:risks.1.note] : à cadrer avec la sécurité interne avant une mise en production.

## Q : Est-ce que je peux l'utiliser, moi ? (enfant, 2026-09-10)
Oui. Le programme est gratuit et son étiquette MIT dit que n'importe qui a le droit de le prendre et de s'en servir [facts:repo.license].
Il faut savoir écrire des programmes dans un langage qui s'appelle Python : ce n'est pas magique, ça s'apprend, souvent au collège ou tout seul avec des tutoriels [facts:repo.topics].
Tout est rangé ici, ouvert à tout le monde : https://github.com/langchain-ai/langgraph [facts:repo.url].
Et 6 990 équipes en ont déjà pris une copie pour bricoler dessus, donc tu ne serais pas la première [facts:repo.forks].

## Q : Est-ce que le robot peut se tromper ? (enfant, 2026-09-10)
Oui, souvent, et les gens le disent : 528 problèmes sont signalés et attendent une réponse [facts:issues.open].
C'est justement pour ça que LangGraph existe : il permet à un humain d'appuyer sur pause, de regarder ce que l'assistant a en tête et de corriger avant qu'il continue [src:readme.md].
Et le marque-page sert quand ça se passe mal : au lieu de tout recommencer, l'assistant repart de la dernière case réussie [src:readme.md].
Un programme, ça ne devine pas : ça suit le plan qu'on lui a donné, et quand le plan est mauvais, le résultat l'est aussi.

## Q : Pourquoi des gens travaillent gratuitement dessus ? (enfant, 2026-09-10)
Ils ne travaillent pas tous gratuitement : le projet est porté par une entreprise, qui paie des gens pour l'entretenir [facts:repo.owner_type] [src:readme.md].
Elle l'offre parce que plus il y a de monde qui s'en sert, plus elle vend ses autres outils payants autour [src:readme.md].
D'autres personnes, dehors, aident pour de vrai gratuitement : sur les trois derniers mois, une dizaine de personnes ont ajouté des changements [facts:activity.contributors].
On appelle ça un logiciel ouvert : on donne la recette, et tout le monde a le droit de l'améliorer.

## Q : Si nous adoptons LangGraph, à quoi nous lions-nous vraiment ? (cto, 2026-09-10)
À trois dépendances externes seulement à l'exécution — `langchain-core`, `pydantic`, `xxhash` — les trois autres étant des paquets du même dépôt [facts:deps.runtime].
Le vrai lien est `langchain-core`, borné à `>=1.4.7,<2` : votre passage à la majeure suivante dépendra du calendrier de LangChain [facts:deps.runtime.0.version].
La licence, elle, ne vous lie à rien : MIT, intégration dans un produit fermé autorisée sans redevance [facts:repo.license].
Le couplage le plus coûteux n'est pas dans le manifeste : c'est la sémantique de reprise après panne, que vous héritez telle quelle [src:readme.md].

## Q : Pouvons-nous compter sur l'amont pour corriger un incident en production ? (cto, 2026-09-10)
Non. 528 tickets sont ouverts et 7 seulement ont été refermés sur les trente derniers jours [facts:issues.open] [facts:issues.closed_30d].
245 propositions de changement attendent d'être examinées, y compris des correctifs sur le cœur [facts:pulls.open].
Aucun fichier CODEOWNERS ne désigne de responsable par zone, et aucun canal de signalement de faille n'est publié [facts:business.codeowners] [facts:risks.1.note].
Parade : une compétence interne sur `libs/langgraph/langgraph` et la capacité à tenir un fork temporaire [facts:entrypoints.0.path].

## Q : Quelle politique de montée de version adopter ? (cto, 2026-09-10)
Épingler : le cœur est passé de 1.2.9 à 1.2.11 en un mois, et les SDK et checkpointers bougent toutes les deux semaines [facts:releases.8.date] [facts:releases.2.date] [facts:releases.0.date].
Le flux de mises à jour est constant : 23 des 33 intégrations du mois sont des montées de version de dépendances [facts:pulls.merged_30d].
Le numéro de version majeure 1 est un engagement de stabilité de l'interface publique, ce qui rend les montées mineures peu risquées [facts:releases.2.name].
Rejouez votre propre suite à chaque montée : l'intégration continue amont teste huit paquets, pas votre usage [src:ci.md].

## Q : Par où commencer si je n'ai qu'une journée pour qualifier ce projet ? (qa, 2026-09-10)
Par la mesure de couverture : `pytest-cov` est déjà installé, mais aucun rapport ni seuil n'existe en intégration continue [facts:risks.4.note].
Ensuite par les cinq tickets les plus discutés — #7417, #8039, #7714, #8764, #7780 — qui décrivent tous une reproduction précise sur la reprise après panne [facts:issues.hot].
Le point d'entrée local est `make test` à la racine, ou `TEST=path/to/test.py make test` pour un seul fichier [facts:build.test] [src:contributing.md].
Ne relisez pas le moteur : 6 fichiers pèsent l'essentiel de la suite du paquet principal, ils sont déjà massivement couverts [src:tests.md].

## Q : La CI est-elle un filet suffisant pour accepter une montée de version ? (qa, 2026-09-10)
Elle est stricte sur la forme : matrice Python 3.10 à 3.14, dépendances gelées, exécution parallèle, et échec si la suite laisse un fichier derrière elle [src:ci.md].
Elle est muette sur le fond : aucun seuil de couverture, donc « CI verte » ne veut pas dire « chemin testé » [facts:risks.4.note].
Elle filtre aussi par chemins modifiés : un changement hors `libs/` ne déclenche aucun test [src:ci.md].
Conclusion : la CI amont valide le paquet, pas votre usage — rejouez votre propre suite à chaque montée.

## Q : Combien de temps avant qu'un bug que je signale soit corrigé ? (qa, 2026-09-10)
Aucun engagement, et le débit observé invite à la prudence : 528 tickets ouverts, 7 refermés sur trente jours [facts:issues.open] [facts:issues.closed_30d].
Côté correctifs, 245 propositions de changement attendent, et les 33 intégrées du mois sont en large majorité des montées de version automatiques [facts:pulls.open] [facts:pulls.merged_30d].
Un signalement sans exemple copiable-collable ni sortie de `python -m langchain_core.sys_info` ne sera pas traité du tout [src:contributing.md].
Prévoyez donc la parade côté produit : contournement local et, si le sujet est bloquant, une correction portée par vous avec un ticket approuvé au préalable [src:contributing.md].

## Q : Sur quoi porterait exactement l'investissement ? (investisseur, 2026-09-10)
Pas sur ce dépôt : il est sous licence MIT, donc utilisable et revendable gratuitement par n'importe qui [facts:risks.0.note].
Aucun financement n'y est déclaré [facts:business.funding] et le README renvoie la partie payante vers la plateforme d'observabilité et de déploiement de l'éditeur [src:readme.md].
L'actif réel est donc LangChain Inc, société qui construit et contrôle le projet [src:readme.md], le dépôt en étant le canal d'acquisition.
Ce que le dépôt prouve : une position d'infrastructure occupée, 41 386 étoiles et 6 990 forks [facts:repo.stars] [facts:repo.forks]. Ce qu'il ne prouve pas : un euro de revenu.

## Q : Le projet survivrait-il au départ de ses mainteneurs ? (investisseur, 2026-09-10)
Mal à court terme : quatre personnes signent la moitié des changements des douze dernières semaines [facts:activity.bus_factor], la première à elle seule 11 commits contre 5 pour la suivante [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits].
Aucun fichier CODEOWNERS ne désigne de responsable de relecture par zone [facts:business.codeowners] : la connaissance n'est pas répartie par construction.
Ce qui amortit : la licence MIT autorise n'importe qui à reprendre le code [facts:risks.0.note], et 6 990 forks existent déjà [facts:repo.forks].
Ce qui aggrave : 528 tickets ouverts pour 7 refermés en trente jours [facts:issues.open] [facts:issues.closed_30d] — une reprise hériterait d'une dette de support immédiate.

## Q : Que signalent les tickets les plus discutés sur la maturité du produit ? (investisseur, 2026-09-10)
Ils ne parlent plus de fonctionnalités mais de garanties : traçabilité auditable des fins de tâche, 64 commentaires [facts:roadmap.requests.0.title].
Puis de conformité : un exemple de validation humaine pour environnements régulés, 30 commentaires [facts:roadmap.requests.2.title], et un point de validation prêt à l'emploi, 45 commentaires [facts:issues.hot.2.title].
C'est la signature d'un produit passé en production chez des clients sérieux, qui réclament désormais de l'auditabilité.
C'est aussi une feuille de route imposée par le marché plutôt que choisie : la demande est là, la capacité de traitement, elle, ne suit pas [facts:issues.closed_30d].
