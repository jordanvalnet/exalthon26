---
path: crates/astrid-integration-tests
url: https://github.com/astrid-runtime/astrid/tree/main/crates/astrid-integration-tests
fetched_at: 2026-09-09T14:58:45Z
---
# Recherche 1 (requête de la procédure) : `repo:astrid-runtime/astrid path:test OR path:tests OR path:__tests__ OR path:spec`
total_count: 0. Aucun dossier test/, tests/ ou spec/ à la racine : les tests vivent sous crates/ et e2e/.

# Recherche 2 : `repo:astrid-runtime/astrid path:crates/astrid-integration-tests OR path:e2e OR path:crates/astrid-test`
total_count: 39. 20 premiers chemins :
e2e/fixtures/astrid-capsule-adversarial/src/lib.rs
e2e/cli-scenarios.toml
e2e/waiter-surfaces.toml
e2e/capability-scenarios.toml
e2e/first-party-capsule-scenarios.toml
e2e/runtime-scenario-specs.toml
e2e/concurrency.sh
e2e/fixtures/astrid-capsule-concurrency/src/lib.rs
e2e/http-scenarios.toml
e2e/fixtures/astrid-capsule-concurrency/Capsule.toml
e2e/fixtures/astrid-capsule-adversarial/Capsule.toml
e2e/fixtures/astrid-capsule-concurrency/.cargo/config.toml
e2e/fixtures/astrid-capsule-adversarial/Cargo.toml
e2e/fixtures/astrid-capsule-concurrency/Cargo.toml
e2e/fixtures/compat/legacy-profile-missing-cpu-fuel.toml
crates/astrid-test/README.md
crates/astrid-integration-tests/README.md
crates/astrid-test/src/mocks.rs
crates/astrid-test/src/harness.rs
crates/astrid-integration-tests/tests/gateway_tls.rs

# Dossier e2e/ (get_file_contents, 8 entrées)
capability-scenarios.toml (11017 o)
cli-scenarios.toml (14863 o)
concurrency.sh (5306 o)
first-party-capsule-scenarios.toml (1938 o)
fixtures/
http-scenarios.toml (6474 o)
runtime-scenario-specs.toml (26155 o)
waiter-surfaces.toml (5957 o)

# Framework et commandes (relevés dans Cargo.toml et ci.yml)
Tests Rust intégrés (cargo test) ; `insta = 1.40` (snapshots yaml/json) dans [workspace.dependencies] ; crate `astrid-test` (harness.rs, mocks.rs) ; crate `astrid-integration-tests` ; dossier `fuzz/` à la racine.
Commande CI : `cargo test --workspace --locked` (ubuntu) ; `scripts/ci/test-workspace-macos.sh` (macos). Workflow dédié `runtime-e2e.yml` non lu.
