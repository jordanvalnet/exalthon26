---
repo: n8n-io/n8n
profile: cto
generated_at: 2026-09-10T14:05:00Z
---
# n8n : ingénierie solide, cadence industrielle, une seule vraie contrainte — la licence. Adopter en auto-hébergé, ne pas forker.

## Que fait ce projet et quelle est son architecture ?

<!-- chart: tree -->

Plateforme d'automatisation de workflows et d'agents IA, visuelle avec du code en secours, auto-hébergeable ou en SaaS [facts:repo.description] [src:readme.md] [gh:https://github.com/n8n-io/n8n].

Monorepo pnpm piloté par Turborepo : `pnpm-workspace.yaml`, `turbo.json` et un `package.json` racine `private: true` en version 2.39.0 ; tout le code applicatif vit sous `packages/` [src:tree.md] [src:manifest.md].

Quatre points d'entrée à connaître :

- `packages/cli/bin/n8n` — binaire visé par les scripts `start`, `webhook` et `worker` : contrôle la version de Node, charge `dist/config` puis le `CommandRegistry` [facts:entrypoints.0.path] [facts:entrypoints.0.why].
- `packages/core` — moteur d'exécution des workflows [facts:entrypoints.3.path] [facts:entrypoints.3.why].
- `packages/nodes-base` — les nœuds intégrés, c'est-à-dire l'essentiel de la surface fonctionnelle [facts:entrypoints.4.path].
- `packages/frontend` — l'éditeur web [facts:entrypoints.2.path].

Contraintes de plateforme fortes et récentes : Node ≥ 24, pnpm ≥ 12.3.4 imposé (`preinstall` bloque npm), TypeScript 6.0.2, Biome et Prettier côte à côte [src:manifest.md].

La racine est instrumentée comme un dépôt d'entreprise : `OWNERS`, `CODEOWNERS`, deux fichiers de licence, quatre configs d'agents IA (`AGENTS.md`, `CLAUDE.md`, `.claude/`, `.opencode`), trois configs de sécurité (`.aikido`, `.poutine.yml`, `security/`) et deux baselines gelées (`.boundaries-baseline.json`, `.code-health-baseline.json`) [facts:tree] [src:tree.md].

> À retenir : ce n'est pas un projet communautaire qui a grossi, c'est un monorepo d'éditeur — 53 entrées à la racine dont la moitié sont des garde-fous d'ingénierie [facts:tree] [src:tree.md].

## Quelle est sa santé technique ?

<!-- chart: commits_per_week -->

Cadence rare : les 500 derniers changements relevés tiennent tous dans deux semaines, 251 puis 249, soit ~250 commits par semaine [facts:activity.commits_per_week]. Les barres à zéro sont la limite du relevé (500 commits), pas un arrêt : l'historique complet est dans le journal des commits du dépôt [gh:https://github.com/n8n-io/n8n/commits/master].

Dernier commit le jour même du relevé, dépôt non archivé, branche par défaut `master` [facts:activity.last_commit] [facts:repo.archived] [facts:repo.default_branch].

Livraison en continu et sur canaux : les dix dernières versions relevées tiennent en quatre jours, avec des pointeurs mobiles `stable` et `beta` [facts:releases] [facts:releases.0.tag]. Deux lignes vivent en parallèle — `n8n@2.39.2` et `n8n@1.123.79` le même jour : la 1.x est encore maintenue, ce qui est une bonne nouvelle pour qui déploie aujourd'hui [facts:releases].

Chaîne de build standard, sans surprise :

```
pnpm install     # installation
pnpm start       # démarrage
pnpm test        # tests (turbo run test)
```

[facts:build.install] [facts:build.run] [facts:build.test]

La CI est le vrai actif technique. `.github/workflows/ci-pull-requests.yml` tourne sur `pull_request` **et** `merge_group` : build, tests unitaires, typecheck, lint, `pack --dry-run`, e2e Playwright, tests DB SQLite + Postgres, e2e de performance, contrôles de sécurité, évaluations IA, et un job `required-checks` bloquant pour le merge [facts:build.ci.0.path] [facts:build.ci.0.name] [src:ci.md] [gh:https://github.com/n8n-io/n8n/blob/master/.github/workflows/ci-pull-requests.yml].

Autour : plus de cent workflows, dont une trentaine dédiés à la release (backport, patch PR, promotion de tag, publication npm) et une dizaine à la sécurité (SBOM, Trivy, Poutine, zizmor) [src:ci.md].

Tests répartis par package, pas de dossier racine : `vitest.workspace.ts`, six configs Vitest rien que pour `packages/cli` (unit, integration, migration, testcontainers), Playwright dans `packages/testing`, et du test de mutation via `@stryker-mutator/vitest-runner` [src:tests.md] [src:manifest.md]. Le taux de couverture réel n'est pas relevé — Codecov est branché (`codecov.yml`), le chiffre est à lire sur le tableau de bord public du projet [gh:https://app.codecov.io/gh/n8n-io/n8n].

> À retenir : ~250 commits par semaine encaissés par une CI à merge queue avec check bloquant — la vélocité n'est pas payée en qualité [facts:activity.commits_per_week] [src:ci.md].

## Qui porte le projet et quel est le bus factor ?

<!-- chart: contributors -->

Bus factor 16 : il faut réunir seize personnes pour couvrir la moitié des changements relevés [facts:activity.bus_factor]. Au-delà de 10, le risque de dépendance individuelle est résiduel.

Aucune concentration : le plus actif pèse 24 changements sur 500, soit moins de 5 %, et les dix premiers cumulent 166 sur 500, soit un tiers [facts:activity.contributors.0.login] [facts:activity.contributors.0.commits] [facts:activity.contributors].

Le dépôt appartient à une organisation, créée en juin 2019 — sept ans d'existence, pas une expérimentation [facts:repo.owner_type] [facts:repo.created_at].

Gouvernance des revues outillée : `CODEOWNERS` et un fichier `OWNERS` par zone, avec `ci-owners-required-reviews.yml`, `ci-owners-assign-reviewers.yml` et `ci-owners-validation.yml` pour l'appliquer en CI [facts:business.codeowners] [src:tree.md] [src:ci.md].

Point à connaître avant de compter sur GitHub comme source de vérité : 297 des issues relevées portent le label `status:in-linear` et 280 `status:team-assigned` — le pilotage réel se fait dans Linear, GitHub est la façade publique [facts:issues.by_label].

Pas de page de financement communautaire : le projet est financé par son éditeur et ses licences entreprise, pas par des dons [facts:business.funding] [src:readme.md].

> À retenir : bus factor 16 et aucun contributeur au-dessus de 5 % du volume — le risque humain est faible, mais la roadmap se décide dans Linear, hors de votre vue [facts:activity.bus_factor] [facts:issues.by_label].

## Quelles dépendances et quelle dette ?

Le manifeste racine ne déclare aucune dépendance runtime : 28 entrées, toutes en `devDependencies` (turbo 2.9.15, typescript 6.0.2, eslint, prettier, biome, lefthook, zx…) [facts:deps.count] [facts:deps.manifest] [facts:deps.runtime] [src:manifest.md].

Les dépendances de production sont déclarées package par package, avec catalogue et verrou centralisés (`pnpm-workspace.yaml`, `pnpm-lock.yaml`) [facts:risks.1.note]. Conséquence directe : **l'inventaire réel des dépendances runtime n'est pas relevé** ici ; il se lit dans les SBOM générés en CI (`sbom-generation-callable.yml`, `test-sbom-nightly.yml`) [src:ci.md].

Signaux de dette, dans l'ordre de ce qu'ils coûtent :

| Signal | Ce qu'on voit | Lecture |
|---|---|---|
| `patches/` à la racine | patches pnpm appliqués à des dépendances tierces | dette externe assumée : chaque montée de version tierce peut casser un patch [src:tree.md] |
| Deux baselines gelées | `.boundaries-baseline.json`, `.code-health-baseline.json` | la dette est mesurée et plafonnée, pas ignorée — mais elle existe et est datée [src:tree.md] |
| Stock ouvert | 375 issues ouvertes, 756 PR ouvertes | l'équipe absorbe le flux sans faire baisser le stock [facts:issues.open] [facts:pulls.open] |
| Toolchain de pointe | Node ≥ 24, pnpm ≥ 12.3.4, TypeScript 6.0.2 | à aligner sur vos environnements avant tout build interne [src:manifest.md] |

La recherche de marqueurs `TODO` remonte 564 fichiers, mais elle est textuelle : une partie des résultats sont des fonctionnalités « to-do » du produit (nœud Microsoft To Do, outils `write-todos` des agents), pas de la dette [src:todo.md]. Chiffre inexploitable tel quel.

> À retenir : zéro dépendance runtime à la racine, un verrou pnpm centralisé et deux baselines de dette — l'inventaire précis passe par les SBOM de la CI, pas par le `package.json` [facts:deps.runtime] [src:ci.md].

## Quels risques ?

<!-- chart: risks -->

Trois risques relevés, un seul bloquant, tous avec une parade connue.

| Risque | Niveau | Parade |
|---|---|---|
| Licence non standard « Sustainable Use License » | Moyen | Usage interne : autorisé sans contrepartie. Revente, SaaS ou intégration à une offre payante : licence entreprise à négocier avant tout engagement [facts:risks.0.level] [facts:risks.0.note] [facts:repo.license] |
| Dépendances runtime éclatées par package | Faible | Verrou et catalogue pnpm centralisés, SBOM générés en CI : brancher `sbom-generation-callable.yml` sur votre chaîne d'audit [facts:risks.1.note] [src:ci.md] |
| Dépendance à la CI de l'éditeur | Faible | Build, tests, typecheck, lint, packaging et e2e sont dans le dépôt et rejouables : rien de la validation n'est un service privé [facts:risks.2.note] [src:ci.md] |

Trois clauses de `LICENSE.md` à faire lire au juridique, elles vont plus loin que le résumé du README [src:license.md] [gh:https://github.com/n8n-io/n8n/blob/master/LICENSE.md] :
1. L'usage est limité à vos **propres besoins internes**, ou non commercial ; la redistribution n'est permise que gratuitement et à but non commercial.
2. Tout fichier contenant `.ee.` dans son nom ou `.ee` dans son chemin **n'est pas** couvert : il exige une licence entreprise (`LICENSE_EE.md`).
3. Le contenu des branches autres que `master` **n'est pas licencié** — ce qui a un effet direct sur toute stratégie de fork ou de branche longue.

Versant sécurité correctement outillé : politique de divulgation publiée, scanners Aikido, Poutine, Trivy et zizmor en CI, chaîne `sec-*` de publication de correctifs [facts:business.security_policy] [src:security.md] [src:ci.md]. Non relevé en revanche : les CVE et avis publiés, à lire directement chez l'éditeur [gh:https://github.com/n8n-io/n8n/security/advisories].

> À retenir : le seul risque qui remonte au comité est juridique — `.ee.` et branches hors `master` non licenciés, usage strictement interne sans licence entreprise [facts:risks.0.note] [src:license.md].

## Adopter, contribuer ou forker ?

Ce qui se construit, lu dans les PR ouvertes : un plan de données séparé pour les exécutions, une pagination par curseur de bout en bout, un service de publication des workflows activé par défaut, et des applications capables de lire et écrire des tables de données — n8n dépasse l'automatisation d'arrière-plan [facts:roadmap.open_prs.0.title] [facts:roadmap.open_prs.1.title] [facts:roadmap.open_prs.3.title] [facts:roadmap.open_prs.7.title].

Deux signaux à ne pas manquer : une PR de comparaison « 3.x » est ouverte, et une PR marquée rupture supprime le nœud LangChain Code [facts:roadmap.open_prs.2.title] [facts:roadmap.open_prs.6.title]. Une majeure se prépare et les ruptures sont assumées : verrouillez votre version et suivez les branches `release-candidate/*`.

Côté utilisateurs, les demandes les plus discutées convergent sur un même point de friction : faire fonctionner les agents et les outils MCP de façon fiable en production, y compris en mode queue [facts:roadmap.requests.3.title] [facts:roadmap.requests.7.title]. C'est aussi là que se situe le risque fonctionnel si votre cas d'usage est agentique.

**Contribuer** est possible mais encadré : CLA obligatoire vérifié par `ci-cla-check.yml`, revue imposée par les propriétaires de zone, règles explicites pour les PR communautaires et fermeture automatique des PR inactives (`community-pr-close-stale.yml`) [src:contributing.md] [src:ci.md] [gh:https://github.com/n8n-io/n8n/blob/master/CONTRIBUTING.md]. Comptez le coût du CLA en amont, pas au moment du merge.

**Forker** est le mauvais calcul malgré 60 629 forks existants : la licence ne couvre pas les branches hors `master`, les fichiers `.ee.` en sont exclus, et un rythme de ~250 commits par semaine rend tout fork divergent irrattrapable en quelques mois [facts:repo.forks] [src:license.md] [facts:activity.commits_per_week].

> À retenir : adopter et suivre l'amont ; contribuer si vous acceptez le CLA ; ne pas forker — la licence l'interdit sur les branches et la cadence le rend intenable [src:license.md] [facts:activity.commits_per_week].

## Décision

- **Adopter, en auto-hébergé, sur une version épinglée.** Ingénierie mature (CI à merge queue avec check bloquant, tests DB et e2e, scanners de sécurité), cadence de ~250 commits par semaine, bus factor 16 : aucun signal technique ne s'y oppose [src:ci.md] [facts:activity.commits_per_week] [facts:activity.bus_factor].
- **Condition bloquante avant tout engagement : validation juridique.** Usage interne uniquement sans licence entreprise ; fichiers `.ee.` exclus ; branches hors `master` non licenciées. Si le projet est de revendre ou d'embarquer n8n dans une offre payante, la décision est commerciale, pas technique [facts:risks.0.note] [src:license.md].
- **Épingler la version et surveiller la 3.x.** Deux lignes maintenues en parallèle (1.123.79 et 2.39.2), une PR de comparaison 3.x ouverte et une suppression de nœud marquée rupture : pas de `latest` en production [facts:releases] [facts:roadmap.open_prs.2.title] [facts:roadmap.open_prs.6.title].
- **Ne pas forker, contribuer en amont si besoin** — CLA à signer, revue par propriétaires de zone ; un fork décroche en quelques mois au rythme actuel [src:contributing.md] [facts:activity.commits_per_week].
- **Deux angles morts à instruire vous-même** : l'inventaire des dépendances runtime (par les SBOM de la CI, pas par le manifeste racine) et les avis de sécurité publiés, non relevés ici [facts:deps.runtime] [src:ci.md] [gh:https://github.com/n8n-io/n8n/security/advisories].
