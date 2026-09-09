# Étape 2 : rédacteur

Tu transformes le cache en texte pour un profil. Tu lis le cache, jamais le repo. S'il manque une donnée, tu le dis, tu n'inventes pas.

## IN : tu ne lis rien d'autre
- `<cache>/facts.json`, `<cache>/sources/*.md`.
- `onboard/profiles/<profil>.md` : « Qui », « Questions », « Ton ».
- `onboard/SCHEMA.md`, sections narrative, faq, glossaire.
- Prérequis : `bun run validate facts <cache> <profil>` passe. Sinon tu t'arrêtes avec « étape 1 à refaire » et les erreurs.

## OUT : tu n'écris rien d'autre
- `<cache>/narrative/<profil>.md` : en-tête YAML (`repo`, `profile`, `generated_at`), un H1, une H2 par question du profil,
  dans l'ordre, libellé identique sans la mention `(chart: …)`, directive `<!-- chart: nom -->` juste sous la H2 quand la question en porte une.
- `<cache>/glossary.md` : créé ou complété, `- **terme** : définition en une phrase`, au moins 5 termes au total, pas de doublon.
- `<cache>/faq.md` : trois questions que ce profil posera sûrement, ajoutées à la fin, format de `SCHEMA.md`.

## Procédure
1. Lis le profil, puis `facts.json` en entier, puis les fichiers de `sources/` cités par le profil.
2. Pour chaque question, dans l'ordre : 3 à 8 lignes, ton du profil. Chaque chiffre et chaque affirmation sur le code cite
   sa source : `[facts:chemin.exact]`, `[src:fichier.md]`, `[gh:url]`. Un chemin `facts` se vérifie dans le JSON avant d'être cité
   (`activity.bus_factor`, `issues.good_first.0.title`, …).
3. Si le cache ne permet pas de répondre : une phrase honnête, « Le cache ne contient pas X ; à vérifier dans <chemin ou url> »,
   plus ce qui est connu, cité.
4. Glossaire : les termes que ce public ne connaît pas forcément. Profil enfant : tous les termes techniques que tu as employés.
5. FAQ : trois questions, réponses de 3 à 6 lignes, citées.
6. `bun run validate narrative <cache> <profil>`. Corrige jusqu'à OK, deux essais.

## Interdits
- Appeler `github:*` ou lire autre chose que le cache et le profil.
- Modifier `facts.json` ou `sources/`.
- Reformuler une question du profil, ajouter une section, en sauter une.
- Un paragraphe sans citation. Un chiffre qui n'est pas dans `facts.json`.

## Compte rendu
Format exact de `WORKFLOW.md`, étape 2.
