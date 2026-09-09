# FAQ — astrid-runtime/astrid

## Q : Puis-je toucher au kernel ou aux crates de sécurité dès ma première PR ? (dev, 2026-09-09)
Non. Tier « New » : issue d'abord, assignation par un mainteneur, label `newcomer-approved` sur la PR. Tier « Astrinaut » (après une première contribution réussie) : crates non-core seulement (CLI, SDK, capsules, docs, tests). Tier « Core » : kernel, events, hooks, config [src:contributing.md].
Les crates de sécurité (`astrid-crypto`, `astrid-capabilities`, `astrid-audit`, `astrid-approval`, `astrid-vfs`, `astrid-storage`, `astrid-sys`, `astrid-core`) restent Core/Maintainer, avec co-revue mainteneur sur les chemins critiques [src:contributing.md].
Les refactors venant de non-mainteneurs sont refusés : ouvrir une issue à la place [src:contributing.md]. Le relecteur effectif est unique (bus factor 1 [facts:activity.bus_factor]).

## Q : Quelle toolchain faut-il installer pour compiler et faire passer la CI ? (dev, 2026-09-09)
Rust 1.95 minimum, édition 2024 [src:manifest.md], version épinglée par `rust-toolchain.toml` [facts:tree.24.role].
La CI enchaîne `cargo fmt --all -- --check`, `cargo clippy --workspace --all-features --all-targets --locked -- -D warnings`, `cargo test --workspace --locked` sur ubuntu et macos, un check MSRV 1.95 et `cargo-audit` [src:ci.md] ; pour les capsules, la cible `wasm32-unknown-unknown` (job wasm-portability) [src:ci.md] [src:readme.md].
Le cache ne liste pas les paquets système (FUSE, FSKit, WinFsp) requis par les tests de stockage ; à vérifier dans `scripts/` [facts:tree.26.role].

## Q : Que doit contenir ma PR pour ne pas être rejetée par la CI ou le mainteneur ? (dev, 2026-09-09)
Un `Closes #N` vers une issue qui vous a été assignée, le template PR entièrement rempli (sections vides = rejet par la CI), des commits `git commit -s` dont le `Signed-off-by` porte l'email de l'auteur, un fragment `changes/{issue}.{kind}.md`, un titre Conventional Commits, des tests (régression pour un bug), aucun fichier au-delà de 1000 lignes sans label `large-file-ok` [src:contributing.md].
Si un outil ou un modèle a produit du contenu significatif : le déclarer dans la section « AI / Tool Assistance » avec `Assisted-by: TOOL_OR_AGENT: MODEL_VERSION` [src:contributing.md].
Exemple de titre conforme parmi les PR fusionnées : « fix(init): honor explicit grants after completed batch resume » [facts:pulls.merged_30d.0.title].
