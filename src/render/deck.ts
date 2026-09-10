// Assemblage du deck : une <section> par page, tout inline. Contrat vérifié par validateDeck (src/validate.ts) :
// aucune ressource externe, au moins questions+2 sections, aucune citation brute visible, une règle @media print.
// Le squelette est le même pour tous les profils ; l'allure vient de theme.ts, les tuiles de couverture de kpi.ts.
import type { Facts } from "../facts.ts";
import type { Profile } from "../validate.ts";
import { renderChart } from "./charts.ts";
import { formatDate, kpis } from "./kpi.ts";
import { escapeHtml, Notes, parseNarrative, renderBody, renderInline, type Section } from "./markdown.ts";
import { css } from "./theme.ts";

export function buildDeck(facts: Facts, narrative: string, profile: Profile): string {
  const { title, sections } = parseNarrative(narrative);
  // Un enfant ne lit pas de notes de bas de page : ni numéros dans le texte, ni page Sources.
  const kid = profile.name === "enfant";
  const notes = kid ? undefined : new Notes();
  // La finale écrite par le rédacteur est la dernière section, au libellé exact de deck.finale (SCHEMA.md).
  const last = sections[sections.length - 1];
  const written = last && profile.finale && last.title === profile.finale ? last : undefined;
  const questions = written ? sections.slice(0, -1) : sections;
  // La page Sources existe dès qu'une référence publique [gh:…] est citée : elle compte dans la pagination.
  const refs = notes !== undefined && sections.some((s) => /\[gh:/.test(`${s.takeaway ?? ""} ${s.body}`));
  const closing = questions.length + 2;
  const total = refs ? closing + 1 : closing;
  const day = formatDate(String(facts.collected.at));
  const foot = (n: number) => footer(facts.repo.full_name, day, profile.name, n, total);

  const pages = questions.map((section, i) => page(section, facts, notes, i + 2, foot(i + 2))).join("\n");
  const body =
    cover(facts, profile, title) +
    pages +
    finale(facts, profile, written, notes, foot(closing)) +
    (notes?.list().length ? sources(notes, foot(total)) : "");
  return shell(title || facts.repo.full_name, body, profile.name);
}

function page(section: Section, facts: Facts, notes: Notes | undefined, n: number, foot: string): string {
  const chart = section.chart ? renderChart(section.chart, facts) : "";
  const takeaway = section.takeaway ? `<p class="takeaway">${renderInline(section.takeaway, notes)}</p>` : "";
  const text = badgeLevels(renderBody(section.body, notes));
  const body = chart
    ? `<div class="body split"><div class="chart-wrap">${chart}</div><div class="text">${text}</div></div>`
    : `<div class="body"><div class="text">${text}</div></div>`;
  return `<section class="page">
<header><span class="kicker">${kicker(n)}</span><h2>${escapeHtml(section.title)}</h2></header>
${takeaway}
${body}
${foot}
</section>`;
}

function kicker(n: number): string {
  return String(n).padStart(2, "0");
}

// Un deck est un instantané : la date du relevé GitHub est sur chaque page.
function footer(repo: string, day: string, profile: string, n: number, total: number): string {
  return `<footer><span class="repo-name">${escapeHtml(repo)} · relevé le ${escapeHtml(day)}</span><span class="n">${escapeHtml(profile)} · ${n} / ${total}</span></footer>`;
}

function cover(facts: Facts, profile: Profile, title: string): string {
  const repo = facts.repo;
  const tiles = kpis(facts, profile.design.kpis)
    .map((k) => `<li><b${k.long ? ' class="long"' : ""}>${escapeHtml(k.value)}</b><span>${escapeHtml(k.label)}</span>${k.hint ? `<small>${escapeHtml(k.hint)}</small>` : ""}</li>`)
    .join("");
  const eyebrow = profile.design.eyebrow ?? `Onboarding · profil ${profile.name}`;
  const foot = [
    `<a href="${escapeHtml(repo.url)}">${escapeHtml(repo.url)}</a>`,
    repo.license ? `Licence ${escapeHtml(repo.license)}` : "Sans licence",
    `Onboard · profil ${escapeHtml(profile.name)}`,
  ];
  return `<section class="cover">
<div class="cover-top"><span class="eyebrow">${escapeHtml(eyebrow)}</span><span class="date">Données GitHub relevées le ${escapeHtml(formatDate(String(facts.collected.at)))}</span></div>
<p class="repo">${escapeHtml(repo.full_name)}</p>
<h1>${renderInline(title || repo.full_name)}</h1>
${repo.description ? `<p class="desc">${escapeHtml(repo.description)}</p>` : ""}
${tiles ? `<ul class="kpis">${tiles}</ul>` : ""}
<p class="cover-foot">${foot.map((f) => `<span>${f}</span>`).join("")}</p>
</section>`;
}

// Page de clôture : la section finale du narratif quand elle existe, sinon uniquement des faits de facts.json.
function finale(facts: Facts, profile: Profile, written: Section | undefined, notes: Notes | undefined, foot: string): string {
  const heading = profile.finale ?? "Pour aller plus loin";
  const body = written ? badgeLevels(renderBody(written.body, notes)) : factualFinale(facts, profile);
  const takeaway = written?.takeaway ? `<p class="takeaway">${renderInline(written.takeaway, notes)}</p>` : "";
  return `<section class="finale">
<header><span class="kicker">${escapeHtml(profile.name)}</span><h2>${escapeHtml(heading)}</h2></header>
${takeaway}
<div class="body"><div class="text">${body}</div></div>
${foot}
</section>`;
}

function factualFinale(facts: Facts, profile: Profile): string {
  if (profile.name === "enfant") {
    return `<p>🚀 Tout ça est gratuit et ouvert : n'importe qui peut aller voir, copier, et proposer ses idées.</p>
<p>Le projet habite ici : <a href="${escapeHtml(facts.repo.url)}">${escapeHtml(facts.repo.url)}</a></p>`;
  }
  const steps: string[] = [];
  if (facts.build?.install) steps.push(`Installer : <code>${escapeHtml(facts.build.install)}</code>`);
  if (facts.build?.test) steps.push(`Lancer les tests : <code>${escapeHtml(facts.build.test)}</code>`);
  const entry = facts.entrypoints?.[0];
  if (entry) steps.push(`Ouvrir <code>${escapeHtml(entry.path)}</code> : ${escapeHtml(entry.why)}`);
  const first = facts.issues?.good_first?.[0];
  if (first) steps.push(`Première issue : <a href="${escapeHtml(first.url)}">#${first.number} ${escapeHtml(first.title)}</a>`);
  return steps.length
    ? `<ol>${steps.slice(0, 3).map((s) => `<li>${s}</li>`).join("")}</ol>`
    : `<p>Tout part de <a href="${escapeHtml(facts.repo.url)}">${escapeHtml(facts.repo.url)}</a>.</p>`;
}

// Uniquement les références publiques : une URL par note. Le cache interne n'apparaît jamais dans le deck.
function sources(notes: Notes, foot: string): string {
  const items = notes
    .list()
    .map((cite) => `<li id="note-${cite.n}"><a href="${escapeHtml(cite.ref)}">${escapeHtml(cite.ref)}</a></li>`)
    .join("");
  return `<section class="refs"><header><span class="kicker">références publiques</span><h2>Sources</h2></header><div class="body"><ol class="sources">${items}</ol></div>${foot}</section>`;
}

// Une cellule de tableau qui ne contient qu'un niveau de risque devient une pastille : « high » se lit sans chercher.
const LEVELS: Record<string, string> = { low: "low", faible: "low", mid: "mid", moyen: "mid", high: "high", "élevé": "high", eleve: "high" };
function badgeLevels(html: string): string {
  return html.replace(/<td>\s*([A-Za-zé]+)\s*<\/td>/g, (m, word: string) => {
    const level = LEVELS[word.toLowerCase()];
    return level ? `<td><span class="level ${level}">${escapeHtml(word)}</span></td>` : m;
  });
}

function shell(title: string, body: string, profile: string): string {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title.replace(/[`*]/g, ""))}</title>
<style>${css(profile)}</style>
</head>
<body class="p-${escapeHtml(profile)}">
${body}
</body>
</html>
`;
}
