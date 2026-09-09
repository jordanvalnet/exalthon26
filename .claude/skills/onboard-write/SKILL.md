---
name: onboard-write
description: Étape 2 seule - le rédacteur transforme le cache (facts.json, sources/) en narrative/<profil>.md, glossary.md et faq.md, sans lire le repo. Usage - /onboard-write owner/repo profil.
argument-hint: owner/repo profil
---
Arguments : `$ARGUMENTS`.
Exécute `onboard/agents/2-write.md` à la lettre. Contrat : `onboard/SCHEMA.md`. Termine par `bun run validate narrative <cache> <profil>` et le compte rendu de `onboard/WORKFLOW.md`.
