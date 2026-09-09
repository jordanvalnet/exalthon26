---
path: CHANGELOG.md
url: https://github.com/astrid-runtime/astrid/blob/affd8760f44190dbdfbec23403f4c4b642c33112/CHANGELOG.md
fetched_at: 2026-09-09T14:57:00Z
---
# Changelog

Notable changes to Astrid are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Version numbers follow [year.month.patch](release/VERSIONING.md) beginning with
2026.9.0. Entries describe net changes since the preceding published release.

## [Unreleased]

## [2026.9.0] - 2026-09-08

### Added

- Content-addressed durable storage with principal-owned KV and file trees,
  content-defined chunking, deduplication, atomic root publication, and journal
  recovery. Bounded range writes avoid whole-file buffers.
- Governed FSKit mounts on macOS and FUSE mounts on Linux, with principal views
  and a writable administrative runtime view. Volume branding is configurable;
  usage describes the hosted volume rather than the backing disk's other data.
- Native Linux musl archive targets for x86_64 and ARM64 alongside GNU Linux
  and macOS. GNU compatibility builds support glibc 2.34 enterprise hosts.
- Signed Distro manifests with relative capsule archives, selected inventory
  verification, and caller-scoped resumable installation and grants.
- Restricted throwaway agent sessions, stable principal identities, and full
  principal-state reclamation on deletion.
- Capability-controlled loopback TCP listeners and concurrent capsule workers.
- Pre-mount client configuration for run and administrative timeouts.
  `ASTRID_ADMIN_TIMEOUT_SECS` supplies the administrative fallback; explicit
  client configuration takes precedence.
- Bounded conditional KV batches published through one durable root transition,
  with journal recovery and opt-in governed read caching.
- Durable human and fleet ownership identities, independent of principal names.
- Foreground daemon logging to stderr through `ASTRID_DAEMON_LOG_TARGET=stderr`.

### Changed

- Stopped runtime state is consolidated into `astrid.volume`. Startup restores
  its working projection and clean shutdown retires it. Migration preserves
  existing durable state and supports subsequent restarts.
- Capsule activation uses verified durable package identities; matching
  completed installations resume without repeating daemon install requests.
- Principal runtimes isolate guest memory, run tasks, subscriptions, processes,
  and lifecycle generations while sharing compiled code where appropriate.
- MCP supports protocol 2026-07-28 and shared, session-scoped gateway
  attachments. Quiet connected sessions remain attached; automatic gateway
  and daemon lifetime follows their connections. Run-loop capsule tools
  participate in discovery. RMCP is updated from 2.2.0 to 3.1.4.
- Capsule archives are reproducible for identical inputs; capsule builds honor
  Cargo's resolved target configuration.
- Durable writes and journal recovery reuse verified immutable map subtrees
  without weakening missing-descendant detection or crash recovery.
- Mounted appends reuse verified prefix chunks, extent mutations scan only
  affected ranges, and unchanged volumes avoid redundant device flushes.
  Canonical content identity, quota checks, atomic publication, and failed-flush
  retries are preserved; the volume format is unchanged.
- The Astrid workspace and versioned runtime crates advance from 0.10.4 to
  2026.9.0 using the documented calendar version convention.
- Wasmtime advances from 46.0.1 to 48.0.1; older compiled caches are rebuilt.
  Direct WASM tooling advances from the 0.253 family to 0.257.1, Syn from 2 to
[tronqué]
