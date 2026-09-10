# FAQ n8n-io/n8n

## Q : Puis-je installer avec npm ou yarn au lieu de pnpm ? (dev, 2026-09-10)
Non. Le `package.json` racine pin `pnpm@12.3.4` dans `packageManager`, exige Node 24 ou plus, et son script `preinstall` (`scripts/block-npm-install.js`) bloque `npm install` [src:manifest.md].
Le guide de contribution demande d'installer exactement cette version, `npm i -g pnpm@12.3.4`, et de la mettre à jour quand le pin change [src:contributing.md].
`AGENTS.md` le résume en une règle : « Always use pnpm » [src:ai-docs.md].
Ensuite : `pnpm install`, `pnpm build`, `pnpm start` [facts:build.install] [facts:build.run].

## Q : Comment lancer seulement le backend ou seulement l'éditeur ? (dev, 2026-09-10)
Backend seul : `pnpm dev:be` (port 5678) ; éditeur seul : `pnpm dev:fe:editor` (port 8080) ; nœuds IA : `pnpm dev:ai` [src:contributing.md] [src:manifest.md].
Pour une seconde instance, passez `N8N_PORT=5699 pnpm dev:be` et `N8N_PORT=5699 N8N_EDITOR_PORT=8082 pnpm dev:fe:editor` : l'éditeur dérive son URL REST de `N8N_PORT` [src:contributing.md].
Pour développer un nœud : `pnpm dev` dans `packages/nodes-base` et `N8N_DEV_RELOAD=true pnpm dev` dans `packages/cli` ; base propre avec `N8N_USER_FOLDER=~/.n8n3/` [src:contributing.md].
`pnpm dev` à la racine n'existe plus : il affiche un avis et sort avec le code 0 [src:contributing.md] [src:manifest.md].

## Q : Où sont les tests et comment en lancer une partie ? (dev, 2026-09-10)
Pas de dossier de tests à la racine : chaque package a les siens ; `pnpm test` lance `turbo run test` partout [facts:build.test] [src:tests.md].
Repères relevés : `vitest.workspace.ts` à la racine, `packages/cli/test/` avec six configs `vitest.config.*.ts` (unit, integration, migration, testcontainers), e2e Playwright dans `packages/testing` (`pnpm dev:e2e` ouvre l'interface Playwright) [src:tests.md] [src:manifest.md].
En CI, `test:ci:frontend` et `test:ci:backend` filtrent par package via turbo, et `ci-pull-requests.yml` rejoue unit, e2e et tests BDD SQLite et Postgres [src:manifest.md] [src:ci.md].
Le nombre de fichiers de test et la commande exacte pour un seul package n'ont pas été relevés : voir la section « Test suite » du guide, https://github.com/n8n-io/n8n/blob/master/CONTRIBUTING.md#test-suite [src:contributing.md].

## Q : Peut-on l'utiliser dans notre offre commerciale sans payer ? (ceo, 2026-09-10)
C'est la seule question à trancher avant d'engager quoi que ce soit, et elle est juridique.
Le projet est publié sous « Sustainable Use License », qui n'est pas une licence ouverte standard : le code est visible et installable chez soi, mais l'usage commercial est encadré [facts:repo.license] [facts:risks.0.note].
L'éditeur vend en parallèle des licences entreprise pour les fonctions et le support supplémentaires [src:readme.md].
Concrètement : faire lire le texte de la licence par le juridique avant toute revente ou intégration dans une offre payante, https://github.com/n8n-io/n8n/blob/master/LICENSE.md [gh:https://github.com/n8n-io/n8n/blob/master/LICENSE.md].

## Q : Si l'équipe derrière le projet disparaissait, que perdrions-nous ? (ceo, 2026-09-10)
Le code resterait disponible et installable chez vous : c'est l'intérêt d'un produit auto-hébergeable [src:readme.md].
La dépendance à une personne clé est faible : il faut réunir 16 contributeurs pour couvrir la moitié des changements récents, et le contributeur le plus actif ne pèse que 24 des 500 changements relevés [facts:activity.bus_factor] [facts:activity.contributors.0.commits].
Le dépôt appartient à une organisation constituée depuis juin 2019, avec une politique de sécurité et des relecteurs désignés par zone du produit [facts:repo.owner_type] [facts:repo.created_at] [facts:business.security_policy] [facts:business.codeowners].
Ce que vous perdriez : le rythme de livraison — cinq versions publiées le seul jour du relevé — et le support de l'éditeur [facts:releases].

## Q : Combien ça coûte et combien de clients l'utilisent ? (ceo, 2026-09-10)
Ces deux chiffres ne sont pas des données publiques du dépôt : non relevés.
Ce que les données montrent, ce sont des indicateurs de notoriété et d'usage, pas de revenus : 203 921 mises en favori, 60 629 copies du projet, 375 demandes ouvertes et 300 traitées en trente jours [facts:repo.stars] [facts:repo.forks] [facts:issues.open] [facts:issues.closed_30d].
Le signe d'un usage réel en entreprise est ailleurs : les sujets les plus commentés viennent d'utilisateurs qui montent de version en production, comme le plus discuté du relevé et ses 25 messages [facts:issues.hot.0.title] [facts:issues.hot.0.comments].
Pour les tarifs et les références clients, il faut passer par l'éditeur, https://n8n.io [gh:https://n8n.io].

## Q : Est-ce que je peux l'essayer moi-même, et est-ce que c'est gratuit ? (enfant, 2026-09-10)
Oui, le code est visible par tout le monde et tu peux l'installer sur un ordinateur à toi [src:readme.md].
Le README donne une seule commande à taper pour tout mettre en place, puis tu ouvres la page dans ton navigateur [src:readme.md].
Attention quand même : ce n'est pas un jouet libre de tout usage. Le projet a une licence particulière, la « Sustainable Use License », qui pose des limites si on veut en faire commerce [facts:repo.license].
Pour t'amuser et apprendre, c'est bon. Pour vendre quelque chose avec, il faut lire la licence avec un adulte.

## Q : Est-ce qu'il faut savoir programmer pour s'en servir ? (enfant, 2026-09-10)
Non, pas au début. Le projet est fait pour qu'on relie des blocs à la souris, sans écrire une ligne [facts:repo.description] [src:readme.md].
C'est pour ça qu'on le range dans les outils « sans code » et « peu de code » [facts:repo.topics].
Si un jour un bloc ne fait pas exactement ce que tu veux, tu peux ajouter ton propre morceau de code par-dessus [src:readme.md].
Autrement dit, tu commences comme avec des Lego, et tu fabriques tes propres briques seulement quand tu en as envie.

## Q : Est-ce que le projet peut s'arrêter du jour au lendemain ? (enfant, 2026-09-10)
C'est peu probable. Il faudrait que 16 personnes différentes arrêtent en même temps pour perdre la moitié du travail [facts:activity.bus_factor].
Et il bouge tous les jours : le dernier changement date du jour même où on a regardé, le 10 septembre 2026 [facts:activity.last_commit].
Beaucoup de monde le suit aussi de près : 203 921 marque-pages et 60 629 copies du projet [facts:repo.stars] [facts:repo.forks].
Et même si l'équipe s'arrêtait, le code resterait visible : quelqu'un d'autre pourrait le reprendre à partir de sa copie [src:readme.md].

## Q : Peut-on l'utiliser dans un produit qu'on vend, ou faut-il payer ? (cto, 2026-09-10)
Pas sans accord. La licence limite l'usage à vos propres besoins internes, ou à un usage non commercial ; la redistribution n'est permise que gratuitement et sans but commercial [src:license.md] [facts:repo.license].
Deux exclusions s'y ajoutent : les fichiers dont le nom contient `.ee.` ou le chemin `.ee` ne sont pas couverts et exigent une licence entreprise (`LICENSE_EE.md`), et le contenu des branches autres que `master` n'est pas licencié du tout [src:license.md].
En pratique : auto-hébergement interne, oui, sans contrepartie. Revente, SaaS ou intégration dans une offre payante : c'est une négociation commerciale avec l'éditeur, pas une décision technique [facts:risks.0.note] [src:readme.md].
C'est le seul point bloquant relevé, et il est classé « moyen » précisément parce qu'il est contournable par contrat [facts:risks.0.level].

## Q : Quel est le vrai coût d'exploitation d'une montée de version ? (cto, 2026-09-10)
Le rythme impose de ne jamais suivre `latest` : environ 250 changements par semaine, et dix versions publiées en quatre jours sur le relevé [facts:activity.commits_per_week] [facts:releases].
Bonne nouvelle pour la stabilité : deux lignes sont maintenues en parallèle, `n8n@2.39.2` et `n8n@1.123.79` le même jour, avec des backports vers les branches `release-candidate/*` [facts:releases] [facts:pulls.merged_30d].
Mauvaise nouvelle : les ruptures sont assumées, une PR ouverte supprime le nœud LangChain Code et une comparaison « 3.x » est déjà en cours [facts:roadmap.open_prs.6.title] [facts:roadmap.open_prs.2.title].
Les issues les plus commentées sont d'ailleurs des régressions après montée de version [facts:issues.hot.0.title].
Budgétez donc une version épinglée, un environnement de recette qui rejoue vos workflows, et une veille sur les branches de release.

## Q : Que faut-il auditer avant la mise en production ? (cto, 2026-09-10)
Trois choses que le dépôt ne vous donne pas directement.
D'abord l'inventaire des dépendances runtime : le manifeste racine ne déclare que 28 `devDependencies` et aucun bloc runtime, tout étant éclaté par package — l'inventaire exploitable est le SBOM généré en CI [facts:deps.count] [facts:deps.runtime] [src:manifest.md] [src:ci.md].
Ensuite les vulnérabilités publiées : non relevées ici, à lire sur https://github.com/n8n-io/n8n/security/advisories ; le dépôt a bien une politique de divulgation et des scanners en CI (Aikido, Poutine, Trivy, zizmor) [facts:business.security_policy] [src:security.md] [src:ci.md].
Enfin la couverture de tests réelle : Codecov est branché mais le taux n'est pas dans le dépôt — https://app.codecov.io/gh/n8n-io/n8n [src:tests.md].
Le reste est vérifiable sur place : la CI complète (build, typecheck, lint, unit, DB SQLite et Postgres, e2e Playwright, performance) est dans `.github/workflows/ci-pull-requests.yml` et rejouable [facts:build.ci.0.path] [src:ci.md].

## Q : Comment retrouver les bugs ouverts alors qu'aucune issue n'est étiquetée « bug » ? (qa, 2026-09-10)
Les 15 étiquettes relevées sont des étiquettes d'équipe (`team:cats` 93, `team:nodes` 92, `team:ai` 61) et de statut (`status:in-linear` 297, `status:team-assigned` 280) : la qualification par gravité se fait dans l'outil de tickets interne, pas sur GitHub [facts:issues.by_label].
Trois entrées restent exploitables. `Needs Feedback`, 41 issues, et `triage:needs-info`, 4, listent les tickets bloqués faute de reproduction — c'est là qu'un testeur apporte le plus de valeur [facts:issues.by_label].
Le volume de commentaires sert de second filtre : les dix issues les plus discutées sont toutes des dysfonctionnements, de 11 à 25 commentaires [facts:issues.hot].
Enfin, le flux est traité et non accumulé — 375 ouvertes pour 300 fermées sur trente jours — donc une issue ancienne et silencieuse mérite d'être revérifiée avant d'être rouverte [facts:issues.open] [facts:issues.closed_30d].

## Q : Une pull request « tout vert » a-t-elle vraiment tout testé ? (qa, 2026-09-10)
Non. Le pipeline `.github/workflows/ci-pull-requests.yml` commence par une étape `ci-filter` qui compare les fichiers modifiés à des filtres et n'active que les étages concernés : `unit`, `e2e`, `db`, `db-migrations`, `e2e-performance`, `frontend-declarations` [facts:build.ci.0.path] [src:ci.md].
Le job `required-checks` bloque bien la fusion, mais il ne bloque que sur les étages effectivement déclenchés [src:ci.md].
Les campagnes exhaustives sont reportées la nuit : `test-workflows-nightly.yml`, `test-e2e-coverage-nightly.yml`, `test-benchmark-nightly.yml`, `test-sbom-nightly.yml` [src:ci.md].
Pour une livraison, exigez donc un passage end-to-end complet ou le résultat de la campagne de nuit, pas seulement le vert de la pull request.

## Q : Dans quelle configuration dois-je reproduire un bug ? (qa, 2026-09-10)
Dans celle du plaignant : n8n s'exécute en SQLite, en Postgres, en mode queue avec des workers, ou en multi-main, et le projet outille les quatre en local par Testcontainers (`pnpm --filter n8n-containers stack:sqlite`, `stack:postgres`, `stack:queue`, `stack:multi-main`) [src:contributing.md].
Le mode compte vraiment : l'issue 26394 ne se manifeste qu'en mode queue, où l'appel d'outil MCP échoue côté worker [facts:issues.hot.7.title].
La version compte autant : trois lignes sont publiées en parallèle (`n8n@2.39.2`, `n8n@2.38.6`, `n8n@1.123.79`) et les correctifs sont reportés vers les branches `release-candidate/*` et `1.x` [facts:releases] [facts:pulls.merged_30d.3.title].
Pour un test rapide sur une version publiée, l'image Docker suffit et l'éditeur répond sur http://localhost:5678 [src:readme.md].

## Q : Peut-on héberger n8n pour ses propres clients et le facturer ? (investisseur, 2026-09-10)
Non, pas sous la licence principale. La « Sustainable Use License » limite l'usage au périmètre interne de l'entreprise ou à un usage non commercial, et n'autorise la redistribution que gratuitement et à des fins non commerciales [src:license.md] [facts:repo.license].
C'est précisément ce qui protège le modèle économique : aucun hébergeur ne peut revendre le produit tel quel, contrairement à ce qui est arrivé à d'autres projets sous licence permissive [facts:risks.0.note].
Les fichiers dont le nom contient `.ee.` sont en outre exclus de cette licence et réservés aux détenteurs d'une licence entreprise payante [src:license.md] [src:readme.md].
Toute opération de revente ou d'hébergement pour compte de tiers passe donc par un accord commercial avec l'éditeur, pas par le dépôt.

## Q : Qu'est-ce qui empêche un concurrent de copier le code et de repartir avec ? (investisseur, 2026-09-10)
Rien, techniquement : le code est visible, et 60 629 copies du dépôt existent déjà [facts:repo.forks].
Ce qui protège n8n est ailleurs. D'abord le catalogue : plus de 1 500 intégrations et plus de 9 000 modèles de flux déjà écrits, qu'un entrant devrait reconstruire et maintenir un par un [src:readme.md].
Ensuite la licence, qui interdit à ce concurrent de revendre le produit dérivé [src:license.md].
Enfin le rythme : dix versions publiées en quatre jours et environ 250 changements par semaine sur les semaines relevées — une copie décroche en quelques mois [facts:releases] [facts:activity.commits_per_week].

## Q : Quels chiffres manquent pour décider, et où les chercher ? (investisseur, 2026-09-10)
Trois, et aucun ne se lit dans le dépôt. Le chiffre d'affaires, le nombre de clients payants et l'historique de financement : aucun fichier de financement n'est publié ici, le modèle affiché étant la licence entreprise et le service en ligne [facts:business.funding] [src:readme.md].
Les vulnérabilités publiées n'ont pas été relevées lors de ce passage : elles se lisent sur https://github.com/n8n-io/n8n/security/advisories, la politique de signalement étant en place [facts:business.security_policy] [src:security.md].
La comparaison avec les projets équivalents n'a pas été prise non plus ; point de départ : https://github.com/topics/ai [facts:repo.topics].
Ce qui est acquis, en revanche : la position d'audience, le rythme de livraison et une équipe peu dépendante d'un individu — bus factor de 16 [facts:repo.stars] [facts:releases] [facts:activity.bus_factor].
