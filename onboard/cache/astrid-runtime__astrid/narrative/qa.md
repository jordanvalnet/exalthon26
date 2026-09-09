---
repo: astrid-runtime/astrid
profile: qa
generated_at: 2026-09-09T15:40:00Z
---
# Astrid : un runtime de sécurité Rust très outillé en CI, mais 42 bugs ouverts, un seul mainteneur et des tests natifs difficiles à rejouer localement

## Que fait ce projet et quels sont ses parcours critiques ?
Astrid est « a portable, capability-secure operating system for composable software » [facts:repo.description] : un runtime user-space sur macOS et Linux qui exécute des composants WebAssembly (« capsules ») dans un sandbox Wasmtime, sans autorité ambiante, chaque accès fichier/réseau/processus étant contrôlé par un jeton de capacité signé [src:readme.md]. Projet jeune (créé le 2026-02-15 [facts:repo.created_at]), 10277 étoiles [facts:repo.stars], 216 issues ouvertes [facts:repo.open_issues], dernier push le 2026-09-09 [facts:repo.pushed_at], version courante v2026.9.0 [facts:releases.0.tag].
Parcours critiques à couvrir, tirés du README [src:readme.md] :
1. Cycle de vie du daemon : `astrid start` / `status` / `capsule list` / `stop`, avec retrait de l'état dans `astrid.volume` à l'arrêt et restauration au redémarrage.
2. Initialisation d'une distribution : `astrid init --distro <source>` (repo, manifeste local, bundle signé `--offline`), écriture d'un `Distro.lock` épinglant chaque capsule par hash BLAKE3.
3. Cycle de vie des capsules à chaud : `capsule new` / `build` / `install` / `update` / `remove` sans redémarrage.
4. Isolation par principal : `agent create`, `caps show`, `quota set`, `pair-device issue --scope use-only` ; un principal ne doit jamais lire l'espace d'un autre, et le système « fails closed ».
5. Montage du stockage durable : `storage mount` / `status` / `sync` / `unmount` via FSKit (macOS 26+) ou FUSE (Linux).
Chaque parcours traverse les mécanismes de sécurité indépendants (sandbox WASM, manifeste allow-list, ACL IPC, jeton de capacité, gate d'approbation, sandbox OS, chaîne d'audit) : ce sont eux qu'il faut tester en négatif [src:readme.md]. Windows est testé en CI mais absent des archives de la release [src:readme.md].

## Comment est-il testé aujourd'hui ?
<!-- chart: tree -->
Pas de dossier `test/`, `tests/` ou `spec/` à la racine : les tests vivent sous `crates/` et `e2e/` [src:tests.md]. Le crate dédié est `crates/astrid-integration-tests` [facts:tests.dir], 39 fichiers relevés [facts:tests.files], avec `cargo test` et des snapshots `insta` [facts:tests.framework] ; un crate `astrid-test` fournit `harness.rs` et `mocks.rs` [src:tests.md] [src:tree.md].
Bout en bout : `e2e/` contient des scénarios TOML (`capability-scenarios.toml`, `cli-scenarios.toml`, `http-scenarios.toml`, `runtime-scenario-specs.toml`, `waiter-surfaces.toml`, `first-party-capsule-scenarios.toml`), un `concurrency.sh` et des fixtures de capsules adverses et concurrentes [facts:tree.20.role] [src:tests.md]. Un dossier `fuzz/` existe à la racine [facts:tree.21.role].
Commande locale : `cargo test --workspace -- --quiet` [facts:build.test] ; en CI, `cargo test --workspace --locked` sur ubuntu et `scripts/ci/test-workspace-macos.sh` sur macos [src:tests.md] [src:ci.md].
Règle d'équipe : « Tests required. New features need tests. Bug fixes need a regression test » [src:contributing.md].
Le cache ne contient ni taux de couverture, ni nombre de cas dans les scénarios TOML, ni le contenu de `runtime-e2e.yml` (« non lu ») ; à vérifier dans https://github.com/astrid-runtime/astrid/tree/main/e2e et https://github.com/astrid-runtime/astrid/blob/main/.github/workflows/runtime-e2e.yml [src:tests.md].

## Que dit la CI et quand tourne-t-elle ?
Un workflow principal, `CI` (`.github/workflows/ci.yml`), déclenché sur `push` et `pull_request` [facts:build.ci.0.name] [facts:build.ci.0.path] [facts:build.ci.0.triggers.0] [facts:build.ci.0.triggers.1]. Le push ne déclenche que sur `main` et `stream-*` et seulement si des `.rs`, `Cargo.toml`/`Cargo.lock`, des scripts de release ou certains workflows changent ; toute PR déclenche sans filtre (« Required build/test checks must also run for stacked and docs-only PRs ») [src:ci.md].
14 jobs, toolchain Rust 1.95 épinglée, `harden-runner` sur chaque job [src:ci.md] :
- Qualité : `fmt`, `clippy -D warnings`, `check --all-features`, `msrv` (1.95), `audit` (cargo-audit 0.22.2).
- Tests : `test` (ubuntu + macos, `CARGO_PROFILE_TEST_DEBUG=0`, cf. #954), `linux-fuse-e2e` (un test `--ignored` de montage FUSE natif), `linux-v0104-upgrade` (script de migration depuis v0.10.4), `windows-filesystem-native` (WinFsp 2.1, x86_64 et aarch64), `wasm-portability`.
- Release : `linux-release-smoke` (4 cibles gnu/musl, contrôles glibc ≤ 2.34 et ELF statique).
- PR seulement, consultatifs : `api-compatibility` (cargo-semver-checks, cf. #1480), `public-rust-api-diff`, `gateway-openapi-contract`.
Au total 20 workflows dans `.github/` [facts:tree.4.role], dont `runtime-e2e.yml`, `native-storage-certification.yml`, `supervised-storage-certification.yml`, `storage-benchmark.yml`, `windows-local-transport.yml`, `codeql.yml`, `nightly.yml` [src:ci.md]. Le risque CI est évalué « low » [facts:risks.3.level] [facts:risks.3.note].
Le cache ne contient ni l'état des derniers runs ni les déclencheurs des 19 autres workflows (le MCP n'expose pas les runs Actions) ; à vérifier dans https://github.com/astrid-runtime/astrid/actions.

## Où sont les bugs connus ?
<!-- chart: issues_by_label -->
192 issues ouvertes [facts:issues.open], 149 fermées sur 30 jours [facts:issues.closed_30d]. Étiquettes utiles pour un plan de test : `bug` 42 [facts:issues.by_label.bug], `security` 46 [facts:issues.by_label.security], `test` 16 [facts:issues.by_label.test], `blocked` 16 [facts:issues.by_label.blocked] ; priorités `p1` 36 [facts:issues.by_label.p1], `p2` 55 [facts:issues.by_label.p2], `p3` 43 [facts:issues.by_label.p3].
Zones les plus chargées : `area/capsule` 73 [facts:issues.by_label.area/capsule], `area/kernel` 43 [facts:issues.by_label.area/kernel], `area/cli` 42 [facts:issues.by_label.area/cli], `area/runtime` 25 [facts:issues.by_label.area/runtime], `area/core` 25 [facts:issues.by_label.area/core]. 91 issues sont `needs-design` [facts:issues.by_label.needs-design] : comportement non figé, donc cas de test à écrire avec prudence.
Bugs concrets et reproductibles parmi les « good first » : #459 « Markdown parser in TUI fails on numbered lists >= 10 » [facts:issues.good_first.3.title] [facts:issues.good_first.3.url], #276 « MCP interceptor: propagate tool_result.is_error instead of treating it as success » [facts:issues.good_first.4.title] [facts:issues.good_first.4.url], #461 « is_known_tag coverage table is 18 vs 19 and omits ToolCancelRequest » [facts:issues.good_first.2.title] [facts:issues.good_first.2.url], #476 sur l'enregistrement dupliqué dans `CapsuleRegistry` [facts:issues.good_first.1.title].
L'issue la plus discutée est un ticket de test : #1708 « test(container): qualify the signed amd64 Linux-backed Astrid host profile », 29 commentaires [facts:issues.hot.0.title] [facts:issues.hot.0.comments] [facts:issues.hot.0.url].
Le cache ne contient pas le croisement `bug` × `area/*` ni la liste des 42 bugs ; à vérifier dans https://github.com/astrid-runtime/astrid/issues?q=is%3Aopen+label%3Abug.

## Comment reproduire et signaler un bug ici ?
Procédure imposée par CONTRIBUTING.md [src:contributing.md] :
1. Chercher une issue existante, puis utiliser le template « bug report ».
2. Reproduire avant d'ouvrir : version ou commit affecté, étapes exactes, comportement attendu et observé, preuves. Les audits en masse, findings spéculatifs et rapports générés par IA non vérifiés sont refusés (« AI output is a drafting aid, not evidence »).
3. Vulnérabilité : jamais d'issue publique, passer par GitHub Security Advisories [src:contributing.md] ; une politique `SECURITY.md` existe [facts:business.security_policy].
4. Pour corriger soi-même : issue assignée d'abord (« Every PR must be linked to an issue. No exceptions »), régression obligatoire pour un bug fix, commit `git commit -s` (DCO), fragment `changes/{issue}.fixed.md`, titre Conventional Commits, template PR complet sinon rejet CI [src:contributing.md].
Le flux est actif : 24 PR ouvertes [facts:pulls.open] et une longue liste de correctifs fusionnés en 30 jours, presque tous en `fix(...)`, par exemple #1906 « fix(init): honor explicit grants after completed batch resume » [facts:pulls.merged_30d.0.title] [facts:pulls.merged_30d.0.url] et #1870 « fix(test): provision private Windows run directory » [facts:pulls.merged_30d.17.title]. Une PR de test récente donne le modèle d'une fixture négative : #1849 « test(capsule): use an unsatisfiable astrid-version fixture » [facts:pulls.merged_30d.28.title] [facts:pulls.merged_30d.28.url].
Le cache ne contient pas le contenu des templates d'issue (`.github/ISSUE_TEMPLATE`) ; à vérifier dans https://github.com/astrid-runtime/astrid/tree/main/.github.

## Quelles zones sont peu couvertes ?
Le cache ne contient aucune mesure de couverture de code ; à vérifier dans https://github.com/astrid-runtime/astrid/actions (job `test`) [src:tests.md]. Les signaux ci-dessous sont indirects.
- Concentration humaine : bus factor 1 [facts:activity.bus_factor], `joshuajbouw` 309 commits contre 7 pour le second contributeur [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] ; risque « high » [facts:risks.1.level] [facts:risks.1.note]. Le relecteur et l'auteur des tests sont la même personne : la revue QA externe a de la valeur.
- Rythme soutenu sans creux : 41 commits en W26 [facts:activity.commits_per_week.0.count], 17 en W37 [facts:activity.commits_per_week.11.count], dernier commit le 2026-09-09 [facts:activity.last_commit] : les régressions arrivent vite, rejouer les scénarios `e2e/` à chaque release.
- Plateformes : Windows testé en CI mais hors release [src:readme.md] ; le montage FUSE natif est un seul test `--ignored` en CI [src:ci.md] ; FSKit exige macOS 26+ et une approbation d'extension signée [src:readme.md], difficile à automatiser.
- Dépendances : 117 entrées dans `Cargo.toml`, 90 externes, 8 épinglées en exact [facts:deps.count] [facts:risks.2.note] ; les deux PR Dependabot ouvertes (#1834, #1877) [facts:roadmap.open_prs.0.title] [facts:roadmap.open_prs.1.title] sont des candidats à une passe de non-régression.
- Fonctionnel : 16 issues `test` [facts:issues.by_label.test] et 16 `blocked` [facts:issues.by_label.blocked] ; les thèmes chauds `campaign/os-universal` (32 issues [facts:issues.by_label.campaign/os-universal]) et les décisions en attente (#1664 « specify the first-owner enrollment ceremony » [facts:issues.hot.6.title], #1692 [facts:issues.hot.8.title]) n'ont pas encore de comportement spécifié à tester.
- Le contenu de `fuzz/` et des 19 workflows hors `ci.yml` n'a pas été lu [src:tests.md] [src:ci.md].
