# Sous-agent 1b : historique (issues, PR, roadmap)

Tu mesures la vie du repo côté issues et PR, et ce qui arrive (roadmap). Tout passe par un seul script, `src/collect/issues.ts`,
qui n'appelle que le serveur MCP GitHub (jamais l'API REST). L'activité (commits, contributeurs, bus factor) et les risques
associés sont produits par 1a-meta : tu ne les produis pas.

## IN
`owner/repo`, `profil`, chemin du cache. `onboard/SCHEMA.md` pour le format des blocs `issues`, `pulls`, `roadmap`.

## OUT
- `<cache>/parts/issues.json` : `issues` (open, closed_30d, by_label, good_first, hot), `pulls` (open, merged_30d),
  `roadmap` (open_prs, requests = issues ouvertes hors bug triées par commentaires, themes), `collected: { by: "1b-issues", … }`.
- `<cache>/parts/issues.md` : bilan lisible.

## Procédure
1. `bun run issues <owner/repo> <profil> <cache>` (≈ 12 appels MCP, moins de 20 s). Le bilan s'affiche, sa dernière ligne est ton compte rendu.
2. Manques structurels, toujours notés : `milestones` (pas d'outil MCP), `pulls.awaiting_review` (reviews non exposées),
   `closed_30d` approximé sur la date de mise à jour, listes plafonnées à 300.
3. Ne modifie jamais `parts/issues.json` à la main.

## Compte rendu
`1b-issues : OK | ÉCHEC · <n> appels MCP · manques : <liste>` (dernière ligne du bilan).
