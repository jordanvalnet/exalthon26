# Étape 2 : rédacteur

Tu transformes le cache en texte pour un profil. Tu lis le cache, jamais le repo. S'il manque une donnée, tu le dis, tu n'inventes pas.

## IN : tu ne lis rien d'autre
- `<cache>/facts.json`, `<cache>/sources/*.md`.
- `onboard/profiles/<profil>.json` : `description`, `priorities` (questions et graphiques), `tone`, `deck.finale`, `design.brief`.
- `onboard/SCHEMA.md`, sections narrative, faq, glossaire.
- Prérequis : `bun run validate facts <cache> <profil>` passe. Sinon tu t'arrêtes avec « étape 1 à refaire » et les erreurs.

## OUT : tu n'écris rien d'autre
- `<cache>/narrative/<profil>.md` : en-tête YAML (`repo`, `profile`, `generated_at`), un H1, une H2 par question du profil,
  dans l'ordre, libellé identique sans la mention `(chart: …)`, directive `<!-- chart: nom -->` juste sous la H2 quand la question en porte une,
  une ligne `> à retenir` en fin de chaque section, puis une dernière H2 au libellé exact de `deck.finale` (contrat : `SCHEMA.md`, narrative).
- `<cache>/glossary.md` : créé ou complété, `- **terme** : définition en une phrase`, au moins 5 termes au total, pas de doublon.
- `<cache>/faq.md` : trois questions que ce profil posera sûrement, ajoutées à la fin, format de `SCHEMA.md`.

## Procédure
1. Lis le profil, puis `facts.json` en entier, puis les fichiers de `sources/` cités par le profil.
2. Pour chaque question, dans l'ordre : 3 à 8 lignes, ton du profil. Chaque chiffre et chaque affirmation sur le code cite
   sa source : `[facts:chemin.exact]`, `[src:fichier.md]`, `[gh:url]`. Un chemin `facts` se vérifie dans le JSON avant d'être cité
   (`activity.bus_factor`, `issues.good_first.0.title`, …). Le H1 est le titre du deck : une phrase qui dit le projet **et** le verdict.
   Termine la section par `> ` : la phrase à retenir, une seule, citée, celle qu'un lecteur pressé lirait seule.
   Le rendu comprend les listes `- ` et `1. `, les tableaux `|`, les blocs ```` ``` ```` : un tableau pour comparer (risques, dépendances),
   une liste numérotée pour un parcours, un bloc de code pour des commandes.
2b. Après la dernière question, une H2 au libellé exact de `deck.finale` : la page de clôture, 3 à 5 lignes ou puces, citées,
   qui font ce que le titre promet (« Vos 3 premières actions » : trois actions concrètes ; « Décision » : la recommandation et
   ses conditions ; « Thèse en 3 lignes » : trois lignes ; « Et toi, tu ferais quoi avec ? » : deux ou trois idées d'usage tirées du README).
   Lis `design.brief` : c'est le cahier des charges du document pour ce public.
3. Si le cache ne permet pas de répondre : une phrase honnête, « Le cache ne contient pas X ; à vérifier dans <chemin ou url> »,
   plus ce qui est connu, cité.
4. Glossaire : les termes que ce public ne connaît pas forcément. Profil enfant : tous les termes techniques que tu as employés.
5. FAQ : trois questions, réponses de 3 à 6 lignes, citées.
6. `bun run validate narrative <cache> <profil>`. Corrige jusqu'à OK, deux essais.

## Interdits
- Appeler `github:*` ou lire autre chose que le cache et le profil.
- Modifier `facts.json` ou `sources/`.
- Reformuler une question du profil, ajouter une section autre que la finale, en sauter une.
- Un paragraphe sans citation. Un chiffre qui n'est pas dans `facts.json`.

## Compte rendu
Format exact de `WORKFLOW.md`, étape 2.
