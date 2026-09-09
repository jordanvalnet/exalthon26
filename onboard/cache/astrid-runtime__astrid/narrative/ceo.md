---
repo: astrid-runtime/astrid
profile: ceo
generated_at: 2026-09-09T15:40:00Z
---
# Astrid : un socle sécurisé pour faire tourner des agents IA sans leur donner les clés de la maison

## Que fait ce projet, en une phrase, et pour qui ?
Astrid est un système d'exploitation portable et « sécurisé par capacités » pour des logiciels assemblés à partir de briques [facts:repo.description]. L'image métier : un immeuble de bureaux où chaque locataire (un agent IA, un outil) n'a que le badge de sa porte, jamais le passe général [src:readme.md].
Le problème visé est très actuel : les frameworks d'agents font confiance au prompt ; Astrid met la confiance dans le moteur d'exécution, comme un système d'exploitation le fait pour un ordinateur [src:readme.md].
Il s'adresse à ceux qui construisent des systèmes d'agents, des outils, des services ou leur propre distribution ; Astrid ne choisit ni le produit, ni le fournisseur de modèle, ni l'interface [src:readme.md].
Aujourd'hui, c'est un moteur qui tourne sur macOS et Linux ; le cap annoncé est un système d'exploitation autonome, pas encore livré [src:readme.md].
Le projet est ouvert sous licence Apache-2.0, permissive pour un usage commercial [facts:repo.license], porté par une organisation et non un particulier [facts:repo.owner_type].

## Est-ce que ça marche et qui s'en sert ?
Ça se livre : 10 versions récentes sont listées, la dernière, v2026.9.0, datée du 9 septembre 2026 [facts:releases.0.tag] [facts:releases.0.date], après une série 0.9 puis 0.10 en juillet [facts:releases.4.tag] [facts:releases.9.date]. Trois « canaux » (stable, nightly, dev) existent, comme des rayons « produit fini », « bêta » et « labo » [facts:releases.5.name].
L'intérêt est réel : 10 277 étoiles GitHub, l'équivalent de « j'aime », et 137 copies du projet par des tiers [facts:repo.stars] [facts:repo.forks].
La demande est soutenue : 192 tickets ouverts et 149 fermés sur les 30 derniers jours [facts:issues.open] [facts:issues.closed_30d], ce qui ressemble à un service client qui répond vite.
Point d'attention : 42 tickets étiquetés « bug » et 46 étiquetés « sécurité » [facts:issues.by_label.bug] [facts:issues.by_label.security], pour un produit dont la promesse est justement la sécurité.
Le cache ne contient pas de liste d'utilisateurs ou de clients nommés ; à vérifier sur https://github.com/astrid-runtime/astrid et dans le Book cité par la documentation [src:readme.md].

## Le projet est-il vivant ?
<!-- chart: commits_per_week -->
Oui, nettement. Sur les 12 dernières semaines, chaque semaine compte entre 16 et 41 modifications enregistrées [facts:activity.commits_per_week.0.count] [facts:activity.commits_per_week.2.count], sans semaine creuse [facts:activity.commits_per_week].
La dernière modification date du 9 septembre 2026, le jour même de cette analyse [facts:activity.last_commit]. Le projet n'est pas archivé [facts:repo.archived].
Le rythme des versions le confirme : quatre versions 0.10.x en quatre jours mi-juillet [facts:releases.1.date] [facts:releases.4.date], puis une version majeure début septembre [facts:releases.0.date].
Le projet est jeune : créé le 15 février 2026 [facts:repo.created_at], il a moins de sept mois.

## Qui est derrière ?
<!-- chart: contributors -->
Une organisation GitHub, astrid-runtime [facts:repo.owner_type] [facts:repo.full_name], mais dans les faits une seule personne : joshuajbouw signe 309 des modifications des 12 dernières semaines, le deuxième contributeur en signe 7 et un assistant automatique 3 [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.contributors.2.commits].
Le « bus factor » est de 1 : si cette personne s'arrête, le projet s'arrête [facts:activity.bus_factor]. C'est une entreprise à un seul salarié clé.
Côté gouvernance, les bons réflexes sont là : une politique de sécurité publiée et des responsables de code désignés [facts:business.security_policy] [facts:business.codeowners].
Aucun financement déclaré (pas de sponsors, pas de page de dons) [facts:business.funding]. Le cache ne contient pas de liste de concurrents ; à vérifier dans facts.json, bloc business.competitors.

## Quels sont les trois risques ?
<!-- chart: risks -->
Risque 1, élevé : la dépendance à une personne. Un seul contributeur porte la moitié des modifications sur 12 semaines [facts:risks.1.level] [facts:risks.1.note]. Un départ, une maladie, et il n'y a plus de pilote.
Risque 2, moyen : les fournisseurs techniques. Le projet s'appuie sur 90 briques externes ; le nombre de briques indirectes n'a pas été relevé [facts:risks.2.level] [facts:risks.2.note]. Comme une chaîne d'approvisionnement, chaque maillon peut casser.
Risque 3, à surveiller : la maturité. 46 tickets portent l'étiquette sécurité et 91 « à concevoir » [facts:issues.by_label.security] [facts:issues.by_label.needs-design], signe d'un produit encore en construction.
Ce qui rassure : licence permissive, risque faible [facts:risks.0.level], et une chaîne de contrôle automatique très fournie, 20 procédures de vérification, risque faible [facts:risks.3.level] [facts:risks.3.note].

## Qu'en fait-on ?
La direction est lisible dans les demandes : les chantiers les plus discutés visent un « système universel » (campagne os-universal) et une « Station » de distribution de briques [facts:roadmap.requests.0.labels.0] [facts:roadmap.requests.1.labels.0], avec en tête un ticket de qualification Linux à 29 commentaires [facts:roadmap.requests.0.comments].
10 propositions de changement sont en attente, dont 7 encore en brouillon [facts:roadmap.open_prs] [facts:roadmap.open_prs.2.draft] ; deux sont des mises à jour automatiques de fournisseurs [facts:roadmap.open_prs.0.title] [facts:roadmap.open_prs.1.title]. Une prépare Windows [facts:roadmap.open_prs.3.title].
Le cache ne contient pas de jalons datés ni de synthèse par thème (roadmap.themes est vide, roadmap.milestones absent) ; à vérifier sur https://github.com/astrid-runtime/astrid/milestones.
Décision proposée : ne pas miser dessus seul aujourd'hui, l'observer trois mois. À suivre : le bus factor [facts:activity.bus_factor], l'arrivée d'un financement [facts:business.funding] et la fermeture des 46 tickets sécurité [facts:issues.by_label.security].
