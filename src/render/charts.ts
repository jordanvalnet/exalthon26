// Un rendu par graphique de onboard/SCHEMA.md. Tout est en SVG inline : aucune ressource externe,
// aucune couleur en dur — les classes CSS de deck.ts font le clair, le sombre et l'impression.
// Données absentes = chaîne vide : la section reste valide, presque tout est optionnel dans facts.ts.
import type { Facts } from "../facts.ts";
import { escapeHtml } from "./markdown.ts";

const WIDTH = 640;

type Row = { label: string; value: number; strong?: boolean; text?: string };

export function renderChart(name: string, facts: Facts): string {
  const chart = CHARTS[name];
  return chart ? chart(facts) : "";
}

function svg(height: number, inner: string): string {
  return `<svg class="chart" viewBox="0 0 ${WIDTH} ${height}" width="${WIDTH}" height="${height}" role="img" preserveAspectRatio="xMinYMin meet">${inner}</svg>`;
}

function clip(label: string, max = 24): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

// Barres horizontales : libellé à gauche, barre, valeur à droite. Sert à 4 graphiques.
function horizontalBars(rows: Row[]): string {
  if (!rows.length) return "";
  const max = Math.max(...rows.map((r) => r.value), 1);
  const rowH = 24;
  const labelW = 168;
  const barX = labelW + 10;
  const barW = WIDTH - barX - 64;
  const height = 12 + rows.length * rowH;
  const inner = rows
    .map((row, i) => {
      const y = 6 + i * rowH;
      const w = Math.max(2, Math.round((row.value / max) * barW));
      return `<text class="lbl" x="${labelW}" y="${y + 15}" text-anchor="end">${escapeHtml(clip(row.label))}</text>` +
        `<rect class="bar${row.strong ? " strong" : ""}" x="${barX}" y="${y + 4}" width="${w}" height="14" rx="3"/>` +
        `<text class="val" x="${barX + w + 6}" y="${y + 15}">${escapeHtml(row.text ?? String(row.value))}</text>`;
    })
    .join("");
  return svg(height, inner);
}

function languages(facts: Facts): string {
  const entries = Object.entries(facts.languages ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (!total) return "";
  return horizontalBars(
    entries.map(([name, bytes]) => ({ label: name, value: bytes, text: `${Math.round((bytes / total) * 100)} %` })),
  );
}

function contributors(facts: Facts): string {
  const activity = facts.activity;
  if (!activity?.contributors.length) return "";
  return horizontalBars(
    activity.contributors.slice(0, 10).map((c, i) => ({
      label: c.login,
      value: c.commits,
      strong: i < activity.bus_factor,
    })),
  );
}

function issuesByLabel(facts: Facts): string {
  const entries = Object.entries(facts.issues?.by_label ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (!entries.length) return "";
  return horizontalBars(entries.map(([label, count]) => ({ label, value: count })));
}

function commitsPerWeek(facts: Facts): string {
  const weeks = facts.activity?.commits_per_week ?? [];
  if (!weeks.length) return "";
  const max = Math.max(...weeks.map((w) => w.count), 1);
  const height = 172;
  const padL = 34;
  const padT = 12;
  const baseline = height - 34;
  const plotW = WIDTH - padL - 12;
  const plotH = baseline - padT;
  const slot = plotW / weeks.length;
  const barW = Math.max(4, slot * 0.6);
  const bars = weeks
    .map((week, i) => {
      const h = Math.round((week.count / max) * plotH);
      const x = padL + i * slot + (slot - barW) / 2;
      const label = week.week.slice(week.week.indexOf("W"));
      const tick = i % 2 === 0 ? `<text class="tick" x="${x + barW / 2}" y="${baseline + 16}" text-anchor="middle">${escapeHtml(label)}</text>` : "";
      return `<rect class="bar" x="${x}" y="${baseline - h}" width="${barW}" height="${Math.max(h, 1)}" rx="2"><title>${escapeHtml(`${week.week} : ${week.count}`)}</title></rect>${tick}`;
    })
    .join("");
  const axis = `<line class="axis" x1="${padL}" y1="${baseline}" x2="${WIDTH - 12}" y2="${baseline}"/>` +
    `<text class="tick" x="${padL - 6}" y="${padT + 10}" text-anchor="end">${max}</text>` +
    `<text class="tick" x="${padL - 6}" y="${baseline}" text-anchor="end">0</text>`;
  return svg(height, `${axis}${bars}`);
}

function releases(facts: Facts): string {
  const list = [...(facts.releases ?? [])].reverse();
  if (!list.length) return "";
  const height = 118;
  const y = 58;
  const padX = 40;
  const step = list.length > 1 ? (WIDTH - padX * 2) / (list.length - 1) : 0;
  const line = `<line class="axis" x1="${padX}" y1="${y}" x2="${WIDTH - padX}" y2="${y}"/>`;
  const points = list
    .map((release, i) => {
      const x = list.length > 1 ? padX + i * step : WIDTH / 2;
      const day = String(release.date).slice(0, 10);
      const above = i % 2 === 0;
      return `<circle class="dot" cx="${x}" cy="${y}" r="5"/>` +
        `<text class="lbl" x="${x}" y="${above ? y - 16 : y + 26}" text-anchor="middle">${escapeHtml(clip(release.tag, 14))}</text>` +
        `<text class="tick" x="${x}" y="${above ? y - 30 : y + 40}" text-anchor="middle">${escapeHtml(day)}</text>`;
    })
    .join("");
  return svg(height, `${line}${points}`);
}

// « Liste annotée, pas un graphique » (SCHEMA.md) : du HTML, pas du SVG.
// Une page, pas un inventaire : les dossiers d'abord, 16 entrées au plus, le reste est compté.
function tree(facts: Facts): string {
  const entries = [...(facts.tree ?? [])].sort((a, b) => (a.type === b.type ? 0 : a.type === "dir" ? -1 : 1));
  if (!entries.length) return "";
  const shown = entries.slice(0, 16);
  const items = shown
    .map((e) => `<li><code>${escapeHtml(e.path)}${e.type === "dir" ? "/" : ""}</code><span class="role">${escapeHtml(e.role)}</span></li>`)
    .join("");
  const more = entries.length > shown.length ? `<li class="more">… et ${entries.length - shown.length} autres entrées à la racine du dépôt</li>` : "";
  return `<ul class="tree">${items}${more}</ul>`;
}

function risks(facts: Facts): string {
  const list = facts.risks ?? [];
  if (!list.length) return "";
  const items = list
    // Un feu tricolore se lit d'un coup d'œil : une note de collecte de 600 signes déborde de la page.
    .map((r) => `<li><span class="light ${r.level}" aria-hidden="true"></span><b>${escapeHtml(r.kind)}</b><span class="role">${escapeHtml(clip(r.note, 190))}</span></li>`)
    .join("");
  return `<ul class="risks">${items}</ul>`;
}

function roadmap(facts: Facts): string {
  const themes = facts.roadmap?.themes ?? [];
  const milestones = facts.roadmap?.milestones ?? [];
  const bars = themes.length ? horizontalBars(themes.map((t) => ({ label: t.label, value: t.count }))) : "";
  const list = milestones.length
    ? `<ul class="tree">${milestones
        .map((m) => {
          const due = m.due ? ` · échéance ${String(m.due).slice(0, 10)}` : "";
          return `<li><code>${escapeHtml(m.title)}</code><span class="role">${m.open} ouvertes, ${m.closed} fermées${escapeHtml(due)}</span></li>`;
        })
        .join("")}</ul>`
    : "";
  return bars + list;
}

type AiDocKind = NonNullable<Facts["ai_docs"]>["files"][number]["kind"];

const AI_DOC_LABELS: Record<AiDocKind, string> = {
  agents_md: "AGENTS.md",
  claude_md: "CLAUDE.md",
  cursorrules: ".cursorrules",
  copilot_instructions: "copilot-instructions",
  llms_txt: "llms.txt",
  mcp_json: ".mcp.json",
  skills_dir: "skills/",
};

// Jauge « ce repo est-il prêt pour les agents ? » : un pavé par repère, plein si le fichier existe.
function aiReadiness(facts: Facts): string {
  const ai = facts.ai_docs;
  if (!ai) return "";
  const found = new Set(ai.files.map((f) => f.kind));
  const kinds = Object.keys(AI_DOC_LABELS) as AiDocKind[];
  const boxW = (WIDTH - 20) / kinds.length;
  const height = 96;
  const pills = kinds
    .map((kind, i) => {
      const x = 10 + i * boxW;
      const on = found.has(kind);
      return `<rect class="bar${on ? " strong" : " off"}" x="${x + 3}" y="34" width="${boxW - 6}" height="22" rx="4"/>` +
        `<text class="tick" x="${x + boxW / 2}" y="72" text-anchor="middle">${escapeHtml(clip(AI_DOC_LABELS[kind], 13))}</text>`;
    })
    .join("");
  const score = `<text class="lbl" x="10" y="22">${ai.score} repère${ai.score > 1 ? "s" : ""} sur ${ai.max} pour les agents IA</text>`;
  return svg(height, `${score}${pills}`);
}

const CHARTS: Record<string, (facts: Facts) => string> = {
  languages,
  commits_per_week: commitsPerWeek,
  contributors,
  issues_by_label: issuesByLabel,
  releases,
  tree,
  risks,
  roadmap,
  ai_readiness: aiReadiness,
};
