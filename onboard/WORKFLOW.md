# Workflow agentique

Une chaîne d'étapes. Chaque étape est un agent avec un prompt (`agents/<n>-<nom>.md`), des entrées déclarées, des sorties
déclarées et une validation dure : une commande qui doit passer avant que l'étape suivante ait le droit de démarrer.
L'agent suivant ne lit que les sorties du précédent. Rien d'autre.

| # | Étape | Prompt | IN (lecture seule) | OUT (écriture seule) | Validation dure |
|---|---|---|---|---|---|
| 0 | orchestrer | `agents/0-onboard.md` | `owner/repo profil [--force]` | enchaîne 1 → 2 → 3 | chacune des validations ci-dessous |
| 1 | collecter | `agents/1-collect.md` lance en parallèle `1a-meta`, `1b-history`, `1c-docs`, `1d-code`, `1e-roadmap` | le repo via `github:*`, `profiles/<profil>.json`, `SCHEMA.md` | `parts/*.json`, `sources/*.md`, puis `facts.json` par `bun run merge` | `bun run merge <cache> <profil>` (fusion + `validate facts`) |
| 2 | rédiger | `agents/2-write.md` | `facts.json`, `sources/`, `profiles/<profil>.json` | `narrative/<profil>.md`, `glossary.md`, `faq.md` | `bun run validate narrative <cache> <profil>` |
| 3 | mettre en page | `agents/3-render.md` | `facts.json`, `narrative/<profil>.md`, `profiles/<profil>.json` (`deck`, `design`) | `deck-<profil>.html`, `deck-<profil>.pdf` | `bun run validate deck <cache> <profil>` |
| 4 | guider (à la demande) | `agents/4-ask.md` | le cache entier, une question, `github:*` en secours | la réponse, `faq.md` (ajout), `sources/` (ajout) | `faq.md` a une entrée de plus, chaque affirmation est citée |

`<cache>` = `onboard/cache/<owner>__<repo>`. Les validations sont dans `src/validate.ts`.

```
owner/repo + profil
      │
      ▼
 [1] collecter : 5 sous-agents en parallèle ──► parts/*.json + sources/*.md ──► merge ──► facts.json ──► validate facts ──┐
                                                                    ▼
 [2] rédiger ─────► narrative/<profil>.md + glossary.md + faq.md ──► validate narrative ──┐
                                                                                           ▼
 [3] mettre en page ► deck-<profil>.html ──► validate deck ──► fini

 [4] guider : question + cache ──► réponse citée + faq.md (ajout)
```

## Règles de chaînage
1. Une étape ne démarre que si la validation de l'étape précédente passe. L'orchestrateur la relance avant de continuer, même si elle a déjà passé.
2. Une étape est « à jour » si sa validation passe et que sa sortie est plus récente que ses entrées. À jour = sautée, sauf `--force`.
3. Chaque agent termine par sa commande de validation et colle la dernière ligne dans son compte rendu. Une validation qui échoue = l'agent corrige et relance, deux essais au plus. Au deuxième échec il s'arrête et rend la main avec les erreurs.
4. Un agent n'écrit que dans ses OUT. Il ne modifie jamais les sorties d'une autre étape, même pour « aider ».
5. Un agent n'invente rien. Donnée absente = champ absent + une ligne dans « Manques » du compte rendu.
6. Un agent ne lit que ses IN. Le rédacteur ne va pas sur GitHub ; les collecteurs ne lisent pas le narratif.
7. **GitHub se lit par le serveur MCP uniquement** : outils `github:*` pour les agents, client MCP de `onboarding/src/` pour le code. Aucun appel REST, aucun `gh`, aucun `curl`, aucun clone. Ce que le MCP n'expose pas (langages, statistiques, jalons) est un manque déclaré avec son URL, jamais contourné.
8. Collecte rapide même sur un gros repo : chaque sous-agent a un budget d'appels, personne ne lit un fichier de code au-delà de 60 lignes ni ne descend au-delà de 2 niveaux d'arborescence.

## Compte rendu d'étape (format exact, dernière chose qu'écrit chaque agent)
```
ÉTAPE <n> <nom> : OK | ÉCHEC
Cache : onboard/cache/<owner>__<repo>
Écrit : <fichiers>
Manques : <liste, ou « aucun »>
Validation : <dernière ligne de la commande>
```

## Pourquoi cette forme
- Les validations sont du code, pas de l'appréciation : un agent ne peut pas se déclarer fini.
- Chaque étape est rejouable seule (`/onboard-collect`, `/onboard-write`, `/onboard-render`, `/onboard-ask`) : on débogue un maillon sans relancer la chaîne.
- Les sorties sont des fichiers texte versionnés : on relit, on diff, on corrige à la main si besoin, on rejoue l'étape suivante.
- Les prompts sont dans `agents/`, pas dans les skills : Claude Code, Copilot et Codex exécutent le même texte.
