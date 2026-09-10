## Q : Quelle version de Node dois-je installer pour développer ? (dev, 2026-09-10)
Node 24, comme la majorité des jobs de la CI [src:ci.md].
`engines` du manifeste annonce node >=18, mais c'est la contrainte du paquet compilé pour ses consommateurs, pas celle du poste de dev [facts:risks.4.note] [src:manifest.md].
L'outillage de dev exige node 22+ : vitest 5 et `node --experimental-strip-types`, que `pnpm mcp:start` et le test d'intégration CLI utilisent [facts:risks.4.note] [src:changelog.md].
La CI le dit elle-même : le job Node 20 ne lance pas vitest, il build `dist/` et auto-teste le serveur compilé [src:ci.md].
pnpm est imposé (`packageManager` épinglé dans `package.json`), npm et yarn sont interdits [src:manifest.md] [src:contributing.md].

## Q : Comment brancher le serveur dans mon IDE ou dans Claude Code ? (dev, 2026-09-10)
En stdio : `.vscode/mcp.json` avec `command: pnpm`, `args: ["exec", "code-dev-intel", "--stdio", "--workspaceRoot=${workspaceFolder}"]` [src:readme.md].
En HTTP : `pnpm exec code-dev-intel ensure --workspaceRoot=. --port=4545` démarre le service s'il ne tourne pas, attend `/health`, et sort en succès s'il tourne déjà [facts:build.run] [src:readme.md].
`--workspaceRoot` se passe une fois au démarrage, pas dans chaque appel d'outil ; un worktree git voisin exige `--allowed-workspace-root=<glob>` ou `CODE_INTEL_ALLOWED_WORKSPACE_ROOTS` [src:readme.md].
Les outils `mcp__code-intel__*` peuvent être chargés à la demande par le client (ToolSearch dans Claude Code) ; après une montée de version, reconnecter le serveur pour recharger outils et instructions [src:readme.md].
Le premier appel sémantique construit le programme TypeScript, les suivants sont rapides [src:readme.md].

## Q : Puis-je embarquer ce paquet dans un produit commercial ? (dev, 2026-09-10)
La licence est AGPL-3.0 (`AGPL-3.0-only` dans `package.json`), notée comme risque élevé : copyleft, contraignant pour un usage commercial [facts:repo.license] [src:manifest.md] [facts:risks.0.note].
L'AGPL étend le copyleft au logiciel exposé en réseau : un serveur modifié rendu accessible à des utilisateurs doit publier ses modifications [src:license.md].
Utilisé tel quel comme outil de dev en local, sans redistribution ni modification, l'obligation ne se déclenche pas ; intégré ou modifié dans un produit, c'est une question pour le juridique [src:license.md].
Détail de la licence : https://github.com/jordanvalnet/code-dev-intel.ts/blob/main/LICENSE [gh:https://github.com/jordanvalnet/code-dev-intel.ts/blob/main/LICENSE].

## Q : Combien ça coûte et qu'est-ce que ça rapporte ? (ceo, 2026-09-10)
Le logiciel lui-même est gratuit : c'est un projet ouvert, sans offre payante ni sponsor déclaré [facts:business.funding] [facts:repo.license].
Le coût réel est celui d'une machine qui héberge le service chez vous et du temps d'installation d'une équipe [src:readme.md].
Le gain annoncé est une baisse de consommation des assistants IA de 13 à 34 % sur les tâches difficiles, 27 % en moyenne, mesurée sur une base de code de production [src:readme.md] [gh:https://github.com/jordanvalnet/code-dev-intel.ts/blob/main/docs/benchmarks/2026-06-07-agent-token-economy.md].
Ce chiffre vient de l'auteur du projet, pas d'un tiers : la façon de le vérifier chez vous est de mesurer la facture d'IA d'une équipe un mois avant et un mois après.
Aucun coût d'abonnement, aucun envoi de code à un service extérieur : l'outil s'installe et tourne sur vos machines [src:readme.md].

## Q : Peut-on l'intégrer à notre produit et le vendre ? (ceo, 2026-09-10)
Pas sans décision juridique. La licence est l'AGPL-3.0, classée risque élevé : c'est un copyleft qui s'étend au logiciel simplement exposé sur un réseau [facts:repo.license] [facts:risks.0.level] [facts:risks.0.note].
Concrètement, si vous modifiez l'outil et que vos clients y accèdent, même sans leur livrer de fichier, vous devez publier vos modifications [src:license.md].
Utilisé tel quel, en interne, comme outil de travail de vos équipes, l'obligation ne se déclenche pas [src:license.md].
La bonne séquence est donc : essai interne d'abord, avis juridique ensuite, décision produit en dernier [facts:risks.0.note].

## Q : Que se passe-t-il si la personne qui développe le projet s'arrête ? (ceo, 2026-09-10)
Le projet s'arrête avec elle : un seul contributeur porte la totalité des 12 modifications relevées sur douze semaines [facts:activity.contributors.0.commits] [facts:activity.bus_factor] [facts:risks.2.note].
Il n'existe ni organisation propriétaire, ni responsable de secours désigné, ni financement qui permettrait de reprendre la main [facts:repo.owner_type] [facts:business.codeowners] [facts:business.funding].
Le code reste néanmoins disponible et reprenable : la licence ouverte autorise n'importe qui à le poursuivre, y compris vos équipes [facts:repo.license] [src:license.md].
La parade tient donc en deux points : ne pas rendre un produit vendu dépendant de cet outil, et garder chez vous une copie de la version que vous utilisez [facts:risks.2.level].

## Q : Est-ce que je peux l'utiliser sur mon ordinateur ? (enfant, 2026-09-10)
Oui, c'est gratuit et tout le monde a le droit de le prendre : le code est ouvert [facts:repo.license].
Mais il ne sert à rien tout seul : c'est un outil qui aide un assistant IA à chercher dans du code, il n'a pas de bouton ni d'image à regarder [src:readme.md].
Il faut donc déjà écrire des programmes, et avoir un assistant IA branché dessus, pour que ça change quelque chose [src:readme.md].
Il s'installe et il tourne sur ta propre machine : rien de ce que tu écris n'est envoyé ailleurs [src:readme.md].

## Q : Pourquoi une personne fait ça toute seule dans son coin ? (enfant, 2026-09-10)
Parce que c'est le début : le projet a commencé le 20 mars 2026, et il n'a encore été remarqué par personne [facts:repo.created_at] [facts:repo.stars].
Une seule personne y travaille, et elle a enregistré 12 changements en trois mois [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits].
Beaucoup de projets commencent comme ça : quelqu'un en a assez d'un problème, fabrique l'outil qui lui manque, et le pose en public au cas où il servirait à d'autres [src:readme.md].
Comme le code est ouvert, d'autres personnes peuvent le rejoindre plus tard, ou même le continuer sans lui [facts:repo.license].
Pour l'instant, le dernier changement date du 6 septembre 2026 : ce n'est pas un projet abandonné [facts:activity.last_commit].

## Q : Comment on sait qu'un programme n'est pas cassé ? (enfant, 2026-09-10)
On ne le sait pas en le regardant : on le fait vérifier par des robots, à chaque changement [facts:tree.1.role].
Le projet range ses vérifications dans un tiroir à part, avec des petits tests qui essaient chaque morceau et disent tout de suite si ça ne marche plus [facts:tree.8.path] [src:tree.md].
Ces robots relancent les tests tout seuls, sans que personne y pense, à chaque fois que quelqu'un touche au code [facts:tree.1.role].
Si un test échoue, le changement est signalé avant d'être ajouté au projet, comme un contrôle à la sortie d'une usine [src:tree.md].
C'est pour ça qu'on peut avancer par petits pas rapides sans tout casser : 11 changements ont été enregistrés en une seule semaine [facts:activity.commits_per_week.10.count].


## Q : Peut-on intégrer cet outil dans un produit qu'on vend ? (cto, 2026-09-10)
Pas sans décision juridique explicite. La licence est AGPL-3.0, classée risque élevé : copyleft contraignant pour un usage commercial [facts:repo.license] [facts:risks.0.level] [facts:risks.0.note].
La clause réseau de l'AGPL se déclenche même sans distribution du binaire : exposer un dérivé en service oblige à publier votre propre code [src:license.md].
L'usage interne, sans modification et sans exposition, reste libre et c'est le seul cadre recommandé ici [facts:risks.0.note].
Le dépôt appartient à un compte personnel unique, donc une licence commerciale se négocie avec une seule partie — c'est aussi une opportunité [facts:repo.owner_type] [facts:activity.contributors.0.login].

## Q : Quelle version installer, vu l'écart entre le dépôt et les versions publiées ? (cto, 2026-09-10)
Une seule version est estampillée, v0.1.6 du 26 mars 2026, alors que le manifeste du dépôt est en 0.5.0 [facts:releases.0.tag] [facts:releases.0.date] [src:manifest.md].
Entre les deux, cinq mois de travail décrits dans le journal des versions, dont la résolution de modules par TypeScript et la matrice de CI à trois systèmes [src:changelog.md].
Conduite à tenir : épingler un commit choisi et audité plutôt que l'étiquette publique, puis exiger une version estampillée à jour comme condition d'un usage plus large [facts:activity.last_commit].
À vérifier avant d'installer : ce que le registre npm publie réellement aujourd'hui, donnée non relevée ici [gh:https://github.com/jordanvalnet/code-dev-intel.ts/releases].

## Q : Quel est le coût d'exploitation et la charge d'intégration ? (cto, 2026-09-10)
Aucun coût de service : le serveur tourne sur les machines de l'équipe, rien n'est envoyé à un indexeur distant [src:readme.md].
L'installation est une dépendance de développement et une commande de démarrage à la demande, utilisable en hook ou en intégration continue [facts:build.install] [facts:build.run].
Le coût réel est en mémoire et en première requête : le graphe de modules est mis en cache hors du dépôt, dans le cache utilisateur, et relu au démarrage d'un nouveau processus [src:readme.md].
Contrainte d'exploitation à tester chez vous : `engines.node` annonce Node 18 et plus, mais seul le paquet compilé est vérifié sur Node 20, l'outillage exigeant Node 22 et plus [facts:risks.4.note] [src:changelog.md].

## Q : Par où commencer une campagne de test sur ce dépôt ? (qa, 2026-09-10)
Par les versions de Node que personne n'exécute : le manifeste annonce Node 18 et plus, Node 18 n'est testé nulle part et Node 20 ne voit passer que le paquet compilé, sans la suite de tests [facts:risks.4.note] [src:ci.md].
Ensuite par la réutilisation du graphe entre deux exécutions : c'est le seul état qui survit au processus, donc le seul endroit où une réponse peut être fausse sans que rien ne plante [src:readme.md].
Ce qui est déjà tenu par la chaîne de vérification n'a pas besoin d'être refait à la main : cinq combinaisons système/Node à chaque push, plus la recette de l'archive publiée sur ubuntu, windows et macos [facts:build.ci.0.triggers] [src:ci.md].
Avant tout cela, créer les étiquettes : aucune n'existe aujourd'hui, donc rien de ce qui sera trouvé ne pourra être compté ni trié [facts:issues.by_label].

## Q : Comment distinguer un vrai défaut d'un effet de la réutilisation du graphe ? (qa, 2026-09-10)
Rejouer le même appel avec `CODE_INTEL_GRAPH_CACHE=off`, qui désactive toute persistance : si le résultat change, le défaut est dans la réutilisation, pas dans le résolveur [src:readme.md].
Le graphe est réécrit dans le répertoire de cache de l'utilisateur, jamais dans le dépôt, et relu au démarrage du processus suivant ; le supprimer force une reconstruction à froid [src:readme.md].
Les cas les plus sensibles sont les quatre événements d'édition — fichier ajouté, supprimé, renommé, ressource ajoutée — plus une modification de `tsconfig.json`, qui doit à elle seule refaire toutes les résolutions [src:readme.md].
Un fichier écrit dans les deux dernières secondes est toujours relu plutôt que réutilisé : un test qui modifie puis interroge immédiatement doit voir sa modification [src:readme.md].

## Q : Que doit contenir un rapport de bug pour être recevable ici ? (qa, 2026-09-10)
Les preuves : le guide de contribution exige les commandes et leurs sorties, en plus des critères d'acceptation remplis et de la mise à jour du journal de mémoire partagée [src:contributing.md].
Les trois portes de qualité doivent passer sur la correction proposée : `pnpm lint`, `pnpm type-check` et `pnpm test` [src:contributing.md] [facts:build.test].
La correction se fait sur une branche courte `task/T-00X-short-name`, une seule tâche par branche et par pull request [src:contributing.md].
Le canal est la file publique du dépôt : il n'y a ni modèle d'issue relevé, ni politique de sécurité, donc aucune voie privée pour un défaut exploitable [facts:business.security_policy] [facts:risks.1.note] [gh:https://github.com/jordanvalnet/code-dev-intel.ts/issues].

## Q : Quelle valorisation défendre pour cet actif ? (investisseur, 2026-09-10)
Aucune valorisation par les revenus ou l'usage n'est défendable : 0 étoile, 0 copie, 1 demande ouverte sans commentaire, presque six mois après l'ouverture du dépôt le 20 mars 2026 [facts:repo.stars] [facts:repo.forks] [facts:issues.open] [facts:repo.created_at].
Ce qui reste évaluable est le coût de reconstruction : 12 changements relevés sur douze semaines par une seule personne, au-dessus d'un socle de cinq mois décrit dans le journal des versions, dont la résolution de modules par le compilateur et la réutilisation du graphe entre deux sessions [facts:activity.contributors.0.commits] [src:changelog.md].
La forme de la transaction suit ce constat : ce n'est pas une société qui s'achète, c'est un savoir-faire attaché à son auteur, valorisé comme un recrutement avec reprise d'actif [facts:repo.owner_type] [facts:activity.bus_factor].
Élément non relevé, à obtenir de l'auteur avant toute offre : le temps réellement passé et l'existence d'un usage interne en entreprise.

## Q : La licence AGPL-3.0 est-elle un obstacle définitif ? (investisseur, 2026-09-10)
Non, tant qu'une seule personne détient les droits : le compte jordanvalnet signe la totalité des changements relevés, donc une relicence se négocie avec un seul interlocuteur [facts:activity.contributors.0.login] [facts:activity.bus_factor].
En l'état, l'AGPL-3.0 oblige à publier son propre code dès que le logiciel est intégré à un produit vendu ou exposé en réseau, ce qui ferme la voie commerciale classique [facts:repo.license] [facts:risks.0.note] [src:license.md].
Elle ne gêne en rien un usage strictement interne, qui reste la façon la plus rapide de vérifier la promesse avant d'engager quoi que ce soit [src:readme.md].
Point de vigilance juridique : la relicence doit être obtenue avant qu'un premier contributeur extérieur n'apporte du code, faute de quoi il faudra l'accord de chacun [src:readme.md].

## Q : Quels signaux surveiller avant de revenir sur ce dossier ? (investisseur, 2026-09-10)
Trois, dans l'ordre d'importance : une version publiée à jour — le public installe la v0.1.6 du 26 mars quand le travail interne est à 0.5.0 du 4 septembre [facts:releases.0.tag] [facts:releases.0.date] [src:changelog.md].
Ensuite un deuxième contributeur régulier, qui ferait passer le nombre de personnes portant la moitié du travail au-dessus de 1 [facts:activity.bus_factor] [facts:activity.contributors].
Enfin des utilisateurs extérieurs identifiables : étoiles, copies, demandes ouvertes par d'autres que l'auteur, toutes à zéro ou presque aujourd'hui [facts:repo.stars] [facts:repo.forks] [facts:issues.hot.0.comments].
Un rythme régulier remplacerait utilement le sursaut actuel, onze des douze changements relevés tenant dans une seule semaine [facts:activity.commits_per_week].
