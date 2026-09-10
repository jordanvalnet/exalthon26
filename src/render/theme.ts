// Une identité visuelle par profil (SCHEMA.md, « Profils », champ design). Même squelette HTML pour tous (deck.ts),
// seul ce fichier décide de l'allure : palette, typographie, densité, couverture, exergue, finale.
// Tout est inline, aucune police distante : les piles de polices ne citent que des fontes système.
// Le thème sombre ne sert qu'à l'écran ; l'impression force la palette claire de chaque profil.

const BASE = `
:root {
  --bg: #f5f5f3; --card: #ffffff; --fg: #17181c; --muted: #5f6470; --line: #dcdde2;
  --accent: #4f5bd5; --accent-2: #d1495b; --accent-ink: #ffffff;
  --cover-bg: #17181c; --cover-fg: #ffffff; --cover-muted: #b7bccb;
  --low: #2e9e6b; --mid: #d99a2b; --high: #d1495b;
  --font: ui-sans-serif, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --display: var(--font); --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --radius: 12px; --pad: 40px 48px; --width: 1040px; --min-h: 600px;
  --h1: 2.8rem; --h2: 1.7rem; --text: 1.02rem; --kpi: 2.6rem;
}
* { box-sizing: border-box; }
html { font-size: 16px; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 1rem/1.55 var(--font); }
section {
  position: relative; background: var(--card); border: 1px solid var(--line); border-radius: var(--radius);
  max-width: var(--width); margin: 28px auto; padding: var(--pad); min-height: var(--min-h); font-size: var(--text);
  display: flex; flex-direction: column;
}
section > .body { flex: 1; }
h1 { font: 700 var(--h1)/1.1 var(--display); letter-spacing: -0.01em; margin: 0 0 16px; }
h2 { font: 700 var(--h2)/1.2 var(--display); margin: 0 0 10px; }
p { margin: 0 0 10px; }
ul, ol { margin: 0 0 12px; padding-left: 22px; }
li { margin: 0 0 6px; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
code { font: 0.88em var(--mono); background: var(--bg); padding: 1px 6px; border-radius: 5px; }
pre { background: #14151a; color: #e8eaf1; padding: 14px 18px; border-radius: 10px; overflow-x: auto; margin: 0 0 14px; font-size: 0.9em; line-height: 1.5; }
pre code { background: none; padding: 0; color: inherit; font-size: 1em; }
strong { font-weight: 700; }
table { border-collapse: collapse; width: 100%; margin: 0 0 14px; font-size: 0.94em; }
th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid var(--line); vertical-align: top; }
th { font-size: 0.78em; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); border-bottom: 2px solid var(--accent); }
.level { display: inline-block; padding: 1px 10px; border-radius: 999px; font-size: 0.8em; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.04em; }
.level.low { background: var(--low); } .level.mid { background: var(--mid); } .level.high { background: var(--high); }

/* Couverture */
.cover { justify-content: center; background: var(--cover-bg); color: var(--cover-fg); border: 0; }
.cover a { color: inherit; }
.cover-top { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-bottom: 40px; }
.eyebrow { color: var(--accent); text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.8rem; font-weight: 700; }
.date, .repo, .cover-foot { color: var(--cover-muted); font-size: 0.9rem; }
.repo { font-family: var(--mono); font-size: 1rem; margin: 0 0 12px; }
.cover .desc { color: var(--cover-muted); font-size: 1.1rem; max-width: 46em; margin-bottom: 32px; }
.kpis { list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; padding: 0; margin: 0 0 32px; }
.kpis li { border: 1px solid rgba(255,255,255,0.18); border-radius: 12px; padding: 14px 18px; background: rgba(255,255,255,0.05); }
.kpis b { display: block; font: 700 var(--kpi)/1 var(--display); letter-spacing: -0.02em; margin-bottom: 6px; }
.kpis span { display: block; font-size: 0.82rem; color: var(--cover-muted); text-transform: uppercase; letter-spacing: 0.08em; }
.kpis b.long { font-size: calc(var(--kpi) * 0.62); padding: 0.25em 0; }
.kpis small { display: block; font-size: 0.78rem; color: var(--cover-muted); margin-top: 3px; text-transform: none; letter-spacing: 0; }
.cover-foot { margin: 0; display: flex; gap: 14px; flex-wrap: wrap; }

/* Pages */
.page header, .finale header { display: flex; flex-direction: column; gap: 4px; margin-bottom: 14px; }
.kicker { font: 700 0.78rem/1 var(--mono); color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase; }
.takeaway { margin: 0 0 22px; padding: 14px 20px; border-left: 5px solid var(--accent); background: var(--bg); font-size: 1.12em; font-weight: 600; line-height: 1.45; border-radius: 0 10px 10px 0; }
.body.split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 32px; align-items: start; }
.body.split .chart-wrap { min-width: 0; }
.body.stack .chart-wrap { margin-bottom: 20px; }
footer { display: flex; justify-content: space-between; gap: 12px; margin-top: 26px; padding-top: 12px; border-top: 1px solid var(--line); color: var(--muted); font-size: 0.78rem; }
footer .n { font-family: var(--mono); }

/* Graphiques SVG et listes annotées (charts.ts) */
.chart { display: block; width: 100%; height: auto; max-width: 640px; margin: 0 0 12px; }
.chart text { font-family: var(--font); fill: var(--fg); }
.chart .lbl { font-size: 12px; }
.chart .val, .chart .tick { font-size: 11px; fill: var(--muted); }
.chart .bar { fill: var(--accent); }
.chart .bar.strong { fill: var(--accent-2); }
.chart .bar.off { fill: var(--line); }
.chart .dot { fill: var(--accent); }
.chart .axis { stroke: var(--line); stroke-width: 1; }
.tree, .risks { list-style: none; margin: 0 0 14px; padding: 0; font-size: 0.92em; }
.tree li, .risks li { display: flex; gap: 10px; align-items: baseline; padding: 4px 0; border-bottom: 1px solid var(--line); }
.tree code { flex: 0 0 auto; }
.tree .more { color: var(--muted); border: 0; font-style: italic; }
.role { color: var(--muted); font-size: 0.9em; }
.light { width: 11px; height: 11px; border-radius: 50%; flex: 0 0 auto; background: var(--muted); }
.light.low { background: var(--low); } .light.mid { background: var(--mid); } .light.high { background: var(--high); }

/* Finale et sources */
.finale { border: 2px solid var(--accent); }
.finale .body { font-size: 1.08em; }
.finale ol, .finale ul { padding-left: 26px; }
.finale li { margin-bottom: 10px; }
.refs { min-height: 0; }
.refs ol { padding-left: 22px; font-size: 0.86rem; column-count: 2; column-gap: 32px; }
.refs li { margin-bottom: 6px; break-inside: avoid; }
.kind { color: var(--muted); margin-right: 8px; }
.note { font-size: 0.68em; }
.note a { text-decoration: none; padding: 0 1px; }
`;

// Chaque profil : palette, typographie, rythme, et deux ou trois traits qui font qu'on reconnaît le document au premier coup d'œil.
const PROFILES: Record<string, string> = {
  /* Dev : un guide de prise en main, air d'IDE. Titres en monospace, couverture en terminal, arborescence en explorateur. */
  dev: `
.p-dev { --accent: #4f5bd5; --accent-2: #e5484d; --cover-bg: #0f1220; --cover-fg: #eceffa; --cover-muted: #9aa3c4; --h1: 2.4rem; --h2: 1.35rem; --kpi: 2.2rem; }
.p-dev h2, .p-dev .kpis b { font-family: var(--mono); letter-spacing: -0.02em; }
.p-dev .cover { background: linear-gradient(160deg, #0f1220 0%, #171b33 100%); }
.p-dev .cover .repo::before { content: "$ onboard "; color: #7cd992; }
.p-dev .cover .repo::after { content: " --profile dev"; color: var(--cover-muted); }
.p-dev .cover .eyebrow { color: #7cd992; }
.p-dev .kpis li { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); }
.p-dev .kpis b { color: #a5adff; }
.p-dev section:not(.cover) { border-left: 6px solid var(--accent); }
.p-dev h2::before { content: "## "; color: var(--accent); opacity: 0.7; }
.p-dev .takeaway { font-family: var(--mono); font-size: 0.98em; background: #0f1220; color: #eceffa; border-left-color: #7cd992; }
.p-dev .takeaway::before { content: "> "; color: #7cd992; }
.p-dev .takeaway .note a { color: #a5adff; }
.p-dev .takeaway code { background: rgba(255,255,255,0.14); color: #fff; }
.p-dev .tree { font-family: var(--mono); font-size: 0.86em; }
.p-dev .tree li { border-bottom: 0; padding: 2px 0; }
.p-dev .tree code { background: none; padding: 0; color: var(--accent); }
.p-dev .tree code::before { content: "├─ "; color: var(--muted); }
.p-dev .finale { border-color: #7cd992; }
.p-dev .finale h2::before { content: "$ "; color: #7cd992; }
`,

  /* QA : un rapport de qualification. Cases à cocher, badges rouge et vert, tableaux zébrés, verdict par page. */
  qa: `
.p-qa { --accent: #0f8f7a; --accent-2: #d1495b; --bg: #f2f7f5; --cover-bg: #ffffff; --cover-fg: #14332c; --cover-muted: #5b7a72; --h1: 2.5rem; --h2: 1.5rem; }
.p-qa .cover { border: 1px solid var(--line); border-top: 14px solid var(--accent); }
.p-qa .cover .eyebrow::before { content: "✓ "; }
.p-qa .kpis li { background: #eef7f4; border-color: #cfe6df; }
.p-qa .kpis b { color: var(--accent); }
.p-qa .kpis li:nth-child(3) b { color: var(--accent-2); }
.p-qa .kpis span, .p-qa .kpis small { color: var(--cover-muted); }
.p-qa h2::before { content: "☑ "; color: var(--accent); }
.p-qa .takeaway { background: #eef7f4; border-left-color: var(--accent); }
.p-qa .takeaway::before { content: "Verdict"; display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent); margin-bottom: 4px; }
.p-qa .body ul { list-style: none; padding-left: 0; }
.p-qa .body ul li { padding-left: 26px; position: relative; }
.p-qa .body ul li::before { content: "☐"; position: absolute; left: 0; color: var(--accent); font-size: 1.05em; }
.p-qa .body ol { counter-reset: step; list-style: none; padding-left: 0; }
.p-qa .body ol li { padding-left: 34px; position: relative; }
.p-qa .body ol li::before { counter-increment: step; content: counter(step); position: absolute; left: 0; top: 1px; width: 24px; height: 24px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 0.8em; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.p-qa tbody tr:nth-child(odd) { background: #f6faf8; }
.p-qa .finale { background: #eef7f4; }
.p-qa .finale h2::before { content: "🧪 "; }
`,

  /* CTO : une note de décision. Bleu nuit, ambre, chiffres serrés, tableaux de risques, recommandation encadrée. */
  cto: `
.p-cto { --accent: #1f3a5f; --accent-2: #c9772e; --cover-bg: #1f3a5f; --cover-fg: #ffffff; --cover-muted: #b9c7dc; --bg: #f4f6f9; --h1: 2.5rem; --h2: 1.5rem; --text: 0.98rem; }
.p-cto .cover { background: linear-gradient(135deg, #1f3a5f 0%, #17304f 60%, #24466f 100%); }
.p-cto .cover .eyebrow { color: #f0b97a; }
.p-cto .cover h1 { border-left: 6px solid var(--accent-2); padding-left: 20px; }
.p-cto .kpis { grid-template-columns: repeat(4, 1fr); }
.p-cto .kpis li { border: 0; border-top: 3px solid var(--accent-2); border-radius: 0; background: rgba(255,255,255,0.06); }
.p-cto section:not(.cover) { border-top: 4px solid var(--accent); border-radius: 0 0 var(--radius) var(--radius); }
.p-cto .kicker { color: var(--accent-2); }
.p-cto .takeaway { border-left-color: var(--accent-2); background: #fbf3ea; }
.p-cto th { border-bottom-color: var(--accent); }
.p-cto .finale { border: 0; background: var(--accent); color: #fff; }
.p-cto .finale .kicker, .p-cto .finale h2 { color: #fff; }
.p-cto .finale h2 { border-left: 6px solid var(--accent-2); padding-left: 16px; }
.p-cto .finale code { background: rgba(255,255,255,0.14); color: #fff; }
.p-cto .finale a, .p-cto .finale .note a { color: #f0b97a; }
.p-cto .finale footer { border-top-color: rgba(255,255,255,0.25); color: #b9c7dc; }
`,

  /* CEO : un keynote. Serif de titrage, or sur bleu nuit, une idée par page, une phrase à retenir en grand. */
  ceo: `
.p-ceo { --accent: #14213d; --accent-2: #c9a227; --cover-bg: #14213d; --cover-fg: #fdfbf5; --cover-muted: #c8cfe0; --bg: #f7f5ef; --card: #fffdf8; --line: #e6e1d3;
  --display: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif; --h1: 3.2rem; --h2: 2.3rem; --text: 1.12rem; --kpi: 3.2rem; --pad: 56px 64px; --min-h: 640px; }
.p-ceo h1, .p-ceo h2 { font-weight: 600; letter-spacing: 0; }
.p-ceo .cover { background: radial-gradient(ellipse at 20% 10%, #22345e 0%, #14213d 55%, #0e1730 100%); }
.p-ceo .cover .eyebrow { color: var(--accent-2); }
.p-ceo .cover h1 { max-width: 16em; }
.p-ceo .kpis { grid-template-columns: repeat(4, 1fr); gap: 0; border-top: 1px solid rgba(255,255,255,0.2); }
.p-ceo .kpis li { border: 0; border-right: 1px solid rgba(255,255,255,0.2); border-radius: 0; background: none; padding: 22px 20px 8px 0; }
.p-ceo .kpis li:last-child { border-right: 0; }
.p-ceo .kpis li + li { padding-left: 20px; }
.p-ceo .kpis b { color: var(--accent-2); }
.p-ceo .kicker { color: var(--accent-2); font-family: var(--font); }
.p-ceo h2 { color: var(--accent); }
.p-ceo .takeaway { border: 0; background: none; padding: 6px 0 6px 36px; font: italic 500 1.55rem/1.35 var(--display); color: var(--accent); position: relative; margin-bottom: 28px; }
.p-ceo .takeaway .note { opacity: 0.55; }
.p-ceo .takeaway::before { content: "“"; position: absolute; left: 0; top: -6px; font-size: 3.2rem; color: var(--accent-2); line-height: 1; }
.p-ceo .body p { max-width: 42em; }
.p-ceo .body.split { grid-template-columns: 1fr; }
.p-ceo .chart .bar { fill: var(--accent-2); }
.p-ceo .chart .bar.strong { fill: var(--accent); }
.p-ceo .finale { background: var(--accent); color: #fdfbf5; border: 0; }
.p-ceo .finale .kicker, .p-ceo .finale h2 { color: var(--accent-2); }
.p-ceo .finale .body { font-size: 1.25em; }
.p-ceo .finale a, .p-ceo .finale .note a { color: var(--accent-2); }
.p-ceo .finale footer { border-top-color: rgba(255,255,255,0.25); color: #c8cfe0; }
.p-ceo footer { font-family: var(--font); }
`,

  /* Investisseur : un mémo. Serif de lecture, vert profond, filets fins, grille de chiffres, thèse en bandeau. */
  investisseur: `
.p-investisseur { --accent: #1d6b4a; --accent-2: #b8862b; --cover-bg: #ffffff; --cover-fg: #16201b; --cover-muted: #5f6b64; --bg: #f6f6f2; --card: #ffffff; --line: #d9dbd2;
  --font: Georgia, "Iowan Old Style", "Times New Roman", serif; --display: ui-sans-serif, system-ui, "Segoe UI", Helvetica, Arial, sans-serif; --h1: 2.6rem; --h2: 1.5rem; --text: 1.04rem; --kpi: 2.4rem; --pad: 48px 56px; }
.p-investisseur .cover { border: 1px solid var(--line); border-top: 18px solid var(--accent); }
.p-investisseur .cover .eyebrow { color: var(--accent); }
.p-investisseur .cover h1 { font-weight: 800; letter-spacing: -0.02em; max-width: 18em; }
.p-investisseur .cover .desc { color: var(--cover-muted); }
.p-investisseur .kpis { grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid var(--line); border-radius: 0; }
.p-investisseur .kpis li { border: 0; border-right: 1px solid var(--line); border-radius: 0; background: #f6f6f2; padding: 18px 20px; }
.p-investisseur .kpis li:last-child { border-right: 0; }
.p-investisseur .kpis b { color: var(--accent); font-family: var(--display); }
.p-investisseur .kpis span, .p-investisseur .kpis small { color: var(--cover-muted); }
.p-investisseur .kicker { font-family: var(--display); color: var(--accent-2); }
.p-investisseur h2 { border-bottom: 1px solid var(--line); padding-bottom: 8px; }
.p-investisseur .takeaway { background: none; border: 1px solid var(--line); border-left: 5px solid var(--accent); font-family: var(--display); font-size: 1.02em; }
.p-investisseur .takeaway::before { content: "Point clé"; display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--accent); margin-bottom: 4px; font-weight: 700; }
.p-investisseur table, .p-investisseur .tree, .p-investisseur .risks, .p-investisseur .chart text { font-family: var(--display); }
.p-investisseur th { border-bottom-color: var(--accent); }
.p-investisseur .chart .bar.strong { fill: var(--accent-2); }
.p-investisseur .finale { background: var(--accent); color: #fff; border: 0; }
.p-investisseur .finale .kicker { color: #e8d59a; }
.p-investisseur .finale h2 { color: #fff; border-bottom-color: rgba(255,255,255,0.3); }
.p-investisseur .finale .body { font-size: 1.22em; }
.p-investisseur .finale .body p { padding-left: 18px; border-left: 3px solid #e8d59a; }
.p-investisseur .finale a, .p-investisseur .finale .note a { color: #e8d59a; }
.p-investisseur .finale footer { border-top-color: rgba(255,255,255,0.3); color: #d6e5dc; }
`,

  /* Enfant : un album. Police ronde, fond crème, une couleur par page, cadre en pointillés, pas une note de bas de page. */
  enfant: `
.p-enfant { --accent: #d4572a; --accent-2: #7b4fc0; --bg: #fff6e5; --card: #fffdf7; --fg: #2b2118; --muted: #7a6a5a; --line: #f0dcc0; --cover-bg: #fffdf7; --cover-fg: #2b2118; --cover-muted: #7a6a5a;
  --font: "Chalkboard SE", "Comic Sans MS", "Comic Neue", "Segoe Print", "Bradley Hand", cursive, sans-serif; --display: var(--font);
  --h1: 3.4rem; --h2: 2.1rem; --text: 1.3rem; --kpi: 2.6rem; --radius: 26px; --pad: 44px 56px; --width: 900px; --min-h: 520px; }
.p-enfant body, .p-enfant { line-height: 1.6; }
.p-enfant section { border: 4px dashed var(--accent); box-shadow: 8px 8px 0 var(--accent); margin: 36px auto; }
.p-enfant section:nth-child(6n+2) { --accent: #d4572a; }
.p-enfant section:nth-child(6n+3) { --accent: #2a9d8f; }
.p-enfant section:nth-child(6n+4) { --accent: #7b4fc0; }
.p-enfant section:nth-child(6n+5) { --accent: #e0a800; }
.p-enfant section:nth-child(6n) { --accent: #e63946; }
.p-enfant section:nth-child(6n+1) { --accent: #1d7fd6; }
.p-enfant h1, .p-enfant h2 { color: var(--accent); font-weight: 700; }
.p-enfant h2::before { content: "🌟 "; }
.p-enfant .cover { text-align: center; align-items: center; }
.p-enfant .cover-top { justify-content: center; margin-bottom: 20px; }
.p-enfant .cover .eyebrow { font-size: 1.15rem; letter-spacing: 0; text-transform: none; }
.p-enfant .cover .eyebrow::before { content: "🎒 "; }
.p-enfant .cover .date, .p-enfant .cover .desc, .p-enfant .cover-foot { display: none; }
.p-enfant .cover .repo { font-family: var(--font); font-size: 1.1rem; }
.p-enfant .cover .repo::before { content: "📦 "; }
.p-enfant .kpis { display: flex; justify-content: center; flex-wrap: wrap; gap: 16px; }
.p-enfant .kpis li { border: 3px solid var(--accent); border-radius: 999px; background: var(--card); padding: 8px 22px; text-align: center; }
.p-enfant .kpis b { font-size: 1.6rem; color: var(--accent); display: inline; margin: 0 8px 0 0; }
.p-enfant .kpis span { display: inline; color: var(--fg); text-transform: none; letter-spacing: 0; font-size: 1.1rem; }
.p-enfant .kpis small { display: none; }
.p-enfant .kicker { display: none; }
.p-enfant .takeaway { border: 3px solid var(--accent); border-radius: 22px; background: var(--card); font-weight: 400; font-size: 1.15em; padding: 14px 22px 14px 58px; position: relative; }
.p-enfant .takeaway::before { content: "💡"; position: absolute; left: 18px; top: 12px; font-size: 1.5rem; }
.p-enfant .body.split { grid-template-columns: 1fr; }
.p-enfant code { font-family: inherit; font-size: 1em; background: #ffe9c7; border-radius: 10px; padding: 1px 8px; }
.p-enfant .chart .lbl { font-size: 15px; }
.p-enfant .chart .val, .p-enfant .chart .tick { font-size: 13px; }
.p-enfant .chart .bar { fill: #f08a3c; } .p-enfant .chart .bar.strong { fill: #a98be0; }
.p-enfant footer { border-top: 0; justify-content: center; }
.p-enfant footer .repo-name { display: none; }
.p-enfant .finale { border-style: solid; }
.p-enfant .finale h2::before { content: "🚀 "; }
.p-enfant .finale .body { font-size: 1.15em; }
`,
};

// Sombre : seuls les accents trop foncés changent, les couvertures gardent leur fond. L'enfant garde sa crème.
const DARK = `
@media (prefers-color-scheme: dark) {
  :root { --bg: #14151a; --card: #1c1e25; --fg: #eceef3; --muted: #a0a6b4; --line: #2f323c; --low: #4cc38a; --mid: #e5b25d; --high: #ef7f8e; }
  code { background: #262932; }
  .p-dev { --accent: #8f97ee; --accent-2: #ef7f8e; }
  .p-qa { --accent: #35c2a8; --accent-2: #ef7f8e; --bg: #14181a; --cover-bg: #1c2422; --cover-fg: #eef5f2; --cover-muted: #9fb8b0; }
  .p-qa .kpis li { background: #213230; border-color: #2e4a45; }
  .p-qa .takeaway, .p-qa .finale { background: #1f2b28; }
  .p-qa tbody tr:nth-child(odd) { background: #1f2624; }
  .p-cto { --accent: #7fa6d9; --accent-2: #f0b97a; --bg: #141821; }
  .p-cto .takeaway { background: #2a2620; }
  .p-cto .finale { background: #1f3a5f; }
  .p-ceo { --accent: #dcc27a; --bg: #15171c; --card: #1c1e25; --line: #2f323c; }
  .p-ceo .finale { background: #14213d; }
  .p-investisseur { --accent: #5cc493; --accent-2: #dcb25f; --bg: #141816; --card: #1b201d; --line: #2c342f; --cover-bg: #1b201d; --cover-fg: #eef3ef; --cover-muted: #9fb0a6; }
  .p-investisseur .kpis li { background: #16201b; }
  .p-investisseur .finale { background: #1d6b4a; }
}
`;

// Impression : A4 paysage, une section par page, palette claire forcée quel que soit le thème du navigateur.
const PRINT = `
@media print {
  @page { size: A4 landscape; margin: 10mm; }
  html { font-size: 12px; }
  .p-dev, .p-qa, .p-cto { --text: 0.9rem; }
  .p-dev .tree, .p-qa .tree, .p-cto .tree { font-size: 0.82em; }
  .body.split { gap: 22px; }
  .takeaway { font-size: 1.05em; padding: 10px 16px; margin-bottom: 14px; }
  body { background: #fff; }
  :root, .p-dev, .p-qa, .p-cto, .p-ceo, .p-investisseur, .p-enfant { --bg: #f5f5f3; --card: #fff; --fg: #17181c; --muted: #5f6470; --line: #dcdde2; }
  .p-qa { --bg: #f2f7f5; } .p-cto { --bg: #f4f6f9; } .p-ceo { --bg: #f7f5ef; --card: #fffdf8; } .p-investisseur { --bg: #f6f6f2; } .p-enfant { --bg: #fff6e5; --card: #fffdf7; --fg: #2b2118; --muted: #7a6a5a; }
  .p-ceo { --accent: #14213d; } .p-cto { --accent: #1f3a5f; } .p-dev { --accent: #4f5bd5; } .p-qa { --accent: #0f8f7a; } .p-investisseur { --accent: #1d6b4a; }
  section { max-width: none; margin: 0; min-height: 178mm; break-after: page; page-break-after: always; box-shadow: none; --pad: 26px 36px; }
  section:last-child { break-after: auto; page-break-after: auto; }
  .p-enfant section { box-shadow: none; margin: 0; }
  .cover { min-height: 178mm; }
  .refs { min-height: 0; }
  * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  a { text-decoration: none; }
}
`;

export function css(profile: string): string {
  return BASE + (PROFILES[profile] ?? "") + DARK + PRINT;
}
