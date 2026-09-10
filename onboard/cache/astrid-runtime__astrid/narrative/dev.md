---
repo: astrid-runtime/astrid
profile: dev
generated_at: 2026-09-09T15:07:08Z
---
# Astrid : un runtime Rust capability-secure pour capsules WebAssembly, porté par un seul mainteneur

## Que fait ce projet et pour qui ?
Astrid se décrit comme « a portable, capability-secure operating system for composable software » [facts:repo.description] : aujourd'hui un runtime user-space sur macOS et Linux, la cible affichée étant un OS autonome [src:readme.md].
Les composants sont des **capsules** WebAssembly exécutées dans Wasmtime sans autorité ambiante ; le noyau (`astrid-daemon`) se contente de router des événements IPC sous ACL de capacités, sans handle LLM ni registre d'outils [src:readme.md].
Public visé : qui construit des systèmes d'agents, des outils, des services ou une distribution, et refuse que le modèle soit l'autorité qui autorise ses propres actions ; Astrid n'impose ni produit, ni fournisseur de modèle, ni boucle d'agent [src:readme.md]. Topics cohérents : `rust` [facts:repo.topics.6], `wasm` [facts:repo.topics.8], `mcp` [facts:repo.topics.4], `capability-security` [facts:repo.topics.2].
Quatre binaires : `astrid` (CLI uplink, TUI et mode headless), `astrid-daemon` (noyau), `astrid-build` (compile les capsules vers `wasm32-unknown-unknown`), `astrid-emit` (pont stdio → bus) [src:readme.md].
Chiffres : 10277 étoiles [facts:repo.stars], 137 forks [facts:repo.forks], 216 issues ouvertes [facts:repo.open_issues], dépôt créé le 2026-02-15 [facts:repo.created_at] par une organisation [facts:repo.owner_type], dernier push le 2026-09-09 [facts:repo.pushed_at].
Licence relevée par GitHub : Apache-2.0 [facts:repo.license] ; le README et les fichiers `LICENSE-APACHE` / `LICENSE-MIT` disent « MIT OR Apache-2.0 » [src:readme.md] [facts:tree.11.path] [facts:tree.12.path]. Le cache ne contient pas la répartition des langages (bloc `languages` absent) ; à vérifier sur https://github.com/astrid-runtime/astrid. Le manifeste est un workspace Cargo [facts:deps.manifest].
> Quatre binaires Rust (`astrid`, `astrid-daemon`, `astrid-build`, `astrid-emit`) autour d'un seul principe, une capsule WebAssembly n'a que les capacités qu'on lui accorde [src:readme.md] ; 10277 étoiles et 216 issues ouvertes pour un dépôt créé le 2026-02-15 [facts:repo.stars] [facts:repo.open_issues] [facts:repo.created_at].

## Comment le code est-il organisé ?
<!-- chart: tree -->
Workspace Cargo (`Cargo.toml`, resolver 2, 32 membres) [facts:tree.10.role] [src:manifest.md] ; tout le code est sous `crates/` : 33 crates, dont `astrid-cli-mockup` hors workspace [facts:tree.18.role] [src:tree.md].
Repères par rôle, d'après les noms de crates [src:tree.md] : noyau et bus (`astrid-kernel`, `astrid-daemon`, `astrid-runtime`, `astrid-events`, `astrid-hooks`, `astrid-config`) ; sécurité (`astrid-crypto`, `astrid-capabilities`, `astrid-audit`, `astrid-approval`, `astrid-vfs`, `astrid-core`) ; état (`astrid-storage`, `astrid-storage-provider-fuse` / `-fskit` / `-winfsp`, `astrid-storage-chunker-evidence`) ; frontends (`astrid-cli`, `astrid-gateway`, `astrid-mcp`, `astrid-uplink`) ; outillage capsules (`astrid-build`, `astrid-capsule`, `astrid-capsule-install`, `astrid-capsule-types`, `astrid-emit`).
Frontière de sécurité, réservée aux tiers Core et Maintainer : `astrid-crypto`, `astrid-capabilities`, `astrid-audit`, `astrid-approval`, `astrid-vfs`, `astrid-storage`, `astrid-sys`, `astrid-core` [src:contributing.md]. Note : `astrid-sys` n'apparaît pas dans le `crates/` relevé [src:tree.md].
Autour du code : `e2e/` (scénarios TOML et fixtures bout en bout) [facts:tree.20.role], `fuzz/` [facts:tree.21.role], `crates/astrid-integration-tests` (39 fichiers, cargo test + insta) [facts:tests.dir] [facts:tests.files] [facts:tests.framework], `native/macos/` [facts:tree.22.role], `docs/` [facts:tree.19.role], `scripts/` (build, CI, release) [facts:tree.26.role], `changes/` (fragments de changelog en attente) [facts:tree.15.role], `.github/` avec 20 workflows [facts:tree.4.role].
Deux curiosités : `wit` est un fichier de 0 octet à la racine [facts:tree.27.role] et `.gitmodules` déclare des sous-modules [facts:tree.6.role] ; le cache ne dit pas ce qu'ils pointent, à vérifier dans https://github.com/astrid-runtime/astrid/blob/main/.gitmodules.
Aucun repère pour agents IA (AGENTS.md, CLAUDE.md, .cursorrules…) : score 0 sur 7 [facts:ai_docs.score] [facts:ai_docs.max] ; seul un dossier `.gemini/` existe [facts:tree.2.role].
> 33 crates sous `crates/`, 32 dans le workspace [facts:tree.18.role] ; les crates de sécurité (`astrid-crypto`, `astrid-capabilities`, `astrid-core`…) sont fermées aux nouveaux, votre terrain est `crates/astrid-cli` [src:contributing.md].

## Par où commencer à lire ?
1. `crates/astrid-cli/src/main.rs` [facts:entrypoints.0.path] : binaire `astrid`, `#[tokio::main]` qui parse clap puis route vers `dispatch` ; client léger qui se connecte au kernel (auto-démarrage), crée ou reprend des sessions et rend les événements en streaming [facts:entrypoints.0.why].
2. `crates/astrid-cli/src/cli.rs` [facts:entrypoints.2.path] : définitions clap des sous-commandes (`agent`, `capsule`, `quota`, `status`, `start`, `stop`, `ps`, `top`) ; déduit du `mod cli` de main.rs, fichier non lu par le collecteur [facts:entrypoints.2.why].
3. `crates/astrid-daemon/src/main.rs` [facts:entrypoints.1.path] : 26 lignes, `setsid` puis runtime tokio multi-thread qui appelle `astrid_daemon::run()` [facts:entrypoints.1.why]. C'est la porte vers le noyau.
4. `crates/astrid-cli-mockup/src/main.rs` [facts:entrypoints.3.path] : maquette de CLI hors workspace, à ignorer au début [facts:entrypoints.3.why].
Pour le modèle mental, lire d'abord les sections « How it works » et « The security model » du README (uplinks, bus, `Capsule.toml` avec `[imports]`/`[exports]`, ABI WIT `astrid:*`) [src:readme.md], puis The Astrid Book, présenté comme la référence canonique avec ancres fichier/ligne [gh:https://github.com/astrid-runtime/book]. Le SDK des capsules (`astrid-sdk`) vit dans un autre dépôt [gh:https://github.com/astrid-runtime/sdk-rust].
Le cache ne contient pas le corps de `astrid_daemon::run()` ni `crates/astrid-kernel/src/lib.rs` ; à vérifier dans https://github.com/astrid-runtime/astrid/tree/main/crates/astrid-daemon/src et https://github.com/astrid-runtime/astrid/tree/main/crates/astrid-kernel/src.
> Deux fichiers suffisent pour le premier jour : `crates/astrid-cli/src/main.rs` (le client) puis `crates/astrid-daemon/src/main.rs` (26 lignes, la porte du noyau) [facts:entrypoints.0.path] [facts:entrypoints.1.path] [facts:entrypoints.1.why].

## Comment builder, tester et lancer ?
Rust 1.95 minimum, édition 2024 [src:manifest.md], version épinglée par `rust-toolchain.toml` à la racine [facts:tree.24.role]. Depuis un shell :
```bash
git clone https://github.com/astrid-runtime/astrid
cd astrid && cargo build --release   # binary at ./target/release/astrid
cargo test --workspace -- --quiet
astrid start && astrid status && astrid stop
```
Commandes prises dans [facts:build.install], [facts:build.test], [facts:build.run] et le « Quick start » du README [src:readme.md]. Alternatives : `brew tap astrid-runtime/tap && brew install astrid`, ou `cargo install astrid` [src:readme.md].
Avant une PR, rejouer la CI en local : `cargo fmt --all -- --check`, `cargo clippy --workspace --all-features --all-targets --locked -- -D warnings`, `cargo test --workspace --locked` [src:ci.md] ; CONTRIBUTING exige au minimum `cargo test --workspace` et `cargo clippy -- -D warnings` [src:contributing.md]. Lints du workspace : `unsafe_code = "deny"`, clippy `pedantic` en warn, `arithmetic_side_effects = "deny"` [src:manifest.md].
CI : `.github/workflows/ci.yml` [facts:build.ci.0.path], déclenchée sur `push` [facts:build.ci.0.triggers.0] (branches `main` et `stream-*`) et `pull_request` [facts:build.ci.0.triggers.1] ; 14 jobs dont check, fmt, clippy, test (ubuntu et macos), msrv 1.95, cargo-audit, portabilité wasm32, tests natifs Windows [src:ci.md] [facts:risks.3.note]. 20 workflows au total [facts:tree.4.role].
Le cache ne contient pas les prérequis système (FUSE, FSKit, WinFsp) des tests de stockage ni le temps de build ; à vérifier dans `scripts/` [facts:tree.26.role] et https://github.com/astrid-runtime/astrid/blob/main/.github/workflows/ci.yml.
> `cargo build --release`, `cargo test --workspace -- --quiet`, puis `cargo clippy --workspace --all-features --all-targets --locked -- -D warnings` : exactement ce que la CI rejoue sur chaque push et pull_request [facts:build.install] [facts:build.test] [src:ci.md] [facts:build.ci.0.triggers.0] [facts:build.ci.0.triggers.1].

## Comment le projet vit-il ?
<!-- chart: commits_per_week -->
Activité soutenue : entre 16 [facts:activity.commits_per_week.2.count] et 41 [facts:activity.commits_per_week.0.count] commits par semaine sur les 12 dernières semaines (2026-W26 [facts:activity.commits_per_week.0.week] à 2026-W37 [facts:activity.commits_per_week.11.week]), dernier commit le 2026-09-09T13:46:34Z [facts:activity.last_commit].
Mais une seule personne porte le projet : `joshuajbouw` 309 commits [facts:activity.contributors.0.commits], `jvsteiner` 7 [facts:activity.contributors.1.commits], `Copilot` 3 [facts:activity.contributors.2.commits]. Bus factor 1 [facts:activity.bus_factor], risque noté `high` [facts:risks.1.level] : « Un seul contributeur porte la moitié des commits sur 12 semaines » [facts:risks.1.note].
Conséquence pratique : un seul relecteur pour vos PR ; 24 PR ouvertes [facts:pulls.open] pour 188 fusionnées en 30 jours [facts:pulls.merged_30d]. Le cache ne dit pas combien attendent une revue (le serveur MCP n'expose pas les reviews) ; à vérifier dans https://github.com/astrid-runtime/astrid/pulls.
Releases : `v2026.9.0` publiée le 2026-09-09 [facts:releases.0.tag] [facts:releases.0.date], première du schéma `year.month.patch` annoncé par le README [src:readme.md] ; avant elle, de `v0.9.3` (2026-07-06) [facts:releases.9.tag] [facts:releases.9.date] à `v0.10.4` (2026-07-20) [facts:releases.1.tag] [facts:releases.1.date], plus des tags de canal `channel-stable`, `channel-nightly`, `channel-dev` [facts:releases.5.tag] [facts:releases.6.tag] [facts:releases.7.tag].
Dépôt créé le 2026-02-15 [facts:repo.created_at], 10277 étoiles [facts:repo.stars] pour 137 forks [facts:repo.forks] : beaucoup de regards, peu de mains. Le cache ne contient ni l'historique avant W26 ni un rythme de release annoncé ; à vérifier dans `CHANGELOG.md` (410 Ko) [facts:tree.7.role] et https://github.com/astrid-runtime/astrid/releases.
> 309 commits en 12 semaines pour `joshuajbouw`, 7 pour le suivant : bus factor 1, un seul relecteur possible, mais 188 PR fusionnées en 30 jours et un commit le 2026-09-09 [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits] [facts:activity.bus_factor] [facts:pulls.merged_30d] [facts:activity.last_commit].

## Quelle première contribution ?
Processus strict : issue d'abord, attendre l'assignation par un mainteneur, label `newcomer-approved` posé sur la PR d'un nouveau, `Closes #N`, template PR entièrement rempli, commit signé `git commit -s` (DCO), fragment `changes/{issue}.{kind}.md`, titre Conventional Commits ; une PR sans issue liée est fermée [src:contributing.md].
5 issues `good first issue` [facts:issues.good_first] sur 192 ouvertes [facts:issues.open] (149 fermées en 30 jours [facts:issues.closed_30d], 42 étiquetées `bug` [facts:issues.by_label.bug]) :
- #459 « Markdown parser in TUI fails on numbered lists >= 10 » [facts:issues.good_first.3.title] [gh:https://github.com/astrid-runtime/astrid/issues/459] : la TUI est dans le binaire `astrid` [src:readme.md], donc `crates/astrid-cli`, crate non-core ouverte aux nouveaux [src:contributing.md] ; périmètre borné, test de régression évident : meilleur candidat.
- #276 « MCP interceptor: propagate tool_result.is_error instead of treating it as success » [facts:issues.good_first.4.title] [gh:https://github.com/astrid-runtime/astrid/issues/276] : probablement `crates/astrid-mcp`, hors liste des crates de sécurité [src:contributing.md].
- #497 « Remove dead AgentHandler stub from astrid-hooks » [facts:issues.good_first.0.title] [gh:https://github.com/astrid-runtime/astrid/issues/497] : `astrid-hooks` est un crate core, à confirmer avec le mainteneur avant de la réclamer [src:contributing.md]. Restent #476 [facts:issues.good_first.1.number] et #461 [facts:issues.good_first.2.number].
Repère de style : les PR fusionnées suivent `fix(scope): …` / `feat(scope): …`, ex. « fix(init): honor explicit grants after completed batch resume » fusionnée le 2026-09-09 [facts:pulls.merged_30d.0.title] [facts:pulls.merged_30d.0.merged_at]. Éviter au début les fils chauds comme #1708 (29 commentaires) [facts:issues.hot.0.comments].
Le cache ne dit pas si ces issues sont déjà assignées ; à vérifier sur chaque URL avant de commenter pour la réclamer.
> Visez #459 (parser Markdown de la TUI, dans `crates/astrid-cli`) : commentez l'issue, attendez l'assignation, puis PR signée `git commit -s` avec `Closes #459` et le fragment `changes/459.fixed.md` [facts:issues.good_first.3.number] [gh:https://github.com/astrid-runtime/astrid/issues/459] [src:contributing.md].

## Vos 3 premières actions
1. Cloner et vérifier le build : `git clone https://github.com/astrid-runtime/astrid && cd astrid && cargo build --release`, puis `cargo test --workspace -- --quiet` ; Rust 1.95 minimum, épinglé par `rust-toolchain.toml` [facts:build.install] [facts:build.test] [src:manifest.md] [facts:tree.24.role].
2. Lancer le runtime et suivre le code qui tourne : `astrid start && astrid status && astrid capsule list && astrid stop` [facts:build.run] [src:readme.md], en lisant `crates/astrid-cli/src/main.rs` puis `crates/astrid-daemon/src/main.rs` [facts:entrypoints.0.path] [facts:entrypoints.1.path].
3. Réclamer #459 par un commentaire sur l'issue et attendre l'assignation ; ensuite seulement : `cargo clippy -- -D warnings` vert, `git commit -s -m "fix(scope): …"`, fragment `changes/459.fixed.md` avec `Closes #459`, template de PR rempli, label `newcomer-approved` posé par un mainteneur [gh:https://github.com/astrid-runtime/astrid/issues/459] [src:contributing.md].
Hors périmètre tant que vous n'êtes pas promu : `astrid-crypto`, `astrid-capabilities`, `astrid-audit`, `astrid-approval`, `astrid-vfs`, `astrid-storage`, `astrid-sys`, `astrid-core`, réservés aux tiers Core et Maintainer [src:contributing.md].
