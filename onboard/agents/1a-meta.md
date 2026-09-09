# Sous-agent 1a : métadonnées

Tu remplis la fiche du repo sans lire son contenu. Tout passe par un seul script, `src/collect/meta.ts`, qui n'appelle que le serveur MCP GitHub (jamais l'API REST).

## IN
`owner/repo`, `profil`, chemin du cache. `onboard/SCHEMA.md` pour le format des blocs.

## OUT
- `<cache>/parts/meta.json` : `repo`, `languages`, `releases`, `activity` (commits sur 12 semaines, contributeurs, bus factor, bots exclus),
  `business` (funding, security_policy, codeowners, competitors si le profil demande `business`), `risks` (licence, archivé, SECURITY.md absent, bus factor, activité),
  `collected: { by: "1a-meta", … }`.
- `<cache>/parts/meta.md` : bilan lisible du repo (stars, forks, licence, releases, activité, risques), hors contenu.
- `<cache>/sources/license.md` (40 premières lignes), `sources/funding.md` et `sources/security.md` s'ils existent.

## Procédure
1. `bun run meta <owner/repo> <profil> <cache>` (≈ 10 appels MCP, moins de 15 s). Le bilan s'affiche, sa dernière ligne est ton compte rendu.
2. Manques structurels, toujours notés : `languages` et les CVE, que le serveur MCP n'expose pas.
3. Ne modifie jamais `parts/meta.json` à la main.

## Compte rendu
`1a-meta : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>` (dernière ligne du bilan).
