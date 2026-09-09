// Single responsibility: render the FACTUAL parts of the report (tables, key facts, gaps, sources) as Markdown.
// Narrative sections are left as explicit placeholders: a person or an assistant writes the plain-language text.
import type { Facts } from "../collectors/all.ts";

const day = (iso: string | null | undefined) => (iso ? new Date(iso).toISOString().slice(0, 10) : "—");
const esc = (s: string) => String(s ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const TODO = (what: string) => `> ✍️ **TO WRITE (plain language):** ${what}\n`;

export function renderSkeleton(f: Facts): string {
  const m = f.repository.facts, i = f.issues.facts, p = f.pullRequests.facts, r = f.releases.facts, w = f.wikiAndBoards.facts, a = f.authors.facts, impl = f.implementation.facts;
  const out: string[] = [];
  out.push(`# Onboarding overview — ${m.repo}`, "",
    `> Prepared on ${day(f.generatedAt)} for a non-technical reader, from the GitHub repository **${m.fullName}** (${m.htmlUrl}), using only the GitHub MCP tools. Prepared by ${f.preparedBy}.`, "");

  out.push("## In one minute", TODO("6 bullets: what it is · who made it · why it exists · how it is built (nutshell) · what it costs / optimizes · health today."), "");
  out.push("## 1. What does this project do?", `GitHub description: ${m.description ? `"${m.description}"` : "_none_"}${m.homepage ? ` — website: ${m.homepage}` : ""}`, "",
    TODO("3–6 sentences from the README introduction and feature sections in facts.purpose; analogy welcome; end with a one-line tagline."), "");

  out.push("## 2. Who is behind it?", "", "| | |", "|---|---|",
    `| Owner | [${a.owner.displayName ? `${a.owner.displayName} (${a.owner.login})` : a.owner.login}](${a.owner.url}) — ${a.owner.type === "Organization" ? "an organization" : "an individual account"} |`,
    `| Earliest author seen | ${a.firstCommit ? `${a.firstCommit.author} (${day(a.firstCommit.date)})` : "—"}${a.commitsSeen >= 300 ? " _(approximate: only recent history read)_" : ""} |`,
    `| Most recent author | ${a.lastCommit ? `${a.lastCommit.author} (${day(a.lastCommit.date)})` : "—"} |`,
    `| Main contributors (last ${a.commitsSeen} commits) | ${a.topCommitters.map((t: any) => `${t.login} (${t.commits})`).join(", ") || "—"} |`,
    `| Collaborators with access | ${a.collaborators ? a.collaborators.join(", ") || "none listed" : "_not visible to this token_"} |`,
    `| License | ${m.license ? m.license.name : "_no license file → all rights reserved by default_"}${a.licenseCopyright ? ` — "${esc(a.licenseCopyright)}"` : ""} |`, "",
    TODO("2–4 sentences: who created it, who maintains it today, how many people are involved; explain the license in everyday words."), "");

  out.push("## 3. Why does it exist?", f.rationale.facts.documented ? TODO("Summarize the motivation in the authors' own words (facts.rationale.sections / excerpts); quote one sentence.") : "**The documentation does not explain why the project was started.** (No Motivation / Why / Background section and no explanatory sentence was found in the files read.)\n\n" + TODO("Optional: one line labelled 'our reading', based only on the WHAT section. Nothing else."), "");

  out.push("## 4. How is it implemented? (no technical background required)", "",
    `Main programming language (GitHub): **${m.language ?? "not detected"}** · file types seen: ${impl.fileExtensions.map((e: any) => `.${e.ext} (${e.files})`).join(", ") || "—"}${m.topics.length ? ` · Topics: ${m.topics.join(", ")}` : ""}`, "",
    "| Building block (folder) | What it contains (plain words) |", "|---|---|",
    ...impl.mainFolders.map((d: any) => `| ${d.name}/ | ✍️ _to describe_ — entries: ${esc(d.entries.slice(0, 8).join(", "))}${d.entries.length > 8 ? "…" : ""} |`),
    ...(impl.mainFolders.length ? [] : ["| (no standard source folder) | " + esc(impl.topLevel.map((e: any) => e.name).slice(0, 15).join(", ")) + " |"]), "",
    `Delivery signals: ${impl.delivery.releases} release(s)${impl.delivery.latestRelease ? ` (latest ${impl.delivery.latestRelease.tag}, ${day(impl.delivery.latestRelease.date)})` : ""}, ${impl.delivery.branches} branch(es), ${impl.delivery.tags} tag(s)${impl.delivery.hasDockerfile ? ", packaged as a container (Docker)" : ""}${impl.delivery.workflows.length ? `, ${impl.delivery.workflows.length} automated workflow(s)` : ", no automated workflow"}.`, "",
    `Quality signals: tests folder ${yn(impl.quality.tests)} · contribution guide ${yn(impl.quality.contributing)} · code of conduct ${yn(impl.quality.codeOfConduct)} · security policy ${yn(impl.quality.security)} · license ${yn(impl.quality.license)} · changelog ${yn(impl.quality.changelog)} · docs folder ${yn(impl.quality.docsFolder)}.`, "",
    TODO("Shape of the product (website / app / tool / library / service), 1–4 building blocks with analogies, technologies glossed, how it is delivered and used, maturity in plain words WITH the evidence."), "");

  const c = f.cost.facts;
  out.push("## 5. What does it cost, and what does it seek to optimize?", "", "| Question | Answer | Source |", "|---|---|---|",
    `| Price for users | ✍️ ${c.pricingSections.length || c.priceExcerpts.length ? "_to write from facts.cost.pricingSections / priceExcerpts_" : `**Not documented.** License: ${m.license?.name ?? "none"}`} | ${c.pricingSections[0]?.file ?? c.priceExcerpts[0]?.file ?? "—"} |`,
    `| Running / infrastructure cost | ✍️ ${c.runningCostExcerpts.length ? "_to write from facts.cost.runningCostExcerpts_" : "**Not documented.**"} | ${c.runningCostExcerpts[0]?.file ?? "—"} |`,
    `| Funding & sponsors | ✍️ ${c.fundingFile || c.fundingExcerpts.length ? "_to write_" : "**Not documented.**"} | ${c.fundingFile ?? c.fundingExcerpts[0]?.file ?? "—"} |`,
    `| Development effort (documented only) | ✍️ ${c.effortExcerpts.length ? "_to write from facts.cost.effortExcerpts_" : "**Not documented.**"} | ${c.effortExcerpts[0]?.file ?? "—"} |`, "",
    `Optimization vocabulary found in the documentation: ${f.goals.facts.vocabulary.slice(0, 8).map((v: any) => `${v.word} (${v.hits})`).join(", ") || "_none_"}`, "",
    TODO("Optimization goals: what is optimized and for whom — 'stated' (quote) vs 'our reading' (labelled)."), "");

  out.push("## 6. Key facts", "", "| Created | Last activity | Latest release | Stars | Forks | Open issues + PRs (≈) | Open PRs | License | Wiki | Project boards |", "|---|---|---|---|---|---|---|---|---|---|",
    `| ${day(m.createdAt)} | ${day(m.pushedAt)} | ${r.latest ? `${r.latest.tag} (${day(r.latest.date)})` : "none"} | ${m.stars} | ${m.forks} | ${m.openIssuesAndPrs} | ${p.counts.open + p.counts.draft} | ${m.license?.name ?? "none"} | ${w.wiki.enabled ? "enabled" : "no"} | ${w.projects.enabled ? "enabled" : "no"} |`, "");

  out.push("## 7. Activity in detail", "",
    `### 7.1 Issues (tickets) — ${i.open.length} open${i.openCapped ? "+ (list capped)" : ""}, ${i.closed.length} closed${i.closedCapped ? "+ (list capped)" : ""}`, "",
    "_An issue is a ticket: a bug report, a question or a request._", "");
  out.push(...issueTable("Open", i.open), ...issueTable("Closed", i.closed));
  if (i.labelCounts.length) out.push(`Most used labels: ${i.labelCounts.slice(0, 8).map((l: any) => `${l.label} (${l.count})`).join(", ")}`, "");
  if (i.oldestOpen) out.push(`Oldest open issue: #${i.oldestOpen.number} "${esc(i.oldestOpen.title)}" (${day(i.oldestOpen.createdAt)}).`, "");
  out.push(TODO("Themes: 3–5 recurring subjects in plain words, what the most discussed tickets are about."), "");

  out.push(`### 7.2 Pull requests (proposed changes) — ${p.counts.open} open, ${p.counts.draft} draft, ${p.counts.merged} merged, ${p.counts.closed} closed without merge${p.capped ? " (list capped)" : ""}`, "",
    "_A pull request is a proposed change waiting to be reviewed and accepted into the project._", "");
  if (p.rows.length) out.push("| # | Title | Status | Author | Opened | Merged |", "|---|---|---|---|---|---|", ...p.rows.map((x: any) => `| [#${x.number}](${x.url}) | ${esc(x.title)} | ${x.status} | ${x.author} | ${day(x.createdAt)} | ${day(x.mergedAt)} |`), "");
  else out.push("_No pull request._", "");
  if (p.medianDaysToMerge != null) out.push(`Typical time to merge: about ${p.medianDaysToMerge} day(s) (median). Main proposers: ${p.authors.slice(0, 5).map((x: any) => `${x.login} (${x.prs})`).join(", ")}.`, "");
  out.push(TODO("Dynamics: who proposes changes (insiders/outsiders), how fast they are accepted."), "");

  out.push(`### 7.3 Releases (published versions) — ${r.releases.length}${r.capped ? "+" : ""}`, "");
  if (r.releases.length) out.push("| Version | Name | Published | Pre-release |", "|---|---|---|---|", ...r.releases.slice(0, 15).map((x: any) => `| ${x.tag} | ${esc(x.name)} | ${day(x.date)} | ${x.prerelease ? "yes" : ""} |`), r.releases.length > 15 ? `_…and ${r.releases.length - 15} older release(s)._` : "", "");
  else out.push("_No published release._", "");
  out.push(`Recent activity: last change on ${day(r.lastCommitDate)}, ${r.commitsLast90Days} change(s) in the last 90 days (of the ${r.commitsSeen} most recent), ${r.distinctAuthorsSeen} distinct author(s) among them.`, "", TODO("Release rhythm in words and health today (actively worked on / quiet), with the evidence above."), "");

  out.push("### 7.4 Wiki pages", "", w.wiki.enabled ? `The repository has a wiki enabled. **Its pages cannot be listed or read through the GitHub MCP tools available here.** Browse them at ${w.wiki.url}.` : "No wiki.", "");
  out.push("### 7.5 Project boards", "", w.projects.enabled ? `Project boards may exist. **They cannot be listed through the GitHub MCP tools.** Open ${w.projects.url}.` : "No project boards.", "");
  if (w.discussions.enabled) out.push(`Discussions are enabled but not reachable through MCP: ${w.discussions.url}`, "");
  out.push("### 7.6 People", "", TODO("(owned by gh-project-authors) Who commits, who proposes changes, who opens tickets — approximate, from the tables above."), "");

  out.push("## 8. Glossary", "", "- **Repository**: the project's shared folder on GitHub, with its full history.", "- **Issue**: a ticket (bug, question, request).", "- **Pull request (PR)**: a proposed change waiting for review.", "- **Release**: a numbered, published version.", "- **Commit**: one recorded change with its author and date.", "- **Branch**: a parallel working copy inside the repository.", "- **Fork**: someone's personal copy of the project.", "- **Star**: a bookmark; a rough popularity indicator.", "- **License**: the rules for reusing the project.", "");

  out.push("## 9. What we could not check (limits of the GitHub MCP tools)", "", ...(f.gaps.length ? f.gaps.map((g) => `- **${g.what}** — ${g.reason}${g.url ? ` → ${g.url}` : ""}`) : ["- Nothing: every section was answered from the repository."]), "");
  out.push("## 10. Sources", "", ...f.sources.map((s) => `- ${s.what} _(via ${s.via})_`), "");
  return out.join("\n");
}

function yn(b: boolean) { return b ? "✅" : "—"; }

function issueTable(label: string, rows: any[]): string[] {
  if (!rows.length) return [`_${label}: none._`, ""];
  return [`**${label} (${rows.length})**`, "", "| # | Title | Opened by | Date | Labels | Comments |", "|---|---|---|---|---|---|",
    ...rows.map((x) => `| #${x.number} | ${esc(x.title)} | ${x.author} | ${day(x.createdAt)} | ${esc(x.labels.join(", "))} | ${x.comments} |`), ""];
}
