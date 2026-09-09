# Glossaire — astrid-runtime/astrid

- **capsule** : composant WebAssembly (cible `wasm32-unknown-unknown`) décrit par un `Capsule.toml`, exécuté dans le sandbox Wasmtime sans autorité ambiante [src:readme.md].
- **principal** : identité (agent, utilisateur) qui possède ses propres capsules, données KV, secrets, home, quotas et chaîne d'audit, isolée des autres principals [src:readme.md].
- **uplink** : client de protocole (CLI, passerelle HTTP, Discord) qui parle au daemon par socket Unix en événements IPC, sans trait `Frontend` [src:readme.md].
- **kernel (astrid-daemon)** : processus noyau volontairement « dumb » qui charge les capsules, route l'IPC sous ACL de capacités et tient la chaîne d'audit, sans état de conversation ni registre d'outils [src:readme.md].
- **capability (jeton de capacité)** : grant ed25519 signé, lié à un principal, scopé à un motif de ressource, à expiration et révocable ; pas de grant, pas d'accès [src:readme.md].
- **WIT / component model** : ABI hôte typée en paquets `astrid:*` (`fs`, `io`, `kv`, `ipc`, `net`, `http`, …) que chaque capsule importe selon son manifeste [src:readme.md].
- **distro** : bundle de capsules curé, installé par `astrid init --distro <source>`, verrouillé par hash BLAKE3 dans `Distro.lock` [src:readme.md].
- **bus factor** : nombre minimal de contributeurs totalisant la moitié des commits des 12 dernières semaines ; ici 1 [facts:activity.bus_factor].
- **MSRV** : Minimum Supported Rust Version, 1.95 pour ce workspace (`rust-version` dans `Cargo.toml`) [src:manifest.md].
- **DCO (Signed-off-by)** : certification humaine ajoutée par `git commit -s`, obligatoire sur chaque commit non-bot, jamais ajoutée par un outil à la place du contributeur [src:contributing.md].
- **Astrinaut** : deuxième tier de contributeur, obtenu après une première contribution réussie, autorisé à réclamer des issues et proposer des PR sur les crates non-core [src:contributing.md].
- **fragment de changelog** : fichier `changes/{issue}.{kind}.md` (kind parmi added, changed, deprecated, removed, fixed, security) attendu avec chaque PR de code ; `CHANGELOG.md` est roulé à la release [src:contributing.md].
- **insta** : crate de tests par snapshot utilisée avec `cargo test` dans `crates/astrid-integration-tests` [facts:tests.framework].
- **FSKit / FUSE** : frontends de système de fichiers (macOS 26+ / Linux) qui montent le stockage d'un principal ; crates `astrid-storage-provider-fskit` et `astrid-storage-provider-fuse` [src:readme.md] [src:tree.md].
