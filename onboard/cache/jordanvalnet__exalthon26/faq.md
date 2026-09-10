## Q : Comment relancer une seule étape du pipeline sans tout recollecter ? (dev, 2026-09-10)
Dans une session Claude Code, chaque étape est un skill : `/onboard-collect owner/repo profil`, `/onboard-write owner/repo profil`, `/onboard-render owner/repo profil`, et `/onboard-ask owner/repo profil "question"` pour interroger le cache [src:readme.md].
En code seul : `bun run render <cache> <profil>` rejoue le rendu, `bun run merge <cache> <profil>` réassemble `parts/*.json` dans `facts.json`, `bun run validate facts|narrative|deck <cache> <profil>` vérifie une étape, `bun run pdf <cache> <profil>` sort le PDF [src:readme.md].
Pour refaire le pipeline complet en écrasant le cache : `bun onboard owner/repo profil --force` [facts:entrypoints.0.why].
Chaque étape ne lit que les sorties de la précédente et ne démarre que si la validation en code passe [src:readme.md].

## Q : Comment appeler le serveur MCP GitHub depuis le code ou le terminal ? (dev, 2026-09-10)
Un seul chemin vers GitHub : le serveur MCP `github` de `.mcp.json`, type http, `https://api.githubcopilot.com/mcp/`, en-tête `Authorization: Bearer ${GITHUB_PAT}` [src:ai-docs.md].
Depuis l'agent, les outils `github:*` ; depuis le code, `src/github.ts`, qui parle au même serveur (client dans `onboarding/src/mcp/`) ; jamais d'appel REST direct [src:ai-docs.md] [src:readme.md].
Au terminal : `bun run gh <outil> '<args JSON>'` fait un appel brut, `bun run gh tools` liste les outils [src:ai-docs.md].
Test de connexion : `bun run dev`, qui appelle `whoami()` de `src/github.ts` et affiche « GitHub OK : <login> », sinon sort en code 1 [facts:entrypoints.1.why].

## Q : L'issue #1 est ouverte avec 22 commentaires : faut-il la traiter ? (dev, 2026-09-10)
Non. #1 « 💬 Chat équipe — canal IA ↔ IA » est le canal par lequel les assistants de l'équipe se parlent : un commentaire = un message, l'auteur est le compte GitHub du token, un message d'IA commence par 🤖, `@login` pour interpeller quelqu'un [facts:issues.hot.0.title] [facts:issues.hot.0.comments] [src:ai-docs.md].
Client : `node chat/chat.mjs read`, `send "🤖 …"`, `who`, et `wait` en tâche de fond ; sans terminal, `issue_read` (méthode `get_comments`) et `add_issue_comment` sur cette issue [src:ai-docs.md].
Ne jamais la fermer [src:ai-docs.md]. C'est la seule issue ouverte du repo, sans label, et il n'y a aucune good first issue [facts:issues.open] [facts:issues.by_label] [facts:issues.good_first].

## Q : Combien ça coûte de faire tourner Onboard ? (ceo, 2026-09-10)
Le cache ne contient aucun chiffre de coût : pas de financement déclaré, pas de sponsor, pas de budget [facts:business.funding].
Ce qu'il faut pour le lancer se lit dans la documentation : un compte GitHub avec un jeton d'accès, l'assistant IA Claude Code d'un éditeur tiers, le runtime bun et, pour les PDF, un navigateur Chrome ou Edge [src:readme.md].
Le code lui-même est léger : trois briques extérieures déclarées, dont une seule à l'exécution [facts:deps.count] [facts:deps.runtime.0.name].
Le poste de coût réel est donc l'usage de l'assistant IA à chaque onboarding, quelques minutes par dépôt et par profil selon la documentation ; son montant n'est pas dans le cache, à vérifier auprès de l'équipe [src:readme.md].

## Q : Peut-on faire confiance aux chiffres des présentations ? (ceo, 2026-09-10)
C'est le principe même du projet : chaque chiffre renvoie à sa source, rien n'est inventé, et une donnée absente reste absente et se dit [src:readme.md].
Concrètement, chaque étape (collecte, rédaction, mise en page) ne lit que les sorties de la précédente et ne démarre que si une vérification en code passe [src:readme.md].
Les faits collectés sont conservés dans un dossier versionné avec le projet : on peut relire, comparer deux versions et corriger [src:readme.md].
Limite à connaître : la collecte ne voit que ce que le serveur MCP GitHub expose ; le reste est déclaré manquant, avec l'adresse où vérifier, plutôt que deviné [src:readme.md].

## Q : Que se passe-t-il si la personne clé s'en va, et peut-on reprendre le projet ? (ceo, 2026-09-10)
Le risque est réel : une personne signe 41 contributions, plus que les quatre autres réunies, et le bus factor est de 1 [facts:activity.contributors.0.commits] [facts:activity.bus_factor].
Reprendre est techniquement faisable : les consignes pour les assistants IA, le prompt de chaque étape et le contrat des fichiers sont écrits dans le dépôt, et une présentation illustrée explique le fonctionnement [facts:ai_docs.files] [src:readme.md].
Un rapport de mission a été livré avec le projet, utile pour une passation [facts:tree.8.role].
Reprendre n'est pas juridiquement acquis : sans licence, personne n'a de droit clair de réutiliser le code, même en interne ; c'est le premier point à régler avec l'auteur [facts:risks.0.note] [facts:risks.0.level].

## Q : Est-ce que je peux l'essayer à la maison ? (enfant, 2026-09-10)
Oui, mais avec un adulte : il faut un ordinateur, un compte GitHub avec une clé secrète appelée GITHUB_PAT, et deux outils à installer, bun et l'assistant IA Claude Code [src:readme.md].
Le mode d'emploi tient en quelques lignes : installer bun, copier le fichier `.env.example` en `.env` avec la clé, puis lancer `bun onboard owner/repo enfant` [src:readme.md].
Le livre sort en quelques minutes dans le dossier `onboard/cache/`, et on peut le transformer en PDF [src:readme.md].
Le mieux pour commencer : demander à un adulte de le lancer sur un projet que tu connais [src:readme.md].

## Q : Pourquoi le robot n'invente rien ? (enfant, 2026-09-10)
Parce que c'est sa règle numéro un : chaque chiffre renvoie à sa source, et une information qu'il n'a pas trouvée reste absente, il le dit au lieu de deviner [src:readme.md].
Le travail se fait en trois étapes, collecter, rédiger, mettre en page, et chaque étape ne peut commencer que si un contrôle automatique a vérifié la précédente [src:readme.md].
Tout ce qu'il a lu est gardé dans un dossier, avec le projet, pour que quelqu'un puisse vérifier après [src:readme.md].
Dans le livre pour les enfants, les petites notes qui disent d'où vient chaque chiffre sont cachées, mais elles existent dans les versions pour les grands [src:readme.md].

## Q : C'est quoi, un hackathon ? (enfant, 2026-09-10)
Un concours où des équipes fabriquent un logiciel en très peu de temps ; celui-ci s'appelait « Agent + MCP GitHub » et avait lieu le 9 septembre 2026 [facts:repo.description] [src:readme.md].
Le projet a été créé ce jour-là, et l'équipe eXaltemps a fait 57 commits en une seule semaine, contre 1 seul avant [facts:repo.created_at] [facts:activity.commits_per_week.11.count] [facts:activity.commits_per_week.9.count] [src:readme.md].
Cinq personnes y ont participé, aidées par des assistants IA qui se parlaient dans la conversation du projet [facts:activity.contributors] [facts:issues.hot.0.title].
Les consignes du jury sont dans le fichier HACKATHON.md du projet [facts:tree.7.role].

## Q : Peut-on remplacer Claude Code par un autre agent, ou s'en passer ? (cto, 2026-09-10)
Les prompts de chaque étape vivent dans `onboard/agents/`, en texte, et le README affirme que Copilot et Codex exécutent le même texte ; les mêmes étapes existent en skills Claude Code (`/onboard`, `/onboard-collect`, `/onboard-write`, `/onboard-render`, `/onboard-ask`) [src:readme.md].
`bun onboard` lance Claude Code en non interactif et exige sa présence dans le PATH, ainsi que `GITHUB_PAT` [facts:entrypoints.1.why] [src:readme.md].
Deux sous-agents de collecte sont déjà du code pur, sans agent : `bun run meta` et `bun run issues` ; le rendu (`bun run render`), la fusion (`bun run merge`) et les validations le sont aussi [src:manifest.md] [src:readme.md].
Ce qui reste dépendant d'un agent : la rédaction du narratif et la coordination des collecteurs de documentation et de code [src:readme.md].

## Q : Que manque-t-il pour un usage régulier en interne ? (cto, 2026-09-10)
Une licence : le dépôt n'en a pas, risque high, réutilisation juridiquement incertaine [facts:risks.0.level] [facts:risks.0.note].
Un second mainteneur et un CODEOWNERS : bus factor 1, une personne signe 41 commits sur 58 [facts:activity.bus_factor] [facts:activity.contributors.0.commits] [facts:business.codeowners].
Une intégration continue : aucun workflow, la seule vérification est `bun run check` en local [facts:build.ci] [src:ci.md].
Un SECURITY.md et une version épinglée de `@types/bun`, aujourd'hui en `latest` [facts:business.security_policy] [src:manifest.md].
Des tests au-delà des 2 fichiers existants, qui ne touchent ni le rendu ni les validations à en juger par leurs noms [facts:tests.files] [src:tests.md].

## Q : Où passe le jeton GitHub et quel périmètre lui donner ? (cto, 2026-09-10)
Le jeton `GITHUB_PAT` est lu dans `.env`, et `.mcp.json` l'envoie en en-tête `Authorization: Bearer` au serveur MCP hébergé `https://api.githubcopilot.com/mcp/` [src:ai-docs.md].
Le README demande un scope `repo` ; c'est le périmètre à réduire : un jeton à granularité fine, lecture seule, limité aux dépôts à onboarder [src:readme.md].
Le code lui-même ne fait aucun appel REST : `src/github.ts` parle au même serveur MCP que l'agent, ce qui réduit la surface à un seul canal à surveiller [src:ai-docs.md] [src:readme.md].
Les caches produits sont versionnés dans le dépôt, avec des extraits bruts des sources lues : ne pas onboarder un dépôt privé dans un cache public [src:readme.md].

## Q : Comment vérifier qu'un deck n'a rien inventé ? (qa, 2026-09-10)
Chaque chiffre d'un deck renvoie à sa source par une note de bas de page ; les faits sont dans `facts.json` et les extraits bruts lus sur GitHub dans `sources/`, tous deux versionnés dans `onboard/cache/<owner>__<repo>/` [src:readme.md].
Deux contrôles : relire `sources/*.md` face au dépôt sur GitHub, et rejouer `bun run gh <outil> '<args JSON>'` pour comparer un chiffre de `facts.json` avec la réponse brute du serveur MCP [src:readme.md] [src:ai-docs.md].
Une donnée que le serveur MCP n'expose pas doit apparaître comme manquante, avec l'adresse où vérifier, jamais devinée ; c'est un cas de test à part entière [src:readme.md].
Le contrôle automatique entre les étapes existe, `bun run validate facts|narrative|deck`, mais il n'a lui-même aucun test connu : les 2 fichiers de test visent l'accès GitHub et les issues [src:readme.md] [facts:tests.files] [src:tests.md].

## Q : Sur quel dépôt et quel cache tester ? (qa, 2026-09-10)
Les dépôts cibles du hackathon sont listés dans `CIBLES.md` à la racine [facts:tree.5.role] [src:tree.md].
Le README montre six decks générés sur mksglu/context-mode, un par profil, avec leurs PDF dans `onboard/cache/mksglu__context-mode/` : un jeu de référence pour comparer un nouveau rendu [src:readme.md].
Les caches sont versionnés avec le dépôt : un diff après `bun onboard owner/repo profil --force` montre exactement ce qui a bougé entre deux collectes [src:readme.md] [facts:entrypoints.1.why].
Le dépôt se qualifie aussi avec ses propres outils : `bun onboard jordanvalnet/exalthon26 qa` [facts:repo.full_name] [src:readme.md].

## Q : Un deck est faux : à quelle étape chercher ? (qa, 2026-09-10)
Trois étapes, trois sorties : la collecte écrit `facts.json` et `sources/`, la rédaction `narrative/<profil>.md`, le rendu `deck-<profil>.html` ; chaque étape ne lit que la sortie de la précédente [src:readme.md].
Un chiffre faux dans `facts.json` vient de la collecte : comparer `parts/*.json` avec un appel brut `bun run gh`, puis relancer `bun run merge <cache> <profil>` [src:readme.md] [src:ai-docs.md].
Un chiffre juste dans `facts.json` mais faux dans le narratif vient de la rédaction : la note de bas de page dit quel chemin de `facts.json` a été cité [src:readme.md].
Un narratif juste mais un deck faux vient du rendu : `bun run render <cache> <profil>` le rejoue seul, sans recollecter [src:readme.md].
Le rédacteur ne va jamais sur GitHub : une information absente du cache ne peut pas être dans le deck, et le texte doit le dire [src:readme.md].

## Q : Y a-t-il quelque chose à acheter : un produit, une propriété intellectuelle ? (investisseur, 2026-09-10)
Pas aujourd'hui. Aucune version publiée, un manifeste privé en 0.1.0, 0 étoile et 0 copie : il n'existe ni produit distribué ni base d'utilisateurs [facts:releases] [src:manifest.md] [facts:repo.stars] [facts:repo.forks].
La propriété intellectuelle n'est pas clarifiée : pas de licence, un dépôt sur un compte personnel, cinq contributeurs sans accord écrit dans le dépôt [facts:repo.license] [facts:repo.owner_type] [facts:activity.contributors].
Ce qui a de la valeur est écrit et lisible : la méthode, le prompt de chaque étape, le contrat des fichiers, le rapport de mission [src:readme.md] [facts:tree.8.role].
Le cache ne contient ni société, ni marque, ni brevet ; à vérifier auprès de l'équipe [facts:business.funding].

## Q : Que se passe-t-il si GitHub ou l'éditeur de Claude Code livrent la même fonction ? (investisseur, 2026-09-10)
Onboard dépend des deux : `bun onboard` lance Claude Code, et toute lecture de GitHub passe par le serveur MCP hébergé à l'adresse api.githubcopilot.com [src:readme.md] [src:ai-docs.md].
La documentation revendique la portabilité des prompts vers Copilot et Codex, ce qui réduit la dépendance à un éditeur mais confirme que la méthode est copiable [src:readme.md].
Le cache ne contient aucun concurrent, faute de thème GitHub sur le dépôt ; le risque de plateforme n'est pas mesuré, il est structurel [facts:repo.topics] [facts:business].
Réponse honnête : rien dans le dépôt ne protège contre ce scénario ; la seule défense serait l'avance d'exécution de l'équipe, 57 contributions en une semaine [facts:activity.commits_per_week.11.count].

## Q : Quels signaux surveiller avant de rouvrir le dossier ? (investisseur, 2026-09-10)
Une licence choisie : aujourd'hui aucune, risque élevé [facts:repo.license] [facts:risks.0.level].
Une première version publiée et un manifeste non privé : aujourd'hui 0 version, private true [facts:releases] [src:manifest.md].
Un second contributeur durable : bus factor 1, 41 contributions pour une personne contre 8 pour la deuxième [facts:activity.bus_factor] [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits].
Des utilisateurs hors de l'équipe : étoiles, copies, tickets étiquetés, tous à 0 ou vides aujourd'hui [facts:repo.stars] [facts:repo.forks] [facts:issues.by_label].
Une feuille de route écrite et des vérifications automatiques : aucune des deux aujourd'hui [facts:roadmap.themes] [facts:build.ci].
