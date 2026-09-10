---
path: ROADMAP.md, docs/roadmap.md
url: https://github.com/jordanvalnet/code-dev-intel.ts/blob/HEAD/ROADMAP.md
fetched_at: 2026-09-10T14:22:24Z
---
Aucun fichier de feuille de route dans le repo.

- `ROADMAP.md` (racine) : absent. L'arborescence de premier niveau relevée le 2026-09-10T13:49:00Z
  (`sources/tree.md`) ne contient que `CHANGELOG.md`, `CONTRIBUTING.md`, `LICENSE`, `README.md`
  comme fichiers Markdown ou de licence. Pas d'appel dépensé pour le reconfirmer.
- `docs/roadmap.md` : absent, vérifié par `get_file_contents` (« the file does not exist in the repository »).

Ce qui en tient lieu, non lu ici (cité par `sources/docs.md`, à la charge d'un autre collecteur) :

- `docs/ai/04-executable-task-backlog.md` — backlog de tâches exécutables, cité par `CONTRIBUTING.md`.
- `CHANGELOG.md` — historique des versions livrées, déjà dans `sources/changelog.md`.

Manque structurel : `milestones`. Le serveur MCP GitHub n'expose aucun outil pour lire les jalons ;
le bloc `roadmap.milestones` de `facts.json` reste donc vide et ne doit pas être inventé.
Consultable à la main : https://github.com/jordanvalnet/code-dev-intel.ts/milestones

Le reste du bloc `roadmap` (PR ouvertes, demandes, thèmes par label) vient du sous-agent 1b (`bun run issues`).
