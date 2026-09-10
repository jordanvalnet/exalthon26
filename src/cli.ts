// `bun onboard owner/repo profil [--force]` : lance le chef d'orchestre (onboard/agents/0-onboard.md) via Claude Code.
// Tout ce qui peut échouer se vérifie ici : un run complet coûte plusieurs minutes, autant refuser en une seconde.
import path from "node:path";
import { readProfile } from "./validate.ts";

const args = process.argv.slice(2);
const [target, profileName, ...rest] = args;
if (!target || !profileName) {
  console.error("Usage : bun onboard owner/repo profil [--force]   (profils : onboard/profiles/)");
  process.exit(2);
}

if (!/^[^/\s]+\/[^/\s]+$/.test(target)) {
  console.error(`Dépôt invalide : « ${target} » (attendu owner/repo, par exemple n8n-io/n8n)`);
  process.exit(2);
}

let profile;
try {
  profile = readProfile(profileName);
} catch (err) {
  console.error((err as Error).message);
  process.exit(2);
}

if (!process.env.GITHUB_PAT) {
  console.error("GITHUB_PAT manquant : la collecte ne peut pas lire le dépôt.\n" +
    "Coller le token dans .env à la racine (bun le charge tout seul), scope repo.");
  process.exit(2);
}

const claude = Bun.which("claude");
if (!claude) {
  console.error("Claude Code introuvable dans le PATH : c'est lui qui exécute les agents du pipeline.");
  process.exit(2);
}

const [owner, repo] = target.split("/");
const cache = path.join("onboard", "cache", `${owner}__${repo}`);
console.error(`onboard ${target} · profil ${profile.name} · cache ${cache}`);
console.error("collecte, rédaction puis rendu : plusieurs minutes, les comptes rendus s'affichent au fil de l'eau.");

// Lancé depuis un terminal Claude Code, la variable CLAUDECODE ferait refuser l'imbrication : on la retire.
const { CLAUDECODE: _nested, ...env } = process.env;
// Non interactif : personne ne répond aux demandes de permission, donc les outils du pipeline sont autorisés d'avance
// (github:* via le MCP, les commandes bun du dépôt, la lecture et l'écriture du cache, les sous-agents de collecte).
const allowed = ["mcp__github__*", "Bash(bun *)", "Bash(bun run *)", "Read", "Write", "Edit", "Glob", "Grep", "Agent", "Skill", "TodoWrite"];
const proc = Bun.spawn([claude, "-p", `/onboard ${target} ${profile.name} ${rest.join(" ")}`.trim(), "--permission-mode", "acceptEdits", "--allowedTools", ...allowed], {
  stdio: ["inherit", "inherit", "inherit"],
  env,
});
const code = await proc.exited;
if (code === 0) console.error(`\nDeck attendu : ${path.join(cache, `deck-${profile.name}.html`)}   (PDF : bun run pdf ${cache} ${profile.name})`);
process.exit(code);
