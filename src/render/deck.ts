// Assemblage du deck : une <section> par page, tout inline. Contrat vérifié par validateDeck (src/validate.ts) :
// aucune ressource externe, au moins questions+2 sections, aucune citation brute visible, une règle @media print.
import type { Facts } from "../facts.ts";
import type { Profile } from "../validate.ts";
import { renderChart } from "./charts.ts";
import { escapeHtml, Notes, parseNarrative, renderBody } from "./markdown.ts";

export function buildDeck(facts: Facts, narrative: string, profile: Profile): string {
  const { title, sections } = parseNarrative(narrative);
  const notes = new Notes();
  const pages = sections
    .map((section) => {
      const chart = section.chart ? renderChart(section.chart, facts) : "";
      return page(section.title, `${chart}${renderBody(section.body, notes)}`);
    })
    .join("\n");
  // Les notes sont numérotées pendant le rendu du corps : la page Sources se construit après.
  return shell(
    title || facts.repo.full_name,
    cover(facts, profile, title) + pages + finale(facts, profile) + sources(notes),
    profile.name,
  );
}

function page(heading: string, body: string): string {
  return `<section><h2>${escapeHtml(heading)}</h2><div class="body">${body}</div></section>`;
}

function cover(facts: Facts, profile: Profile, title: string): string {
  const repo = facts.repo;
  const day = String(facts.collected.at).slice(0, 10);
  const meta = [
    `${repo.stars} ★`,
    `${repo.forks} forks`,
    `${repo.open_issues} issues ouvertes`,
    repo.license ?? "sans licence",
  ];
  return `<section class="cover">
  <p class="eyebrow">Onboarding · profil ${escapeHtml(profile.name)} · ${escapeHtml(day)}</p>
  <h1>${escapeHtml(repo.full_name)}</h1>
  ${title ? `<p class="lede">${escapeHtml(title)}</p>` : ""}
  ${repo.description ? `<p class="desc">${escapeHtml(repo.description)}</p>` : ""}
  <p class="meta">${meta.map((m) => `<span>${escapeHtml(m)}</span>`).join("")}</p>
  <p class="url"><code>${escapeHtml(repo.url)}</code></p>
</section>`;
}

// Page de clôture : uniquement des faits déjà présents dans facts.json, jamais une action inventée.
function finale(facts: Facts, profile: Profile): string {
  const steps: string[] = [];
  if (facts.build?.install) steps.push(`Installer : <code>${escapeHtml(facts.build.install)}</code>`);
  if (facts.build?.test) steps.push(`Lancer les tests : <code>${escapeHtml(facts.build.test)}</code>`);
  const entry = facts.entrypoints?.[0];
  if (entry) steps.push(`Ouvrir <code>${escapeHtml(entry.path)}</code> — ${escapeHtml(entry.why)}`);
  const first = facts.issues?.good_first?.[0];
  if (first) steps.push(`Première issue : <a href="${escapeHtml(first.url)}">#${first.number} ${escapeHtml(first.title)}</a>`);
  const body = steps.length
    ? `<ol class="steps">${steps.slice(0, 3).map((s) => `<li>${s}</li>`).join("")}</ol>`
    : `<p>Tout part de <code>${escapeHtml(facts.repo.url)}</code>.</p>`;
  return `<section class="finale"><h2>${escapeHtml(profile.finale ?? "Pour aller plus loin")}</h2><div class="body">${body}</div></section>`;
}

function sources(notes: Notes): string {
  const items = notes.list().map((cite) => {
    const label = cite.kind === "facts" ? "donnée collectée" : cite.kind === "src" ? "source du repo" : "GitHub";
    const value = /^https?:\/\//.test(cite.ref)
      ? `<a href="${escapeHtml(cite.ref)}">${escapeHtml(cite.ref)}</a>`
      : `<code>${escapeHtml(cite.ref)}</code>`;
    return `<li id="note-${cite.n}"><span class="kind">${escapeHtml(label)}</span>${value}</li>`;
  });
  const body = items.length ? `<ol class="sources">${items.join("")}</ol>` : "<p>Aucune citation dans ce narratif.</p>";
  return `<section class="refs"><h2>Sources</h2><div class="body">${body}</div></section>`;
}

function shell(title: string, body: string, profile: string): string {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>${CSS}</style>
</head>
<body class="p-${escapeHtml(profile)}">
${body}
</body>
</html>
`;
}

const CSS = `
:root {
  --bg: #f7f7f5; --card: #ffffff; --fg: #17181c; --muted: #5f6470;
  --line: #dcdde2; --bar: #4f5bd5; --bar-strong: #d1495b; --accent: #4f5bd5;
  --low: #2e9e6b; --mid: #d99a2b; --high: #d1495b;
  --radius: 10px; --pad: 32px 36px; --width: 900px;
  --h1: 2.1rem; --h2: 1.45rem; --text: 1rem;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #14151a; --card: #1c1e25; --fg: #eceef3; --muted: #a0a6b4;
    --line: #2f323c; --bar: #8f97ee; --bar-strong: #ef7f8e; --accent: #8f97ee;
    --low: #4cc38a; --mid: #e5b25d; --high: #ef7f8e;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--fg);
  font: 16px/1.55 ui-sans-serif, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
section {
  background: var(--card); border: 1px solid var(--line); border-radius: var(--radius);
  max-width: var(--width); margin: 24px auto; padding: var(--pad); min-height: 460px;
  font-size: var(--text);
}
h1 { font-size: var(--h1); line-height: 1.15; margin: 0 0 12px; }
h2 { font-size: var(--h2); margin: 0 0 20px; padding-bottom: 12px; border-bottom: 2px solid var(--accent); }

/* Un profil = un public. L'accent, la densité et l'échelle typographique changent, la palette de base ne bouge pas. */
.p-dev { --accent: #4f5bd5; --bar: #4f5bd5; --bar-strong: #d1495b; }
.p-qa { --accent: #0f8f7a; --bar: #0f8f7a; --bar-strong: #d1495b; }
.p-cto { --accent: #3d6fa8; --bar: #3d6fa8; --bar-strong: #c9772e; }
.p-ceo {
  --accent: #1f3a5f; --bar: #1f3a5f; --bar-strong: #b8862b;
  --h1: 2.7rem; --h2: 1.7rem; --text: 1.08rem; --pad: 44px 52px; --width: 860px;
}
.p-investisseur {
  --accent: #1d6b4a; --bar: #1d6b4a; --bar-strong: #b8862b;
  --h1: 2.6rem; --h2: 1.65rem; --text: 1.05rem; --pad: 40px 48px;
}
.p-enfant {
  --accent: #d4572a; --bar: #f08a3c; --bar-strong: #7b4fc0;
  --h1: 3rem; --h2: 2rem; --text: 1.25rem; --radius: 24px; --pad: 44px 52px; --width: 820px;
}
.p-ceo h2, .p-investisseur h2, .p-enfant h2 { border-bottom-width: 3px; }
.p-enfant section { border-width: 3px; border-color: var(--accent); }
.p-enfant code { border-radius: 8px; }
p { margin: 0 0 12px; }
code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 0.88em; background: var(--bg); padding: 1px 5px; border-radius: 4px; }
a { color: var(--accent); }
.cover { display: flex; flex-direction: column; justify-content: center; }
.eyebrow { color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.78rem; margin-bottom: 18px; }
.lede { font-size: 1.15rem; }
.desc { color: var(--muted); }
.meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.meta span { border: 1px solid var(--line); border-radius: 999px; padding: 3px 12px; font-size: 0.85rem; color: var(--muted); }
.url { margin-top: 16px; }
.note { font-size: 0.7em; }
.note a { text-decoration: none; padding: 0 1px; }
.chart { display: block; width: 100%; height: auto; max-width: 640px; margin: 0 0 20px; }
.chart text { font-family: inherit; fill: var(--fg); }
.chart .lbl { font-size: 12px; }
.chart .val, .chart .tick { font-size: 11px; fill: var(--muted); }
.chart .bar { fill: var(--bar); }
.chart .bar.strong { fill: var(--bar-strong); }
.chart .bar.off { fill: var(--line); }
.chart .dot { fill: var(--accent); }
.chart .axis { stroke: var(--line); stroke-width: 1; }
.tree, .risks, .steps, .sources { margin: 0 0 18px; padding-left: 0; }
.tree, .risks { list-style: none; }
.tree li, .risks li { display: flex; gap: 10px; align-items: baseline; padding: 4px 0; border-bottom: 1px solid var(--line); }
.role { color: var(--muted); font-size: 0.9rem; }
.light { width: 10px; height: 10px; border-radius: 50%; flex: 0 0 auto; background: var(--muted); }
.light.low { background: var(--low); }
.light.mid { background: var(--mid); }
.light.high { background: var(--high); }
.steps, .sources { padding-left: 22px; }
.steps li, .sources li { margin-bottom: 10px; }
.sources { font-size: 0.9rem; }
.kind { color: var(--muted); margin-right: 8px; }
@media print {
  @page { size: A4 landscape; margin: 12mm; }
  /* Palette claire forcée : sinon une impression depuis un navigateur en thème sombre sort en texte clair sur blanc. */
  :root {
    --bg: #fff; --card: #fff; --fg: #17181c; --muted: #5f6470;
    --line: #dcdde2; --bar: #4f5bd5; --bar-strong: #d1495b; --accent: #4f5bd5;
    --low: #2e9e6b; --mid: #d99a2b; --high: #d1495b;
  }
  body { background: #fff; color: var(--fg); }
  section {
    border: 0; margin: 0; padding: 0; max-width: none; min-height: 0;
    break-after: page; page-break-after: always;
  }
  section:last-child { break-after: auto; page-break-after: auto; }
  .chart .bar, .chart .bar.strong, .light { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  a { color: #000; text-decoration: none; }
}
`;
