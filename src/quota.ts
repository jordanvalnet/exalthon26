// Couche unique des appels au serveur MCP GitHub côté code (src/github.ts la branche sur la connexion).
// Réactif : une erreur de quota est reconnue, une seule attente bornée (≤ 60 s) si le reset est proche, jamais de boucle.
// Proactif : chaque appel porte une priorité (P0 indispensable, P1 utile, P2 jetable), le collecteur a un budget d'appels
// et une échéance ; quand l'un des deux ne suffit plus, les P2 puis les P1 sont jetés, chaque jet est journalisé avec sa
// raison dans <cache>/parts/quota.json. `bun run quota <cache>` résume cet état.
//
// Vérifié le 2026-09-10 en lisant pkg/errors/error.go de github/github-mcp-server via MCP : une erreur de quota REST arrive
// en résultat d'outil `isError` dont le texte finit par « GitHub API rate limit exceeded. Retry after 42m13s. » (limite
// primaire 5000/h ou de recherche 30/min, délai au format Go, ou « Wait before retrying. » sans délai), et par « GitHub
// secondary rate limit exceeded. Retry after 30s. » pour une limite secondaire. Vérifié aussi : la réponse HTTP du serveur
// MCP ne porte aucun en-tête x-ratelimit-* et aucun outil ne donne le quota restant, qui ne se connaît que par ses refus.
// Supposé : les outils GraphQL (list_issues) renvoient le message brut de GitHub, « API rate limit exceeded… », sans délai ;
// un 429 du serveur MCP lui-même remonte en exception « MCP tools/call: HTTP 429 » du client.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { type McpClient, type McpToolResult, toolText } from "../onboarding/src/mcp/client.ts";

export type Priority = "P0" | "P1" | "P2";
export type Planned = { label: string; priority: Priority; count: number; url?: string };
export type QuotaOptions = { by: string; dir?: string; budget?: number; deadline?: number; plan?: Planned[] };
export type QuotaResult = McpToolResult & { skipped?: string };
type Family = "core" | "search";
type Call = { label: string; tool: string; priority: Priority; ms: number; ok: boolean };
type Skip = { label: string; priority: Priority; reason: string; url?: string };
type Run = { at: string; budget: number; deadline_s: number; calls: number; remaining: number; ms: number; waited_ms: number; made: Call[]; skipped: Skip[] };
type State = { schema: 1; resets: Partial<Record<Family, string>>; collectors: Record<string, Run> };

export const QUOTA_FILE = "parts/quota.json";
const MAX_WAIT_MS = 60_000;
const CALL_MS = 1_500;
const RANK: Record<Priority, number> = { P0: 0, P1: 1, P2: 2 };
const UNKNOWN = "?";

export class QuotaError extends Error {
  constructor(message: string, readonly reset: string | null) {
    super(message);
  }
}

// Reconnaît une erreur de quota dans un texte d'erreur ; `retryMs` quand le serveur annonce un délai.
export function quotaError(text: string): { retryMs: number | null; secondary: boolean } | null {
  if (!/rate limit|HTTP 429/i.test(text)) return null;
  const m = text.match(/Retry after (?:(\d+)h)?(?:(\d+)m)?(?:(\d+(?:\.\d+)?)s)?/);
  const s = m ? Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) : 0;
  return { retryMs: s > 0 ? Math.round(s * 1000) : null, secondary: /secondary/i.test(text) };
}

// Options communes des collecteurs en code : `--budget N` et `--deadline S` (secondes), le reste est positionnel.
export function quotaArgs(argv: string[]): { budget?: number; deadline?: number; rest: string[] } {
  const out: { budget?: number; deadline?: number; rest: string[] } = { rest: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a !== "--budget" && a !== "--deadline") {
      out.rest.push(a);
      continue;
    }
    const v = Number(argv[++i]);
    if (!(v > 0)) throw new Error(`${a} attend un nombre positif`);
    out[a.slice(2) as "budget" | "deadline"] = v;
  }
  return out;
}

const family = (tool: string): Family => (tool.startsWith("search_") ? "search" : "core");
const clock = (iso: string) => new Date(iso).toTimeString().slice(0, 8);
const inMinutes = (iso: string) => Math.max(1, Math.ceil((Date.parse(iso) - Date.now()) / 60_000));
const resetText = (at: string | undefined) => (!at || at === UNKNOWN ? "inconnu" : `à ${clock(at)} (dans ${inMinutes(at)} min)`);

function readState(dir: string): State {
  const file = path.join(dir, QUOTA_FILE);
  if (!existsSync(file)) return { schema: 1, resets: {}, collectors: {} };
  try {
    return JSON.parse(readFileSync(file, "utf8")) as State;
  } catch {
    return { schema: 1, resets: {}, collectors: {} };
  }
}

export class Quota {
  readonly budget: number;
  readonly deadlineMs: number;
  private readonly plan: Planned[];
  private readonly started = Date.now();
  private readonly made: Call[] = [];
  private readonly skipped: Skip[] = [];
  private readonly resets: Partial<Record<Family, string>>;
  private waitedMs = 0;

  constructor(private readonly raw: McpClient, private readonly opts: QuotaOptions) {
    this.plan = opts.plan ?? [];
    this.budget = opts.budget ?? (this.plan.length ? this.plan.reduce((n, p) => n + p.count, 0) : Infinity);
    this.deadlineMs = (opts.deadline ?? 60) * 1000;
    this.resets = opts.dir ? readState(opts.dir).resets : {};
  }

  get calls(): number {
    return this.made.length;
  }

  // Le reset le plus lointain encore à venir, ISO ; « ? » si le quota est épuisé sans heure annoncée ; null sinon.
  get reset(): string | null {
    const known = Object.values(this.resets).filter((at) => at !== UNKNOWN && Date.parse(at) > Date.now()).sort();
    return known.at(-1) ?? (Object.values(this.resets).includes(UNKNOWN) ? UNKNOWN : null);
  }

  dropped(label: string): boolean {
    return this.skipped.some((s) => s.label === label);
  }

  // Un client MCP dont chaque appel passe par ce quota sous l'étiquette donnée, pour GitHubMcp.
  client(label: string): Pick<McpClient, "callTool"> {
    return { callTool: (name, args) => this.call(label, name, args) };
  }

  // Appel dont la réponse est du JSON : null si l'appel est jeté, exception sur une vraie erreur d'outil.
  async json<T>(label: string, name: string, args: Record<string, unknown>): Promise<T | null> {
    const r = await this.call(label, name, args);
    if (r.skipped) return null;
    const text = toolText(r);
    if (r.isError) throw new Error(`${name} : ${text.slice(0, 200)}`);
    return JSON.parse(text) as T;
  }

  async call(label: string, name: string, args: Record<string, unknown>): Promise<QuotaResult> {
    const p = this.plan.find((x) => x.label === label) ?? { label, priority: "P1" as Priority, count: 1 };
    const already = this.skipped.find((s) => s.label === label);
    if (already) return result(p, already.reason);
    const refusal = await this.refusal(p, name);
    if (refusal) return this.skip(p, refusal);
    let r = await this.attempt(p, name, args);
    let q = r.isError ? quotaError(toolText(r)) : null;
    if (q) {
      this.noteReset(name, q);
      if (q.retryMs !== null && this.canWait(p, q.retryMs)) {
        await this.wait(q.retryMs);
        r = await this.attempt(p, name, args);
        q = r.isError ? quotaError(toolText(r)) : null;
        if (q) this.noteReset(name, q);
      }
    }
    if (!q) return r;
    const reason = `quota GitHub épuisé sur ${name}, reset ${resetText(this.resets[family(name)])}`;
    if (p.priority === "P0") throw new QuotaError(`${label} (P0) : ${reason}`, this.resets[family(name)] ?? null);
    return this.skip(p, reason);
  }

  // Les jets, formulés pour la ligne « Manques » : quoi, pourquoi, où aller voir.
  missing(): string[] {
    return this.skipped.map((s) => `${s.label} jeté (${s.priority}, ${s.reason})${s.url ? ` → ${s.url}` : ""}`);
  }

  summary(): string {
    const reset = this.reset;
    return `${this.calls} appels MCP · ${this.skipped.length} jeté(s) · reset ${reset ? resetText(reset) : "aucun"}`;
  }

  // Relit le fichier juste avant d'écrire : les collecteurs tournent en parallèle, chacun n'écrit que sa propre entrée.
  save(): void {
    if (!this.opts.dir) return;
    const state = readState(this.opts.dir);
    const now = Date.now();
    state.resets = Object.fromEntries(Object.entries({ ...state.resets, ...this.resets }).filter(([, at]) => at !== UNKNOWN && Date.parse(at) > now));
    state.collectors[this.opts.by] = {
      at: new Date(this.started).toISOString(),
      budget: this.budget,
      deadline_s: this.deadlineMs / 1000,
      calls: this.calls,
      remaining: Math.max(0, this.budget - this.calls),
      ms: Date.now() - this.started,
      waited_ms: this.waitedMs,
      made: this.made,
      skipped: this.skipped,
    };
    mkdirSync(path.join(this.opts.dir, "parts"), { recursive: true });
    writeFileSync(path.join(this.opts.dir, QUOTA_FILE), JSON.stringify(state, null, 2) + "\n");
  }

  private async attempt(p: Planned, name: string, args: Record<string, unknown>): Promise<McpToolResult> {
    const t0 = Date.now();
    let r: McpToolResult;
    try {
      r = await this.raw.callTool(name, args);
    } catch (err) {
      const message = (err as Error).message;
      if (!quotaError(message)) throw err;
      r = { isError: true, content: [{ type: "text", text: message }] };
    }
    this.made.push({ label: p.label, tool: name, priority: p.priority, ms: Date.now() - t0, ok: !r.isError });
    return r;
  }

  // Avant d'appeler : reset connu, budget, échéance. Un P0 passe toujours (un seul essai réel si le reset est connu).
  private async refusal(p: Planned, name: string): Promise<string | null> {
    const at = this.resets[family(name)];
    if (at) {
      const wait = at === UNKNOWN ? Infinity : Date.parse(at) - Date.now();
      if (wait > 0) {
        if (this.canWait(p, wait)) await this.wait(wait);
        else if (p.priority !== "P0") return `quota GitHub épuisé, reset ${resetText(at)}`;
      }
    }
    if (p.priority === "P0") return null;
    const reserved = this.reserved(p);
    if (this.calls + 1 + reserved > this.budget) return `budget : ${this.calls}/${this.budget} appels faits${reserved ? `, ${reserved} réservés aux plus prioritaires` : ""}`;
    const elapsed = Date.now() - this.started;
    const avg = this.made.length ? this.made.reduce((n, c) => n + c.ms, 0) / this.made.length : CALL_MS;
    if (elapsed + (1 + reserved) * avg > this.deadlineMs) return `échéance : ${Math.round(elapsed / 1000)} s écoulées sur ${this.deadlineMs / 1000}`;
    return null;
  }

  // Appels encore dus aux entrées plus prioritaires qui suivent dans le plan (celles d'avant sont faites : le plan s'exécute dans l'ordre).
  private reserved(p: Planned): number {
    const idx = this.plan.indexOf(p);
    return this.plan.reduce((n, e, i) => {
      if (i <= idx || RANK[e.priority] >= RANK[p.priority]) return n;
      return n + Math.max(0, e.count - this.made.filter((c) => c.label === e.label).length);
    }, 0);
  }

  private canWait(p: Planned, ms: number): boolean {
    if (ms > MAX_WAIT_MS || this.waitedMs || p.priority === "P2") return false;
    return p.priority === "P0" || Date.now() - this.started + ms <= this.deadlineMs;
  }

  private async wait(ms: number): Promise<void> {
    this.waitedMs = ms + 1000;
    console.error(`quota GitHub : attente de ${Math.ceil(this.waitedMs / 1000)} s, une seule fois`);
    await new Promise((resolve) => setTimeout(resolve, this.waitedMs));
  }

  private noteReset(name: string, q: { retryMs: number | null; secondary: boolean }): void {
    const at = q.retryMs === null ? UNKNOWN : new Date(Date.now() + q.retryMs).toISOString();
    for (const f of q.secondary ? (["core", "search"] as Family[]) : [family(name)]) this.resets[f] = at;
  }

  private skip(p: Planned, reason: string): QuotaResult {
    this.skipped.push({ label: p.label, priority: p.priority, reason, ...(p.url ? { url: p.url } : {}) });
    console.error(`${this.opts.by} : ${p.label} jeté (${p.priority}, ${reason})`);
    return result(p, reason);
  }
}

function result(p: Planned, reason: string): QuotaResult {
  return { isError: true, skipped: reason, content: [{ type: "text", text: `${p.label} jeté (${p.priority}, ${reason})` }] };
}

// `bun run quota <cache>` : l'état en trois lignes, la dernière au format de la ligne « Quota » du compte rendu d'étape.
// Code de sortie 1 quand un reset est encore à venir.
if (import.meta.main) {
  const [dir] = process.argv.slice(2);
  if (!dir) {
    console.error("Usage : bun run quota <dossier du cache>");
    process.exit(2);
  }
  const state = readState(dir);
  const runs = Object.entries(state.collectors);
  const calls = runs.reduce((n, [, r]) => n + r.calls, 0);
  const skipped = runs.flatMap(([by, r]) => r.skipped.map((s) => `${by} ${s.label} (${s.priority}, ${s.reason})${s.url ? ` → ${s.url}` : ""}`));
  const reset = Object.values(state.resets).filter((at) => Date.parse(at) > Date.now()).sort().at(-1);
  console.log(`Appels : ${runs.length ? runs.map(([by, r]) => `${by} ${r.calls}/${r.budget} en ${Math.round(r.ms / 1000)} s`).join(", ") : `aucun (pas de ${QUOTA_FILE})`}`);
  console.log(`Jetés : ${skipped.join(" · ") || "aucun"}`);
  console.log(`Quota : ${calls} appels, ${skipped.length} jetés, reset ${reset ? resetText(reset) : "aucun"}`);
  process.exit(reset ? 1 : 0);
}
