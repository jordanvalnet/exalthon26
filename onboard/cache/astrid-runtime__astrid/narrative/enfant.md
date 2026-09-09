---
repo: astrid-runtime/astrid
profile: enfant
generated_at: 2026-09-09T16:20:00Z
---
# Astrid, une maison avec des portes qui ferment à clé pour les programmes

## C'est quoi, ce projet ?
Astrid, c'est un programme qui fait tourner d'autres programmes. Ses créateurs disent qu'il est « portable » et « sécurisé » : il marche sur plusieurs ordinateurs et il surveille ce que les autres programmes ont le droit de faire [facts:repo.description].
Imagine une grande maison. Chaque petit programme a sa chambre, et chaque chambre a une porte qui ferme à clé. Un programme ne peut entrer dans une autre chambre que s'il a la clé. Les créateurs appellent ces petits programmes des « capsules » et les clés des « capacités » [src:readme.md].
Pourquoi ? Parce qu'aujourd'hui on fait travailler des intelligences artificielles (des IA) sur nos ordinateurs. Une IA peut décider de faire des choses. Mais lui dire « sois sage » ne suffit pas. Astrid, lui, ne la laisse pas ouvrir les portes qu'elle n'a pas le droit d'ouvrir [src:readme.md].
Pour l'instant, Astrid tourne sur les Mac et sur Linux. Le rêve des créateurs, c'est d'en faire plus tard un vrai système complet pour ordinateur, comme Windows ou macOS [src:readme.md].

## Qui s'en sert et pour quoi faire ?
Ce sont surtout des gens qui fabriquent des programmes : ils s'en servent pour construire des robots-assistants (des IA qui font des tâches), des outils ou des services. Astrid leur donne la maison avec les portes, et ils choisissent eux-mêmes qui habite dedans [src:readme.md].
C'est comme une boîte de Lego : Astrid donne la plaque de base et les règles d'emboîtement, mais il ne décide pas ce que tu construis. Le mode d'emploi dit même qu'Astrid « ne choisit pas de produit » pour toi [src:readme.md].
On peut l'installer sur un Mac ou un Linux en quelques lignes, et on peut lui demander des choses en écrivant, par exemple « résume ce qui a changé » [src:readme.md].
Combien de personnes s'en servent vraiment ? Le cache ne contient pas ce chiffre ; à vérifier sur https://github.com/astrid-runtime/astrid. Ce qu'on sait : 10277 personnes ont mis une étoile au projet (un « j'aime » sur GitHub) [facts:repo.stars] et 137 en ont fait leur propre copie pour bricoler dessus [facts:repo.forks].

## Combien de personnes le fabriquent ?
<!-- chart: contributors -->
Sur les 12 dernières semaines, presque tout le travail vient d'une seule personne : joshuajbouw a fait 309 envois de code [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits]. Un « envoi de code » s'appelle un commit : c'est comme sauvegarder ta partie dans un jeu vidéo, avec un petit mot qui dit ce que tu as changé.
Deux autres ont aidé un peu : jvsteiner avec 7 commits [facts:activity.contributors.1.commits] et Copilot avec 3 commits [facts:activity.contributors.2.commits].
C'est comme un gâteau fait presque entièrement par un seul pâtissier, avec deux amis qui ont ajouté trois cerises. Les développeurs appellent ça un « bus factor » de 1 : si cette personne s'arrête, le projet s'arrête presque [facts:activity.bus_factor].
Le pâtissier travaille beaucoup : entre 16 et 41 commits chaque semaine [facts:activity.commits_per_week.2.count] [facts:activity.commits_per_week.0.count]. Le dernier commit date du 9 septembre 2026, le jour même de cette fiche [facts:activity.last_commit].

## Comment on fabrique un logiciel à plusieurs ?
Un logiciel, c'est plein de fichiers rangés dans des dossiers, comme un grand classeur. Pour Astrid, le gros du code est dans le dossier `crates`, découpé en 33 boîtes, une par morceau du programme [facts:tree.18.role] [src:tree.md].
Pour travailler à plusieurs sans se marcher dessus, il y a des règles écrites dans un fichier, `CONTRIBUTING.md` [facts:tree.8.role]. Par exemple : avant de changer quelque chose, on ouvre d'abord un « ticket » (une issue) pour en parler, et on signe ses commits [src:readme.md].
Quand quelqu'un propose un changement, des robots vérifient tout automatiquement : le dossier `.github` contient 20 chaînes de vérification [facts:tree.4.role]. C'est comme un contrôle de qualité à la sortie d'une usine de jouets.
Il y a aussi un dossier `e2e` pour tester le programme de bout en bout [facts:tree.20.role] et un dossier `fuzz` qui lui envoie n'importe quoi pour voir s'il résiste [facts:tree.21.role].
Ça bouge beaucoup : 192 tickets sont ouverts [facts:issues.open], 149 ont été réglés en 30 jours [facts:issues.closed_30d] et 24 propositions de changement attendent [facts:pulls.open]. Chaque changement accepté est noté dans un journal, `CHANGELOG.md`, qui fait déjà 410 Ko de texte [facts:tree.7.role].

## Une chose étonnante sur ce projet ?
Le projet est tout jeune : il est né le 15 février 2026 [facts:repo.created_at]. En moins de sept mois, 10277 personnes lui ont donné une étoile [facts:repo.stars]. C'est comme si un nouveau à l'école avait dix mille amis avant la fin de l'année.
Encore plus drôle : Astrid sert à empêcher les IA de faire n'importe quoi sur ton ordinateur [src:readme.md]. Et pourtant, une IA, Copilot, a elle-même ajouté 3 commits au projet [facts:activity.contributors.2.login] [facts:activity.contributors.2.commits]. Le gardien a été un peu construit par ceux qu'il surveille.
Une dernière : tout ça est presque l'œuvre d'une seule personne [facts:activity.bus_factor], mais le projet a déjà un numéro de version qui ressemble à une date, `v2026.9.0`, sorti le jour de cette fiche [facts:releases.0.tag] [facts:releases.0.date].
