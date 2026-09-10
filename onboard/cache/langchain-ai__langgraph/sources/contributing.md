---
path: .github/ISSUE_TEMPLATE/bug-report.yml, .github/ISSUE_TEMPLATE/config.yml, .github/PULL_REQUEST_TEMPLATE.md
url: https://github.com/langchain-ai/langgraph/tree/HEAD/.github
fetched_at: 2026-09-10T14:03:00Z
---
Il n'y a **pas de fichier `CONTRIBUTING.md`** dans ce repo : ni à la racine (voir `tree.md`), ni dans `.github/`
(listing du 2026-09-10 : `ISSUE_TEMPLATE/`, `PULL_REQUEST_TEMPLATE.md`, `THREAT_MODEL.md`, `actions/`,
`dependabot.yml`, `images/`, `scripts/`, `workflows/`), ni dans `docs/` (voir `docs.md`).
Les règles de contribution sont hébergées hors du repo : https://docs.langchain.com/oss/python/contributing/overview
(lien donné par le gabarit de pull request). Ce qui suit est le contenu brut des gabarits du repo.

## .github/ISSUE_TEMPLATE/bug-report.yml — https://github.com/langchain-ai/langgraph/blob/HEAD/.github/ISSUE_TEMPLATE/bug-report.yml

```yaml
name: "🐛 Bug Report"
description: Report a bug in LangGraph. To report a security issue, please instead use the security option (below). For questions, please use the LangChain forum (below).
labels: ["bug"]
type: bug
body:
  - type: markdown
    attributes:
      value: |
        Thank you for taking the time to file a bug report.

        > **All contributions must be in English.** See the [language policy](https://docs.langchain.com/oss/python/contributing/overview#language-policy).

        For usage questions, feature requests and general design questions, please use the [LangChain Forum](https://forum.langchain.com/).

        Check these before submitting to see if your issue has already been reported, fixed or if there's another way to solve your problem:

        * [Documentation](https://docs.langchain.com/oss/python/langgraph/overview),
        * [API Reference Documentation](https://reference.langchain.com/python/),
        * [LangChain ChatBot](https://chat.langchain.com/)
        * [GitHub search](https://github.com/langchain-ai/langgraph),
        * [LangChain Forum](https://forum.langchain.com/),
  - type: checkboxes
    id: checks
    attributes:
      label: Checked other resources
      description: Please confirm and check all the following options.
      options:
        - label: This is a bug, not a usage question.
          required: true
        - label: I added a clear and descriptive title that summarizes this issue.
          required: true
        - label: I used the GitHub search to find a similar question and didn't find it.
          required: true
        - label: I am sure that this is a bug in LangGraph rather than my code.
          required: true
        - label: The bug is not resolved by updating to the latest stable version of LangGraph (or the specific integration package).
          required: true
        - label: This is not related to the langchain-community package.
          required: true
        - label: I posted a self-contained, minimal, reproducible example. A maintainer can copy it and run it AS IS.
          required: true
  - type: textarea
    id: related
    validations:
      required: false
    attributes:
      label: Related Issues / PRs
      description: |
        If this bug is related to any existing issues or pull requests, please link them here.
      placeholder: |
        * e.g. #123, #456
  - type: textarea
    id: reproduction
    validations:
      required: true
    attributes:
      label: Reproduction Steps / Example Code (Python)
      description: |
        Please add a self-contained, [minimal, reproducible, example](https://stackoverflow.com/help/minimal-reproducible-example) with your use case.

        If a maintainer can copy it, run it, and see it right away, there's a much higher chance that you'll be able to get help.

        **Important!**

        * Avoid screenshots, as they are hard to read and (more importantly) don't allow others to copy-and-paste your code.
        * Reduce your code to the minimum required to reproduce the issue if possible.

        (This will be automatically formatted into code, so no need for backticks.)
      render: python
      placeholder: |
        from langgraph.graph import StateGraph

        def bad_code(inputs) -> int:
          raise NotImplementedError('For demo purpose')

        chain = StateGraph(list)
        chain.invoke('Hello!')
  - type: textarea
    attributes:
      label: Error Message and Stack Trace (if applicable)
      description: |
        If you are reporting an error, please copy and paste the full error message and
        stack trace.
        (This will be automatically formatted into code, so no need for backticks.)
      render: shell
  - type: textarea
    id: description
    attributes:
      label: Description
      description: |
        What is the problem, question, or error?

        Write a short description telling what you are doing, what you expect to happen, and what is currently happening.
      placeholder: |
        * I'm trying to use the `langgraph` library to do X.
        * I expect to see Y.
        * Instead, it does Z.
    validations:
      required: true
  - type: textarea
    id: system-info
    attributes:
      label: System Info
      description: |
        Please share your system info with us.

        Run the following command in your terminal and paste the output here:

        `python -m langchain_core.sys_info`

        or if you have an existing python interpreter running:

        ```python
        from langchain_core import sys_info
        sys_info.print_sys_info()
        ```
      placeholder: |
        python -m langchain_core.sys_info
    validations:
      required: true
```

## .github/ISSUE_TEMPLATE/config.yml — https://github.com/langchain-ai/langgraph/blob/HEAD/.github/ISSUE_TEMPLATE/config.yml

```yaml
blank_issues_enabled: false
version: 2.1
contact_links:
  - name: 💬 LangChain Forum
    url: https://forum.langchain.com/
    about: General community discussions and support
  - name: 📚 LangGraph Documentation
    url: https://docs.langchain.com/oss/python/langgraph/overview
    about: View the official LangGraph documentation
  - name: 📚 API Reference Documentation
    url: https://reference.langchain.com/python/langgraph/
    about: View the official LangGraph API reference documentation
  - name: 📚 Documentation issue
    url: https://github.com/langchain-ai/docs/issues/new?template=02-langgraph.yml
    about: Report an issue related to the LangGraph documentation
```

Autre gabarit présent, non lu : `.github/ISSUE_TEMPLATE/privileged.yml`.

## .github/PULL_REQUEST_TEMPLATE.md — https://github.com/langchain-ai/langgraph/blob/HEAD/.github/PULL_REQUEST_TEMPLATE.md

```markdown
Fixes #

<!-- Replace everything above this line with a 1-2 sentence description of your change. Keep the "Fixes #xx" keyword and update the issue number. -->

Read the full contributing guidelines: https://docs.langchain.com/oss/python/contributing/overview

> **All contributions must be in English.** See the [language policy](https://docs.langchain.com/oss/python/contributing/overview#language-policy).

If you paste a large clearly AI generated description here your PR may be IGNORED or CLOSED!

Thank you for contributing to LangGraph! Follow these steps to have your pull request considered as ready for review.

1. PR title: Should follow the format: TYPE(SCOPE): DESCRIPTION

    - feat(langgraph): add multi-tenant support
  - Allowed TYPE and SCOPE values: https://github.com/langchain-ai/langgraph/blob/main/.github/workflows/pr_lint.yml#L19-L43

2. PR description:

  - Write 1-2 sentences summarizing the change.
  - The `Fixes #xx` line at the top is **required** for external contributions — update the issue number and keep the keyword. This links your PR to the approved issue and auto-closes it on merge.
  - If there are any breaking changes, please clearly describe them.
  - If this PR depends on another PR being merged first, please include "Depends on #PR_NUMBER" in the description.

3. Run `make format`, `make lint` and `make test` from the root of the package(s) you've modified.

  - We will not consider a PR unless these three are passing in CI.

4. How did you verify your code works?

Additional guidelines:

  - All external PRs must link to an issue or discussion where a solution has been approved by a maintainer, and you must be assigned to that issue. PRs without prior approval will be closed.
  - PRs should not touch more than one package unless absolutely necessary.
  - Do not update the `uv.lock` files or add dependencies to `pyproject.toml` files (even optional ones) unless you have explicit permission to do so by a maintainer.

## Social handles (optional)
<!-- If you'd like a shoutout on release, add your socials below -->
Twitter: @
LinkedIn: https://linkedin.com/in/
```

## Commandes de vérification, telles qu'écrites dans AGENTS.md — https://github.com/langchain-ai/langgraph/blob/HEAD/AGENTS.md

```
When you modify code in any library, run the following commands in that library's directory before creating a pull request:

- `make format` – run code formatters
- `make lint` – run the linter
- `make test` – execute the test suite

To run a particular test file or to pass additional pytest options you can specify the `TEST` variable:

TEST=path/to/test.py make test
```
