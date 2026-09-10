---
repo: mksglu/context-mode
profile: ceo
generated_at: 2026-09-09T16:00:00Z
---
# Context Mode : l'outil qui empêche les assistants de programmation de perdre la mémoire, à essayer en interne, pas à bâtir dessus

## Que fait ce projet, en une phrase, et pour qui ?
Les assistants de programmation par IA ont une mémoire de travail limitée, et chaque outil qu'ils appellent la remplit de données brutes ; Context Mode filtre ces données à la source et annonce jusqu'à 98 % d'économie [facts:repo.description]. C'est comme un assistant qui ne vous apporte que le résumé d'un dossier de 500 pages, et qui garde le dossier sous la main si vous voulez un détail [src:readme.md].

Le public : les équipes qui utilisent un assistant de code comme Claude Code, Codex ou Copilot, sur 17 plateformes annoncées [facts:repo.description]. Le README affiche des logos d'entreprises utilisatrices (Microsoft, Google, Stripe…) ; ces usages ne sont pas vérifiables dans les données relevées, à vérifier dans https://github.com/mksglu/context-mode#readme [src:readme.md].
> Context Mode promet jusqu'à 98 % de mémoire économisée aux assistants de code, sur 17 plateformes [facts:repo.description].

## Est-ce que ça marche et qui s'en sert ?
Signal d'adoption : 21 624 étoiles et 1 555 copies (forks) sur GitHub, pour un projet né le 2026-02-23, soit en un peu plus de six mois [facts:repo.stars] [facts:repo.forks] [facts:repo.created_at]. Le README revendique une première place sur Hacker News [src:readme.md].

Livraisons : 10 versions publiées entre le 2026-06-01 et le 2026-06-29, de la v1.0.160 à la v1.0.169 [facts:releases.9.date] [facts:releases.0.date] [facts:releases.0.tag]. Aucune version relevée après fin juin ; à vérifier dans https://github.com/mksglu/context-mode/releases.

Retours : 119 demandes ouvertes, 6 résolues sur les 30 derniers jours [facts:issues.open] [facts:issues.closed_30d]. La demande la plus commentée (154 commentaires) cherche des beta-testeurs sur 15 plateformes et 3 systèmes [facts:issues.hot.0.title] [facts:issues.hot.0.comments]. Ça marche assez pour attirer, pas assez pour que tout soit traité.
> 21 624 étoiles en un peu plus de six mois : le marché a répondu, mais 119 demandes attendent encore une réponse [facts:repo.stars] [facts:repo.created_at] [facts:issues.open].

## Le projet est-il vivant ?
<!-- chart: commits_per_week -->
Oui, mais il ralentit. Le rythme est passé de 57 modifications en semaine 26 à environ 11 par semaine tout l'été, puis 9 en semaine 36 [facts:activity.commits_per_week]. Dernière modification le 2026-09-08 [facts:activity.last_commit].

Le stock de travail en attente grossit : 107 propositions de changement ouvertes, aucune acceptée sur 30 jours dans les données relevées [facts:pulls.open] [facts:pulls.merged_30d]. Image : un guichet où la file s'allonge parce qu'il n'y a qu'un guichetier.
> Vivant mais au ralenti : de 57 modifications par semaine fin juin à 9 début septembre, avec 107 propositions en attente [facts:activity.commits_per_week] [facts:pulls.open].

## Qui est derrière ?
<!-- chart: contributors -->
Une personne : Mert Koseoğlu, compte `mksglu`, 60 modifications sur 12 semaines, contre 6 pour le deuxième et 1 ou 2 pour les huit suivants [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits]. L'auteur se présente lui-même comme mainteneur solo avec peu de temps [src:contributing.md].

C'est un compte personnel, pas une organisation [facts:repo.owner_type]. Il accepte les dons via GitHub Sponsors [facts:business.funding] [src:funding.md]. Pas de politique de sécurité ni de liste de responsables par zone [facts:business.security_policy] [facts:business.codeowners].
> Un projet à une seule personne : 60 modifications sur 12 semaines pour l'auteur, 6 pour le suivant [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.bus_factor].

## Quels sont les trois risques ?
<!-- chart: risks -->
1. Dépendance à une seule personne, niveau élevé : si l'auteur s'arrête, le projet s'arrête [facts:risks.2.level] [facts:risks.2.note].
2. Licence non standard, niveau moyen : Elastic License 2.0, qui interdit de revendre le logiciel comme service hébergé [facts:risks.0.note] [src:license.md]. Utilisable en interne, pas comme produit.
3. Sécurité, niveau moyen : aucun canal déclaré pour signaler une faille, sur un outil qui exécute du code et lit vos sessions [facts:risks.1.note].

Les deux autres risques suivis, chaîne de livraison et dépendances, sont faibles [facts:risks.3.level] [facts:risks.4.level].
> Le risque numéro un est humain : tout repose sur une seule personne, et la licence interdit d'en faire un service payant [facts:risks.2.level] [facts:risks.0.note] [src:license.md].

## Qu'en fait-on ?
Le carnet de demandes est peu structuré : un seul thème étiqueté, « enhancement », 6 demandes, et aucun jalon planifié [facts:roadmap.themes.0.label] [facts:roadmap.themes.0.count]. Les 10 propositions de changement les plus récentes sont des corrections ciblées (délais, routage réseau, budgets par plateforme) [facts:roadmap.open_prs].

Lecture : un outil utile et populaire, porté par un seul développeur, sous une licence qui bloque toute revente en service. Décision raisonnable : l'essayer en interne sur une équipe, sans en dépendre pour un produit, et surveiller le rythme des versions à trois mois.
> Un essai interne sur une équipe, pas un produit : la licence et la dépendance à une personne l'interdisent pour l'instant [facts:risks.0.note] [facts:risks.2.note].

## Ce que je retiens
- Un vrai problème, une vraie réponse : jusqu'à 98 % de mémoire économisée pour les assistants de code, 21 624 étoiles en un peu plus de six mois [facts:repo.description] [facts:repo.stars] [facts:repo.created_at].
- Une seule personne derrière : 60 modifications sur 12 semaines contre 6 pour le suivant, et 107 propositions de changement en attente [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:pulls.open].
- Une licence qui autorise l'usage interne et interdit la revente comme service hébergé [facts:repo.license] [src:license.md].
- Le rythme baisse : 57 modifications par semaine fin juin, 9 début septembre, et aucune version publiée après le 29 juin dans les données relevées [facts:activity.commits_per_week] [facts:releases.0.date].
- Décision : essai interne sur une équipe volontaire, aucune dépendance produit, et revue du rythme des versions avant tout engagement plus large [facts:risks.2.level] [facts:risks.0.note].
