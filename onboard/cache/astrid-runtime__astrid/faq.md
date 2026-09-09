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

## Q : Peut-on utiliser Astrid dans un produit commercial sans payer ? (ceo, 2026-09-09)
Oui sur le plan juridique : la licence est Apache-2.0, permissive, qui autorise usage commercial, modification et redistribution [facts:repo.license] [facts:risks.0.note].
Le projet ne déclare aucun financement ni sponsor [facts:business.funding] : il n'y a pas de vendeur derrière, donc pas de support contractuel à acheter dans l'état du cache.
Le README précise que la version actuelle est un moteur hébergé sur macOS et Linux, pas encore un système d'exploitation autonome [src:readme.md] : à intégrer comme une brique, pas comme une plateforme complète.

## Q : Que se passe-t-il si le développeur principal s'arrête ? (ceo, 2026-09-09)
C'est le risque numéro un, classé élevé : une seule personne porte la moitié des modifications des 12 dernières semaines [facts:risks.1.level] [facts:risks.1.note], soit 309 modifications contre 7 pour le suivant [facts:activity.contributors.0.commits] [facts:activity.contributors.1.commits].
Les garde-fous existent : responsables de code désignés, politique de sécurité publiée [facts:business.codeowners] [facts:business.security_policy], licence permissive qui permet de reprendre le code [facts:repo.license].
Mais 137 copies du projet et 10 277 étoiles ne garantissent pas une relève [facts:repo.forks] [facts:repo.stars] ; le cache ne dit pas qui d'autre pourrait reprendre.

## Q : Est-ce mûr ou encore en chantier ? (ceo, 2026-09-09)
En chantier, mais un chantier actif : entre 16 et 41 modifications par semaine sur 12 semaines [facts:activity.commits_per_week], 10 versions récentes dont v2026.9.0 le 9 septembre 2026 [facts:releases.0.date].
Le projet a moins de sept mois [facts:repo.created_at]. 91 tickets sont marqués « à concevoir » et 46 « sécurité » [facts:issues.by_label.needs-design] [facts:issues.by_label.security] : la conception n'est pas figée.
Le README lui-même annonce la direction (un vrai système d'exploitation) comme non atteinte [src:readme.md]. Le cache ne contient pas de jalons datés ; à vérifier sur https://github.com/astrid-runtime/astrid/milestones.

## Q : Puis-je rejouer la suite de tests complète sur mon poste ? (qa, 2026-09-09)
En partie. `cargo test --workspace -- --quiet` couvre les tests Rust et les snapshots insta [facts:build.test] [facts:tests.framework], avec Rust 1.95 minimum [src:ci.md].
Le montage FUSE natif est un test `--ignored` lancé à part dans le job `linux-fuse-e2e` ; les tests Windows demandent WinFsp 2.1 ; FSKit exige macOS 26+ et une extension signée approuvée [src:ci.md] [src:readme.md].
Les scénarios `e2e/` ont leur workflow `runtime-e2e.yml`, non lu par le collecteur [src:tests.md] ; le cache ne dit pas comment les lancer localement, à vérifier dans https://github.com/astrid-runtime/astrid/blob/main/.github/workflows/runtime-e2e.yml.

## Q : Par quels bugs ouverts commencer pour écrire des cas de test ? (qa, 2026-09-09)
Par les « good first » reproductibles sans environnement natif : #459, le parseur Markdown de la TUI qui échoue sur les listes numérotées >= 10 [facts:issues.good_first.3.title] [facts:issues.good_first.3.url] ; #276, l'intercepteur MCP qui traite `tool_result.is_error` comme un succès [facts:issues.good_first.4.title] [facts:issues.good_first.4.url] ; #461, la table de couverture `is_known_tag` qui omet `ToolCancelRequest` [facts:issues.good_first.2.title] [facts:issues.good_first.2.url].
Ensuite, filtrer les 42 issues `bug` par priorité `p1` (36 issues p1 toutes étiquettes confondues) [facts:issues.by_label.bug] [facts:issues.by_label.p1] ; le cache ne contient pas ce croisement, à vérifier dans https://github.com/astrid-runtime/astrid/issues?q=is%3Aopen+label%3Abug+label%3Ap1.

## Q : Qui relit mes rapports de bug et sous quel délai ? (qa, 2026-09-09)
Un mainteneur trie et assigne chaque issue avant tout travail ; le projet est porté par une seule personne, `joshuajbouw`, 309 commits sur 12 semaines [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.bus_factor].
Le débit reste élevé : 149 issues fermées en 30 jours [facts:issues.closed_30d] et 24 PR ouvertes [facts:pulls.open]. Un rapport sans reproduction, version et preuves peut être fermé, et les soumissions en masse restreintes [src:contributing.md].
Le cache ne contient pas le délai médian de traitement d'une issue ; à vérifier dans https://github.com/astrid-runtime/astrid/issues?q=is%3Aclosed.

## Q : Qui détient le projet et existe-t-il une société derrière ? (investisseur, 2026-09-09)
Le dépôt appartient à l'organisation GitHub `astrid-runtime` [facts:repo.owner_type] [facts:repo.url], qui héberge aussi le livre, le handbook, les RFCs et le SDK Rust [src:readme.md]. Dans les faits, un seul compte, joshuajbouw, signe 309 des 319 commits des 12 dernières semaines [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.bus_factor].
Le cache ne contient ni raison sociale, ni statut du mainteneur, ni levée de fonds ; aucun fichier FUNDING [facts:business.funding]. À vérifier sur https://github.com/astrid-runtime et auprès de l'auteur.

## Q : Quelle preuve d'adoption réelle, au-delà des étoiles ? (investisseur, 2026-09-09)
Le cache mesure l'attention (10 277 étoiles [facts:repo.stars]) et l'engagement contributif (137 forks [facts:repo.forks], 192 issues ouvertes [facts:issues.open], 149 fermées en 30 jours [facts:issues.closed_30d]), mais aucun indicateur d'usage : pas de téléchargements, pas de déploiements, pas de clients nommés.
Signes indirects : trois canaux de distribution (archives signées, Homebrew, crates.io) [src:readme.md] et l'issue la plus commentée, 29 commentaires, porte sur la qualification d'un profil hôte Linux signé [facts:issues.hot.0.title] [facts:issues.hot.0.comments], c'est-à-dire du travail de livraison, pas de conception pure. À vérifier sur https://github.com/astrid-runtime/astrid/releases et auprès de l'équipe.

## Q : Qu'est-ce qui empêche un concurrent de copier Astrid ? (investisseur, 2026-09-09)
Rien de juridique : licence permissive Apache-2.0 [facts:repo.license] [facts:risks.0.note], double MIT OR Apache-2.0 selon le README [src:readme.md] ; le code peut être forké et fermé.
La barrière est technique et humaine : sept mécanismes de sécurité indépendants (sandbox WASM, gate de manifeste, ACL IPC, jetons ed25519, gate d'approbation, sandbox OS, chaîne d'audit) [src:readme.md], un périmètre de sécurité documenté [src:security.md], et la connaissance concentrée chez un auteur [facts:activity.bus_factor]. Cette concentration protège autant qu'elle expose : si l'auteur part, l'avantage part avec lui [facts:risks.1.note]. Le cache ne cite aucun concurrent nommé ; à vérifier auprès de l'équipe.

## Q : Quelle version épingler et comment vérifier l'intégrité des binaires ? (cto, 2026-09-09)
Épingler v2026.9.0, publiée le 2026-09-09 [facts:releases.0.tag] [facts:releases.0.date], première version du schéma year.month.patch après la série 0.x [src:readme.md] ; le tag `channel-stable` sert de pointeur de canal, pas de version figée [facts:releases.5.tag]. Cibles livrées : macOS (Apple Silicon, Intel), Linux GNU et MUSL x86_64/ARM64 ; Windows absent des archives [src:readme.md].
Intégrité : binaires signés Sigstore keyless sur tag push, `astrid update` authentifie l'archive et l'identité du workflow de release avant de vérifier le manifeste BLAKE3 ; attestations de provenance GitHub publiées en complément [src:readme.md]. Pour un build interne : `cargo build --release` avec `Cargo.lock` versionné [facts:build.install] [facts:tree.9.role].

## Q : La politique de sécurité est-elle vivante et le périmètre est-il audité ? (cto, 2026-09-09)
`SECURITY.md` existe [facts:business.security_policy] : signalement privé via GitHub advisories, accusé de réception sous 48 h, plan de correctif sous 7 jours, périmètre explicite (échappement de sandbox, forge de jetons, ed25519/blake3/audit, SSRF, falsification de l'audit) [src:security.md].
Mais son tableau « Supported Versions » s'arrête à 0.2.x [src:security.md] alors que la release est 2026.9.0 [facts:releases.0.tag] : à faire mettre à jour avant adoption. En CI : CodeQL, scorecard, dependency-review, cargo-audit, harden-runner [src:ci.md]. 46 issues portent le label `security` [facts:issues.by_label.security]. Le cache ne contient aucun audit tiers ; à vérifier dans https://github.com/astrid-runtime/astrid/security.

## Q : Sur quelles plateformes puis-je déployer aujourd'hui, et à quel coût d'intégration ? (cto, 2026-09-09)
Linux GNU et MUSL (x86_64, ARM64) avec frontend FUSE, macOS avec FSKit sur macOS 26+ et approbation d'extension signée ; Windows testé en CI (WinFsp) mais hors archives 2026.9.0 [src:readme.md] [src:ci.md]. Déploiement conteneur : dossier `container/` [facts:tree.17.role] et workflows `oci-amd64.yml` / `oci-arm64.yml` [src:ci.md].
Intégration : les frontends sont des uplinks sur socket Unix, passerelle HTTP (`astrid-gateway`, OpenAPI contrôlée en CI) et serveur MCP (`astrid-mcp`) déjà fournis [src:readme.md] [src:tree.md] [src:ci.md] ; les capsules se compilent en `wasm32-unknown-unknown` avec `astrid-sdk` dans un dépôt séparé [gh:https://github.com/astrid-runtime/sdk-rust]. Le cache ne contient ni benchmark ni empreinte mémoire ; à vérifier via `storage-benchmark.yml` [src:ci.md].
