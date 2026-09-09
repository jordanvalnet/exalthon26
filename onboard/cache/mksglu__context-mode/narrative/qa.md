---
repo: mksglu/context-mode
profile: qa
generated_at: 2026-09-09T16:00:00Z
---
# Context Mode : un serveur MCP et des hooks multi-plateformes, 255 fichiers de tests vitest, 119 issues ouvertes dont 4 bugs étiquetés

## Que fait ce projet et quels sont ses parcours critiques ?
Context Mode est un serveur MCP plus des hooks qui interceptent les sorties d'outils des agents de code, les indexent dans SQLite FTS5, et n'exposent qu'un résumé recherchable ; il persiste aussi la session pour survivre à la compaction et impose un routage sur 17 plateformes [facts:repo.description] [src:readme.md].

Parcours critiques déduits du README et de CONTRIBUTING.md :
- Interception d'une sortie d'outil, indexation, recherche via `ctx_search` [src:contributing.md].
- Exécution de code en bac à sable dans 12 langages (`src/executor.ts`) et règles deny/allow (`src/security.ts`) [src:contributing.md].
- Compaction puis reprise : hooks PreCompact, SessionStart, snapshot injecté [src:contributing.md].
- Installation et diagnostic par la CLI (`setup`, `doctor`) sur chaque plateforme [src:manifest.md].
Le repo compte 226 issues ouvertes toutes catégories [facts:repo.open_issues].

## Comment est-il testé aujourd'hui ?
<!-- chart: tree -->
Framework vitest, dossier `tests/`, 255 fichiers trouvés par recherche de code [facts:tests.framework] [facts:tests.dir] [facts:tests.files]. `npm test` lance `vitest run`, précédé automatiquement d'un `npm run build` [facts:build.test] [src:manifest.md].

Les 20 premiers chemins montrent des sous-dossiers `tests/executor/`, `tests/core/` (deny-policy, routing), `tests/session/`, `tests/adapters/` (kiro, memory-conventions) et `tests/util/`, plus un `tests/mcp-integration.ts` [src:tests.md]. Un benchmark existe : `npx tsx tests/benchmark.ts` [src:manifest.md].

Le cache ne contient ni couverture de code ni liste complète des 255 fichiers ; à vérifier dans https://github.com/mksglu/context-mode/tree/main/tests.

## Que dit la CI et quand tourne-t-elle ?
Un workflow lu, `CI` (`.github/workflows/ci.yml`), déclenché par workflow_dispatch, push et pull_request, sur les branches main et next [facts:build.ci.0.name] [facts:build.ci.0.triggers] [src:ci.md].

Matrice ubuntu, macos et windows, fail-fast désactivé ; Node 22.5, Python 3.12, Go stable, Elixir 1.17 installés pour l'exécuteur polyglotte [src:ci.md]. Étapes : `npm install`, typecheck, build, bundle, assertions sur les bundles (garde-fou issue #511), puis vitest et enfin `npx tsx src/cli.ts doctor` en continue-on-error [src:ci.md].

Quatre workflows non lus : bundle, openclaw-e2e, tier2-e2e-smoke, update-stats [src:ci.md]. Les deux e2e sont à examiner pour connaître la couverture bout en bout réelle.

## Où sont les bugs connus ?
<!-- chart: issues_by_label -->
119 issues ouvertes, 6 fermées sur 30 jours ; seules 11 sont étiquetées : 6 enhancement, 4 bug, 1 help wanted [facts:issues.open] [facts:issues.closed_30d] [facts:issues.by_label]. Le tri par label est donc peu fiable, lire les titres.

Bugs les plus discutés :
- #950 : `ctx_stats` se contredit dans un même rendu et annonce 100 % d'économie sans aucun appel [facts:issues.hot.3.url] [facts:issues.hot.3.comments].
- #947 : le timeout de `ctx_batch_execute` ne borne pas l'indexation, un agent peut pendre des heures [facts:issues.hot.4.url].
- #959 : sur l'adaptateur Pi, un `ctx_execute` bloqué ne peut pas être interrompu [facts:issues.hot.2.url].
- #1024 : le nettoyage des bases périmées supprime des sessions vivantes mais inactives [facts:issues.hot.8.url].
- #1022 : le snapshot de reprise ignore son budget d'octets, ~196 KB injectés au lieu de 2 KB [facts:issues.hot.9.url].
- #911 et #946 : l'injection de prompt déclenche le classificateur de Claude Code [facts:issues.hot.1.url] [facts:issues.hot.5.url].

## Comment reproduire et signaler un bug ici ?
Le mainteneur demande trois choses : suivre les templates d'issue, lancer `bash scripts/ctx-debug.sh` et joindre sa sortie, écrire des tests pour tout correctif [src:contributing.md]. Pour tester localement dans une vraie session : `npm run build` puis supprimer `server.bundle.mjs`, sinon vos changements ne sont jamais chargés [src:contributing.md].

Côté PR : 107 ouvertes, aucune fusionnée sur 30 jours dans le cache [facts:pulls.open] [facts:pulls.merged_30d]. Attendez-vous à une revue lente ; un rapport de bug précis avec sortie de debug a plus de valeur qu'une PR non testée.

## Quelles zones sont peu couvertes ?
Le cache ne contient pas de mesure de couverture ; les zones ci-dessous sont déduites des issues et de la structure, à vérifier dans https://github.com/mksglu/context-mode/tree/main/tests.
- Timeouts et annulation (#947, #959) : les tests vus portent sur l'exécuteur et le bac à sable Windows, pas sur l'interruption [facts:issues.hot.4.url] [src:tests.md].
- Budgets et statistiques (#950, #1022) : `tests/session/stats-output-format.test.ts` existe mais les bugs persistent [src:tests.md] [facts:issues.hot.3.url].
- Plateformes secondaires : issue #45 cherche encore des testeurs sur 15 plateformes × 3 OS [facts:issues.hot.0.title]. Les adaptateurs kiro et memory-conventions ont des tests, les autres n'apparaissent pas dans les 20 chemins vus [src:tests.md].
- Activité concentrée : 60 des commits sur 12 semaines viennent d'une seule personne, donc peu de relecture croisée [facts:activity.contributors.0.commits] [facts:activity.bus_factor].
