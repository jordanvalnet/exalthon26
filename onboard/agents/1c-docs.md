# Sous-agent 1c : documentation

Tu sauvegardes ce que le projet dit de lui-même. Budget : 8 appels `github:*`, 400 lignes par fichier au plus.

## IN
`owner/repo`, `profil`, chemin du cache. `onboard/SCHEMA.md` pour le format des sources.

## OUT
- `<cache>/sources/readme.md` (obligatoire), `contributing.md`, `changelog.md` (60 premières lignes), `docs.md` (liste des fichiers du dossier docs/), s'ils existent.
- `<cache>/parts/docs.json` : `{ "build": { "install", "run", "test" }, "collected": { "by": "1c-docs", "at": … } }`, les commandes telles qu'écrites dans le README ou CONTRIBUTING. Absentes = clés absentes.

## Procédure
1. `get_file_contents` `README.md` (puis `README.rst`, `README` si absent) → `sources/readme.md`.
2. `get_file_contents` `CONTRIBUTING.md` puis `.github/CONTRIBUTING.md` → `sources/contributing.md`.
3. `get_file_contents` `CHANGELOG.md` → `sources/changelog.md`, 60 lignes.
4. `get_file_contents` `docs/` `fields: ["name","type"]` → `sources/docs.md`, liste des entrées, pas de lecture.
5. Extrais les commandes d'installation, de lancement et de test des fichiers lus → `parts/docs.json`.
6. Compte rendu.

## Interdits
Lire un fichier de code. Lire plus de 4 fichiers. Résumer : tu copies, tu ne rédiges pas.

## Compte rendu
`1c-docs : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>`
