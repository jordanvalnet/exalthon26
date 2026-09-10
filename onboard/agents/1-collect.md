# Étape 1 : collecte, cinq sous-agents en parallèle

Tu coordonnes la collecte. Tu ne lis pas le repo toi-même : tu lances cinq sous-agents en parallèle (outil Agent, un appel
par sous-agent, tous dans le même message), tu attends leurs comptes rendus, tu fusionnes, tu valides.
Objectif : moins de 3 minutes même sur un repo de 500 000 lignes. Personne ne lit le code en entier.

## IN
- Arguments : `owner/repo profil`. Le cache est `onboard/cache/<owner>__<repo>/`.
- `onboard/profiles/<profil>.json`, champ `priorities` : les blocs `facts` et les `sources` demandés.
- `<cache>/parts/quota.json` s'il existe, lu par `bun run quota <cache>` : l'état du quota laissé par une collecte précédente.

## OUT
- `<cache>/parts/<nom>.json` écrit par chaque sous-agent, puis `<cache>/facts.json` produit par `bun run merge <cache> <profil>`.
- `<cache>/sources/*.md` écrits par les sous-agents.

## Sous-agents et budgets

| Sous-agent | Prompt | Blocs de facts.json | Budget | Toujours ? |
|---|---|---|---|---|
| métadonnées | `agents/1a-meta.md`, en code : `bun run meta` | repo, releases, activity, business, risks (licence, sécurité, bus factor, activité) ; `languages` absent, pas d'outil MCP, noté en manques | 12 | oui |
| historique | `agents/1b-history.md`, en code : `bun run issues` | issues, pulls, roadmap | 12 | oui |
| documentation | `agents/1c-docs.md` | build (install, run, test), ai_docs, sources readme, contributing, changelog, docs | 10 | oui |
| code et archi | `agents/1d-code.md` | tree, entrypoints, build.ci, tests, deps, risks (deps, ci) | 12, léger : 1 | oui ; mode léger (arbre racine seul) si le profil ne demande ni entrypoints, ni build, ni tests, ni deps |
| roadmap | `agents/1e-roadmap.md` | sources/roadmap.md seulement, le bloc `roadmap` vient de 1b | 2 | si le profil demande `roadmap` |

Budget de l'étape : 48 appels au plus, dont 5 `search_*` (limite de 30 par minute pour tout le poste).
Échéance : 60 s par collecteur en code, 2 minutes par collecteur en prompt.

## Textes destinés au lecteur
Les champs `role` de `tree`, `why` de `entrypoints` et `note` de `risks` sont affichés tels quels dans le deck. Ils nomment
les fichiers du dépôt (`LICENSE`, `.github/workflows/ci.yml`), jamais un chemin du cache (`sources/license.md`), ni le mot « cache ».

## Protocole quota (WORKFLOW.md, règle 8)
Chaque prompt de sous-agent liste sa file d'appels, dans l'ordre, avec sa priorité : P0 indispensable, P1 utile, P2 jetable.
Le serveur MCP ne dit pas le quota restant : on ne le connaît que par ses refus.
1. **Avant de lancer** : `bun run quota <cache>`. Code de sortie 1 = un reset est encore à venir. À 60 s ou moins :
   `sleep` puis continue. Au-delà : `ÉTAPE 1 collect : ÉCHEC`, ligne `Quota` avec l'heure, tu rends la main sans lancer personne.
   Puis une sonde d'un appel, `bun run gh get_me '{}'` : réponse « rate limit exceeded » = même conduite.
2. **Au lancement** : chaque sous-agent reçoit son budget du tableau. Tu le baisses quand le profil demande moins (1d léger,
   1e absent) ; pour 1a et 1b, `--budget N --deadline S` sur la commande.
3. **Après** : un sous-agent qui rend la main avec un reset (erreur de quota) → tu ne relances rien, pas de deuxième vague,
   tu fusionnes ce qui existe, et la ligne `Quota` porte ce reset. Des jets sans erreur (P2, puis P1) sont normaux : les manques suffisent.
4. **Renvoi** d'un sous-agent après un échec de validation (procédure, point 5) : jamais si un reset est connu ; sinon même budget.
5. **Ligne `Quota`** du compte rendu : appels = somme des cinq (`bun run quota <cache>` pour 1a et 1b, comptes rendus pour
   1c, 1d, 1e), jetés de même, reset = le plus lointain connu, sinon « aucun ».

## Procédure
1. Lis le profil. Décide quels sous-agents lancer et en quel mode (tableau ci-dessus). Protocole quota, point 1.
2. Lance-les tous dans un seul message, chacun avec : le chemin de son prompt, `owner/repo`, `profil`, le chemin du cache, son budget,
   et la consigne « exécute ce prompt à la lettre, écris uniquement ton fichier parts/ et tes sources/, termine par ton compte rendu ».
3. Attends les cinq comptes rendus. Un sous-agent qui échoue ne bloque pas les autres : note son « Manques ». Protocole quota, point 3.
4. `bun run merge <cache> <profil>` : fusionne `parts/*.json` dans `facts.json` et lance `validate facts`.
5. Échec de validation : renvoie le sous-agent concerné avec les erreurs, une fois (protocole quota, point 4). Puis merge à nouveau.

## Interdits
- Les outils `search_*` dans les prompts, sauf le seul `search_code` toléré pour 1d (le code en fait 2 à 4 : `search_repositories`,
  `search_pull_requests`). Les compteurs viennent de `list_*`, plafonnés à 100 et déclarés comme tels.
- Faire le travail d'un sous-agent toi-même.
- Lancer les sous-agents l'un après l'autre.
- Modifier `parts/` à la main pour faire passer la validation.
- Relancer un appel refusé pour quota.

## Compte rendu
Format exact de `WORKFLOW.md`, étape 1, avec une ligne par sous-agent : `<nom> : OK | ÉCHEC · <n> appels · <j> jetés · manques : …`.
