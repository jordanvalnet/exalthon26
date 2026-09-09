// Single responsibility: find the GitHub token. Same convention as chat/chat.mjs:
// GITHUB_PAT / GITHUB_TOKEN in the environment, else the .env file at the repository root.
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function findGitHubToken(): string {
  const fromEnv = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;
  if (fromEnv) return stripBearer(fromEnv);
  const envFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env");
  try {
    const line = readFileSync(envFile, "utf8")
      .split(/\r?\n/)
      .find((l) => /^\s*(GITHUB_PAT|GITHUB_TOKEN)\s*=/.test(l));
    const value = line?.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
    if (value) return stripBearer(value);
  } catch {}
  throw new Error("GitHub token not found: export GITHUB_PAT or put it in .env at the repository root.");
}

function stripBearer(token: string): string {
  return token.replace(/^Bearer\s+/i, "").trim();
}
