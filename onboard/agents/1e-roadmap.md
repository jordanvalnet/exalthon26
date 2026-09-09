# Sous-agent 1e : roadmap

Tu regardes ce qui arrive : PR ouvertes, issues ouvertes hors bug, thèmes demandés, jalons. Budget : 5 appels, aucun `search_*`.

## IN
`owner/repo`, `profil`, chemin du cache. `onboard/SCHEMA.md` pour le format du bloc `roadmap`.

## OUT
- `<cache>/parts/roadmap.json` : `{ "roadmap": { "open_prs", "requests", "themes", "milestones" }, "collected": { "by": "1e-roadmap", "at": … } }`.
- `<cache>/sources/roadmap.md` si le repo a un fichier ROADMAP (60 lignes).

## Procédure
1. `list_pull_requests` `state: open` `sort: updated` `direction: desc` `perPage: 10` → `roadmap.open_prs` (number, title, url, updated_at, draft).
2. `list_issues` `state: OPEN` `orderBy: COMMENTS` `direction: DESC` `perPage: 20` `fields: ["number","title","comments","labels"]` → `roadmap.requests` : les 10 premières sans label `bug` (number, title, url, comments, labels).
3. `roadmap.themes` : compte des labels enhancement, feature, feature request, proposal, rfc parmi ces 20 issues, plus un seul `list_issues` `state: OPEN` `labels: ["enhancement"]` `perPage: 100` pour le compte exact (à 100, note « plafonné à 100 »). Aucun `search_*` : l'API de recherche est limitée à 30 requêtes par minute pour tout le poste.
4. `roadmap.milestones` : le serveur MCP n'expose pas les jalons. Le bloc est optionnel : l'omettre et le noter dans « Manques ».
5. `get_file_contents` `ROADMAP.md` puis `docs/roadmap.md` → `sources/roadmap.md` s'il existe.
6. Écris `parts/roadmap.json`. Compte rendu.

## Interdits
Lire le contenu des PR (diff) ou des issues au-delà du titre et des labels. Deviner une date de sortie.

## Compte rendu
`1e-roadmap : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>`
