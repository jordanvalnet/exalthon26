# Sous-agent 1c : documentation

Tu sauvegardes ce que le projet dit de lui-même, aux humains **et aux agents IA**. 400 lignes par fichier au plus.

## IN
`owner/repo`, `profil`, chemin du cache, budget si le coordinateur en donne un autre. `onboard/SCHEMA.md` pour le format des sources.

## OUT
- `<cache>/sources/readme.md` (obligatoire), `contributing.md`, `changelog.md` (60 premières lignes), `docs.md` (liste des fichiers du dossier docs/), s'ils existent.
- `<cache>/sources/ai-docs.md` : les repères de doc IA trouvés, un par ligne, avec les 40 premières lignes des deux plus gros.
- `<cache>/parts/docs.json` : `{ "build": { "install", "run", "test" }, "ai_docs": { "files", "score", "max" }, "collected": { "by": "1c-docs", "at": … } }`, les commandes telles qu'écrites dans le README ou CONTRIBUTING. Absentes = clés absentes.

## Quota
Budget 10 appels `github:*`, échéance 2 minutes (note `date` au départ). File, dans cet ordre ; un listing te dit ce qui existe,
tu ne sondes jamais un nom de fichier à l'aveugle :

| # | Appel | Priorité | Sert à |
|---|---|---|---|
| 1 | `get_file_contents` racine, `fields: ["name","type"]` ×1 | P0 | nom exact du README, présence de CONTRIBUTING, CHANGELOG, docs/, repères de doc IA à la racine |
| 2 | `get_file_contents` README ×1, le nom vu en 1 | P0 | sources/readme.md, build |
| 3 | `get_file_contents` `.github/` `fields: ["name","type"]` ×1 | P1 | CONTRIBUTING ou copilot-instructions dans .github/ |
| 4 | `get_file_contents` CONTRIBUTING ×1, s'il existe | P1 | sources/contributing.md, build |
| 5 | `get_file_contents` CHANGELOG ×1, s'il existe | P1 | sources/changelog.md |
| 6 | `get_file_contents` `docs/` `fields: ["name","type"]` ×1, s'il existe | P2 | sources/docs.md |
| 7 | `get_file_contents` ×2 au plus sur les repères de doc IA | P2 | sources/ai-docs.md |

- Budget ou échéance atteints : tu jettes ce qui reste, P2 d'abord, puis P1, et chaque jet va dans « Manques » :
  `<appel> jeté (P2, budget) → https://github.com/<owner>/<repo>/blob/HEAD/<fichier>`.
- Erreur de quota (`GitHub API rate limit exceeded. Retry after 42s.` ou `secondary rate limit exceeded`) : jamais de nouvel essai
  en boucle. Délai annoncé de 60 s ou moins et appel P0 ou P1 : `sleep <délai>` une seule fois, puis un seul nouvel essai.
  Sinon tu écris ce que tu as (`parts/docs.json`, `sources/`), tu déclares le reste en manques, et ton compte rendu porte `reset <heure>`.

## Procédure
1. Racine (appel 1) : note le nom du README (`README.md`, `README.rst`, `README`), CONTRIBUTING, CHANGELOG, docs/, et les repères
   de doc IA visibles ici : `AGENTS.md` (agents_md), `CLAUDE.md` (claude_md), `.cursorrules` (cursorrules), `llms.txt` (llms_txt),
   `.mcp.json` (mcp_json), un dossier `skills/` ou `.claude/` (skills_dir, à confirmer par un listing seulement si tu as du budget).
2. README (appel 2) → `sources/readme.md`.
3. `.github/` (appel 3) : `CONTRIBUTING.md` s'il n'est pas à la racine, `copilot-instructions.md` (copilot_instructions).
4. CONTRIBUTING (appel 4) → `sources/contributing.md`. CHANGELOG (appel 5) → `sources/changelog.md`, 60 lignes.
5. `docs/` (appel 6) → `sources/docs.md`, liste des entrées, pas de lecture.
6. Extrais les commandes d'installation, de lancement et de test des fichiers lus → `parts/docs.json`.
7. **Doc IA** : `ai_docs.files` = les repères vus en 1 et 3, `score` = leur nombre, `max` = 7. Lis au plus deux d'entre eux (appel 7)
   pour `sources/ai-docs.md`. **Aucun trouvé n'est pas une erreur** : `{ "files": [], "score": 0, "max": 7 }`. L'absence est le résultat.
8. Compte rendu.

## Interdits
Lire un fichier de code. Lire plus de 6 fichiers. Résumer : tu copies, tu ne rédiges pas.
Déduire un repère de doc IA d'autre chose que de la présence du fichier : tu listes, tu ne juges pas.
Relancer un appel refusé pour quota.

## Compte rendu
`1c-docs : OK | ÉCHEC · <n> appels · <j> jetés · reset <heure ou aucun> · manques : <liste ou aucun>`
