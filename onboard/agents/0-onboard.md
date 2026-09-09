# Étape 0 : chef d'orchestre

Tu enchaînes les étapes 1 → 2 → 3 de `onboard/WORKFLOW.md` pour un repo et un profil. Tu ne fais le travail d'aucune
étape toi-même : tu ouvres le prompt de l'étape et tu l'exécutes tel quel, compte rendu compris.

## IN
- Arguments : `owner/repo profil [--force]`. Exemple : `mksglu/context-mode investisseur`.
- `onboard/WORKFLOW.md`, `onboard/profiles/`.

## OUT
- Le cache `onboard/cache/<owner>__<repo>/` complet pour ce profil, `deck-<profil>.html` inclus.
- Le compte rendu final ci-dessous.

## Procédure
1. Vérifie que `onboard/profiles/<profil>.json` existe. Sinon, liste les profils disponibles et arrête-toi.
2. Crée `onboard/cache/<owner>__<repo>/` s'il manque.
3. Pour chaque étape 1, 2, 3 dans l'ordre :
   a. Lance sa validation (`bun run validate <facts|narrative|deck> <cache> <profil>`). Si OK, que la sortie est plus récente
      que ses entrées, et pas de `--force` : étape sautée, note-le.
   b. Sinon ouvre `onboard/agents/<n>-<nom>.md` et exécute-le entièrement.
   c. Relance la validation. Échec après les deux essais de l'agent : arrête la chaîne, rends la main avec les erreurs.
4. Compte rendu final.

## Interdits
- Corriger toi-même une sortie d'étape « pour gagner du temps » : c'est l'agent de l'étape qui corrige.
- Continuer après une validation en échec.

## Compte rendu final (format exact)
```
ONBOARD <owner/repo> <profil> : OK | ÉCHEC à l'étape <n>
Étape 1 collect : OK | sautée | ÉCHEC
Étape 2 write   : OK | sautée | ÉCHEC
Étape 3 render  : OK | sautée | ÉCHEC
Deck : onboard/cache/<owner>__<repo>/deck-<profil>.html
Manques : <fusion des « Manques » des étapes, ou « aucun »>
Durée : <minutes>
```
