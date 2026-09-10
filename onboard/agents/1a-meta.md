# Sous-agent 1a : métadonnées

Tu remplis la fiche du repo sans lire son contenu. Tout passe par un seul script, `src/collect/meta.ts`, qui n'appelle que le
serveur MCP GitHub (jamais l'API REST), chaque appel passant par la couche de quota `src/quota.ts`.

## IN
`owner/repo`, `profil`, chemin du cache, budget et échéance si le coordinateur en donne. `onboard/SCHEMA.md` pour le format des blocs.

## OUT
- `<cache>/parts/meta.json` : `repo`, `releases`, `activity` (commits sur 12 semaines, contributeurs, bus factor, bots exclus),
  `business` (funding, security_policy, codeowners, competitors si le profil demande `business`), `risks` (licence, archivé, SECURITY.md absent, bus factor, activité),
  `collected: { by: "1a-meta", … }`. Un bloc dont l'appel a été jeté est absent, jamais mis à zéro.
- `<cache>/parts/meta.md` : bilan lisible du repo (stars, forks, licence, releases, activité, risques), hors contenu.
- `<cache>/sources/license.md` (40 premières lignes), `sources/funding.md` et `sources/security.md` s'ils existent.
  Les `note` de `risks` sont lues par le public : « lire LICENSE avant tout usage », jamais « lire sources/license.md ».
- `<cache>/parts/quota.json`, entrée `1a-meta` : appels faits, jetés, reset connu.

## Quota
Budget 12 appels, échéance 60 s. File exécutée dans cet ordre par le script :

| Appel | Outil | Priorité | Sert à |
|---|---|---|---|
| repo | `search_repositories` ×1 | P0 | repo, branche par défaut |
| commits | `list_commits` ×1 à 5 | P1 | activity, bus factor, risques bus factor et activité |
| releases | `list_releases` ×1 | P1 | releases |
| license | `get_file_contents` ×0 à 3, seulement si GitHub a détecté une licence | P1 | repo.license, sources/license.md, risque licence |
| security | `get_file_contents` ×1 à 2 | P1 | business.security_policy, sources/security.md, risque sécurité |
| funding | `get_file_contents` ×1 | P2 | business.funding, sources/funding.md |
| codeowners | `get_file_contents` ×1 à 2 | P2 | business.codeowners |
| competitors | `search_repositories` ×1, si le profil demande `business` et qu'un topic existe | P2 | business.competitors |

Le script jette les P2 puis les P1 quand le budget ou l'échéance ne suffit plus, journalise chaque jet avec son URL dans
« manques » et dans `parts/quota.json`, et sur une erreur de quota attend une seule fois (reset à 60 s ou moins) ou s'arrête
avec l'heure de reset. Toi, tu ne relances pas : `1a-meta : ÉCHEC · … reset à HH:MM:SS` est ton compte rendu tel quel.

## Procédure
1. `bun run meta <owner/repo> <profil> <cache> [--budget N --deadline S]` (8 à 11 appels MCP, moins de 15 s). Le bilan s'affiche, sa dernière ligne est ton compte rendu.
2. Manques structurels, toujours notés : `languages` et les CVE, que le serveur MCP n'expose pas.
3. Ne modifie jamais `parts/meta.json` à la main.

## Compte rendu
`1a-meta : OK | ÉCHEC · <n> appels MCP · <j> jeté(s) · reset <heure ou aucun> · manques : <liste ou aucun>` (dernière ligne du bilan).
