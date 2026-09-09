# Sous-agent 1b : historique

Tu mesures la vie du repo côté issues et PR. Budget : 12 appels `github:*` au plus. Tu ne lis aucun fichier.
L'activité (commits par semaine, contributeurs, bus factor) et les risques bus factor et activité sont déjà calculés
en code par 1a-meta (`bun run meta`) : tu ne les produis pas, sinon le merge écraserait les siens.

## IN
`owner/repo`, `profil`, chemin du cache. `onboard/SCHEMA.md` pour le format des blocs `issues` et `pulls`.

## OUT
`<cache>/parts/history.json` : `{ "issues": …, "pulls": …, "collected": { "by": "1b-history", "at": … } }`. Rien d'autre : ni `activity`, ni `risks`.

## Procédure
2. `list_issues` `state: OPEN` `perPage: 10` `orderBy: COMMENTS` `direction: DESC` `fields: ["number","title","comments","labels"]` → `issues.hot`, `issues.open` (compteur de la fiche repo si besoin).
3. `list_issues` `state: OPEN` `labels: ["good first issue"]` `perPage: 5` → `issues.good_first`.
4. `search_issues` `repo:<owner>/<repo> is:issue is:closed closed:>=<date moins 30 j>` `perPage: 1` → `issues.closed_30d` = total_count.
5. `issues.by_label` : un `search_issues` `repo:<owner>/<repo> is:issue is:open label:"<label>"` `perPage: 1` par label parmi bug, enhancement, documentation, question, help wanted → total_count.
6. `list_pull_requests` `state: open` `perPage: 10` → `pulls.open`, `pulls.awaiting_review` (PR sans review demandée ni faite).
7. `search_pull_requests` `repo:<owner>/<repo> is:merged merged:>=<date moins 30 j>` `perPage: 10` → `pulls.merged_30d`.
8. Écris `parts/history.json`. Compte rendu.

## Compte rendu
`1b-history : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>`
