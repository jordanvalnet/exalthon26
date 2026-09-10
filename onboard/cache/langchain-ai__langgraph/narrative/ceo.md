---
repo: langchain-ai/langgraph
profile: ceo
generated_at: 2026-09-10T14:05:00Z
---
# LangGraph : le socle sur lequel des entreprises font tourner leurs agents IA, très adopté, très vivant, tenu par peu de monde

## Que fait ce projet, en une phrase, et pour qui ?

LangGraph permet de construire des agents IA qui travaillent longtemps : ils s'arrêtent, attendent qu'une personne valide, encaissent une panne, puis repartent exactement où ils en étaient [src:readme.md].

Le projet se résume lui-même en trois mots : « Build resilient agents », construire des agents résilients [facts:repo.description].

L'image la plus juste : le modèle d'IA est le cerveau, LangGraph est le système nerveux et la mémoire autour. Sans lui, un agent qui plante recommence à zéro ; avec lui, il reprend son travail.

Le public visé n'est pas le grand public mais les équipes techniques qui mettent des agents en production. Sa page d'accueil cite Klarna, Replit et Elastic parmi les entreprises qui s'en servent [src:readme.md].

C'est un logiciel ouvert et gratuit, sous licence MIT : n'importe quelle société peut l'intégrer dans un produit payant sans redevance ni obligation de publier son propre code [facts:repo.license].

> Ce n'est pas un produit qu'on achète, c'est une fondation gratuite sur laquelle des entreprises construisent leurs agents IA [facts:repo.description] [facts:repo.license].

## Est-ce que ça marche et qui s'en sert ?

41 384 personnes ont mis ce projet en favori et 6 990 équipes en ont pris une copie pour travailler dessus : dans le monde du logiciel ouvert, ces deux chiffres sont l'équivalent d'une part de marché [facts:repo.stars] [facts:repo.forks].

La preuve la plus solide reste la liste des utilisateurs affichés : Klarna, Replit, Elastic, c'est-à-dire des entreprises qui exposent leurs propres clients à cette technologie [src:readme.md].

Le produit est livré au rythme d'une entreprise, pas d'un projet de garage : la version 1.2.11 du cœur date du 11 août 2026 et la dernière livraison relevée du 27 août 2026 [facts:releases.2.name] [facts:releases.2.date] [facts:releases.0.date].

Un numéro de version qui commence par 1 est un engagement public de stabilité : les clients existants ne seront pas cassés sans préavis [facts:releases.2.name].

Le revers de l'adoption : 528 demandes d'aide ou de correction sont ouvertes, contre 7 refermées sur les trente derniers jours [facts:issues.open] [facts:issues.closed_30d]. Le succès arrive plus vite que le service après-vente.

> Adopté par des entreprises qui exposent leurs clients à cette technologie, mais avec une file d'attente de 528 demandes ouvertes [src:readme.md] [facts:issues.open].

## Le projet est-il vivant ?

<!-- chart: commits_per_week -->

Oui, sans ambiguïté : 112 modifications ont été apportées au projet sur les douze dernières semaines [facts:activity.commits_per_week].

La dernière remonte au 9 septembre 2026, soit la veille de ce relevé [facts:activity.last_commit].

Sur trente jours, 33 changements ont été validés et intégrés — corrections, mises à jour de sécurité des briques utilisées, nouvelles fonctions [facts:pulls.merged_30d].

Le rythme est irrégulier : des semaines à 25 et 19 modifications, d'autres à 2 [facts:activity.commits_per_week]. C'est la signature d'une équipe qui livre par vagues, autour des versions, pas d'un projet qui s'essouffle.

> Modifié la veille du relevé, 112 fois en douze semaines : ce projet n'est pas un dépôt abandonné, c'est un chantier permanent [facts:activity.last_commit] [facts:activity.commits_per_week].

## Qui est derrière ?

<!-- chart: contributors -->

Une entreprise, pas un individu : le projet est publié par LangChain Inc, l'éditeur du logiciel LangChain, sous un compte d'organisation [src:readme.md] [facts:repo.owner_type].

Le travail visible reste porté par une petite garde rapprochée : sur les douze dernières semaines, la personne la plus active signe 11 modifications, la deuxième 5 [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits].

Le chiffre à retenir est 4 : quatre personnes suffisent à représenter la moitié du travail de la période [facts:activity.bus_factor]. Si ces quatre-là partent le même trimestre, le rythme s'effondre.

Le projet ne vit pas de dons mais du budget de l'entreprise qui l'édite [facts:business.funding], et personne n'y est nommément désigné responsable d'une partie du travail [facts:business.codeowners].

> Une entreprise finance, mais quatre personnes portent la moitié du travail : la dépendance est humaine avant d'être technique [facts:activity.bus_factor] [facts:business.funding].

## Quels sont les trois risques ?

<!-- chart: risks -->

**Premier risque, la concentration humaine.** Quatre personnes représentent la moitié du travail des douze dernières semaines [facts:activity.bus_factor]. C'est le risque le plus élevé du dossier, et il ne se corrige pas en achetant du logiciel.

**Deuxième risque, la sécurité déclarative.** Le projet ne publie aucune adresse ni procédure pour signaler une faille : un chercheur qui en trouve une n'a pas de canal officiel où l'annoncer discrètement [facts:risks.1.note] [facts:risks.1.level].

**Troisième risque, la file d'attente.** 528 demandes ouvertes pour 7 refermées en trente jours [facts:issues.open] [facts:issues.closed_30d] : si votre équipe rencontre un problème, comptez sur vous-même avant de compter sur une réponse.

Ce qui n'est **pas** un risque, et c'est important de le dire : la licence est permissive et sans piège commercial [facts:risks.0.note], les briques externes utilisées sont peu nombreuses et verrouillées [facts:risks.2.level], et chaque changement passe par des contrôles automatiques avant d'être intégré [facts:risks.3.level].

> Le vrai risque n'est ni juridique ni technique : c'est de dépendre d'un projet que quatre personnes portent à bout de bras [facts:activity.bus_factor] [facts:risks.0.note].

## Qu'en fait-on ?

245 propositions de changement attendent d'être examinées, dont dix ont bougé dans les jours précédant le relevé [facts:pulls.open] [facts:roadmap.open_prs.0.updated_at].

Ce que la communauté réclame le plus fort dit où va le produit, et c'est une bonne nouvelle pour une direction : la demande la plus discutée porte sur la preuve auditable qu'un agent a bien terminé son travail, 64 échanges [facts:roadmap.requests.0.comments] [gh:https://github.com/langchain-ai/langgraph/issues/7844].

Viennent ensuite un exemple de validation humaine adapté aux environnements réglementés [gh:https://github.com/langchain-ai/langgraph/issues/7687] et un mécanisme pour bloquer une action d'agent avant qu'elle ne s'exécute, au nom d'une politique interne [gh:https://github.com/langchain-ai/langgraph/issues/8102].

Traduction : les entreprises qui utilisent ce projet ne demandent plus « est-ce que ça marche », elles demandent « est-ce que je peux le prouver à mon auditeur ». C'est le signe d'un marché qui passe de l'expérimentation à la production.

Donnée non relevée : le projet ne publie pas de feuille de route datée ni de jalons publics [facts:roadmap.themes] ; les intentions se lisent dans les demandes ouvertes, à suivre sur https://github.com/langchain-ai/langgraph/issues.

> Les demandes les plus discutées ne parlent plus de fonctionnalités mais de preuve, de conformité et de contrôle : le marché des agents entre en production [facts:roadmap.requests.0.comments] [gh:https://github.com/langchain-ai/langgraph/issues/7687].

## Ce que je retiens

- **Un standard de fait, gratuit.** 41 384 favoris, 6 990 copies, une licence qui n'impose rien à mon entreprise [facts:repo.stars] [facts:repo.forks] [facts:repo.license].
- **Une technologie mûre et active.** Version 1.2.11, modifiée la veille du relevé, 112 modifications en douze semaines [facts:releases.2.name] [facts:activity.last_commit] [facts:activity.commits_per_week].
- **Une dépendance humaine à surveiller.** Quatre personnes portent la moitié du travail : si nous bâtissons dessus, il faut des compétences internes, pas seulement un contrat [facts:activity.bus_factor].
- **Un support à ne pas attendre.** 528 demandes ouvertes contre 7 refermées en trente jours : le service après-vente, c'est nous [facts:issues.open] [facts:issues.closed_30d].
- **La bonne question à poser à mon équipe technique.** Sommes-nous capables de prouver ce que font nos agents ? C'est exactement ce que la communauté réclame aujourd'hui [facts:roadmap.requests.0.comments].
