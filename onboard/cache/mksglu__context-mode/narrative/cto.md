---
repo: mksglu/context-mode
profile: cto
generated_at: 2026-09-09T16:00:00Z
---
# Context Mode : outil populaire et utile, bus factor 1, licence ELv2, à adopter en interne sans en dépendre

## Que fait ce projet et quelle est son architecture ?
<!-- chart: tree -->
Serveur MCP plus hooks : les sorties d'outils sont indexées dans SQLite FTS5 et remplacées par un résumé recherchable, la session est persistée pour survivre à la compaction, et un routage est imposé sur 17 plateformes [facts:repo.description] [src:readme.md]. 21 624 étoiles, 1 555 forks, créé le 2026-02-23 [facts:repo.stars] [facts:repo.forks] [facts:repo.created_at].

Architecture en trois couches : `src/` en TypeScript (serveur MCP, CLI, exécuteur polyglotte, sécurité, un adaptateur par plateforme), `hooks/` en JS pur sans build, `configs/` par plateforme [facts:tree] [src:contributing.md]. Deux bases : SessionDB persistante par projet et ContentStore FTS5 éphémère par processus [src:contributing.md]. Les artefacts publiés sont des bundles esbuild (`server.bundle.mjs`, `cli.bundle.mjs`) [facts:tree].

Point d'attention : 5 manifestes de plugin cachés (.claude-plugin, .codex-plugin, .cursor-plugin, .openclaw-plugin, .pi) et un dossier `web/` [facts:tree]. La surface multi-plateforme est le coût principal de maintenance.

## Quelle est sa santé technique ?
<!-- chart: commits_per_week -->
Activité en décrue : 57 commits en semaine 26, plateau à 11-13 par semaine, 9 en semaine 36 [facts:activity.commits_per_week]. Dernier commit le 2026-09-08 [facts:activity.last_commit]. 10 releases entre le 2026-06-01 et le 2026-06-29, aucune dans le cache depuis [facts:releases.9.date] [facts:releases.0.date] ; à vérifier dans https://github.com/mksglu/context-mode/releases.

CI sérieuse : matrice ubuntu, macos, windows, typecheck, build, bundle, assertions d'invariants sur les bundles, vitest, sur push et PR vers main et next [facts:build.ci.0.triggers] [src:ci.md]. 255 fichiers de tests vitest [facts:tests.files].

Signal négatif : 107 PR ouvertes, 0 fusionnée sur 30 jours dans le cache, 119 issues ouvertes, 6 fermées sur 30 jours [facts:pulls.open] [facts:pulls.merged_30d] [facts:issues.open] [facts:issues.closed_30d]. Le débit d'absorption des contributions est quasi nul.

## Qui porte le projet et quel est le bus factor ?
<!-- chart: contributors -->
Bus factor 1 [facts:activity.bus_factor]. `mksglu` : 60 commits sur 12 semaines ; `ken-jo` : 6 ; les huit suivants 1 ou 2 [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.contributors.2.commits]. L'auteur l'écrit : « I'm a solo maintainer with limited time » [src:contributing.md].

Compte personnel, pas d'organisation, pas de CODEOWNERS [facts:repo.owner_type] [facts:business.codeowners]. Financement par GitHub Sponsors uniquement [facts:business.funding] [src:funding.md].

## Quelles dépendances et quelle dette ?
15 dépendances dans package.json, 8 en runtime : SDK MCP, better-sqlite3, zod 3, turndown et son plugin GFM, domino, clack, picocolors [facts:deps.count] [facts:deps.runtime] [src:manifest.md]. better-sqlite3 est un module natif externalisé du bundle : c'est le point de fragilité à l'installation (ABI Node), confirmé par la PR ouverte « pin ABI healing to the running Node » [facts:risks.4.note] [facts:roadmap.open_prs].

Node ≥ 22.5.0 ; `packageManager` déclare pnpm alors que la CI et la doc font `npm install` [src:manifest.md] [src:ci.md]. Un seul TODO/FIXME dans tout le code, et dans un fichier de doc [src:todo.md] : la dette n'est pas dans les commentaires, elle est dans le backlog.

## Quels risques ?
<!-- chart: risks -->
| Risque | Niveau | Parade |
|---|---|---|
| Bus factor 1 [facts:risks.2.level] | high | Fork interne prêt, pas de dépendance produit |
| Licence ELv2 [facts:risks.0.level] | mid | Usage interne et contribution OK ; pas d'offre hébergée [src:license.md] |
| Sécurité : pas de SECURITY.md [facts:risks.1.level] | mid | Revue interne de `src/security.ts` et des hooks avant déploiement |
| CI [facts:risks.3.level] | low | Rien à faire |
| Dépendances [facts:risks.4.level] | low | Épingler la version, surveiller better-sqlite3 |

Le cache ne contient pas `security.md` puisque le repo n'a pas de SECURITY.md [facts:business.security_policy]. Risque supplémentaire non noté : l'outil injecte des prompts et exécute du code ; deux issues signalent des collisions avec le classificateur de Claude Code (#911, #946) [facts:issues.hot.1.url] [facts:issues.hot.5.url].

## Adopter, contribuer ou forker ?
Roadmap sans jalon, un seul thème étiqueté (6 enhancement) ; les 10 PR récentes sont des correctifs de timeouts, routage réseau et budgets [facts:roadmap.themes] [facts:roadmap.open_prs]. Les demandes ouvertes les plus commentées sont un appel à beta-testeurs (#45, 154 commentaires) et des bugs de timeout et de budget [facts:roadmap.requests.0.comments] [facts:issues.hot.4.url].

Décision : adopter en interne, version épinglée, sur une équipe pilote. Contribuer seulement des correctifs petits et testés, car la file de 107 PR n'avance pas. Ne pas forker aujourd'hui : préparer plutôt un fork dormant, et déclencher la bascule si aucune release ne sort d'ici trois mois.
