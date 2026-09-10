---
repo: jordanvalnet/code-dev-intel.ts
profile: investisseur
generated_at: 2026-09-10T14:30:00Z
---
# code-dev-intel : un gain mesuré de 13 à 34 % sur la facture d'IA, zéro utilisateur et un seul contributeur — un actif technique, pas encore une entreprise

## Quel problème et quel marché ?
Le problème est un problème de coût : un assistant IA qui travaille sur du code relit des fichiers entiers à chaque question, et chaque relecture se facture en jetons [src:readme.md].
Le produit installe chez le client un service qui répond directement aux questions de structure — où est défini ce symbole, qui l'appelle, quels fichiers cassent si on le change — sans relecture complète du dépôt [facts:repo.description].
La cible annoncée : les équipes qui font travailler des agents IA sur une base TypeScript moyenne ou grande, et qui veulent que leur code ne sorte pas de chez elles [src:readme.md].
La proposition de valeur est donc double, et les deux moitiés sont vendables séparément : moins de jetons consommés, et un index qui reste local plutôt que confié à un service d'indexation distant [src:readme.md].
Ce que le relevé ne dit pas : la taille de ce marché, le prix pratiqué, le moindre client. Le dépôt ne contient aucun élément commercial — ni tarif, ni page produit, ni collecte de fonds déclarée [facts:business.funding].
> Un problème réel et chiffrable — le coût des jetons d'un agent qui relit tout — attaqué par un produit local, sans aucun élément commercial adossé à ce jour [facts:repo.description] [facts:business.funding].

## Quelle traction ?
<!-- chart: releases -->
Nulle, au sens où un investisseur l'entend : 0 étoile et 0 copie du projet, presque six mois après sa création le 20 mars 2026 [facts:repo.stars] [facts:repo.forks] [facts:repo.created_at].
Une seule version a été mise à disposition du public, la v0.1.6 du 26 mars 2026, six jours après l'ouverture du dépôt [facts:releases.0.tag] [facts:releases.0.date].
Or le journal interne du projet est à la version 0.5.0, datée du 4 septembre 2026, plus un lot non publié : cinq mois de travail que personne, dehors, ne peut installer [src:changelog.md].
Côté demande, une seule sollicitation extérieure est ouverte, sans un seul commentaire, et aucune n'a été traitée dans les trente derniers jours [facts:issues.open] [facts:issues.hot.0.comments] [facts:issues.closed_30d].
La seule preuve d'usage disponible est un banc d'essai conduit par l'auteur : sur une base de code de production, 11 agents sur 11 ont choisi l'outil spontanément, pour 13 à 34 % de jetons en moins sur les tâches difficiles, 27 % en moyenne [src:readme.md] [gh:https://github.com/jordanvalnet/code-dev-intel.ts/blob/main/docs/benchmarks/2026-06-07-agent-token-economy.md].
Une mesure interne n'est pas une traction : elle dit que le produit marche, pas que quelqu'un le veut.
> Aucun signal de marché — 0 étoile, 0 copie, 1 version publiée en mars — face à une démonstration technique convaincante mais faite par l'auteur seul [facts:repo.stars] [facts:releases.0.date] [src:readme.md].

## Quelle dynamique ?
<!-- chart: commits_per_week -->
Le projet avance par sursauts : 12 changements relevés sur les douze dernières semaines, dont 11 concentrés dans la seule semaine du 1er septembre, les onze semaines précédentes étant vides [facts:activity.commits_per_week].
Le dernier changement date du 6 septembre 2026, soit quatre jours avant ce relevé : le projet est actif, il n'est pas régulier [facts:activity.last_commit].
Ce qui est sorti lors de ce sursaut est un travail de mise en qualité, pas une nouveauté fonctionnelle : la chaîne de vérification tourne désormais sur les trois systèmes du marché [facts:pulls.merged_30d.0.title].
La file est vide dans les deux sens : aucune proposition de changement en attente, aucun thème récurrent dans les demandes, une seule demande ouverte au total [facts:pulls.open] [facts:roadmap.themes] [facts:roadmap.requests.0.title].
Donnée non relevée : les jalons de planification, à vérifier sur la page des jalons du projet [gh:https://github.com/jordanvalnet/code-dev-intel.ts/milestones].
Lecture d'investisseur : un rythme de projet personnel mené en soirées et en week-ends, cohérent avec un contributeur unique, incompatible avec un engagement de service.
> Onze semaines vides puis onze changements en une semaine : le rythme d'un projet personnel, pas celui d'un produit sous engagement [facts:activity.commits_per_week] [facts:activity.last_commit].

## Quelle équipe et quelle gouvernance ?
<!-- chart: contributors -->
Une personne. Le compte jordanvalnet signe les 12 changements relevés sur douze semaines, et le nombre de personnes qui portent la moitié du travail est de 1 [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.bus_factor].
Le dépôt vit sur un compte personnel, pas sur celui d'une société ni d'une fondation : il n'y a donc, en l'état, aucune structure à laquelle contracter [facts:repo.owner_type].
La gouvernance est vide sur les trois marqueurs habituels : aucun responsable désigné pour le code, aucune politique de sécurité publiée, aucun financement déclaré [facts:business.codeowners] [facts:business.security_policy] [facts:business.funding].
Aucun contributeur extérieur n'est apparu depuis l'ouverture, alors que la procédure de contribution est écrite et publique [facts:activity.contributors] [src:readme.md].
Conséquence directe sur la valorisation : l'actif n'est pas séparable de son auteur. Ce qui s'achète ici est un savoir-faire attaché à une personne, pas une équipe qui continuerait sans elle.
> Un contributeur, un compte personnel, aucun responsable ni financement déclaré : l'actif ne survit pas au départ de son auteur [facts:activity.bus_factor] [facts:repo.owner_type] [facts:business.codeowners].

## Quelle concurrence ?
Donnée non relevée : la liste des projets comparables. Le dépôt ne déclare aucun mot-clé public, ce qui rend l'établissement d'une liste de comparables impossible sans recherche manuelle ; à faire sur la recherche publique de GitHub [facts:repo.topics] [gh:https://github.com/search?q=typescript+code+intelligence+mcp&type=repositories].
Ce que le projet revendique face au marché, c'est le positionnement local : une alternative auto-hébergée aux services d'indexation de code distants, argument de conformité autant que de coût [src:readme.md].
Le vrai concurrent, cependant, n'est pas un produit, c'est le comportement par défaut : la recherche texte et la lecture de fichiers, gratuites et déjà présentes dans tous les assistants.
C'est contre elle que le projet se chiffre, et le chiffre est le meilleur argument du dossier : une sortie environ 72 % plus compacte que son propre format précédent et environ 60 % plus compacte que la recherche texte de référence, sur un symbole à 43 usages [src:readme.md].
Défendabilité : faible sur le principe — l'idée est reproductible par tout éditeur d'outillage IA — et réelle sur l'exécution, la résolution de modules par le compilateur TypeScript et la réutilisation du graphe entre deux sessions représentant plusieurs mois de travail difficile [src:changelog.md].
> La concurrence à battre est la recherche texte gratuite, et le produit la bat sur les jetons ; la barrière n'est pas l'idée, c'est l'exécution [src:readme.md] [src:changelog.md].

## Licence, financement, risques ?
<!-- chart: risks -->
La licence est le point dur du dossier : AGPL-3.0, copyleft, qui oblige à publier son propre code dès lors que le logiciel est intégré à un produit vendu ou simplement exposé en réseau [facts:repo.license] [src:license.md] [facts:risks.0.note].
En usage interne, elle n'a aucune conséquence. Dans une thèse d'investissement qui suppose un produit commercialisé, elle en a une : soit l'auteur, seul détenteur des droits, relicencie, soit la thèse tombe [facts:activity.contributors.0.login].
Aucun financement n'est déclaré et aucune politique de sécurité n'est publiée : le dépôt ne contient ni fichier de financement, ni canal de signalement de faille [facts:business.funding] [facts:business.security_policy].
Deux risques ressortent en rouge — la licence et la dépendance à une seule personne — et un en orange, l'absence de canal de signalement de faille [facts:risks.0.level] [facts:risks.2.level] [facts:risks.1.note].
Les deux risques bas, la chaîne de vérification automatique et les 14 composants extérieurs, sont précisément ceux qui coûtent le plus cher à rattraper après une acquisition, et ils sont déjà tenus [facts:risks.3.level] [facts:risks.4.note].
Les deux risques hauts, eux, ne se règlent pas par du code mais par contrat : une relicence signée et un engagement de l'auteur.
> Deux risques élevés, licence et homme-clé, tous deux réglables par négociation avec une seule personne ; la partie technique, elle, est propre [facts:risks.0.note] [facts:risks.2.note] [facts:risks.3.level].

## Pourquoi oui, pourquoi non ?
Pourquoi oui :
- Le gain est mesuré, pas promis : 13 à 34 % de jetons en moins sur les tâches difficiles, et 11 agents sur 11 qui adoptent l'outil sans qu'on le leur demande [src:readme.md].
- Le marché sous-jacent grandit mécaniquement avec la dépense d'IA des équipes de développement, et le produit attaque directement la ligne de coût [facts:repo.description].
- La qualité d'exécution est vérifiable : contrôles automatiques sur trois systèmes, dépendances tenues, 14 paquets seulement [facts:risks.3.note] [facts:risks.4.note].
- L'angle auto-hébergé répond à une objection de conformité que les indexeurs distants ne peuvent pas lever [src:readme.md].

Pourquoi non :
- Aucune preuve de demande : 0 étoile, 0 copie, 1 demande ouverte sans commentaire, près de six mois après l'ouverture [facts:repo.stars] [facts:repo.forks] [facts:issues.open].
- Un seul contributeur, sur un compte personnel, sans financement ni relais désigné : le risque d'homme-clé est maximal [facts:activity.bus_factor] [facts:repo.owner_type] [facts:business.funding].
- La licence AGPL-3.0 ferme la voie d'un produit vendu tant qu'elle n'est pas renégociée [facts:risks.0.note].
- Le public installe une version de mars quand le travail interne est de septembre : le produit démontré n'est pas le produit livrable [facts:releases.0.date] [src:changelog.md].
> Une technique qui tient et un gain chiffré, en face d'une demande nulle, d'un homme-clé unique et d'une licence fermée : le dossier n'est pas prêt, il est observable [src:readme.md] [facts:activity.bus_factor] [facts:risks.0.note].

## Thèse en 3 lignes
1. **Ne pas investir aujourd'hui.** Le produit fonctionne et le gain est mesuré, mais il n'existe aucune preuve de demande extérieure : 0 étoile, 0 copie, 1 sollicitation sans réponse, presque six mois après l'ouverture [facts:repo.stars] [facts:repo.forks] [facts:issues.open] [facts:repo.created_at].
2. **Trois conditions rendraient le dossier discutable**, dans cet ordre : une version publiée à jour, la 0.5.0 plutôt que la v0.1.6 de mars ; une relicence négociée avec l'auteur, seul détenteur des droits, pour sortir de l'AGPL-3.0 ; et dix utilisateurs extérieurs identifiés [facts:releases.0.tag] [facts:risks.0.note] [facts:activity.contributors.0.login].
3. **Si l'une de ces conditions tombe, ce n'est pas une société qu'on achète mais une personne** : le vrai objet de la transaction est alors un recrutement ou une acquisition d'actif, valorisé comme tel, avec l'auteur engagé et une clause de non-départ [facts:activity.bus_factor] [facts:repo.owner_type].
