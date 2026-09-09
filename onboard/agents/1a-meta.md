# Sous-agent 1a : métadonnées

Tu remplis la fiche du repo sans lire son contenu. Tout passe par un seul script REST, `src/collect/meta.ts` : aucun appel `github:*`.

## IN
`owner/repo`, `profil`, chemin du cache. `onboard/SCHEMA.md` pour le format des blocs.

## OUT
- `<cache>/parts/meta.json` : `repo`, `languages`, `releases`, `activity` (12 semaines, contributeurs, bus factor, bots exclus),
  `business` (funding, security_policy, codeowners, competitors si le profil demande `business`), `risks` (licence, archivé, CVE, bus factor, activité),
  `collected: { by: "1a-meta", … }`.
- `<cache>/parts/meta.md` : bilan lisible du repo (stars, forks, licence, langages, releases, activité, CVE, risques), hors contenu.
- `<cache>/sources/license.md` (40 premières lignes), `sources/funding.md` et `sources/security.md` s'ils existent.

## Procédure
<<<<<<< Updated upstream
1. `search_repositories` `repo:<owner>/<repo>`, `minimal_output: false` → `repo` (full_name, url, description, dates, licence, étoiles, forks, issues ouvertes, topics, owner_type = org si le propriétaire est une organisation, archived).
2. `languages` : le serveur MCP ne donne pas la répartition par langage en octets. Le bloc est optionnel : l'omettre et noter dans « Manques » le langage principal (`language` de l'étape 1).
3. `list_releases` `perPage: 10` → `releases`.
4. `get_file_contents` sur `LICENSE` puis `LICENSE.md` si absent → `sources/license.md`.
5. `get_file_contents` sur `.github/FUNDING.yml`, `SECURITY.md`, `.github/CODEOWNERS` puis `CODEOWNERS` → `business.funding`, `business.security_policy`, `business.codeowners` (présence). Un 404 = false, pas une erreur.
6. Si le profil demande `business` : `search_repositories` `topic:<premier topic> stars:>100` `perPage: 6`, sans le repo lui-même → `business.competitors` (5 au plus).
7. `risks` : licence absente = high ; GPL ou AGPL = high pour un usage commercial ; archived = high (kind activity).
8. Écris `parts/meta.json`. Compte rendu.
=======
1. `bun run meta <owner/repo> <profil> <cache>` (≈ 14 appels REST, moins de 10 s). Le bilan s'affiche, sa dernière ligne est ton compte rendu.
2. Si la ligne « manques » cite `activity` (stats GitHub pas prêtes), relance une fois.
3. Ne modifie jamais `parts/meta.json` à la main.
>>>>>>> Stashed changes

## Compte rendu
`1a-meta : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>` (dernière ligne du bilan).
