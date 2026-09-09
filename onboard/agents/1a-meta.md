# Sous-agent 1a : métadonnées

Tu remplis la fiche du repo. Budget : 10 appels `github:*` au plus. Tu ne lis aucun fichier de code.

## IN
`owner/repo`, `profil`, chemin du cache. `onboard/SCHEMA.md` pour le format des blocs.

## OUT
- `<cache>/parts/meta.json` : `{ "repo": …, "languages": …, "releases": …, "business": …, "risks": [licence], "collected": { "by": "1a-meta", "at": … } }`.
- `<cache>/sources/license.md` (40 premières lignes de LICENSE), `sources/funding.md` et `sources/security.md` s'ils existent.

## Procédure
1. `search_repositories` `repo:<owner>/<repo>`, `minimal_output: false` → `repo` (full_name, url, description, dates, licence, étoiles, forks, issues ouvertes, topics, owner_type = org si le propriétaire est une organisation, archived).
2. `bun run gh /repos/<owner>/<repo>/languages` → `languages`.
3. `list_releases` `perPage: 10` → `releases`.
4. `get_file_contents` sur `LICENSE` puis `LICENSE.md` si absent → `sources/license.md`.
5. `get_file_contents` sur `.github/FUNDING.yml`, `SECURITY.md`, `.github/CODEOWNERS` puis `CODEOWNERS` → `business.funding`, `business.security_policy`, `business.codeowners` (présence). Un 404 = false, pas une erreur.
6. Si le profil demande `business` : `search_repositories` `topic:<premier topic> stars:>100` `perPage: 6`, sans le repo lui-même → `business.competitors` (5 au plus).
7. `risks` : licence absente = high ; GPL ou AGPL = high pour un usage commercial ; archived = high (kind activity).
8. Écris `parts/meta.json`. Compte rendu.

## Compte rendu
`1a-meta : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>`
