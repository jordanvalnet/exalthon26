---
path: Cargo.toml
url: https://github.com/astrid-runtime/astrid/blob/main/Cargo.toml
fetched_at: 2026-09-09T14:58:45Z
---
[workspace]
resolver = "2"
members = [
    "crates/astrid-approval",
    "crates/astrid-audit",
    "crates/astrid-capabilities",
    "crates/astrid-build",
    "crates/astrid-capsule",
    "crates/astrid-capsule-install",
    "crates/astrid-capsule-types",
    "crates/astrid-cli",
    "crates/astrid-config",
    "crates/astrid-daemon",
    "crates/astrid-core",
    "crates/astrid-emit",
    "crates/astrid-crypto",
    "crates/astrid-events",
    "crates/astrid-types",
    "crates/astrid-gateway",
    "crates/astrid-hooks",
    "crates/astrid-integration-tests",
    "crates/astrid-kernel",
    "crates/astrid-mcp",
    "crates/astrid-prelude",
    "crates/astrid-runtime",
    "crates/astrid-storage",
    "crates/astrid-storage-chunker-evidence",
    "crates/astrid-storage-provider-fuse",
    "crates/astrid-storage-provider-fskit",
    "crates/astrid-storage-provider-winfsp",
    "crates/astrid-telemetry",
    "crates/astrid-test",
    "crates/astrid-uplink",
    "crates/astrid-vfs",
    "crates/astrid-workspace",
]

[workspace.package]
version = "2026.9.0"
edition = "2024"
authors = ["Joshua J. Bouw <dev@joshuajbouw.com>", "Unicity Labs <info@unicity-labs.com>"]
license = "MIT OR Apache-2.0"
repository = "https://github.com/astrid-runtime/astrid"
rust-version = "1.95"

[workspace.dependencies]
astrid-approval = { path = "crates/astrid-approval", version = "2026.9.0" }
astrid-audit = { path = "crates/astrid-audit", version = "2026.9.0" }
astrid-capabilities = { path = "crates/astrid-capabilities", version = "2026.9.0" }
astrid-build = { path = "crates/astrid-build", version = "2026.9.0" }
astrid-capsule = { path = "crates/astrid-capsule", version = "2026.9.0" }
astrid-capsule-install = { path = "crates/astrid-capsule-install", version = "2026.9.0" }
astrid-capsule-types = { path = "crates/astrid-capsule-types", version = "2026.9.0" }
astrid-config = { path = "crates/astrid-config", version = "2026.9.0" }
astrid-daemon = { path = "crates/astrid-daemon", version = "2026.9.0" }
astrid-core = { path = "crates/astrid-core", version = "2026.9.0" }
astrid-crypto = { path = "crates/astrid-crypto", version = "2026.9.0" }
astrid-emit = { path = "crates/astrid-emit", version = "2026.9.0" }
astrid-events = { path = "crates/astrid-events", version = "2026.9.0" }
astrid-hooks = { path = "crates/astrid-hooks", version = "2026.9.0" }
[tronqué]

# Suite de [workspace.dependencies], relevée du même fichier (commentaires retirés, versions telles qu'écrites)
# 13 autres crates internes (path, version 2026.9.0 sauf astrid-test sans version) :
astrid-kernel, astrid-mcp, astrid-prelude, astrid-runtime, astrid-storage, astrid-storage-provider-winfsp, astrid-telemetry, astrid-test, astrid-types (features = ["clock"]), astrid-uplink, astrid-gateway, astrid-vfs, astrid-workspace
# 90 crates externes, dans l'ordre du fichier :
anyhow = "1.0"
arboard = "3"
arc-swap = "1.7"
lz4_flex = "0.14"
async-stream = "0.3"
async-trait = "0.1"
axum = "0.8"
axum-server = "0.8"
tokio-stream = "0.1"
base64 = "0.23"
blake3 = "1.5"
caseless = "=0.2.2"
chrono = "0.4"
clap = "4.5"
clap_complete = "4.5"
colored = "3.1"
crossterm = "0.29"
dashmap = "6.1.0"
dialoguer = "0.11"
directories = "6.0"
ed25519-dalek = "3.0"
flate2 = "1.0"
fastcdc = "=5.0.0"
fastcdc-v4 = { package = "fastcdc", version = "=4.0.1" }
fs2 = "0.4"
futures = "0.3"
globset = "0.4"
hex = "0.4"
ignore = "0.4"
indicatif = "0.18"
insta = "1.40"
jsonrpsee = "0.24"
keyring = "3"
landlock = "0.4"
libc = "0.2"
nix = "0.31"
process-wrap = "10"
signal-hook = "0.4"
metrics = "0.24"
metrics-exporter-prometheus = "0.18"
metrics-process = "2.4"
mincdc = "=0.1.0"
mothcdc = "=0.7.2"
notify = "8"
parking_lot = "0.12"
rand = "0.10"
ratatui = "0.30"
rcgen = "0.14"
rustls = "0.23"
regex = "1.10"
reqwest = "0.12"
rmcp = "~3.1.4"
rustyline = "18"
semver = "1"
serde = "1.0"
serde_json = "1.0"
serde_yaml = "0.9"
sha2 = "0.11"
sigstore-verify = "=0.11.0"
subtle = "2"
surrealkv = "0.21"
syn = "~3.0.4"
syntect = "5"
tar = "0.4"
teloxide = "0.13"
tempfile = "3"
thiserror = "2.0"
tokio = "1.49"
tokio-util = "0.7"
toml = "~1.1.4"
tower = "0.5"
tower-http = "0.7"
tracing = "0.1"
tracing-subscriber = "0.3"
url = "2"
utoipa = "5"
uuid = "~1.25.0"
walkdir = "2.5"
wasm-encoder = "0.257.1"
wat = "=1.257.1"
wasmparser = "0.257.1"
windows-sys = "0.61"
wit-component = "0.257.1"
wit-parser = "0.257.1"
wasmtime = "48.0.1"
wasmtime-wasi = "48.0.1"
unicode-normalization = "=0.1.25"
unicode-width = "0.2"
which = "8"
zeroize = "1.8"

[workspace.lints.rust]
unsafe_code = "deny"

[workspace.lints.clippy]
all = { level = "warn", priority = -1 }
pedantic = { level = "warn", priority = -1 }
arithmetic_side_effects = "deny"
