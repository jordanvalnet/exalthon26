# Sous-agent 1b : historique

Tu mesures la vie du repo côté issues et PR. Budget : 12 appels `github:*` au plus. Tu ne lis aucun fichier.
L'activité (commits par semaine, contributeurs, bus factor) et les risques bus factor et activité sont déjà calculés
en code par 1a-meta (`bun run meta`) : tu ne les produis pas, sinon le merge écraserait les siens.

## IN
`owner/repo`, `profil`, chemin du cache. `onboard/SCHEMA.md` pour le format des blocs `issues` et `pulls`.

## OUT
`<cache>/parts/history.json` : `{ "issues": …, "pulls": …, "collected": { "by": "1b-history", "at": … } }`. Rien d'autre : ni `activity`, ni `risks`.

## Procédure
Budget : 8 appels. Aucun outil `search_*` : l'API de recherche GitHub est limitée à 30 requêtes par minute pour tout le poste.
1. `list_issues` `state: OPEN` `perPage: 20` `orderBy: COMMENTS` `direction: DESC` `fields: ["number","title","comments","labels"]` → `issues.hot` (10 premières), `issues.open` = `open_issues` de la fiche repo si tu l'as, sinon omis.
2. `list_issues` `state: OPEN` `labels: ["good first issue"]` `perPage: 5` → `issues.good_first`.
3. `issues.by_label` : `list_issues` `state: OPEN` `labels: ["bug"]` `perPage: 100`, puis `labels: ["enhancement"]` `perPage: 100` → count = nombre renvoyé. À 100, note « plafonné à 100 » dans « Manques ». Pas d'autre label.
4. `list_issues` `state: CLOSED` `since: <date moins 30 j>` `perPage: 100` → `issues.closed_30d` = nombre renvoyé (approximation sur la date de mise à jour, à noter dans « Manques »).
5. `list_pull_requests` `state: open` `perPage: 10` → `pulls.open` ; `pulls.awaiting_review` omis si la réponse ne dit rien des reviews.
6. `list_pull_requests` `state: closed` `sort: updated` `direction: desc` `perPage: 10` → `pulls.merged_30d` = celles dont `merged_at` est dans les 30 jours.
7. Écris `parts/history.json`. Compte rendu.

## Interdits
Tout outil `search_*`. Écrire `activity` ou `risks`. Un chiffre qui ne vient pas d'une réponse.

## Compte rendu
`1b-history : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>`
