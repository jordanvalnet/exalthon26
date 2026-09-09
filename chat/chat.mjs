#!/usr/bin/env node
// Chat d'équipe sur une issue GitHub : un commentaire = un message. Zéro dépendance, node ≥ 18 ou bun.
// Canal : CHAT_ISSUE=owner/repo#n (défaut ci-dessous).
// Token : GITHUB_PAT ou GITHUB_TOKEN dans l'environnement, sinon ../.env, sinon `gh auth token`.
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_CHANNEL = "jordanvalnet/exalthon26#1";
const POLL_MS = 2000;
const USAGE = `Usage : node chat/chat.mjs <commande>
  read [n]        les n derniers messages (défaut 20)
  send "texte"    envoie un message ; @login pour interpeller quelqu'un
  wait [s]        bloque jusqu'au prochain message d'un autre, l'affiche, quitte (défaut 600 s)
  listen          affiche les messages en continu (Ctrl+C pour sortir)
  who             qui a parlé, combien de fois, quand`;

const [cmd = "read", ...args] = process.argv.slice(2);
const channel = parseChannel(process.env.CHAT_ISSUE ?? DEFAULT_CHANNEL);
const token = findToken();
const api = `https://api.github.com/repos/${channel.owner}/${channel.repo}/issues/${channel.number}/comments`;

const commands = { read, send, wait, listen, who };
if (!commands[cmd]) fail(USAGE);
await commands[cmd](...args);

async function read(n = "20") {
  const messages = await lastMessages(Number(n) || 20);
  if (!messages.length) return console.log("(aucun message)");
  messages.forEach(show);
}

async function send(...words) {
  const body = words.join(" ").trim();
  if (!body) fail('Usage : send "texte"');
  const { data } = await gh(api, { method: "POST", body: JSON.stringify({ body }) });
  console.log(`✓ envoyé par ${data.user.login} : ${data.html_url}`);
}

async function wait(seconds = "600") {
  const s = Number(seconds) || 600;
  console.error(`attente d'un message sur ${channel.owner}/${channel.repo}#${channel.number} (max ${s} s)…`);
  setTimeout(() => { console.log(`(aucun message en ${s} s)`); process.exit(0); }, s * 1000);
  for await (const batch of incoming({ skipMe: true })) {
    batch.forEach(show);
    process.exit(0);
  }
}

async function listen() {
  console.error(`écoute de ${channel.owner}/${channel.repo}#${channel.number} (Ctrl+C pour sortir)`);
  for await (const batch of incoming({ skipMe: false })) batch.forEach(show);
}

async function who() {
  const byLogin = new Map();
  for (const c of await lastMessages(100)) {
    const e = byLogin.get(c.user.login) ?? { count: 0, last: c.created_at };
    byLogin.set(c.user.login, { count: e.count + 1, last: c.created_at });
  }
  if (!byLogin.size) return console.log("(personne n'a encore parlé)");
  for (const [login, e] of [...byLogin].sort((a, b) => (a[1].last < b[1].last ? 1 : -1))) {
    console.log(`${login.padEnd(20)} ${String(e.count).padStart(3)} msg   dernier : ${hhmm(e.last)}`);
  }
}

// Boucle de polling : rend les nouveaux messages par paquet. Les 304 (ETag) ne comptent pas dans le quota.
async function* incoming({ skipMe }) {
  const me = skipMe ? (await gh("https://api.github.com/user")).data.login : null;
  const [latest] = await lastMessages(1);
  let lastId = latest?.id ?? 0;
  let since = latest?.created_at ?? new Date().toISOString();
  let etag = null;
  let delay = POLL_MS;
  for (;;) {
    const { res, data } = await gh(`${api}?since=${since}&per_page=100`, { headers: etag ? { "If-None-Match": etag } : {} });
    if (data) {
      const fresh = data.filter((c) => c.id > lastId);
      if (fresh.length) {
        lastId = fresh.at(-1).id;
        since = fresh.at(-1).created_at;
        etag = null;
      } else etag = res.headers.get("etag");
      const others = fresh.filter((c) => c.user.login !== me);
      if (others.length) yield others;
    }
    const remaining = Number(res.headers.get("x-ratelimit-remaining"));
    if (remaining && remaining < 300 && delay === POLL_MS) {
      console.error(`quota GitHub bas (${remaining} requêtes restantes) : polling ralenti à 15 s`);
      delay = 15_000;
    }
    await new Promise((r) => setTimeout(r, delay));
  }
}

// Les commentaires d'une issue arrivent du plus ancien au plus récent, 100 par page : on va chercher la fin.
async function lastMessages(n) {
  let { res, data } = await gh(`${api}?per_page=100`);
  const last = Number(/page=(\d+)>; rel="last"/.exec(res.headers.get("link") ?? "")?.[1]);
  if (last > 1) {
    const prev = (await gh(`${api}?per_page=100&page=${last - 1}`)).data;
    data = [...prev, ...(await gh(`${api}?per_page=100&page=${last}`)).data];
  }
  return data.slice(-n);
}

async function gh(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "exalthon-chat",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 304) return { res, data: null };
  if (!res.ok) {
    const hint = {
      401: "token invalide ou absent : vérifier GITHUB_PAT",
      403: "accès refusé ou quota épuisé",
      404: `issue introuvable : vérifier CHAT_ISSUE (${channel.owner}/${channel.repo}#${channel.number})`,
    }[res.status] ?? (await res.text()).slice(0, 200);
    fail(`GitHub HTTP ${res.status} : ${hint}`);
  }
  return { res, data: await res.json() };
}

function show(c) {
  const body = c.body.trim().replace(/\r\n/g, "\n").replace(/\n/g, "\n    ");
  console.log(`[${hhmm(c.created_at)}] ${c.user.login}: ${body}`);
}

function hhmm(iso) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function parseChannel(s) {
  const m = /^([^/\s]+)\/([^#\s]+)#(\d+)$/.exec(s.trim());
  if (!m) fail(`CHAT_ISSUE invalide : "${s}" (attendu owner/repo#numéro)`);
  return { owner: m[1], repo: m[2], number: m[3] };
}

function findToken() {
  if (process.env.GITHUB_PAT || process.env.GITHUB_TOKEN) return process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;
  const envFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env");
  try {
    const line = readFileSync(envFile, "utf8").split(/\r?\n/).find((l) => /^\s*(GITHUB_PAT|GITHUB_TOKEN)\s*=/.test(l));
    const value = line?.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
    if (value) return value;
  } catch {}
  try {
    return execSync("gh auth token", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {}
  return fail("Token GitHub introuvable : exporter GITHUB_PAT, le mettre dans .env à la racine, ou `gh auth login`.");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
