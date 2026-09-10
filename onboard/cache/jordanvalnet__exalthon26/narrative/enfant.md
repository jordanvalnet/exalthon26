---
repo: jordanvalnet/exalthon26
profile: enfant
generated_at: 2026-09-10T09:17:51Z
---
# Onboard, c'est un robot qui lit un projet d'ordinateur et t'en fait un livre à ta taille : il marche, il est tout neuf, et il s'est lu lui-même

## C'est quoi, ce projet ?
Onboard est un programme. Tu lui donnes l'adresse d'un projet informatique rangé sur GitHub, et il te fabrique une présentation pour l'expliquer [src:readme.md].
GitHub, c'est une immense bibliothèque en ligne où les gens rangent le code de leurs logiciels, avec l'histoire de tout ce qu'ils ont changé [src:readme.md].
Imagine un guide de musée : il visite le musée pour toi, puis il te raconte ce qu'il y a dedans. Mais il ne raconte pas pareil à un enfant, à un scientifique ou au directeur du musée [src:readme.md].
Onboard fait ça pour six sortes de lecteurs, et l'un d'eux, c'est toi [src:readme.md].
Il a été fabriqué pendant un hackathon, un concours où des équipes créent un logiciel en une journée, le 9 septembre 2026 [facts:repo.description] [facts:repo.created_at] [src:readme.md].
Sa règle numéro un : il n'invente rien. Chaque chiffre qu'il écrit dit d'où il vient [src:readme.md].
> Onboard lit un projet d'ordinateur à ta place et te l'explique avec des mots faits pour toi [src:readme.md].

## Qui s'en sert et pour quoi faire ?
Six sortes de personnes peuvent s'en servir : celui qui écrit le code, celui qui cherche les bugs, le chef des ordinateurs, le patron, celui qui donne de l'argent, et un enfant curieux comme toi [src:readme.md].
Chacun reçoit son propre petit livre, qu'on appelle un deck : les mêmes faits, mais racontés à sa façon [src:readme.md].
C'est comme une recette de gâteau : la même pour tout le monde, mais expliquée avec des dessins à un enfant et avec des grammes précis à un chef pâtissier [src:readme.md].
Après avoir lu son livre, chacun peut poser des questions au guide, qui répond et dit toujours où il a trouvé la réponse [src:readme.md].
L'équipe l'a essayé sur un vrai projet fait par quelqu'un d'autre, et a mis les six livres en ligne pour montrer que ça marche [src:readme.md].
Pour l'instant, c'est surtout l'équipe qui s'en sert : sur GitHub, personne n'a encore mis d'étoile sur le projet, une étoile c'est comme un « j'aime », et personne ne l'a encore copié chez lui [facts:repo.stars] [facts:repo.forks].
> Six lecteurs, six livres, et pour l'instant c'est l'équipe qui l'utilise pour montrer que ça marche [src:readme.md] [facts:repo.stars].

## Combien de personnes le fabriquent ?
<!-- chart: contributors -->
Cinq personnes ont travaillé dessus [facts:activity.contributors].
Une modification enregistrée dans le projet, les informaticiens appellent ça un commit : c'est comme sauvegarder ta partie dans un jeu vidéo, avec ton nom et l'heure [facts:activity.contributors].
Une personne a fait le plus gros du travail : jordanvalnet, avec 41 commits ; les quatre autres en ont fait 8, 4, 3 et 2 [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.contributors.2.commits] [facts:activity.contributors.3.commits] [facts:activity.contributors.4.commits].
Imagine une cabane construite par cinq copains : l'un d'eux a planté presque toutes les planches, les autres ont apporté les clous, la peinture et le toit [facts:activity.contributors.0.commits] [facts:activity.bus_factor].
Si le copain principal partait, la cabane serait dure à finir. Les informaticiens appellent ça le bus factor, et ici il vaut 1 : une seule personne porte la moitié du travail [facts:activity.bus_factor].
Et presque tout a été fait en une seule semaine : 57 commits la semaine du concours, contre 1 seul pendant les onze semaines d'avant [facts:activity.commits_per_week.11.count] [facts:activity.commits_per_week.9.count] [facts:activity.commits_per_week].
> Cinq personnes, mais une seule a fait presque tout : le projet tient sur elle [facts:activity.contributors] [facts:activity.bus_factor].

## Comment on fabrique un logiciel à plusieurs ?
Un logiciel, c'est plein de fichiers rangés dans des dossiers, comme ton cartable avec un cahier pour chaque matière [src:tree.md].
Dans ce projet, il y a 21 cahiers et dossiers au premier niveau [src:tree.md] [facts:tree].
Le dossier src contient le code principal, le vrai moteur, écrit dans un langage qui s'appelle TypeScript ; le dossier test contient les vérifications ; le dossier docs contient les explications [facts:tree.18.role] [facts:tree.19.role] [facts:tree.12.role].
Un fichier s'appelle README : c'est le mode d'emploi, la première page qu'on lit quand on arrive [facts:tree.9.role].
Il y a aussi des consignes écrites pour les robots : les assistants IA de l'équipe lisent le fichier AGENTS.md pour savoir quoi faire et comment se parler [facts:tree.4.role] [src:ai-docs.md].
Tout le monde travaille sur la même copie, rangée sur GitHub, et chaque changement est signé : comme un cahier de classe où chacun écrit son nom à côté de sa ligne [facts:activity.contributors] [facts:activity.last_commit].
Pour discuter, l'équipe et ses robots utilisent une conversation sur GitHub, avec 22 messages échangés [facts:issues.hot.0.title] [facts:issues.hot.0.comments].
> Un logiciel à plusieurs, c'est un cartable bien rangé, une seule copie partagée et un cahier où chacun signe ce qu'il change [src:tree.md] [facts:activity.contributors].

## Une chose étonnante sur ce projet ?
Le projet a été créé le 9 septembre 2026 et son dernier changement date du 10 septembre : tout a été fait en moins de deux jours [facts:repo.created_at] [facts:activity.last_commit].
Sur GitHub, le projet s'appelle exalthon26, et le logiciel qu'il contient s'appelle Onboard [facts:repo.full_name] [src:readme.md].
Le plus étonnant : le livre que tu tiens a été fabriqué par Onboard, en lisant le projet Onboard. Le robot s'est regardé dans le miroir [src:readme.md] [facts:repo.full_name].
Autre chose étonnante : des robots ont travaillé avec les humains. Les assistants IA de l'équipe se parlent entre eux dans la conversation du projet, et chacun de leurs messages commence par 🤖 [src:ai-docs.md] [facts:issues.hot.0.title].
Et une chose qui manque : le projet n'a pas de licence, ce papier qui dit si tu as le droit de le copier ou de le prêter. C'est comme un jouet sans la notice qui dit à qui il appartient [facts:repo.license] [facts:risks.0.note].
> Ce projet s'est expliqué lui-même : le robot s'est regardé dans le miroir [src:readme.md] [facts:repo.full_name].

## Et toi, tu ferais quoi avec ?
- Tu pourrais lui donner l'adresse de ton jeu préféré, s'il est rangé sur GitHub, et lui demander de te l'expliquer en version enfant [src:readme.md].
- Tu pourrais fabriquer le même livre pour ta grande sœur qui code ou pour tes parents : il existe une version pour chacun des six lecteurs [src:readme.md].
- Tu pourrais lui poser des questions après, comme à un guide de musée : il répond et dit toujours où il a trouvé la réponse [src:readme.md].
- Et toi, quelle question tu lui poserais en premier ? [src:readme.md]
