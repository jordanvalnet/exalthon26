---
repo: jordanvalnet/exalthon26
profile: ceo
generated_at: 2026-09-10T09:02:17Z
---
# Onboard transforme n'importe quel dépôt GitHub en présentation sur mesure pour six publics : une démonstration de hackathon aboutie, pas encore un produit

## Que fait ce projet, en une phrase, et pour qui ?
Onboard lit un dépôt GitHub, en tire un dossier de faits vérifiés et le résume en une présentation adaptée à la personne qui la lit : développeur, testeur, directeur technique, dirigeant, investisseur, ou même un enfant [src:readme.md].
L'analogie : un cabinet d'audit qui visite l'usine une seule fois, puis rédige six rapports différents, un par lecteur, chaque chiffre renvoyant à sa pièce justificative [src:readme.md].
C'est le livrable d'une équipe du hackathon eXaltemps du 9 septembre 2026, dont le sujet était « agent + MCP GitHub » : faire travailler un assistant IA avec les outils de GitHub [facts:repo.description] [src:readme.md].
Le public visé est double : toute personne qui doit comprendre vite un projet logiciel qu'elle n'a pas écrit, et le jury du hackathon [src:readme.md].
La promesse : rien n'est inventé, chaque chiffre cite sa source, et un guide répond ensuite aux questions à partir du dossier constitué [src:readme.md].
> Un dépôt GitHub entre, six présentations sourcées sortent, une par public : c'est le pitch, et c'est ce que fait le logiciel [src:readme.md].

## Est-ce que ça marche et qui s'en sert ?
Ça marche : le dépôt expose six présentations complètes générées sur un projet extérieur, une par public, chacune avec son PDF à télécharger [src:readme.md].
Mais personne ne s'en sert encore hors de l'équipe : 0 étoile, 0 copie du projet par d'autres comptes, 0 version publiée [facts:repo.stars] [facts:repo.forks] [facts:releases].
L'analogie : un prototype qui tourne en salle de démonstration, sans client, sans catalogue et sans numéro de version [facts:releases] [facts:repo.stars].
Le seul ticket ouvert n'est pas une demande d'utilisateur : c'est le canal de discussion des assistants IA de l'équipe, 22 messages échangés [facts:issues.open] [facts:issues.hot.0.title] [facts:issues.hot.0.comments].
Aucun ticket fermé sur 30 jours, aucune demande étiquetée : il n'y a pas encore de retour du terrain à analyser [facts:issues.closed_30d] [facts:issues.by_label].
> Le produit fonctionne en démonstration ; son usage réel est à zéro, ce qui est normal le lendemain de sa création [facts:repo.stars] [facts:repo.created_at].

## Le projet est-il vivant ?
<!-- chart: commits_per_week -->
Le dépôt a été créé le 9 septembre 2026 et modifié pour la dernière fois le 10 septembre au matin : il a moins de deux jours [facts:repo.created_at] [facts:activity.last_commit].
Sur les 12 dernières semaines, tout s'est joué en une seule : 57 contributions la semaine du hackathon, contre 1 seule sur les onze semaines précédentes [facts:activity.commits_per_week.11.count] [facts:activity.commits_per_week.9.count] [facts:activity.commits_per_week].
L'analogie : un chantier qui a démarré hier et travaille de nuit, pas une usine qui tourne depuis des années [facts:activity.commits_per_week].
Vivant, donc, mais au sens d'un sprint : la vraie question n'est pas « est-ce actif ? » mais « que se passe-t-il la semaine prochaine ? », et le dépôt n'affiche aucun plan [facts:activity.last_commit] [facts:roadmap.themes].
> 57 contributions en une semaine, 1 avant : une intensité de hackathon, pas encore une habitude [facts:activity.commits_per_week.11.count] [facts:activity.commits_per_week.9.count].

## Qui est derrière ?
<!-- chart: contributors -->
Cinq personnes ont contribué, réunies par le hackathon eXaltemps [facts:activity.contributors] [src:readme.md].
Une seule porte l'essentiel : jordanvalnet, 41 contributions, plus que les quatre autres réunies (8, 4, 3 et 2) [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.contributors.2.commits] [facts:activity.contributors.3.commits] [facts:activity.contributors.4.commits].
Le « bus factor » est de 1 : si cette personne s'arrête, la moitié du savoir-faire s'arrête avec elle [facts:activity.bus_factor].
Le dépôt appartient à un compte personnel, pas à une entreprise ; il n'a ni financement déclaré, ni responsables désignés par domaine, ni politique de sécurité [facts:repo.owner_type] [facts:business.funding] [facts:business.codeowners] [facts:business.security_policy].
L'analogie : une start-up de garage où le fondateur écrit l'essentiel du produit, avec quatre coéquipiers de hackathon autour de lui [facts:activity.bus_factor] [facts:activity.contributors.0.commits].
> Cinq contributeurs, un pilier : le projet tient sur une personne [facts:activity.bus_factor] [facts:activity.contributors].

## Quels sont les trois risques ?
<!-- chart: risks -->
Cinq risques sont relevés, deux élevés, deux moyens, un faible ; voici les trois qui comptent pour une direction [facts:risks].
| Risque | Niveau | Ce que ça veut dire pour vous |
|---|---|---|
| Pas de licence | élevé | Personne, ni nous ni un tiers, n'a le droit clair de réutiliser ce code : à régler avant tout usage hors de l'équipe [facts:risks.0.level] [facts:risks.0.note] |
| Une seule personne clé | élevé | La moitié des contributions vient d'une personne ; son départ gèle le projet [facts:risks.2.level] [facts:risks.2.note] [facts:activity.bus_factor] |
| Aucune vérification automatique | moyen | Rien ne contrôle une modification avant qu'elle n'arrive sur la version principale ; chacun vérifie sur sa propre machine [facts:risks.3.level] [facts:risks.3.note] [facts:build.ci] |
Les deux autres : pas de canal pour signaler une faille (moyen), et une dépendance à seulement trois briques extérieures (faible, plutôt une bonne nouvelle) [facts:risks.1.level] [facts:risks.1.note] [facts:risks.4.level] [facts:deps.count].
> Deux risques élevés, tous deux administratifs plutôt que techniques : une licence à choisir, une personne clé à épauler [facts:risks.0.level] [facts:risks.2.level].

## Qu'en fait-on ?
Le dépôt n'affiche aucune feuille de route : pas de proposition de modification en attente, aucun thème de travail étiqueté, et la seule demande ouverte est le canal de discussion de l'équipe, pas une évolution [facts:roadmap.open_prs] [facts:roadmap.themes] [facts:roadmap.requests.0.title].
Le cache ne contient pas de jalons ; à vérifier dans https://github.com/jordanvalnet/exalthon26/milestones [facts:roadmap].
Ce qui existe : une démonstration complète sur un projet extérieur, un rapport de mission, des supports de pitch et une présentation illustrée, autrement dit tout ce qu'il faut pour convaincre un jury [src:readme.md] [facts:tree.8.role] [facts:tree.16.role].
Trois options pour la direction, par ordre d'engagement croissant [facts:roadmap.themes] :
1. Classer comme démonstration de hackathon et en garder l'idée : six publics, une source par chiffre [src:readme.md].
2. L'essayer en interne sur un de nos dépôts : la documentation dit que ça marche sur n'importe quel dépôt GitHub, en quelques minutes [src:readme.md].
3. En faire un produit : cela suppose d'abord une licence, une deuxième personne clé et des vérifications automatiques [facts:risks.0.note] [facts:risks.2.note] [facts:risks.3.note].
> Rien n'est planifié après le hackathon : la suite est une décision de direction, pas une question technique [facts:roadmap.themes] [facts:roadmap.open_prs].

## Ce que je retiens
- Un logiciel qui lit un dépôt GitHub et produit six présentations sourcées, une par public ; la démonstration existe et se télécharge [src:readme.md].
- Une intensité de hackathon : 57 contributions en une semaine, cinq personnes, un dépôt créé le 9 septembre 2026 [facts:activity.commits_per_week.11.count] [facts:activity.contributors] [facts:repo.created_at].
- Zéro usage extérieur pour l'instant : 0 étoile, 0 copie, 0 version publiée [facts:repo.stars] [facts:repo.forks] [facts:releases].
- Deux risques élevés à lever avant d'aller plus loin : pas de licence, une seule personne clé [facts:risks.0.level] [facts:risks.2.level].
- La suite n'est écrite nulle part : à nous de décider si c'est une idée à garder, un outil à essayer ou un produit à financer [facts:roadmap.themes] [facts:business.funding].
