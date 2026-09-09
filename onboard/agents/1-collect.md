# Étape 1 : collecte, cinq sous-agents en parallèle

Tu coordonnes la collecte. Tu ne lis pas le repo toi-même : tu lances cinq sous-agents en parallèle (outil Agent, un appel
par sous-agent, tous dans le même message), tu attends leurs comptes rendus, tu fusionnes, tu valides.
Objectif : moins de 3 minutes même sur un repo de 500 000 lignes. Personne ne lit le code en entier.

## IN
- Arguments : `owner/repo profil`. Le cache est `onboard/cache/<owner>__<repo>/`.
- `onboard/profiles/<profil>.json`, champ `priorities` : les blocs `facts` et les `sources` demandés.

## OUT
- `<cache>/parts/<nom>.json` écrit par chaque sous-agent, puis `<cache>/facts.json` produit par `bun run merge <cache> <profil>`.
- `<cache>/sources/*.md` écrits par les sous-agents.

## Sous-agents

| Sous-agent | Prompt | Blocs de facts.json | Toujours ? |
|---|---|---|---|
| métadonnées | `agents/1a-meta.md`, en code : `bun run meta` | repo, releases, activity, business, risks (licence, sécurité, bus factor, activité) ; `languages` absent, pas d'outil MCP, noté en manques | oui |
| historique | `agents/1b-history.md` | issues, pulls | oui |
| documentation | `agents/1c-docs.md` | build (install, run, test), sources readme, contributing, changelog, docs | oui |
| code et archi | `agents/1d-code.md` | tree, entrypoints, build.ci, tests, deps, risks (deps, ci) | oui ; mode léger (arbre racine seul) si le profil ne demande ni entrypoints, ni build, ni tests, ni deps |
| roadmap | `agents/1e-roadmap.md` | roadmap (PR ouvertes, issues hors bug, thèmes, jalons) | si le profil demande `roadmap` |

## Procédure
1. Lis le profil. Décide quels sous-agents lancer et en quel mode (tableau ci-dessus).
2. Lance-les tous dans un seul message, chacun avec : le chemin de son prompt, `owner/repo`, `profil`, le chemin du cache,
   et la consigne « exécute ce prompt à la lettre, écris uniquement ton fichier parts/ et tes sources/, termine par ton compte rendu ».
3. Attends les cinq comptes rendus. Un sous-agent qui échoue ne bloque pas les autres : note son « Manques ».
4. `bun run merge <cache> <profil>` : fusionne `parts/*.json` dans `facts.json` et lance `validate facts`.
5. Échec de validation : renvoie le sous-agent concerné avec les erreurs, une fois. Puis merge à nouveau.

## Interdits
- Les outils `search_*`, sauf le seul `search_code` toléré pour 1d : l'API de recherche GitHub est limitée à 30 requêtes par minute pour tout le poste. Les compteurs viennent de `list_*`, plafonnés à 100 et déclarés comme tels. Budget total d'une collecte : 40 appels environ (1a 12, 1b 8, 1c 8, 1d 10, 1e 5).
- Faire le travail d'un sous-agent toi-même.
- Lancer les sous-agents l'un après l'autre.
- Modifier `parts/` à la main pour faire passer la validation.

## Compte rendu
Format exact de `WORKFLOW.md`, étape 1, avec une ligne par sous-agent : `<nom> : OK | ÉCHEC · <n> appels · manques : …`.
