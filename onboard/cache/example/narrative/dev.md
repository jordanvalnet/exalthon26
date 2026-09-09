---
repo: acme/rocket
profile: dev
generated_at: 2026-09-09T16:10:00Z
---
# Rocket : un moteur de règles « quand X alors Y », en TypeScript, vivant et bien testé

## Que fait ce projet et pour qui ?
Rocket exécute des règles « quand X alors Y » sur des événements [src:readme.md]. Il vise les équipes qui automatisent
des workflows sans écrire de code métier à chaque fois [facts:repo.description]. 4 820 étoiles et 312 forks [facts:repo.stars] [facts:repo.forks].

## Comment le code est-il organisé ?
<!-- chart: tree -->
Le moteur est dans `src`, la ligne de commande et l'interface web dans `packages/` [facts:tree]. Les tests sont dans `test`,
84 fichiers en bun:test [facts:tests.files]. TypeScript représente l'essentiel du code [facts:languages.TypeScript].

## Par où commencer à lire ?
`src/index.ts` exporte l'API publique du moteur [facts:entrypoints.0.path]. Ensuite `packages/cli/src/main.ts` montre comment
l'API est consommée [facts:entrypoints.1.path]. Le README tient en une page [src:readme.md].

## Comment builder, tester et lancer ?
`bun install`, puis `bun run dev` pour lancer et `bun test` pour tester [facts:build.install] [facts:build.run] [facts:build.test].
La CI tourne sur chaque push et chaque PR [facts:build.ci.0.triggers], une release part sur tag [facts:build.ci.1.triggers].

## Comment le projet vit-il ?
<!-- chart: commits_per_week -->
Entre 0 et 22 commits par semaine sur les 12 dernières semaines, avec un creux fin juillet [facts:activity.commits_per_week].
Deux personnes portent les trois quarts des commits [facts:activity.bus_factor]. 41 issues fermées en 30 jours [facts:issues.closed_30d].

## Quelle première contribution ?
Six issues « good first issue » sont ouvertes [facts:issues.by_label]. La plus simple : afficher la version dans la CLI
[facts:issues.good_first.0.title] [gh:https://github.com/acme/rocket/issues/812]. Règle de la maison : une PR = un sujet,
issue d'abord au-delà de 200 lignes [src:contributing.md].
