---
path: .github/workflows/ci-pull-requests.yml
url: https://github.com/n8n-io/n8n/blob/master/.github/workflows/ci-pull-requests.yml
fetched_at: 2026-09-10T13:25:00Z
---
name: 'CI: Pull Requests (Build, Test, Lint)'

on:
  pull_request:
  merge_group:

concurrency:
  group: ci-${{ github.event.pull_request.number || github.event.merge_group.head_sha || github.ref }}
  cancel-in-progress: true

jobs:
  install-and-build:
    name: Install & Build
    runs-on: ${{ vars.RUNNER_PROVIDER == 'github' && 'ubuntu-latest' || 'blacksmith-4vcpu-ubuntu-2204' }}
    env:
      NODE_OPTIONS: '--max-old-space-size=7168'
      CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
      QA_METRICS_WEBHOOK_URL: ${{ secrets.QA_METRICS_WEBHOOK_URL }}
      QA_METRICS_WEBHOOK_USER: ${{ secrets.QA_METRICS_WEBHOOK_USER }}
      QA_METRICS_WEBHOOK_PASSWORD: ${{ secrets.QA_METRICS_WEBHOOK_PASSWORD }}
    outputs:
      ci: ${{ fromJSON(steps.ci-filter.outputs.results).ci == true }}
      runtime: ${{ fromJSON(steps.ci-filter.outputs.results).runtime == true }}
      unit: ${{ fromJSON(steps.ci-filter.outputs.results).unit == true }}
      e2e: ${{ fromJSON(steps.ci-filter.outputs.results).e2e == true }}
      dev_server_smoke: ${{ fromJSON(steps.ci-filter.outputs.results)['dev-server-smoke'] == true }}
      frontend_declarations: ${{ fromJSON(steps.ci-filter.outputs.results)['frontend-declarations'] == true }}
      workflows: ${{ fromJSON(steps.ci-filter.outputs.results).workflows == true }}
      workflow_scripts: ${{ fromJSON(steps.ci-filter.outputs.results)['workflow-scripts'] == true }}
      db: ${{ fromJSON(steps.ci-filter.outputs.results).db == true }}
      db_migrations: ${{ fromJSON(steps.ci-filter.outputs.results)['db-migrations'] == true }}
      e2e_performance: ${{ fromJSON(steps.ci-filter.outputs.results)['e2e-performance'] == true }}
      instance_ai_workflow_eval: ${{ fromJSON(steps.ci-filter.outputs.results)['instance-ai-workflow-eval'] == true }}
      commit_sha: ${{ steps.commit-sha.outputs.sha }}
      merge_base: ${{ steps.ci-filter.outputs.merge-base }}
      matrix: ${{ steps.generate-matrix.outputs.matrix }}
      db_test_matrix: ${{ steps.generate-db-test-matrix.outputs.db_test_matrix }}
      skip_tests: ${{ steps.generate-matrix.outputs.skip-tests }}
      affected_packages: ${{ steps.affected-packages.outputs.list }}
      changed_files: ${{ steps.ci-filter.outputs.changed-files }}
    steps:
      - uses: useblacksmith/checkout@bcec731f1eb1367240608d1c889a75b96db6ec53 # v1.5.0
        with:
          # Use merge_group SHA when in merge queue, otherwise PR merge ref
          ref: ${{ github.event_name == 'merge_group' && github.event.merge_group.head_sha || format('refs/pull/{0}/merge', github.event.pull_request.number) }}

      - name: Capture commit SHA for cache consistency
        id: commit-sha
        run: echo "sha=$(git rev-parse HEAD)" >> "$GITHUB_OUTPUT"

      - name: Check for relevant changes
        uses: ./.github/actions/ci-filter
        id: ci-filter
        with:
          mode: filter
          filters: |
            ci:
              **
              !packages/@n8n/task-runner-python/**
              !.github/**
[tronqué]

Jobs du même fichier, résumés : install-and-build (pnpm build, format:check), unit-test (test-unit-reusable.yml),
typecheck (pnpm turbo typecheck), lint (test-linting-reusable.yml), check-packaging (pnpm -r pack --dry-run),
prepare-docker, e2e (test-e2e-reusable.yml, Playwright), dev-server-smoke, frontend-declarations, db-tests
(test-db-reusable.yml, SQLite + Postgres), e2e-performance, security-checks (sec-ci-reusable.yml), workflow-scripts,
instance-ai-discovery-evals, required-checks (bloquant pour le merge), post-qa-metrics-comment.

## .github/workflows/ (https://github.com/n8n-io/n8n/tree/master/.github/workflows), noms de fichiers
backport.yml
build-base-image.yml
build-benchmark-image.yml
build-node-pc-image.yml
build-v3-nightly.yml
build-windows.yml
ci-check-pr-title.yml
ci-check-release-from-fork.yml
ci-cla-check.yml
ci-detect-new-packages.yml
ci-instance-ai-evals.yml
ci-master.yml
ci-mcp-evals.yml
ci-owners-assign-reviewers.yml
ci-owners-required-reviews.yml
ci-owners-review-recommendations.yml
ci-owners-validation.yml
ci-pr-quality.yml
ci-pull-request-review.yml
ci-pull-requests.yml
ci-python.yml
ci-restrict-private-merges.yml
clean-stale-branches.yml
community-pr-close-stale.yml
docker-build-push.yml
docker-build-smoke.yml
docker-sbom-probe.yml
prepare-docker-reusable.yml
release-build-daytona-snapshot.yml
release-chromatic.yml
release-create-experiment.yml
release-create-github-releases.yml
release-create-minor-pr.yml
release-create-patch-pr.yml
release-create-pr.yml
release-merge-tag-to-branch.yml
release-populate-cloud-with-releases.yml
release-promote-backport-labels.yml
release-promote-github-release.yml
release-publish-new-package.yml
release-publish-post-release.yml
release-publish.yml
release-push-to-channel.yml
release-recreate-failed-release.yml
release-schedule-patch-prs.yml
release-set-stable-npm-packages-to-latest.yml
release-standalone-package.yml
release-storybook.yml
release-update-pointer-tag.yml
release-version-release-notification.yml
sbom-generation-callable.yml
sbom-validation-callable.yml
sec-ci-reusable.yml
sec-poutine-reusable.yml
sec-publish-fix-1x.yml
sec-publish-fix.yml
sec-sync-bundle-branches.yml
sec-sync-public-to-private.yml
sec-sync-retarget-prs.yml
sec-zizmor-reusable.yml
security-trivy-scan-callable.yml
test-bench-reusable.yml
test-benchmark-destroy-nightly.yml
test-benchmark-nightly.yml
test-db-reusable.yml
test-dev-server-smoke-reusable.yml
test-e2e-coverage-nightly.yml
test-e2e-helm.yml
test-e2e-infrastructure-reusable.yml
test-e2e-pc-nightly.yml
test-e2e-performance-reusable.yml
test-e2e-reusable.yml
test-evals-ai-release.yml
test-evals-ai-reusable.yml
test-evals-ai.yml
test-evals-discovery.yml
test-evals-instance-ai.yml
test-evals-mcp.yml
test-evals-python.yml
test-frontend-declarations-reusable.yml
test-get-n8n.yml
test-linting-reusable.yml
test-sbom-nightly.yml
test-single-instance-npm.yml
test-unit-reusable.yml
test-workflow-scripts-reusable.yml
test-workflows-callable.yml
test-workflows-nightly.yml
test-workflows-pr-comment.yml
util-approve-and-set-automerge.yml
util-backport-bundle.yml
util-cleanup-abandoned-release-branches.yml
util-cleanup-pr-images.yml
util-codespace-preview.yml
util-data-tooling.yml
util-determine-current-version.yml
util-ensure-release-candidate-branches.yml
util-hide-outdated-cubic-comments.yml
util-notify-merge-queue-removal.yml
util-notify-pr-status.yml
util-probe-registry.yml
util-publish-api-schema.yml
util-qa-metrics-comment-reusable.yml
util-refresh-cubic-schema.yml
util-sync-master-to-3x.yml
util-update-credential-setupability.yml
util-update-node-popularity.yml
