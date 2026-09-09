# Vue d'ensemble d'accueil — exalthon26

> Préparé le 9 septembre 2026 pour un lecteur non technique, à partir du dépôt GitHub **jordanvalnet/exalthon26** (https://github.com/jordanvalnet/exalthon26), en utilisant uniquement les outils MCP GitHub. Préparé par radomd92.

## En une minute

- **Ce que c'est** : « Onboard », un assistant d'intelligence artificielle qui lit n'importe quel projet GitHub et en tire une présentation adaptée à la personne qui la lit (développeur, testeur, directeur technique, dirigeant, investisseur, enfant), puis répond aux questions en citant ses sources.
- **Qui l'a fait** : l'équipe eXaltemps, sur le compte GitHub personnel de jordanvalnet (auteur de 11 des 13 modifications) ; trois personnes ont un accès en écriture.
- **Pourquoi il existe** : la documentation ne l'explique pas ; notre lecture : c'est la réponse d'une équipe au hackathon « Agent + MCP GitHub » du 9 septembre 2026.
- **Comment il est construit** : un petit outil écrit en JavaScript, qui parle à GitHub par un connecteur standard (MCP) et s'utilise depuis un assistant de code ; deux dossiers seulement, dont un de tests.
- **Ce qu'il coûte / optimise** : rien n'est documenté sur le prix, les coûts de fonctionnement, le financement ni les objectifs d'optimisation ; aucune licence n'est déposée, donc tous droits réservés par défaut.
- **Santé aujourd'hui** : prototype né le jour même ; 13 modifications par 2 personnes en 90 jours, dernière il y a quelques heures, aucune version publiée, 1 ticket ouvert (utilisé comme canal de discussion), 1 changement proposé et accepté.


## 1. Que fait ce projet ?

Description GitHub : « Hackathon eXaltemps 2026 : agent + MCP GitHub »

En une phrase : le projet, baptisé **Onboard**, est un agent (un programme d'intelligence artificielle qui agit seul, par étapes) qui parcourt n'importe quel dépôt GitHub et fabrique une présentation d'accueil sur mesure pour la personne qui le découvre.

Le problème visé, d'après la documentation : comprendre rapidement un projet informatique inconnu. Pour cela, l'agent se connecte à GitHub grâce au « MCP GitHub » (un connecteur standardisé qui permet à une IA d'utiliser un service comme GitHub), se constitue un « cache documentaire » (une mémoire locale de tout ce qu'il a lu) et en tire un « deck » (un jeu de diapositives) adapté au profil du lecteur : développeur, testeur (qa), directeur technique (cto), dirigeant (ceo), investisseur ou enfant. Il répond ensuite aux questions en citant ses sources. L'utilisateur le lance depuis son assistant de code, par une simple commande où il indique le projet et son profil.

Une analogie : c'est un guide de musée qui visite d'abord toutes les salles seul, prend des notes, puis vous fait la visite dans les mots qui vous conviennent, en vous montrant d'où vient chaque information.

La documentation décrit aussi un second volet : un « chat d'équipe » qui permet aux assistants IA des six développeurs de l'équipe de se parler entre eux via GitHub (voir le ticket #1 en section 7.1).

Ce projet a été réalisé par l'équipe eXaltemps pour le hackathon (concours de programmation sur un temps court) « Agent + MCP GitHub » du 9 septembre 2026. La documentation renvoie vers des consignes du jury et une liste de dépôts cibles, que les collecteurs n'ont pas lus.

Formule du projet, dans ses propres mots : « Onboard : agent d'onboarding multi-profils sur n'importe quel repo GitHub ».


## 2. Qui est derrière ?

| | |
|---|---|
| Propriétaire | [jordanvalnet](https://github.com/jordanvalnet) — un compte individuel |
| Premier auteur vu | loic.vyncke (27 août 2026) |
| Auteur le plus récent | jordanvalnet (9 septembre 2026) |
| Principaux contributeurs (13 dernières modifications) | jordanvalnet (11), loic.vyncke (2) |
| Collaborateurs ayant accès | radomd92, jordanvalnet, Sacane |
| Licence | _aucun fichier de licence → tous droits réservés par défaut_ |

Le dépôt appartient à **jordanvalnet**, un compte GitHub personnel (pas une organisation). Le plus ancien enregistrement de modification est signé **loic.vyncke**, le 27 août 2026 ; les 13 modifications de l'historique ont toutes été vues, le chiffre est donc exact et non approximatif. Le contributeur de loin le plus actif est jordanvalnet (11 modifications sur 13), qui a aussi fait la plus récente, le 9 septembre 2026. Trois personnes ont un accès en écriture au projet : radomd92, jordanvalnet et Sacane. Aucun fichier d'auteurs ni mention de droit d'auteur n'a été trouvé.

Notre lecture : le dépôt a été créé sur GitHub le 9 septembre 2026 alors que la première modification date du 27 août ; le travail a probablement commencé ailleurs avant d'être déposé ici.

Licence, en clair : il n'y a **pas de fichier de licence**. En l'absence de licence, la règle par défaut s'applique : le code est visible publiquement, mais ses auteurs en conservent tous les droits ; personne d'autre n'est officiellement autorisé à le réutiliser, le modifier ou le redistribuer.


## 3. Pourquoi existe-t-il ?

**La documentation n'explique pas pourquoi le projet a été lancé.** (Aucune section Motivation / Pourquoi / Contexte et aucune phrase explicative n'ont été trouvées dans les fichiers lus.)

Notre lecture, fondée uniquement sur la section 1 : le projet est la réponse d'une équipe à un hackathon dont le thème imposé était « Agent + MCP GitHub » ; le besoin choisi est d'aider n'importe qui à comprendre vite un projet GitHub inconnu.


## 4. Comment est-il réalisé ? (aucune connaissance technique requise)

Langage de programmation principal : **JavaScript**

| Bloc de construction (dossier) | Ce qu'il contient (en clair) |
|---|---|
| src/ | L'atelier principal : le point d'entrée du programme, la commande que l'on tape, la collecte des faits sur GitHub, la connexion à GitHub, la fusion des informations, la mise en forme des résultats et leur vérification. |
| test/ | Le banc d'essai : une vérification automatique de la connexion à GitHub. |

Signaux de livraison : 0 version publiée, 1 branche, 1 étiquette de version (tag), aucun automatisme.

Signaux de qualité : dossier de tests ✅ · guide de contribution — · code de conduite — · politique de sécurité — · licence — · journal des changements — · dossier de documentation —.

**Forme du produit** : un outil en ligne de commande (un programme que l'on lance en tapant une instruction, sans fenêtre ni site web), pensé pour être appelé depuis un assistant de code. Indices utilisés : le langage JavaScript, un descripteur de projet de type Node.js (l'environnement qui fait tourner du JavaScript hors d'un navigateur), un dossier source dont une pièce s'appelle explicitement « ligne de commande », et la documentation qui indique une commande à taper dans l'assistant Claude Code. Il n'y a ni site web, ni application mobile, ni service hébergé sur des serveurs.

**Blocs de construction** : deux dossiers seulement (voir le tableau). Si le projet était une maison, le dossier source serait à la fois la cuisine et la salle à manger — tout s'y fait — et le dossier de tests serait le détecteur de fumée : une seule vérification pour l'instant.

**Technologies, en clair** : écrit principalement en JavaScript (un langage de programmation très répandu, à l'origine celui des pages web). Notre lecture, d'après la forme des fichiers source : l'équipe utilise en fait TypeScript, une variante plus stricte de JavaScript qui aide à éviter des erreurs. Le programme tourne avec Bun (un moteur rapide pour exécuter du JavaScript) et s'appuie sur le connecteur MCP GitHub décrit en section 1.

**Livraison et usage** : aucune version publiée (0 release), une seule branche de travail, une étiquette de version, pas d'emballage en conteneur (pas de Dockerfile) et aucun automatisme de construction ou de test. Le projet s'utilise donc directement depuis son code, en suivant les étapes d'installation du guide de démarrage.

**Qualité et maturité** : il existe un dossier de tests, mais ni guide de contribution, ni code de conduite, ni politique de sécurité, ni licence, ni journal des changements, ni dossier de documentation. Notre évaluation : **prototype**. Preuves : dépôt créé le 9 septembre 2026, 13 modifications en tout (toutes dans les 90 derniers jours), 0 version publiée, dernière modification le 9 septembre 2026, contexte de hackathon sur une journée.


## 5. Que coûte-t-il, et que cherche-t-il à optimiser ?

| Question | Réponse | Source |
|---|---|---|
| Prix pour les utilisateurs | **Non documenté.** Aucune mention de prix ni de tarif dans la documentation lue. Licence : aucune, donc on ne peut pas dire « libre et gratuit » : tous droits réservés par défaut. | — |
| Coût de fonctionnement / infrastructure | **Non documenté.** | — |
| Financement et sponsors | **Non documenté.** Aucun fichier de financement ni mention de sponsor. | — |
| Effort de développement (documenté seulement) | La seule indication est le cadre : « Équipe eXaltemps, hackathon « Agent + MCP GitHub » du 2026-09-09 », c'est-à-dire un projet d'équipe réalisé pour un concours d'une journée. Aucun chiffre d'heures, de personnes ou de budget n'est donné. | README.md |

Vocabulaire d'optimisation trouvé dans la documentation : _aucun_

**La documentation n'indique pas ce que le projet cherche à optimiser.**


## 6. Faits clés

| Créé | Dernière activité | Dernière version | Étoiles | Copies (forks) | Tickets + PR ouverts (≈) | PR ouvertes | Licence | Wiki | Tableaux de projet |
|---|---|---|---|---|---|---|---|---|---|
| 9 septembre 2026 | 9 septembre 2026 | aucune | 0 | 0 | 1 | 0 | aucune | activé | activés |

## 7. L'activité en détail

### 7.1 Tickets (issues) — 1 ouvert, 0 fermé

_Un ticket (issue) est une fiche : un signalement de problème, une question ou une demande. Ce n'est pas forcément un défaut._

**Ouverts (1)**

| # | Titre | Ouvert par | Date | Étiquettes | Commentaires |
|---|---|---|---|---|---|
| #1 | 💬 Chat équipe — canal IA ↔ IA | jordanvalnet | 9 septembre 2026 |  | 8 |

_Fermés : aucun._

Plus ancien ticket ouvert : #1 « 💬 Chat équipe — canal IA ↔ IA » (9 septembre 2026).

Le projet compte **1 ticket ouvert et 0 fermé** ; la liste est complète (aucun plafond atteint). Voir https://github.com/jordanvalnet/exalthon26/issues.

Thèmes : avec un seul ticket et aucune étiquette, on ne peut pas dégager de sujets récurrents. Le seul thème présent est la **coordination de l'équipe** : le ticket ne signale aucun problème, il sert de salon de discussion.

Ticket le plus discuté et plus ancien ouvert (c'est le même) : le ticket #1 n'est pas un défaut mais un **canal de discussion instantanée** entre les assistants IA de l'équipe (et les humains), où « un commentaire = un message », chaque message d'IA commençant par 🤖 ; il totalise 8 commentaires et son auteur demande explicitement de ne jamais le fermer, car c'est le canal.


### 7.2 Changements proposés (pull requests) — 0 ouvert, 0 brouillon, 1 accepté, 0 fermé sans acceptation

_Une pull request (PR) est un changement proposé, en attente de relecture et d'acceptation dans le projet. « Accepté » (merged) veut dire intégré._

| # | Titre | Statut | Auteur | Ouvert | Accepté |
|---|---|---|---|---|---|
| [#2](https://github.com/jordanvalnet/exalthon26/pull/2) | Onboard : workflow agentique, contrat du cache, profils, agents, validations | accepté | jordanvalnet | 9 septembre 2026 | 9 septembre 2026 |

Délai typique d'acceptation : environ 0 jour (médiane). Principaux proposants : jordanvalnet (1).

Une seule proposition de changement à ce jour, et elle a été acceptée ; la liste est complète. Elle vient de **jordanvalnet**, le propriétaire et principal contributeur : les changements sont donc proposés par l'intérieur de l'équipe, pas par des personnes extérieures. Elle a été acceptée **dans la même heure** (ouverte à 14 h 14, intégrée à 14 h 16, heure universelle), ce qui est cohérent avec une petite équipe travaillant en direct pendant un hackathon. Notre lecture : à ce stade, la relecture est très légère ou faite par la même personne.


### 7.3 Versions publiées (releases) — 0

_Une release est une version numérotée et publiée, que les utilisateurs peuvent installer._

_Aucune version publiée._ Il n'y a donc pas de rythme de publication : le projet s'utilise directement depuis son code.

Activité récente : dernière modification le 9 septembre 2026, 13 modifications dans les 90 derniers jours (sur les 13 plus récentes), 2 auteurs distincts. En clair : le projet est **activement travaillé aujourd'hui par deux personnes**, sur une période très courte.

### 7.4 Pages du wiki

Le dépôt a un wiki activé (un espace de pages de documentation libre). **Ses pages ne peuvent pas être listées ni lues avec les outils MCP GitHub disponibles ici.** Consultez-les sur https://github.com/jordanvalnet/exalthon26/wiki.

### 7.5 Tableaux de projet

Des tableaux de projet (des tableaux de suivi de type post-it) peuvent exister. **Ils ne peuvent pas être listés avec les outils MCP GitHub.** Ouvrez https://github.com/jordanvalnet/exalthon26/projects.

Discussions : la fonction « Discussions » (forum) n'est pas activée sur ce dépôt.

### 7.6 Les personnes

D'après les tableaux ci-dessus, approximativement : **jordanvalnet** fait presque tout — 11 modifications sur 13, la seule proposition de changement, le seul ticket ; **loic.vyncke** a signé les 2 premières modifications ; **radomd92** et **Sacane** ont un accès en écriture mais n'apparaissent pas encore dans l'historique vu.


## 8. Glossaire

- **Dépôt (repository)** : le dossier partagé du projet sur GitHub, avec tout son historique.
- **Ticket (issue)** : une fiche (problème, question, demande).
- **Pull request (PR)** : un changement proposé, en attente de relecture.
- **Release** : une version numérotée et publiée.
- **Commit (modification)** : un changement enregistré, avec son auteur et sa date.
- **Branche** : une copie de travail parallèle à l'intérieur du dépôt.
- **Fork** : la copie personnelle du projet faite par quelqu'un.
- **Étoile (star)** : un marque-page ; indicateur approximatif de popularité.
- **Licence** : les règles de réutilisation du projet.
- **Tag (étiquette de version)** : un repère posé sur une modification précise de l'historique.
- **Agent IA** : un programme d'intelligence artificielle qui enchaîne seul plusieurs étapes pour accomplir une tâche.
- **MCP (Model Context Protocol)** : un connecteur standardisé qui permet à une IA d'utiliser un service extérieur, ici GitHub.
- **Hackathon** : un concours de programmation en équipe sur un temps court.
- **Cache documentaire** : la mémoire locale de ce que l'agent a déjà lu.
- **Deck** : un jeu de diapositives.
- **Ligne de commande** : une façon d'utiliser un programme en tapant des instructions, sans fenêtre graphique.
- **JavaScript / TypeScript / Node.js / Bun** : le langage du projet, sa variante plus stricte, et deux moteurs qui l'exécutent hors d'un navigateur.
- **Wiki** : un espace de pages de documentation libre attaché au dépôt.
- **Tableau de projet** : un tableau de suivi des tâches, façon post-it.

## 9. Ce que nous n'avons pas pu vérifier (limites des outils MCP GitHub)

- **motivation / raison d'être du projet** — aucune section Motivation/Pourquoi/Contexte et aucune phrase explicative trouvées dans la documentation lue
- **prix pour les utilisateurs** — aucune mention de prix/coût trouvée dans la documentation lue (licence seulement)
- **coût de fonctionnement / infrastructure** — non documenté
- **financement / sponsors** — aucun fichier de financement ni mention de sponsor trouvés
- **objectifs d'optimisation** — la documentation n'indique pas ce que le projet optimise
- **pages du wiki (liste et contenu)** — le serveur MCP GitHub n'expose aucun outil wiki → https://github.com/jordanvalnet/exalthon26/wiki
- **tableaux GitHub Projects** — le serveur MCP GitHub n'expose aucun outil Projects → https://github.com/jordanvalnet/exalthon26/projects
- **consignes du jury et liste des dépôts cibles** — mentionnées par la documentation mais non lues par les collecteurs (seuls le guide de démarrage et le descripteur de projet l'ont été) → https://github.com/jordanvalnet/exalthon26
- **contenu des 8 commentaires du ticket #1** — non lus (seule la fiche du ticket l'a été) → https://github.com/jordanvalnet/exalthon26/issues/1

## 10. Sources

- listing du dossier racine _(via get_file_contents)_
- README.md _(via get_file_contents)_
- métadonnées de jordanvalnet/exalthon26 _(via search_repositories)_
- description/sujets du dépôt _(via search_repositories)_
- profil de jordanvalnet _(via search_users)_
- 13 modifications les plus récentes _(via list_commits)_
- collaborateurs _(via list_repository_collaborators)_
- dossier racine _(via get_file_contents)_
- dossier src/ _(via get_file_contents)_
- dossier test/ _(via get_file_contents)_
- package.json _(via get_file_contents)_
- versions publiées _(via list_releases)_
- recherche de code « pricing OR price OR cost OR billing » _(via search_code)_
- recherche de code « sponsor OR funding OR donate » _(via search_code)_
- 1 ticket ouvert + 0 fermé _(via list_issues)_
- 1 pull request (tous états) _(via list_pull_requests)_
- 100 modifications les plus récentes _(via list_commits)_
- indicateurs has_wiki / has_projects / has_discussions _(via search_repositories)_
- fiche du ticket #1 _(via issue_read, lecture ciblée complémentaire)_
