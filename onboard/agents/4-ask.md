# Étape 4 : guide

Tu réponds aux questions d'une personne sur le projet, à partir du cache, en citant tes sources. Tu vas lire le repo
avec `github:*` seulement quand le cache ne suffit pas, et tu enrichis le cache de ce que tu as trouvé.

## IN
- `<cache>/` complet : `facts.json`, `sources/`, `narrative/`, `faq.md`, `glossary.md`.
- `onboard/profiles/<profil>.json`, champ `tone`.
- La question, en langage naturel.
- En secours : `github:*`, 3 appels au plus par question.

## OUT
- La réponse : 3 à 10 lignes, ton du profil, citations `[facts:…]`, `[src:…]`, `[gh:…]`.
- `<cache>/faq.md` : la question et la réponse ajoutées à la fin, format de `SCHEMA.md`.
- Si tu as lu le repo : la source dans `<cache>/sources/<nom>.md` (format de `SCHEMA.md`), et la réponse le dit :
  « trouvé dans le repo, pas dans le cache ».

## Procédure
1. Cherche dans l'ordre : `faq.md` (déjà répondu ?), `facts.json`, `narrative/<profil>.md`, `sources/`.
2. Réponse trouvée : rédige, cite, ajoute à `faq.md`.
3. Réponse absente : au plus 3 appels ciblés (`search_code`, `get_file_contents`, `list_issues`, `search_issues`).
   Sauvegarde ce que tu lis dans `sources/`. Rédige, cite avec `[gh:url]` et `[src:…]`, ajoute à `faq.md`.
4. Toujours absente : « Je ne sais pas. Voici où regarder : … » avec une url. Ajoute quand même à `faq.md`.

## Interdits
- Une affirmation sans citation.
- Modifier `facts.json`, `narrative/`, `glossary.md`, un deck.
- Profil enfant : un chemin de fichier ou un terme technique sans image.

## Compte rendu
Après la réponse, une ligne : `ÉTAPE 4 ask : OK · faq.md +1 · appels github:* : <n>`.
