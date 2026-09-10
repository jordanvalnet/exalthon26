# Sous-agent 1b : historique (issues, PR, roadmap)

Tu mesures la vie du repo côté issues et PR, et ce qui arrive (roadmap). Tout passe par un seul script, `src/collect/issues.ts`,
qui n'appelle que le serveur MCP GitHub (jamais l'API REST), chaque appel passant par la couche de quota `src/quota.ts`.
L'activité (commits, contributeurs, bus factor) et les risques associés sont produits par 1a-meta : tu ne les produis pas.

## IN
`owner/repo`, `profil`, chemin du cache, budget et échéance si le coordinateur en donne. `onboard/SCHEMA.md` pour le format des blocs `issues`, `pulls`, `roadmap`.

## OUT
- `<cache>/parts/issues.json` : `issues` (open, closed_30d, by_label, good_first, hot), `pulls` (open, merged_30d),
  `roadmap` (open_prs, requests = issues ouvertes hors bug triées par commentaires, themes), `collected: { by: "1b-issues", … }`.
  Un champ dont l'appel a été jeté est absent, jamais mis à zéro.
- `<cache>/parts/issues.md` : bilan lisible.
- `<cache>/parts/quota.json`, entrée `1b-issues` : appels faits, jetés, reset connu.

## Quota
Budget 12 appels, échéance 60 s. File exécutée dans cet ordre par le script :

| Appel | Outil | Priorité | Sert à |
|---|---|---|---|
| repo | `search_repositories` ×1 | P0 | url, compte d'issues ouvertes |
| issues | `list_issues` ouvertes ×1 à 3 | P1 | issues.by_label, good_first, hot ; roadmap.requests, themes |
| pulls | `list_pull_requests` tous états ×1 à 3 | P1 | pulls.merged_30d, médiane de fusion du bilan |
| open_prs | `list_pull_requests` ouvertes ×1 | P1 | roadmap.open_prs |
| open_pr_count | `search_pull_requests` ×1 | P1 | pulls.open, et issues.open exact (GitHub compte les PR dans les issues) |
| closed_30d | `list_issues` fermées ×1 à 3 | P2 | issues.closed_30d |

Le script jette les P2 puis les P1 quand le budget ou l'échéance ne suffit plus, journalise chaque jet avec son URL dans
« manques » et dans `parts/quota.json`, et sur une erreur de quota attend une seule fois (reset à 60 s ou moins) ou s'arrête
avec l'heure de reset. Toi, tu ne relances pas : `1b-issues : ÉCHEC · … reset à HH:MM:SS` est ton compte rendu tel quel.

## Procédure
1. `bun run issues <owner/repo> <profil> <cache> [--budget N --deadline S]` (6 à 12 appels MCP, moins de 20 s). Le bilan s'affiche, sa dernière ligne est ton compte rendu.
2. Manques structurels, toujours notés : `milestones` (pas d'outil MCP), `pulls.awaiting_review` (reviews non exposées),
   `closed_30d` approximé sur la date de mise à jour, listes plafonnées à 300.
3. Ne modifie jamais `parts/issues.json` à la main.

## Compte rendu
`1b-issues : OK | ÉCHEC · <n> appels MCP · <j> jeté(s) · reset <heure ou aucun> · manques : <liste>` (dernière ligne du bilan).
