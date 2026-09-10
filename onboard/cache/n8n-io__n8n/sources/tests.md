---
path: packages/cli/test
url: https://github.com/n8n-io/n8n/tree/master/packages/cli/test
fetched_at: 2026-09-10T14:09:20Z
---
## packages/cli/test/ (https://github.com/n8n-io/n8n/tree/master/packages/cli/test)
extend-expect.ts
global-setup.ts
integration/
migration/
setup-encryption-key.ts
setup-mocks.ts
setup-test-folder.ts
setup-testcontainers.ts
shared/
unit/

10 entrées à la racine de `packages/cli/test` : 4 dossiers (`unit`, `integration`, `migration`, `shared`) et
6 fichiers d'amorçage (`global-setup.ts`, `extend-expect.ts`, `setup-mocks.ts`, `setup-encryption-key.ts`,
`setup-test-folder.ts`, `setup-testcontainers.ts`). C'est le décompte de ce dossier, pas le total du dépôt :
n8n est un monorepo pnpm et chaque package a ses propres tests. Le contenu des sous-dossiers n'a pas été listé.

## Où vivent les tests
Pas de dossier de tests à la racine du dépôt. Repères vus :
- racine : `vitest.workspace.ts`, script `test` = `turbo run test` (package.json), `@stryker-mutator/vitest-runner`
  en devDependency (tests de mutation) ;
- `packages/cli/test/` plus six configurations `vitest.config.*.ts` dans `packages/cli` :
  `vitest.config.ts`, `vitest.config.base.ts`, `vitest.config.integration.ts`,
  `vitest.config.integration.testcontainers.ts`, `vitest.config.migration.ts`,
  `vitest.config.migration.testcontainers.ts` — unitaire, intégration et migrations de base de données,
  les variantes `testcontainers` lançant une vraie base en conteneur ;
- `packages/testing/` : `playwright/` (e2e, filtre `n8n-playwright` des scripts `dev:e2e` et `build:docker:test`),
  `performance/`, `containers/`, `code-health/`, `test-impact/`, `rules-engine/`, `janitor/` et un `README.md`.

## Ce que la CI exécute (voir ci.md)
`ci-pull-requests.yml` déclenche, selon les fichiers modifiés : `test-unit-reusable.yml` (unitaires),
`test-e2e-reusable.yml` (Playwright), `test-db-reusable.yml` (SQLite et Postgres), `test-e2e-performance-reusable.yml`,
`test-frontend-declarations-reusable.yml`, `test-workflow-scripts-reusable.yml`, `sec-ci-reusable.yml`.
Le job `required-checks` est bloquant pour la fusion. `codecov.yml` à la racine indique un suivi de couverture Codecov.

## Manques
- Nombre total de fichiers de test du dépôt : non compté (monorepo, tests répartis dans chaque package,
  un listing par package dépasse le budget d'appels) → https://github.com/n8n-io/n8n/tree/master/packages
- Contenu de `packages/cli/test/unit`, `integration`, `migration`, `shared` : non listé (troisième niveau)
  → https://github.com/n8n-io/n8n/tree/master/packages/cli/test
- Taux de couverture : non relevé, aucun chiffre lu ; seule l'existence de `codecov.yml` est constatée
  → https://github.com/n8n-io/n8n/blob/master/codecov.yml
