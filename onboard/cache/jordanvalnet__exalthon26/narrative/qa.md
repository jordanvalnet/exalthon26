---
repo: jordanvalnet/exalthon26
profile: qa
generated_at: 2026-09-10T09:37:00Z
---
# Onboard : une chaîne à validations dures, mais 2 fichiers de test, aucune CI et tout écrit en une semaine

## Que fait ce projet et quels sont ses parcours critiques ?
Onboard lit n'importe quel dépôt GitHub par le serveur MCP GitHub, construit un cache documentaire vérifié et en tire une présentation par public : dev, qa, cto, ceo, investisseur, enfant [src:readme.md] [facts:repo.description].
Une commande, `bun onboard owner/repo profil`, enchaîne trois étapes, collecter, rédiger, rendre, puis un guide répond aux questions à partir du cache ; chaque étape ne démarre que si la validation en code de la précédente passe [src:readme.md] [facts:build.run].
Créé le 9 septembre 2026 pour le hackathon « Agent + MCP GitHub » de l'équipe eXaltemps, dernier push le 10 septembre ; aucune release, 0 étoile, 0 fork [facts:repo.created_at] [facts:repo.pushed_at] [facts:releases] [facts:repo.stars] [facts:repo.forks] [src:readme.md].
Parcours critiques à qualifier, dans l'ordre où ils cassent le plus probablement :
1. Accès GitHub : `GITHUB_PAT` dans `.env`, serveur MCP déclaré dans `.mcp.json` ; `bun run dev` affiche « GitHub OK : <login> » ou sort en code 1 [facts:entrypoints.0.why] [src:ai-docs.md] [src:readme.md].
2. Collecte : `bun run meta` et `bun run issues`, puis `bun run merge` qui assemble `parts/*.json` dans `facts.json` [src:manifest.md] [src:readme.md].
3. Validations : `bun run validate facts|narrative|deck`, la barrière entre deux étapes [src:readme.md].
4. Rendu : `bun run render` puis `bun run pdf`, qui exige Chrome ou Edge en headless [src:readme.md].
5. Orchestration : `bun onboard` lance Claude Code en non interactif et exige sa présence dans le PATH [facts:entrypoints.1.why] [src:readme.md].
> Cinq parcours à qualifier, dont deux dépendent d'un service extérieur : le serveur MCP GitHub et Claude Code [src:readme.md] [facts:entrypoints.1.why].

## Comment est-il testé aujourd'hui ?
<!-- chart: tree -->
Un dossier `test/` à la racine, lanceur `bun test`, 2 fichiers : `test/github.test.ts` (801 octets) et `test/issues.test.ts` (1654 octets) [facts:tests.dir] [facts:tests.framework] [facts:tests.files] [src:tests.md].
La commande de référence est `bun run check` = `tsc --noEmit` puis `bun test` : le typecheck pèse autant que les tests [facts:build.test] [src:ci.md] [src:manifest.md].
À en juger par leurs noms, les deux fichiers visent l'accès GitHub et le collecteur d'issues ; leur contenu n'a pas été lu [src:tests.md].
Ce que ces noms ne couvrent pas, sur les 9 entrées de `src/` et les 15 scripts du manifeste [src:tree.md] [src:manifest.md] :
- `src/validate.ts` (8324 octets) : les trois validations dures du pipeline [src:tree.md] [src:readme.md]
- `src/merge.ts` (3849 octets) : la fusion des collectes dans `facts.json` [src:tree.md] [src:readme.md]
- `src/render/` : deck HTML, PDF, capture d'écran [src:tree.md] [facts:entrypoints.2.why]
- `src/cli.ts` (2530 octets) : l'orchestration via Claude Code [src:tree.md] [facts:entrypoints.1.why]
- `onboarding/` : second package bun, manifeste et code non lus [facts:tree.14.role] [src:tree.md]
- `chat/chat.mjs` : le client du chat d'équipe, node ou bun [facts:entrypoints.4.why] [src:ai-docs.md]
> 2 fichiers de test pour 15 scripts : aujourd'hui, la barrière principale est le typecheck, pas les tests [facts:tests.files] [src:manifest.md].

## Que dit la CI et quand tourne-t-elle ?
Rien : `.github/workflows/` renvoie 404 et la racine, 21 entrées, ne contient aucun dossier `.github` [facts:build.ci] [src:ci.md] [src:tree.md].
La seule vérification est locale, `bun run check`, que le README demande de lancer « avant de pousser » ; elle repose sur la discipline de chaque personne [facts:build.test] [src:readme.md].
La collecte note ce risque mid : aucun workflow GitHub Actions, aucune vérification hébergée [facts:risks.3.kind] [facts:risks.3.level] [facts:risks.3.note].
Conséquence pour la qualification : aucune trace d'exécution des tests n'existe sur GitHub ; il faut les rejouer soi-même sur le commit à qualifier [src:ci.md].
Rien ne contrôle non plus les dépendances : `@types/bun` est en `latest`, non épinglée, malgré un `bun.lock` versionné [facts:risks.4.note] [src:manifest.md].
> Rien ne tourne sur GitHub : un push qui casse `bun run check` n'est détecté par personne tant qu'un poste ne le relance pas [facts:build.ci] [src:readme.md].

## Où sont les bugs connus ?
<!-- chart: issues_by_label -->
Nulle part dans le tracker : 1 issue ouverte, 0 fermée sur 30 jours, aucun label, donc aucun ticket « bug » et aucune good first issue [facts:issues.open] [facts:issues.closed_30d] [facts:issues.by_label] [facts:issues.good_first].
L'unique issue ouverte, #1 « 💬 Chat équipe — canal IA ↔ IA », 22 commentaires, est le canal où les 6 assistants IA de l'équipe se parlent, pas un défaut [facts:issues.hot.0.number] [facts:issues.hot.0.title] [facts:issues.hot.0.comments] [src:ai-docs.md] [gh:https://github.com/jordanvalnet/exalthon26/issues/1].
Un tracker vide sur un projet d'une semaine ne dit rien de la qualité : personne n'a encore signalé. La liste des risques collectés est le seul inventaire disponible [facts:risks] [facts:repo.created_at].
| Risque | Niveau | Constat |
|---|---|---|
| Licence | high | pas de fichier LICENSE, réutilisation juridiquement incertaine [facts:risks.0.level] [facts:risks.0.note] |
| Bus factor | high | un seul contributeur porte la moitié des commits sur 12 semaines [facts:risks.2.level] [facts:risks.2.note] |
| CI | mid | aucun workflow, vérification locale seulement [facts:risks.3.level] [facts:risks.3.note] |
| Sécurité | mid | pas de SECURITY.md, aucun canal pour signaler une faille [facts:risks.1.level] [facts:risks.1.note] |
| Dépendances | low | 3 déclarées, `@types/bun` non épinglée [facts:risks.4.level] [facts:risks.4.note] [facts:deps.count] |
Aucun commentaire `TODO` de dette dans `src/` ni `test/` : la recherche renvoie 12 résultats, tous dans de la documentation, des prompts ou des caches générés [src:todo.md].
> Aucun bug tracé : le tracker est vide parce que personne n'a signalé, pas parce que le produit est qualifié [facts:issues.open] [facts:issues.by_label].

## Comment reproduire et signaler un bug ici ?
Donnée non relevée : CONTRIBUTING.md ; le fichier est absent des 21 entrées de la racine, à vérifier dans https://github.com/jordanvalnet/exalthon26 ; aucune procédure de signalement n'est écrite [src:tree.md].
Reproduire : l'environnement tient en quelques lignes du README, bun, `.env` avec `GITHUB_PAT`, `bun install && bun run check`, puis la commande d'onboarding [src:readme.md] [facts:build.install] [facts:build.run].
```bash
cp .env.example .env            # GITHUB_PAT=<token GitHub, scope repo>
bun install && bun run check
bun onboard owner/repo qa
bun run validate facts|narrative|deck onboard/cache/<owner>__<repo> qa
```
Isoler : chaque étape se rejoue seule, `bun run merge`, `bun run validate`, `bun run render`, `bun run pdf`, et chaque sortie est un fichier texte versionné dans `onboard/cache/` : un diff montre ce qui a changé [src:readme.md].
Comparer avec GitHub sans passer par le pipeline : `bun run gh <outil> '<args JSON>'` fait l'appel brut au serveur MCP, `bun run gh tools` liste les outils [src:readme.md] [src:ai-docs.md].
Signaler : 0 PR ouverte et 1 seule PR fusionnée, #2 le 9 septembre, pour 57 commits cette semaine ; les changements arrivent sur `main` sans passer par une PR [facts:pulls.open] [facts:pulls.merged_30d.0.number] [facts:pulls.merged_30d.0.merged_at] [facts:activity.commits_per_week.11.count] [gh:https://github.com/jordanvalnet/exalthon26/pull/2].
L'issue #1 est réservée au chat des assistants et ne doit jamais être fermée ; un défaut se signale dans une issue neuve, avec l'étape (collecte, rédaction, rendu), le dossier de cache, le profil et la dernière ligne de la validation [src:ai-docs.md] [src:readme.md] [facts:issues.hot.0.number].
> Pas de CONTRIBUTING et pas de label bug : un défaut se signale par une issue neuve, jamais dans #1 [src:tree.md] [facts:issues.by_label] [facts:issues.hot.0.number].

## Quelles zones sont peu couvertes ?
Tout le code a été écrit en une semaine : 57 commits la semaine 37, 1 la semaine 35, 0 les dix autres ; dernier commit le 10 septembre 2026 [facts:activity.commits_per_week.11.count] [facts:activity.commits_per_week.9.count] [facts:activity.last_commit].
Une personne signe 41 commits, plus que les quatre autres réunies (8, 4, 3, 2) ; bus factor 1, risque high [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.bus_factor] [facts:risks.2.level].
Les 2 fichiers de test, à en juger par leurs noms, ne touchent que l'accès GitHub et les issues [facts:tests.files] [src:tests.md].
Zones sans test connu, par ordre de risque pour le livrable :
- `src/render/` : deck HTML, PDF via Chrome headless, capture ; c'est le livrable visible [facts:entrypoints.2.why] [src:readme.md]
- `src/validate.ts` : les trois barrières du pipeline ; une barrière qui laisse passer rend le reste inutile [src:tree.md] [src:readme.md]
- `src/merge.ts` : la fusion des `parts/*.json` dans `facts.json` [src:tree.md] [src:readme.md]
- `src/cli.ts` : l'orchestration via Claude Code, non testable sans l'agent [facts:entrypoints.1.why]
- `onboarding/` : second package bun, manifeste et code non lus par la collecte [facts:tree.14.role] [src:tree.md]
- `chat/chat.mjs` : doit tourner sous node et sous bun [facts:entrypoints.4.why] [src:ai-docs.md]
La documentation pour agents IA est en revanche bien présente, 4 repères sur 7 : AGENTS.md, CLAUDE.md, .mcp.json, .claude/skills/ [facts:ai_docs.score] [facts:ai_docs.max] [src:ai-docs.md].
> Le rendu, les validations et la fusion, soit le cœur du produit, n'ont aucun test connu ; tout a été écrit en une semaine, par une personne principale [facts:tests.files] [facts:activity.bus_factor].

## Plan de test en 5 points
1. Environnement : sur un poste neuf, `bun install && bun run check` passe et `bun run dev` affiche « GitHub OK : <login> » avec un `GITHUB_PAT` de scope repo [facts:build.install] [facts:build.test] [facts:entrypoints.0.why] [src:readme.md].
2. Collecte : `bun run meta` et `bun run issues` sur un dépôt de `CIBLES.md`, comparer `parts/*.json` avec un appel brut `bun run gh`, vérifier que ce que le serveur MCP n'expose pas est déclaré manquant, jamais deviné [src:manifest.md] [facts:tree.5.role] [src:readme.md].
3. Validations : corrompre volontairement `facts.json`, une citation du narratif et le deck, puis vérifier que `bun run validate facts|narrative|deck` bloque à chaque fois [src:readme.md] [facts:tree.18.role].
4. Rendu : `bun run render` puis `bun run pdf` pour les six profils sur un même cache, relecture à l'œil de chaque deck, aucun chiffre sans note de bas de page [src:readme.md].
5. Non-régression : épingler `@types/bun` et ajouter un workflow qui lance `bun run check` à chaque push, aujourd'hui inexistant [facts:risks.4.note] [facts:build.ci] [src:ci.md].
> Sans CI, chaque point de ce plan se rejoue à la main sur le commit à qualifier : le point 5 est celui qui rend les quatre autres durables [facts:build.ci] [src:ci.md].
