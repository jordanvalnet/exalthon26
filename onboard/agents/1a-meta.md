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
1. `bun run meta <owner/repo> <profil> <cache>` (≈ 14 appels REST, moins de 10 s). Le bilan s'affiche, sa dernière ligne est ton compte rendu.
2. Si la ligne « manques » cite `activity` (stats GitHub pas prêtes), relance une fois.
3. Ne modifie jamais `parts/meta.json` à la main.

## Compte rendu
`1a-meta : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>` (dernière ligne du bilan).
