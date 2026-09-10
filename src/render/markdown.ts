// Narratif Markdown → HTML. Les citations [facts:…] et [src:…] renvoient au cache interne : elles servent au guide et à la
// validation, jamais au lecteur, elles disparaissent du deck. Seules les [gh:url] (références publiques) deviennent des notes.
// `validate deck` refuse toute citation encore visible une fois les balises retirées.
// Sous-ensemble compris (SCHEMA.md) : une ligne = un paragraphe, listes - et 1., tableaux |, blocs ```, > à retenir, **gras**, `code`, URL nues.
const CITATION = /\[(facts|src|gh):([^\]]+)\]/g;

export type CiteKind = "facts" | "src" | "gh";
export type Citation = { n: number; kind: CiteKind; ref: string };
export type Section = { title: string; chart?: string; takeaway?: string; body: string };
export type Narrative = { title: string; sections: Section[] };

export function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Accumulateur de notes : une même source citée deux fois garde le même numéro.
export class Notes {
  private readonly byKey = new Map<string, Citation>();

  add(kind: CiteKind, ref: string): Citation {
    const key = `${kind}:${ref}`;
    const known = this.byKey.get(key);
    if (known) return known;
    const cite: Citation = { n: this.byKey.size + 1, kind, ref };
    this.byKey.set(key, cite);
    return cite;
  }

  list(): Citation[] {
    return [...this.byKey.values()];
  }
}

export function parseNarrative(md: string): Narrative {
  const body = md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "";
  const sections = body
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const nl = chunk.indexOf("\n");
      const heading = (nl === -1 ? chunk : chunk.slice(0, nl)).trim();
      const rest = nl === -1 ? "" : chunk.slice(nl + 1);
      const chart = rest.match(/<!--\s*chart\s*:\s*([a-z_]+)\s*-->/)?.[1];
      // L'« à retenir » (première ligne « > ») sort du corps : le deck l'affiche en exergue, en tête de page.
      const takeaway = rest.match(/^>\s*(\S.*)$/m)?.[1]?.trim();
      const text = rest.replace(/<!--[\s\S]*?-->/g, "").replace(/^>.*$/gm, "").trim();
      return { title: heading, ...(chart ? { chart } : {}), ...(takeaway ? { takeaway } : {}), body: text };
    });
  return { title, sections };
}

// Sans `notes`, même les références publiques disparaissent (deck enfant : pas de notes de bas de page).
export function renderBody(body: string, notes?: Notes): string {
  const lines = body.replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    const trimmed = line.trim();
    if (!trimmed) {
      i++;
      continue;
    }
    if (trimmed.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i]!.trim().startsWith("```")) code.push(lines[i]!), i++;
      i++;
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }
    if (trimmed.startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i]!.trim().startsWith("|")) rows.push(lines[i]!.trim()), i++;
      out.push(renderTable(rows, notes));
      continue;
    }
    const list = /^[-*]\s/.test(trimmed) ? "ul" : /^\d+[.)]\s/.test(trimmed) ? "ol" : null;
    if (list) {
      const items: string[] = [];
      const marker = list === "ul" ? /^[-*]\s+/ : /^\d+[.)]\s+/;
      while (i < lines.length && marker.test(lines[i]!.trim())) items.push(lines[i]!.trim().replace(marker, "")), i++;
      out.push(`<${list}>${items.map((item) => `<li>${renderInline(item, notes)}</li>`).join("")}</${list}>`);
      continue;
    }
    out.push(`<p>${renderInline(trimmed, notes)}</p>`);
    i++;
  }
  return out.join("\n");
}

function renderTable(rows: string[], notes?: Notes): string {
  const cells = (row: string) => row.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  const [head, ...rest] = rows;
  const body = rest.filter((r) => !/^\|?\s*:?-{2,}/.test(r));
  const th = cells(head!).map((c) => `<th>${renderInline(c, notes)}</th>`).join("");
  const tr = body.map((r) => `<tr>${cells(r).map((c) => `<td>${renderInline(c, notes)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}

// Échapper d'abord, décorer ensuite : un titre contenant « < » ne doit jamais casser la page.
export function renderInline(text: string, notes?: Notes): string {
  const decorated = escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])(https?:\/\/[^\s<)\]]*[^\s<)\].,;:!?])/g, (_m, before: string, url: string) => `${before}<a href="${url}">${url}</a>`);
  // Une citation retirée part avec l'espace qui la précède : « gagnée [facts:x]. » devient « gagnée. »
  return decorated.replace(new RegExp(`\\s*${CITATION.source}`, "g"), (match, kind: string, ref: string) => {
    if (!notes || kind !== "gh") return "";
    const { n } = notes.add("gh", ref.trim());
    return `${match.startsWith(" ") ? " " : ""}<sup class="note"><a href="#note-${n}">${n}</a></sup>`.replace(/^ /, "");
  });
}
