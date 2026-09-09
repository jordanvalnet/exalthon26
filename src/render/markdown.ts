// Narratif Markdown → HTML. Les citations [facts:…] [src:…] [gh:…] deviennent des notes numérotées :
// `validate deck` refuse toute citation encore visible une fois les balises retirées.
const CITATION = /\[(facts|src|gh):([^\]]+)\]/g;

export type CiteKind = "facts" | "src" | "gh";
export type Citation = { n: number; kind: CiteKind; ref: string };
export type Section = { title: string; chart?: string; body: string };
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
      return { title: heading, ...(chart ? { chart } : {}), body: rest.replace(/<!--[\s\S]*?-->/g, "").trim() };
    });
  return { title, sections };
}

// Sans `notes`, les citations disparaissent du texte (deck enfant : pas de notes de bas de page).
export function renderBody(body: string, notes?: Notes): string {
  return body
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => (/^[-*]\s/.test(block) ? renderList(block, notes) : `<p>${renderInline(block, notes)}</p>`))
    .join("\n");
}

function renderList(block: string, notes?: Notes): string {
  const items = block
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .map((item) => `<li>${renderInline(item, notes)}</li>`);
  return `<ul>${items.join("")}</ul>`;
}

// Échapper d'abord, décorer ensuite : un titre contenant « < » ne doit jamais casser la page.
function renderInline(text: string, notes?: Notes): string {
  const decorated = escapeHtml(text)
    .replace(/\r?\n/g, " ")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Sans notes, la citation part avec l'espace qui la précède : « gagnée [facts:x]. » devient « gagnée. »
  if (!notes) return decorated.replace(new RegExp(`\\s*${CITATION.source}`, "g"), "");
  return decorated.replace(new RegExp(CITATION.source, "g"), (_match, kind: string, ref: string) => {
    const { n } = notes.add(kind as CiteKind, ref.trim());
    return `<sup class="note"><a href="#note-${n}">${n}</a></sup>`;
  });
}
