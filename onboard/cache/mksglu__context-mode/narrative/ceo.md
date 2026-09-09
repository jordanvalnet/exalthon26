---
repo: mksglu/context-mode
profile: ceo
generated_at: 2026-09-09T15:01:28Z
---
# Context Mode : l'outil qui évite aux assistants IA de saturer leur mémoire, porté par une seule personne

## Que fait ce projet, en une phrase, et pour qui ?
Context Mode est un outil qui se branche sur les assistants de programmation par IA (Claude Code, Copilot, Cursor, Codex et une quinzaine d'autres) pour les empêcher de saturer leur mémoire de travail et pour leur donner une mémoire de session ; le projet annonce 17 plateformes prises en charge [facts:repo.description].
L'analogie : un assistant IA travaille sur un bureau de taille fixe ; chaque document qu'on lui pose prend de la place et, selon les auteurs, au bout de 30 minutes 40 % du bureau est encombré, puis l'assistant oublie ce qu'il faisait pour faire de la place [src:readme.md].
Context Mode range les dossiers dans une armoire à côté et ne pose sur le bureau que la fiche de synthèse : les auteurs mesurent 315 Ko de données ramenés à 5,4 Ko, soit 98 % de place économisée [src:readme.md].
Le public : les développeurs et les équipes qui utilisent ces assistants au quotidien, avec un argument d'abord financier, puisque la place occupée dans cette mémoire est ce que le fournisseur d'IA facture ; l'outil affiche d'ailleurs l'argent économisé par session [src:readme.md].
Le projet est public sur GitHub sous le nom mksglu/context-mode et a été créé le 23 février 2026 [facts:repo.full_name] [facts:repo.created_at].

## Est-ce que ça marche et qui s'en sert ?
Les signaux d'adoption sont massifs pour un projet de six mois : 21 624 étoiles GitHub (l'équivalent d'un « j'aime » laissé par un développeur) et 1 555 copies du projet chez des tiers [facts:repo.stars] [facts:repo.forks].
La vitrine du projet affiche des logos « utilisé dans des équipes chez » Microsoft, Google, Meta, Amazon, Stripe, etc., ainsi qu'une première place sur Hacker News avec plus de 570 points ; ce sont des affirmations des auteurs, sans preuve dans le cache [src:readme.md].
Le cache ne contient pas le nombre d'utilisateurs ni de téléchargements ; à vérifier sur la page npm du paquet [gh:https://www.npmjs.com/package/context-mode].
Côté livraison, 10 versions ont été publiées entre le 1er et le 29 juin 2026, de v1.0.160 à v1.0.169, soit un rythme quasi quotidien [facts:releases.9.date] [facts:releases.0.date] [facts:releases.0.tag].
Le cache ne recense aucune version publiée après le 29 juin alors que le code a bougé jusqu'au 8 septembre ; à vérifier sur la page des versions [facts:activity.last_commit] [gh:https://github.com/mksglu/context-mode/releases].
Côté fiabilité, l'outil est couvert par 255 fichiers de tests automatiques, rejoués sur Windows, macOS et Linux à chaque modification [facts:tests.files] [facts:risks.3.note].
Les utilisateurs sont actifs : 119 tickets ouverts, dont seulement 4 étiquetés comme bugs, et un appel aux bêta-testeurs qui a reçu 154 commentaires [facts:issues.open] [facts:issues.by_label.bug] [facts:issues.hot.0.comments].

## Le projet est-il vivant ?
<!-- chart: commits_per_week -->
Oui : la dernière modification date du 8 septembre 2026, la veille de cette note, et le projet n'est pas archivé [facts:activity.last_commit] [facts:repo.archived].
Le rythme ressemble à celui d'une boutique ouverte toutes les semaines : un pic de 57 modifications fin juin (la semaine des versions en rafale), puis un régime de croisière stable de 9 à 14 modifications par semaine pendant dix semaines [facts:activity.commits_per_week.0.count] [facts:activity.commits_per_week.1.count] [facts:activity.commits_per_week.10.count].
La semaine en cours, entamée depuis deux jours, en compte déjà 2 [facts:activity.commits_per_week.11.count].
Le point d'attention n'est pas l'activité mais l'engorgement : 119 tickets ouverts pour 6 fermés sur 30 jours, et 107 propositions de code en attente [facts:issues.open] [facts:issues.closed_30d] [facts:pulls.open].
Le cache n'a relevé aucune proposition de code fusionnée sur les 30 derniers jours ; à vérifier sur la liste des propositions fusionnées [facts:pulls.merged_30d] [gh:https://github.com/mksglu/context-mode/pulls?q=is%3Apr+is%3Amerged].
Lecture métier : la demande entrante dépasse la capacité de traitement d'une équipe d'une seule personne, voir page suivante [facts:activity.bus_factor].

## Qui est derrière ?
<!-- chart: contributors -->
Derrière le projet, il y a une personne, pas une entreprise : le dépôt appartient à un compte individuel, mksglu, et la licence porte le nom de Mert Koseoglu [facts:repo.owner_type] [facts:activity.contributors.0.login] [src:license.md].
Sur les 12 dernières semaines, cette personne signe 60 modifications ; le deuxième contributeur en signe 6, le troisième 2, et les sept suivants une seule chacun [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.contributors.2.commits] [facts:activity.contributors.3.commits].
Le « bus factor » vaut 1 : une seule personne suffit à totaliser la moitié du travail, comme une PME où un seul salarié détient le savoir-faire [facts:activity.bus_factor].
Le financement déclaré est du mécénat : un lien de dons GitHub Sponsors au nom de mksglu, sans société ni levée de fonds mentionnée dans le cache [facts:business.funding] [src:funding.md].
Un indice de modèle payant existe pourtant : la documentation renvoie vers un tableau de bord hébergé, « Insight », présenté comme un outil d'analyse pour les équipes d'ingénierie, et la licence parle d'une « clé de licence » [src:readme.md] [src:license.md].
Le cache ne contient pas les conditions de ce service hébergé ; à vérifier sur le site du projet [gh:https://context-mode.com/insight].
Autour, une communauté nombreuse mais informelle : un serveur Discord, 154 commentaires sur l'appel à bêta-testeurs, mais aucun responsable désigné par domaine ni politique de sécurité [src:readme.md] [facts:issues.hot.0.comments] [facts:business.codeowners] [facts:business.security_policy].

## Quels sont les trois risques ?
<!-- chart: risks -->
Risque 1, élevé : la dépendance à une seule personne ; le collecteur note qu'un seul contributeur porte la moitié des modifications sur 12 semaines [facts:risks.2.level] [facts:risks.2.note].
Si cette personne s'arrête, le projet s'arrête ; le filet de sécurité, c'est que le code est public et déjà copié 1 555 fois, donc récupérable, mais sans personne pour le maintenir [facts:repo.forks].
Risque 2, moyen : une licence non standard, Elastic License 2.0, qui autorise l'usage interne gratuitement mais interdit de proposer le logiciel à des tiers comme service hébergé et interdit de contourner sa clé de licence [facts:risks.0.level] [facts:repo.license] [src:license.md].
Analogie : une machine qu'on peut utiliser dans son atelier, mais pas louer à des clients ; ce n'est pas de l'open source au sens classique [src:license.md].
Risque 3, moyen : aucun canal déclaré pour signaler une faille de sécurité, alors que l'outil exécute du code et lit tout ce que fait l'assistant [facts:risks.1.level] [facts:risks.1.note].
Deux points rassurants : la chaîne de vérification automatique est jugée à risque faible, et les 15 briques logicielles externes aussi [facts:risks.3.level] [facts:risks.4.level] [facts:deps.count].
À surveiller enfin : un ticket ouvert affirme que les statistiques d'économie affichées par l'outil se contredisent, ce qui fragilise l'argument commercial du « 98 % » [facts:issues.hot.3.title].

## Qu'en fait-on ?
Ce que ça coûte : rien à l'achat, la licence est gratuite pour un usage interne, et l'installation dans Claude Code tient en deux commandes [src:license.md] [src:readme.md].
Ce que ça rapporte : la promesse est une facture d'IA réduite (98 % de données en moins dans la mémoire de l'assistant, selon les auteurs), à confirmer par une mesure chez nous [src:readme.md].
Ce qui arrive : les 10 propositions de code les plus récentes sont des corrections et de la documentation, pas de nouvelles fonctions majeures ; côté demandes, 6 améliorations sont réclamées [facts:roadmap.open_prs.0.title] [facts:roadmap.open_prs.1.title] [facts:roadmap.themes.0.count].
Les tickets les plus discutés portent sur des blocages en usage réel : des assistants qui peuvent rester bloqués des heures, ou un mode de fonctionnement de Claude Code qui bloque l'outil [facts:issues.hot.4.title] [facts:issues.hot.7.title].
Le cache ne contient ni jalons ni feuille de route datée ; à vérifier sur la page des jalons [facts:roadmap.themes] [gh:https://github.com/mksglu/context-mode/milestones].
Recommandation : un pilote sur une équipe volontaire, avec mesure de la facture d'IA avant et après, sans en faire une brique critique tant que le projet repose sur une personne [facts:activity.bus_factor].
Ligne rouge : ne pas intégrer Context Mode dans un produit hébergé vendu à des clients sans avis juridique sur la licence Elastic 2.0 [facts:repo.license] [src:license.md].
