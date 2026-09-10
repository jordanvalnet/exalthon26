---
repo: mksglu/context-mode
profile: qa
generated_at: 2026-09-09T16:00:00Z
---
# Context Mode : 255 fichiers de tests vitest et une CI sur trois OS, mais des bugs ouverts de timeout et de budget et un seul mainteneur : une base testée, à qualifier zone par zone

## Que fait ce projet et quels sont ses parcours critiques ?
Context Mode est un serveur MCP plus des hooks qui interceptent les sorties d'outils des agents de code, les indexent dans SQLite FTS5, et n'exposent qu'un résumé recherchable ; il persiste aussi la session pour survivre à la compaction et impose un routage sur 17 plateformes [facts:repo.description] [src:readme.md].

Parcours critiques déduits du README et de CONTRIBUTING.md :
- Interception d'une sortie d'outil, indexation, recherche via `ctx_search` [src:contributing.md].
- Exécution de code en bac à sable dans 12 langages (`src/executor.ts`) et règles deny/allow (`src/security.ts`) [src:contributing.md].
- Compaction puis reprise : hooks PreCompact, SessionStart, snapshot injecté [src:contributing.md].
- Installation et diagnostic par la CLI (`setup`, `doctor`) sur chaque plateforme [src:manifest.md].
Le repo compte 226 issues ouvertes toutes catégories [facts:repo.open_issues].
> Quatre parcours à couvrir en priorité : interception puis indexation puis `ctx_search`, exécution en bac à sable dans 12 langages, compaction puis reprise, et `setup`/`doctor` sur 17 plateformes [src:contributing.md] [facts:repo.description].

## Comment est-il testé aujourd'hui ?
<!-- chart: tree -->
Framework vitest, dossier `tests/`, 255 fichiers trouvés par recherche de code [facts:tests.framework] [facts:tests.dir] [facts:tests.files]. `npm test` lance `vitest run`, précédé automatiquement d'un `npm run build` [facts:build.test] [src:manifest.md].

Les 20 premiers chemins montrent des sous-dossiers `tests/executor/`, `tests/core/` (deny-policy, routing), `tests/session/`, `tests/adapters/` (kiro, memory-conventions) et `tests/util/`, plus un `tests/mcp-integration.ts` [src:tests.md]. Un benchmark existe : `npx tsx tests/benchmark.ts` [src:manifest.md].

Le cache ne contient ni couverture de code ni liste complète des 255 fichiers ; à vérifier dans https://github.com/mksglu/context-mode/tree/main/tests.
> 255 fichiers vitest lancés par `npm test` après un build automatique, mais aucune mesure de couverture dans le cache [facts:tests.files] [facts:build.test] [src:manifest.md].

## Que dit la CI et quand tourne-t-elle ?
Un workflow lu, `CI` (`.github/workflows/ci.yml`), déclenché par workflow_dispatch, push et pull_request, sur les branches main et next [facts:build.ci.0.name] [facts:build.ci.0.triggers] [src:ci.md].

Matrice ubuntu, macos et windows, fail-fast désactivé ; Node 22.5, Python 3.12, Go stable, Elixir 1.17 installés pour l'exécuteur polyglotte [src:ci.md]. Étapes : `npm install`, typecheck, build, bundle, assertions sur les bundles (garde-fou issue #511), puis vitest et enfin `npx tsx src/cli.ts doctor` en continue-on-error [src:ci.md].

Quatre workflows non lus : bundle, openclaw-e2e, tier2-e2e-smoke, update-stats [src:ci.md]. Les deux e2e sont à examiner pour connaître la couverture bout en bout réelle.
> Chaque push et pull request sur main et next passe typecheck, build, bundle et vitest sur ubuntu, macos et windows ; quatre workflows dont deux e2e restent non lus [facts:build.ci.0.triggers] [src:ci.md].

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
> 4 issues étiquetées bug sur 119 ouvertes : le label ne suffit pas, partez des titres #947, #959, #950, #1022 et #1024 [facts:issues.by_label.bug] [facts:issues.open] [facts:issues.hot].

## Comment reproduire et signaler un bug ici ?
Le mainteneur demande trois choses : suivre les templates d'issue, lancer `bash scripts/ctx-debug.sh` et joindre sa sortie, écrire des tests pour tout correctif [src:contributing.md]. Pour tester localement dans une vraie session : `npm run build` puis supprimer `server.bundle.mjs`, sinon vos changements ne sont jamais chargés [src:contributing.md].

Côté PR : 107 ouvertes, aucune fusionnée sur 30 jours dans le cache [facts:pulls.open] [facts:pulls.merged_30d]. Attendez-vous à une revue lente ; un rapport de bug précis avec sortie de debug a plus de valeur qu'une PR non testée.
> Un rapport recevable = template d'issue, sortie de `bash scripts/ctx-debug.sh`, prompt exact et étapes de reproduction ; pas de SECURITY.md pour une faille, et 107 PR attendent déjà [src:contributing.md] [facts:business.security_policy] [facts:pulls.open].

## Quelles zones sont peu couvertes ?
Le cache ne contient pas de mesure de couverture ; les zones ci-dessous sont déduites des issues et de la structure, à vérifier dans https://github.com/mksglu/context-mode/tree/main/tests.
- Timeouts et annulation (#947, #959) : les tests vus portent sur l'exécuteur et le bac à sable Windows, pas sur l'interruption [facts:issues.hot.4.url] [src:tests.md].
- Budgets et statistiques (#950, #1022) : `tests/session/stats-output-format.test.ts` existe mais les bugs persistent [src:tests.md] [facts:issues.hot.3.url].
- Plateformes secondaires : issue #45 cherche encore des testeurs sur 15 plateformes × 3 OS [facts:issues.hot.0.title]. Les adaptateurs kiro et memory-conventions ont des tests, les autres n'apparaissent pas dans les 20 chemins vus [src:tests.md].
- Activité concentrée : 60 des commits sur 12 semaines viennent d'une seule personne, donc peu de relecture croisée [facts:activity.contributors.0.commits] [facts:activity.bus_factor].
> Sans couverture mesurée, les trous visibles sont les timeouts, les budgets d'octets et les plateformes secondaires ; bus factor 1, donc vos tests sont la seule relecture croisée [facts:activity.bus_factor] [facts:issues.hot.4.url] [facts:issues.hot.9.url] [facts:issues.hot.0.url] [src:tests.md].

## Plan de test en 5 points
1. Environnement de qualification : `npm install`, `npm run build`, supprimer `server.bundle.mjs`, puis `npx tsx src/cli.ts doctor` ; à dérouler sur les trois OS de la matrice CI, car le doctor y tourne en continue-on-error et ne bloque rien [facts:build.install] [src:contributing.md] [src:ci.md].
2. Régression timeouts et annulation, risque haut : `ctx_batch_execute` doit s'arrêter au timeout même pendant l'indexation (#947) et un `ctx_execute` bloqué sur Pi doit répondre à Esc/Ctrl+C (#959) [facts:issues.hot.4.url] [facts:issues.hot.2.url].
3. Budgets et statistiques, risque haut : le snapshot de reprise doit rester sous son budget d'octets (#1022) et `ctx_stats` doit rester cohérent dans un même rendu, y compris sans appel `ctx_execute` (#950) ; point de départ `tests/session/stats-output-format.test.ts` [facts:issues.hot.9.url] [facts:issues.hot.3.url] [src:tests.md].
4. Continuité de session, risque moyen : le nettoyage des bases périmées ne doit pas supprimer une session vivante mais inactive (#1024) ; vérifier la chaîne PostToolUse, PreCompact, SessionStart décrite dans CONTRIBUTING.md [facts:issues.hot.8.url] [src:contributing.md].
5. Plateformes, risque moyen : 17 plateformes annoncées, l'issue #45 cherche encore des testeurs sur 15 plateformes × 3 OS, et seuls les adaptateurs kiro et memory-conventions ont des tests dans les 20 chemins vus ; compléter par les workflows openclaw-e2e et tier2-e2e-smoke, et ajouter chaque test dans le fichier existant du domaine, jamais un nouveau [facts:repo.description] [facts:issues.hot.0.url] [src:tests.md] [src:ci.md] [src:contributing.md].
