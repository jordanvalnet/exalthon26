import { afterEach, describe, expect, test } from "bun:test";
import { whoami } from "../src/github.ts";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

describe("whoami", () => {
  test("renvoie le login de l'utilisateur du token via le serveur MCP", async () => {
    process.env.GITHUB_PAT = "ghp_test";
    globalThis.fetch = (async () =>
      Response.json({
        jsonrpc: "2.0",
        id: 1,
        result: { content: [{ type: "text", text: JSON.stringify({ login: "alice" }) }] },
      })) as unknown as typeof fetch;
    expect(await whoami()).toBe("alice");
  });

  test("explique quoi faire si le token manque", async () => {
    delete process.env.GITHUB_PAT;
    await expect(whoami()).rejects.toThrow("GITHUB_PAT manquant");
  });
});
