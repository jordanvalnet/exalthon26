---
name: onboard-collect
description: Étape 1 seule - le cartographe lit un repo GitHub via github:* et écrit facts.json et sources/ dans onboard/cache/. Usage - /onboard-collect owner/repo profil.
argument-hint: owner/repo profil
---
Arguments : `$ARGUMENTS`.
Exécute `onboard/agents/1-collect.md` à la lettre. Contrat : `onboard/SCHEMA.md`. Termine par `bun run validate facts <cache> <profil>` et le compte rendu de `onboard/WORKFLOW.md`.
