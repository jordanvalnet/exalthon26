---
repo: jordanvalnet/exalthon26
profile: investisseur
generated_at: 2026-09-10T09:48:00Z
---
# Onboard : une preuve de concept de hackathon démontrée en un jour, pas un actif investissable aujourd'hui

## Quel problème et quel marché ?
Le problème adressé : comprendre vite un projet logiciel qu'on n'a pas écrit. Onboard lit un dépôt GitHub, constitue un dossier de faits vérifiés et en tire une présentation pour six publics distincts : développeur, testeur, directeur technique, dirigeant, investisseur, enfant [src:readme.md].
Le marché implicite est celui de la documentation et de l'intégration d'équipe autour de GitHub ; le dépôt ne le chiffre pas : aucune taille de marché, aucun client cible, aucun prix dans la documentation, aucun financement déclaré [src:readme.md] [facts:business.funding].
La promesse différenciante est la traçabilité : chaque chiffre renvoie à sa source, rien n'est inventé, une donnée absente est déclarée absente [src:readme.md].
Le contexte compte : le dépôt est le livrable d'un hackathon d'une journée, le 9 septembre 2026, sur le thème « agent + MCP GitHub » ; il a été créé le jour même [facts:repo.description] [facts:repo.created_at].
> Un problème réel et bien formulé, un marché jamais chiffré : c'est un sujet de hackathon, pas encore un dossier de marché [src:readme.md] [facts:repo.description].

## Quelle traction ?
<!-- chart: releases -->
Traction externe nulle à ce jour : 0 étoile, 0 copie par un autre compte, 0 version publiée, 1 ticket ouvert [facts:repo.stars] [facts:repo.forks] [facts:releases] [facts:repo.open_issues].
Le seul ticket ouvert n'est pas une demande d'utilisateur : c'est le canal de discussion des assistants IA de l'équipe, 22 messages [facts:issues.hot.0.title] [facts:issues.hot.0.comments].
Le logiciel est en version 0.1.0 et déclaré privé dans son manifeste : il n'est pas publié comme paquet installable, il n'a pas de canal de distribution [src:manifest.md].
Ce qui existe comme preuve : six présentations complètes générées sur un projet extérieur, avec leur PDF, exposées dans la documentation [src:readme.md].
Comparaison utile : le dépôt a été créé le 9 septembre 2026 et poussé pour la dernière fois le 10 ; à cette échelle, zéro traction est la norme, pas une anomalie [facts:repo.created_at] [facts:repo.pushed_at].
> Aucune traction mesurable, une démonstration crédible : on évalue une idée prouvée, pas un usage [facts:repo.stars] [facts:releases] [src:readme.md].

## Quelle dynamique ?
<!-- chart: commits_per_week -->
Sur 12 semaines, 57 contributions la semaine du hackathon contre 1 sur les onze semaines précédentes : toute la vie du projet tient dans une semaine [facts:activity.commits_per_week.11.count] [facts:activity.commits_per_week.9.count] [facts:activity.commits_per_week].
Dernière contribution le 10 septembre 2026 au matin, le lendemain de la création [facts:activity.last_commit] [facts:repo.created_at].
Une seule proposition de modification a été fusionnée, le 9 septembre, celle qui a posé l'architecture du pipeline ; aucune n'est en attente [facts:pulls.merged_30d.0.title] [facts:pulls.merged_30d.0.merged_at] [facts:pulls.open].
Aucune feuille de route : pas de proposition ouverte, aucun thème de travail étiqueté, et l'unique demande ouverte est le chat d'équipe [facts:roadmap.open_prs] [facts:roadmap.themes] [facts:roadmap.requests.0.title].
Donnée non relevée : les jalons, le serveur MCP GitHub ne les expose pas ; à vérifier dans https://github.com/jordanvalnet/exalthon26/milestones [facts:roadmap].
> Une intensité de sprint, 57 contributions en une semaine, et rien d'écrit pour la suivante [facts:activity.commits_per_week.11.count] [facts:roadmap.themes].

## Quelle équipe et quelle gouvernance ?
<!-- chart: contributors -->
Cinq contributeurs sur 12 semaines ; l'un d'eux, jordanvalnet, signe 41 contributions, plus que les quatre autres réunis (8, 4, 3 et 2) [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.contributors.2.commits] [facts:activity.contributors.3.commits] [facts:activity.contributors.4.commits].
Le bus factor est de 1 : une seule personne totalise la moitié des contributions ; son départ arrête le projet [facts:activity.bus_factor] [facts:risks.2.note].
L'équipe travaille avec six assistants IA qui se coordonnent par une conversation GitHub : une partie de la production est déléguée à des agents, ce qui explique le rythme et pose la question de ce que l'équipe produit sans eux [src:ai-docs.md] [facts:issues.hot.0.title].
Gouvernance : aucune. Le dépôt appartient à un compte personnel, pas à une société ; pas de responsables désignés par domaine, pas de politique de sécurité, pas de financement déclaré [facts:repo.owner_type] [facts:business.codeowners] [facts:business.security_policy] [facts:business.funding].
Point positif : le savoir-faire est écrit. Consignes pour les agents, prompt de chaque étape, contrat des fichiers et rapport de mission sont dans le dépôt, avec 4 repères de documentation IA sur 7 [facts:ai_docs.score] [facts:ai_docs.max] [facts:tree.8.role] [src:readme.md].
> Une équipe de hackathon, un pilier unique, aucune structure juridique ni gouvernance : rien d'investissable en l'état [facts:activity.bus_factor] [facts:repo.owner_type].

## Quelle concurrence ?
Donnée non relevée : les concurrents, la recherche de projets voisins se fait par thème GitHub et ce dépôt n'affiche aucun thème ; à vérifier sur https://github.com/search?type=repositories avec les mots-clés onboarding, documentation, agent [facts:repo.topics] [facts:business].
Lecture d'analyste, à confirmer : la fonction « lire un dépôt et l'expliquer à un public » est à portée des deux plateformes dont Onboard dépend, l'assistant Claude Code d'un éditeur tiers et le serveur MCP hébergé par GitHub ; le risque est moins un concurrent qu'une absorption par la plateforme [src:readme.md] [src:ai-docs.md].
Ce qui serait défendable : la méthode, validations en code entre chaque étape, cache versionné, six profils décrits en fichiers, plutôt que le code, léger, 3 dépendances dont 1 seule à l'exécution [src:readme.md] [facts:deps.count] [facts:deps.runtime.0.name].
La documentation affirme que les prompts, en texte brut, s'exécutent aussi avec Copilot et Codex : ce qui rend le projet portable le rend aussi facile à copier [src:readme.md].
> Pas de concurrent identifié, pas de barrière non plus : la valeur est dans la méthode et l'équipe, pas dans un actif protégé [facts:repo.topics] [src:readme.md].

## Licence, financement, risques ?
<!-- chart: risks -->
Le dépôt n'a ni fichier de licence, ni fichier de financement, ni politique de sécurité : donnée non relevée pour LICENSE, FUNDING et SECURITY.md parce que ces fichiers n'existent pas dans le dépôt ; à vérifier dans https://github.com/jordanvalnet/exalthon26 [facts:repo.license] [facts:business.funding] [facts:business.security_policy].
Sans licence, personne n'a de droit clair de réutiliser le code, ni un tiers ni un investisseur : la propriété est de fait répartie entre les cinq contributeurs, sans accord écrit dans le dépôt [facts:risks.0.note] [facts:activity.contributors].
| Risque | Niveau | Ce que ça change pour un investisseur |
|---|---|---|
| Pas de licence | élevé | Aucun droit d'usage acquis, propriété intellectuelle non clarifiée [facts:risks.0.level] [facts:risks.0.note] |
| Personne clé unique | élevé | Le projet s'arrête si une personne s'arrête [facts:risks.2.level] [facts:risks.2.note] |
| Pas de vérification automatique | moyen | Qualité dépendante de la discipline de chacun, aucun garde-fou [facts:risks.3.level] [facts:risks.3.note] |
| Pas de canal de signalement de faille | moyen | Aucune posture sécurité formalisée [facts:risks.1.level] [facts:risks.1.note] |
| Dépendances | faible | 3 briques extérieures, dont 1 seule à l'exécution : peu de dette héritée [facts:risks.4.level] [facts:risks.4.note] |
Risque non listé par la collecte : le produit repose sur deux services tiers, Claude Code et le serveur MCP GitHub hébergé, dont le prix et les conditions ne sont pas dans le dépôt [src:readme.md] [src:ai-docs.md].
> Deux risques élevés, tous deux réglables sur le papier : une licence à choisir, une deuxième personne clé à installer [facts:risks.0.level] [facts:risks.2.level].

## Pourquoi oui, pourquoi non ?
Pourquoi oui [src:readme.md] :
- Une idée simple et démontrée : un dépôt entre, six présentations sourcées sortent, exemples téléchargeables à l'appui [src:readme.md].
- Une exécution rapide : 57 contributions en une semaine, cinq personnes, un pipeline complet avec validations en code [facts:activity.commits_per_week.11.count] [facts:activity.contributors] [src:readme.md].
- Une base technique légère, 3 dépendances, 2 fichiers de test, et un savoir-faire écrit plutôt que dans les têtes [facts:deps.count] [facts:tests.files] [facts:ai_docs.score].
Pourquoi non [facts:risks] :
- Zéro usage, zéro version, zéro distribution : 0 étoile, 0 copie, aucune version publiée, manifeste privé [facts:repo.stars] [facts:repo.forks] [facts:releases] [src:manifest.md].
- Pas de licence, pas de société, pas de financement, pas de feuille de route : rien à acheter et personne à qui l'acheter [facts:repo.license] [facts:repo.owner_type] [facts:business.funding] [facts:roadmap.themes].
- Une personne clé, bus factor 1, et une dépendance totale à deux plateformes tierces qui peuvent livrer la même fonction [facts:activity.bus_factor] [src:readme.md].
> Non aujourd'hui : rien n'est faux dans la démonstration, mais aucun des attributs d'un actif n'est là [facts:releases] [facts:repo.license] [facts:activity.bus_factor].

## Thèse en 3 lignes
1. Onboard est une preuve de concept de hackathon réussie : l'idée d'un dépôt qui devient six présentations sourcées est démontrée, pas encore vendue ni utilisée [src:readme.md] [facts:repo.stars] [facts:releases].
2. L'actif réel est une équipe capable de livrer un pipeline complet en une semaine, 57 contributions à cinq, mais qui tient sur une seule personne et n'a ni société ni licence [facts:activity.commits_per_week.11.count] [facts:activity.bus_factor] [facts:repo.license].
3. Verdict : ne pas investir aujourd'hui ; rouvrir le dossier si une licence est choisie, une première version publiée et un second contributeur installé dans la durée [facts:risks.0.level] [facts:releases] [facts:activity.bus_factor].
