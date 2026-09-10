---
repo: n8n-io/n8n
profile: ceo
generated_at: 2026-09-10T13:50:00Z
---
# n8n : la chaîne de montage des tâches numériques tourne à plein régime — reste à faire valider la licence

## Que fait ce projet, en une phrase, et pour qui ?

n8n est une plateforme qui permet de faire travailler ensemble les logiciels d'une entreprise, et aujourd'hui ses agents IA, sans écrire toute la plomberie soi-même [facts:repo.description] [src:readme.md].

L'image juste est celle d'une chaîne de montage : on pose des postes de travail les uns après les autres — « quand un client remplit ce formulaire, vérifie son dossier, demande l'accord d'un humain, puis crée la facture » — et la chaîne tourne toute seule.

Deux publics : les équipes métier qui composent leur automatisation à la souris sur un canevas visuel, et les équipes techniques qui ajoutent du code quand le cas est particulier [src:readme.md].

L'argument commercial mis en avant est la liberté : plus de 1 500 connexions à des logiciels du marché prêtes à l'emploi, le choix du fournisseur d'IA sans refonte, et l'hébergement chez soi ou en ligne [src:readme.md].

Le marché a répondu : 203 921 personnes ont mis le projet en favori et 60 629 en ont pris une copie pour la leur [facts:repo.stars] [facts:repo.forks] [gh:https://github.com/n8n-io/n8n].

> À retenir : n8n vend du temps d'ingénierie économisé — 1 500 connecteurs déjà écrits que personne n'a plus à écrire [src:readme.md].

## Est-ce que ça marche et qui s'en sert ?

Le produit est livré en continu, pas par grandes vagues annuelles : les dix dernières versions publiées tiennent dans quatre jours, dont cinq le jour même du relevé [facts:releases].

Le service après-vente suit : 300 demandes ont été traitées et fermées en trente jours, pour 375 encore ouvertes [facts:issues.closed_30d] [facts:issues.open].

Les sujets qui font le plus parler viennent d'utilisateurs en production qui montent de version — le plus commenté rassemble 25 messages sur un service de discussion qui ne répond plus après une mise à jour [facts:issues.hot.0.title] [facts:issues.hot.0.comments].

C'est le signe d'une base installée réelle : on ne se plaint d'une montée de version que si l'on s'en sert pour de vrai.

Le nombre d'entreprises clientes, de téléchargements et le chiffre d'affaires ne sont pas des informations publiques du dépôt : non relevé, à demander à l'éditeur ou à chercher sur https://n8n.io.

> À retenir : cinq versions publiées dans la seule journée du relevé, et 300 demandes clôturées en un mois : la machine à livrer fonctionne [facts:releases] [facts:issues.closed_30d].

## Le projet est-il vivant ?

<!-- chart: commits_per_week -->

Oui, et c'est même l'un des rythmes les plus soutenus qu'un projet de cette taille puisse tenir.

Les 500 derniers changements relevés tiennent tous dans les deux dernières semaines : 251 puis 249 [facts:activity.commits_per_week].

Le dernier changement date du jour même du relevé, le 10 septembre 2026 [facts:activity.last_commit] [facts:repo.pushed_at].

Sur les trois derniers jours, 167 propositions de modification ont été relues, validées et intégrées [facts:pulls.merged_30d].

Le dépôt n'est pas archivé : il est en service actif [facts:repo.archived].

Les semaines antérieures aux deux dernières n'ont pas été relevées — les barres à zéro du graphique sont une limite du relevé, pas un arrêt de l'activité ; l'historique complet est visible sur https://github.com/n8n-io/n8n/commits.

> À retenir : 500 changements en deux semaines et le dernier daté du jour du relevé — ce projet ne dort pas [facts:activity.commits_per_week] [facts:activity.last_commit].

## Qui est derrière ?

<!-- chart: contributors -->

Une organisation, pas un individu : le dépôt appartient à une structure constituée, créée en juin 2019, soit plus de sept ans d'existence [facts:repo.owner_type] [facts:repo.created_at].

Le risque de dépendance à une seule personne est faible : il faut réunir 16 personnes différentes pour couvrir la moitié des changements récents [facts:activity.bus_factor].

La charge est partagée : le contributeur le plus actif du relevé pèse 24 changements sur les 500, aucun ne domine [facts:activity.contributors.0.commits] [facts:activity.contributors].

Les réflexes d'entreprise sont en place : une politique de sécurité publiée pour signaler une faille, et des propriétaires désignés par zone du produit, qui doivent relire avant toute intégration [facts:business.security_policy] [facts:business.codeowners].

Aucune page d'appel aux dons n'est déclarée : le projet ne vit pas de la générosité de sa communauté mais d'un modèle commercial, avec des licences entreprise vendues à côté de la version ouverte [facts:business.funding] [src:readme.md].

> À retenir : 16 personnes pour la moitié du travail récent et une entreprise derrière — le projet ne repose pas sur un bénévole isolé [facts:activity.bus_factor] [facts:business.codeowners].

## Quels sont les trois risques ?

<!-- chart: risks -->

Trois points relevés, un seul mérite votre arbitrage.

| Risque | Niveau | Ce que ça veut dire pour vous |
|---|---|---|
| La licence | Moyen | Ce n'est pas une licence ouverte standard : elle limite l'usage commercial et doit passer au juridique [facts:risks.0.note] [facts:repo.license] |
| Les briques externes | Faible | Les composants tiers sont déclarés et verrouillés produit par produit, pas laissés au hasard [facts:risks.1.note] |
| Les contrôles de qualité | Faible | Chaque modification est testée, relue et vérifiée automatiquement avant d'entrer dans le produit [facts:risks.2.note] |

Le seul vrai sujet de direction est donc le premier : « Sustainable Use License » veut dire code visible et auto-hébergeable, mais revente ou intégration dans une offre payante encadrées, avec une licence entreprise à négocier [facts:repo.license] [src:readme.md] [gh:https://github.com/n8n-io/n8n/blob/master/LICENSE.md].

Un quatrième point n'est pas un risque technique mais une charge : 375 demandes ouvertes et 756 propositions de modification en attente, un stock que l'équipe absorbe mais qui ne descend pas [facts:issues.open] [facts:pulls.open].

> À retenir : la seule question qui remonte au comité de direction est juridique, pas technique — faire valider la licence avant d'industrialiser [facts:risks.0.note].

## Qu'en fait-on ?

Ce qui est en cours de construction se lit dans les chantiers ouverts : un moteur d'exécution capable de tenir la charge à grande échelle, la publication maîtrisée des automatisations vers la production, et un constructeur d'applications qui sort n8n de la seule automatisation en coulisses [facts:roadmap.open_prs.0.title] [facts:roadmap.open_prs.3.title] [facts:roadmap.open_prs.7.title].

Les demandes les plus discutées par les utilisateurs portent toutes sur le même terrain : faire dialoguer les agents IA avec les outils de l'entreprise de façon fiable [facts:roadmap.requests.3.title] [facts:roadmap.requests.0.comments].

Autrement dit, l'éditeur et ses utilisateurs poussent dans la même direction : l'IA au travail, pas l'IA en démonstration.

Trois usages se présentent : automatiser un processus interne en quelques jours plutôt qu'en quelques mois, donner aux équipes métier un outil encadré au lieu de tableurs partagés, ou héberger le tout chez soi quand les données ne doivent pas sortir [src:readme.md].

Le calendrier officiel de l'éditeur, ses jalons datés et ses engagements de version ne sont pas publiés dans le dépôt : non relevé, à voir sur https://github.com/n8n-io/n8n/milestones.

> À retenir : les chantiers ouverts et les demandes des utilisateurs convergent sur l'IA mise en production — c'est là que le produit se joue [facts:roadmap.open_prs.0.title] [facts:roadmap.requests.3.title].

## Ce que je retiens

- **Le produit existe et vit** : 500 changements en deux semaines, cinq versions publiées le jour du relevé, dernier changement le jour même [facts:activity.commits_per_week] [facts:releases] [facts:activity.last_commit].
- **L'adoption est massive** : 203 921 mises en favori et 60 629 copies du projet, avec des utilisateurs qui se plaignent des montées de version — donc qui s'en servent en production [facts:repo.stars] [facts:repo.forks] [facts:issues.hot.0.title].
- **L'équipe est solide** : une entreprise, 16 personnes pour la moitié du travail récent, une politique de sécurité et des relecteurs désignés [facts:activity.bus_factor] [facts:business.security_policy] [facts:business.codeowners].
- **Une seule décision à prendre avant d'engager** : faire lire la licence par le juridique, car elle encadre l'usage commercial et prévoit une offre entreprise payante [facts:risks.0.note] [facts:repo.license].
- **Ce que je n'ai pas** : le nombre de clients, le chiffre d'affaires et le calendrier officiel de l'éditeur ne sont pas dans les données publiques du projet [gh:https://n8n.io].
