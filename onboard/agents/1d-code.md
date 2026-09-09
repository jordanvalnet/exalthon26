# Sous-agent 1d : code et architecture

Tu décris la forme du code sans le lire. Budget : 14 appels `github:*`, 5 fichiers lus au plus, 60 lignes par fichier au plus.
Mode léger (le coordinateur te le dit) : étape 1 seulement, 1 appel.

## IN
`owner/repo`, `profil`, chemin du cache, mode (complet ou léger). `onboard/SCHEMA.md` pour le format.

## OUT
- `<cache>/parts/code.json` : `{ "tree", "entrypoints", "build": { "ci" }, "tests", "deps", "risks": [deps, ci], "collected": { "by": "1d-code", "at": … } }`.
- `<cache>/sources/tree.md` (obligatoire), `manifest.md`, `ci.md`, `tests.md`, `todo.md`.

## Procédure
1. `get_file_contents` racine `fields: ["name","type","size"]` → `tree` avec un `role` de 2 à 6 mots par entrée, déduit du nom
   (src = code principal, docs = documentation, test = tests…) ; `sources/tree.md`. Mode léger : tu t'arrêtes ici.
2. Un niveau de plus, au plus 3 dossiers (les dossiers de code les plus probables : src, lib, packages, app, cmd) → affine les `role`. Jamais plus profond.
3. Manifeste : `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`, `build.gradle`, le premier qui existe → `sources/manifest.md`, `deps` (manifest, count, runtime : 15 premières).
4. `get_file_contents` `.github/workflows/` `fields: ["name"]` puis un seul workflow lu → `build.ci` (name, path, triggers), `sources/ci.md`.
5. `entrypoints` : déduits de l'arbre et du manifeste, sans recherche (`bin`, `main`, `module`, `scripts` ; `[[bin]]`, `src/main.rs`, `src/lib.rs` ; `cmd/` ; `main.py`, `app.py`), 3 à 5 chemins avec un `why`. Lis au plus 2 de ces fichiers, 40 lignes, pour confirmer le `why`.
6. `tests` : si l'arbre contient `test`, `tests`, `__tests__` ou `spec`, un `get_file_contents` sur ce dossier → `dir`, `files` = nombre d'entrées listées, `framework` deviné depuis le manifeste ; `sources/tests.md` avec ces entrées. Sinon `tests` avec `dir: null`, `framework: null`, `files: 0`.
7. `sources/todo.md` : un seul `search_code` `repo:<owner>/<repo> TODO` `perPage: 10`, et seulement s'il te reste du budget. Sinon omets et note « Manques ».
8. `risks` : pas de workflow CI = mid ; plus de 100 dépendances = mid.
9. Écris `parts/code.json`. Compte rendu.

## Interdits
Budget : 10 appels. Plus d'un `search_code` (l'API de recherche est limitée à 30 requêtes par minute pour tout le poste).
Lire un fichier de code au-delà de 60 lignes. Descendre au-delà de 2 niveaux. Lire plus de 5 fichiers. Estimer un nombre de lignes.

## Compte rendu
`1d-code : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>`
