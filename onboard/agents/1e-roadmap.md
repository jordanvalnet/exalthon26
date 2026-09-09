# Sous-agent 1e : roadmap

Fusionné dans 1b : `bun run issues` produit déjà le bloc `roadmap` (PR ouvertes triées par mise à jour, issues ouvertes hors bug
triées par commentaires, thèmes par label). Ne lance rien de plus.

## Reste à faire, seulement si le profil demande `roadmap` et qu'un fichier de feuille de route existe
1. `get_file_contents` `ROADMAP.md` puis `docs/roadmap.md` → `<cache>/sources/roadmap.md` (60 lignes, format de `SCHEMA.md`). Deux appels au plus.
2. Manque structurel, toujours noté : `milestones` (pas d'outil MCP), url `https://github.com/<owner>/<repo>/milestones`.

## Compte rendu
`1e-roadmap : OK · <n> appels · manques : milestones<, ROADMAP absent>`
