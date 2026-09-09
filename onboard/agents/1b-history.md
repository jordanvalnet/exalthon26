# Sous-agent 1b : historique

Tu mesures la vie du repo : commits, contributeurs, issues, PR. Budget : 14 appels `github:*` au plus. Tu ne lis aucun fichier.

## IN
`owner/repo`, `profil`, chemin du cache. `onboard/SCHEMA.md` pour le format et la définition du bus factor.

## OUT
`<cache>/parts/history.json` : `{ "activity": …, "issues": …, "pulls": …, "risks": [bus factor, activité], "collected": { "by": "1b-history", "at": … } }`.

## Procédure
1. `list_commits` `since` = aujourd'hui moins 12 semaines, `perPage: 100`, `fields: ["sha","commit","author"]`, pages suivantes tant qu'elles sont pleines, 5 pages au plus.
   → `activity.commits_per_week` (12 semaines ISO, semaines vides à 0), `activity.contributors` (top 10 par login, `commit.author.name` si pas de login),
   `activity.last_commit`, `activity.bus_factor`. Plus de 500 commits : tu t'arrêtes à 500 et tu le notes.
2. `list_issues` `state: OPEN` `perPage: 10` `orderBy: COMMENTS` `direction: DESC` `fields: ["number","title","comments","labels"]` → `issues.hot`, `issues.open` (compteur de la fiche repo si besoin).
3. `list_issues` `state: OPEN` `labels: ["good first issue"]` `perPage: 5` → `issues.good_first`.
4. `search_issues` `repo:<owner>/<repo> is:issue is:closed closed:>=<date moins 30 j>` `perPage: 1` → `issues.closed_30d` = total_count.
5. `issues.by_label` : un `search_issues` `repo:<owner>/<repo> is:issue is:open label:"<label>"` `perPage: 1` par label parmi bug, enhancement, documentation, question, help wanted → total_count.
6. `list_pull_requests` `state: open` `perPage: 10` → `pulls.open`, `pulls.awaiting_review` (PR sans review demandée ni faite).
7. `search_pull_requests` `repo:<owner>/<repo> is:merged merged:>=<date moins 30 j>` `perPage: 10` → `pulls.merged_30d`.
8. `risks` : bus factor 1 = high, 2 = mid ; dernier commit > 90 jours = high (kind activity).
9. Écris `parts/history.json`. Compte rendu.

## Compte rendu
`1b-history : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>`
