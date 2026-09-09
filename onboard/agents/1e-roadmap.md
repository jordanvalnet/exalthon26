# Sous-agent 1e : roadmap

Tu regardes ce qui arrive : PR ouvertes, issues ouvertes hors bug, thèmes demandés, jalons. Budget : 10 appels.

## IN
`owner/repo`, `profil`, chemin du cache. `onboard/SCHEMA.md` pour le format du bloc `roadmap`.

## OUT
- `<cache>/parts/roadmap.json` : `{ "roadmap": { "open_prs", "requests", "themes", "milestones" }, "collected": { "by": "1e-roadmap", "at": … } }`.
- `<cache>/sources/roadmap.md` si le repo a un fichier ROADMAP (60 lignes).

## Procédure
1. `list_pull_requests` `state: open` `sort: updated` `direction: desc` `perPage: 10` → `roadmap.open_prs` (number, title, url, updated_at, draft).
2. `search_issues` `repo:<owner>/<repo> is:issue is:open -label:bug` `sort: reactions` `order: desc` `perPage: 10` → `roadmap.requests` (number, title, url, comments, labels).
3. `roadmap.themes` : un `search_issues` `repo:<owner>/<repo> is:issue is:open label:"<label>"` `perPage: 1` par label parmi enhancement, feature, feature request, proposal, rfc, discussion → `{ label, count }` pour les counts > 0.
4. `bun run gh /repos/<owner>/<repo>/milestones?state=open` → `roadmap.milestones` (title, open = open_issues, closed = closed_issues, due = due_on).
5. `get_file_contents` `ROADMAP.md` puis `docs/roadmap.md` → `sources/roadmap.md` s'il existe.
6. Écris `parts/roadmap.json`. Compte rendu.

## Interdits
Lire le contenu des PR (diff) ou des issues au-delà du titre et des labels. Deviner une date de sortie.

## Compte rendu
`1e-roadmap : OK | ÉCHEC · <n> appels · manques : <liste ou aucun>`
