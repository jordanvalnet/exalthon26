---
path: .github/workflows/ci.yml
url: https://github.com/astrid-runtime/astrid/blob/main/.github/workflows/ci.yml
fetched_at: 2026-09-09T14:58:45Z
---
name: CI

on:
  push:
    branches: [main, stream-*]
    paths:
      - '**.rs'
      - 'scripts/install-windows.ps1'
      - 'scripts/uninstall-windows.ps1'
      - 'scripts/windows_release_manifest.py'
      - 'scripts/test_windows_release_manifest.py'
      - 'scripts/release_manifest.py'
      - 'scripts/test_release_manifest.py'
      - 'scripts/musl_release_manifest.py'
      - 'scripts/test_musl_release_manifest.py'
      - 'scripts/package_release_archive.py'
      - 'scripts/test_validate_release_archive.py'
      - 'scripts/validate_release_archive.py'
      - 'scripts/build-macos-fskit.sh'
      - 'scripts/check-macos-fskit.sh'
      - 'scripts/manage-macos-fskit.sh'
      - 'scripts/test_manage_macos_fskit.sh'
      - 'scripts/validate-macos-fskit.sh'
      - 'scripts/validate_macos_release.py'
      - 'scripts/test_macos_release_packaging.py'
      - 'scripts/test_v0104_linux_upgrade.sh'
      - 'scripts/test_v0104_macos_upgrade.sh'
      - 'scripts/ci/**'
      - 'scripts/fixtures/windows-release-extension.toml'
      - 'scripts/check_glibc.py'
      - 'scripts/test_check_glibc.py'
      - 'scripts/check_dco.py'
      - 'scripts/test_check_dco.py'
      - 'scripts/changelog.py'
      - 'scripts/test_changelog.py'
      - 'scripts/check_static_elf.py'
      - 'scripts/test_check_static_elf.py'
      - 'scripts/release_publication.py'
      - 'scripts/test_release_publication.py'
      - 'scripts/release_draft_recovery.py'
      - 'scripts/test_release_draft_recovery.py'
      - 'scripts/crate_publication.py'
      - 'scripts/test_crate_publication.py'
      - 'scripts/channel_metadata.py'
      - 'scripts/test_channel_metadata.py'
      - 'scripts/channel_publication.py'
      - 'scripts/test_channel_publication.py'
      - 'scripts/test_channel_workflow_contract.sh'
      - 'scripts/test_ci_workflow_contract.sh'
      - 'scripts/test_gnu_build_packages.py'
      - 'scripts/nightly_version.py'
      - 'scripts/test_nightly_version.py'
      - 'release/nightly.toml'
      - 'crates/astrid-storage-provider-fskit/**'
      - 'native/macos/**'
      - '**/Cargo.toml'
      - '**/Cargo.lock'
      - '.github/workflows/ci.yml'
      - '.github/workflows/native-storage-certification.yml'
      - '.github/workflows/release.yml'
[tronqué]

# Relevé du reste de ci.yml (même fichier)
Second déclencheur : `pull_request:` sans filtre (commentaire du fichier : "Required build/test checks must also run for stacked and docs-only PRs").
permissions: contents: read. Toolchain Rust "1.95" (dtolnay/rust-toolchain), cache Swatinem/rust-cache, step-security/harden-runner sur chaque job.
Jobs (14) :
- linux-release-smoke : cargo build --release --locked -p astrid -p astrid-storage-provider-fuse, 4 cibles (x86_64/aarch64 gnu et musl, dans des images Docker rust épinglées) ; check_glibc.py --max-version 2.34 ; check_static_elf.py
- linux-v0104-upgrade : cargo build --locked -p astrid --bins ; scripts/test_v0104_linux_upgrade.sh
- linux-fuse-e2e : cargo test --locked -p astrid-storage-provider-fuse linux_native_fuse_mount_supports_all_required_operations -- --ignored
- check : cargo check --workspace --all-features --locked ; scripts/ci/test-release-contracts.sh
- wasm-portability : ./scripts/check-wasm-portability.sh (cible wasm32-unknown-unknown)
- windows-filesystem-native : cargo test / clippy sur x86_64 et aarch64 pc-windows-msvc (WinFsp 2.1 épinglé par SHA256)
- fmt : cargo fmt --all -- --check
- clippy : cargo clippy --workspace --all-features --all-targets --locked -- -D warnings
- test : cargo test --workspace --locked (ubuntu-latest) ; scripts/ci/test-workspace-macos.sh (macos-latest) ; CARGO_PROFILE_TEST_DEBUG=0 (cf. #954)
- msrv : cargo check --workspace --locked avec toolchain 1.95
- api-compatibility (PR seulement) : cargo-semver-checks, résultat consultatif (cf. #1480)
- public-rust-api-diff (PR seulement) : cargo-public-api, nightly-2026-06-29
- gateway-openapi-contract (PR seulement) : scripts/ci/diff-gateway-openapi.sh
- audit : cargo metadata --locked ; cargo-audit 0.22.2 ; rustsec/audit-check

# .github/workflows/ (20 fichiers, listés par get_file_contents)
bootstrap-channels.yml
changelog.yml
ci.yml
codeql.yml
dependency-review.yml
macos-v0104-upgrade.yml
native-storage-certification.yml
nightly.yml
oci-amd64.yml
oci-arm64.yml
pr-checks.yml
promote-channel.yml
promote-nightly.yml
publish-stable-crates.yml
release.yml
runtime-e2e.yml
scorecard.yml
storage-benchmark.yml
supervised-storage-certification.yml
windows-local-transport.yml
