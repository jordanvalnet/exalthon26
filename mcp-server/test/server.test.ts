// Tests in-memory : client et serveur reliés sans process ni réseau.
import { beforeAll, describe, expect, test } from "bun:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.ts";

let client: Client;

beforeAll(async () => {
  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
  await createServer().connect(serverSide);
  client = new Client({ name: "test", version: "0.0.0" });
  await client.connect(clientSide);
});

describe("tools", () => {
  test("liste les outils attendus", async () => {
    const names = (await client.listTools()).tools.map((t) => t.name).sort();
    expect(names).toEqual(["echo", "github_repo", "read_file"]);
  });

  test("echo renvoie le texte et la sortie structurée", async () => {
    const r = await client.callTool({ name: "echo", arguments: { text: "salut", upper: true } });
    expect(r.isError).toBeFalsy();
    expect(r.structuredContent).toEqual({ text: "SALUT", length: 5 });
  });

  test("echo refuse un texte vide (validation du schéma)", async () => {
    const r = await client.callTool({ name: "echo", arguments: { text: "" } });
    expect(r.isError).toBe(true);
  });

  test("read_file lit un fichier de la racine", async () => {
    const r = await client.callTool({ name: "read_file", arguments: { path: "package.json" } });
    expect(r.isError).toBeFalsy();
    expect((r.content as { text: string }[])[0]?.text).toContain("hackathon-mcp-server");
  });

  test("read_file refuse de sortir de la racine", async () => {
    const r = await client.callTool({ name: "read_file", arguments: { path: "../../etc/passwd" } });
    expect(r.isError).toBe(true);
  });

  test("read_file signale un fichier absent sans lever d'exception", async () => {
    const r = await client.callTool({ name: "read_file", arguments: { path: "nope.txt" } });
    expect(r.isError).toBe(true);
  });
});

describe("resources", () => {
  test("liste la ressource statique et les notes", async () => {
    const uris = (await client.listResources()).resources.map((r) => r.uri);
    expect(uris).toContain("hackathon://about");
    expect(uris).toContain("hackathon://notes/1");
  });

  test("lit une note par template", async () => {
    const r = await client.readResource({ uri: "hackathon://notes/2" });
    expect((r.contents[0] as { text: string }).text).toContain("Deuxième");
  });
});

describe("prompts", () => {
  test("summarize_repo injecte l'argument", async () => {
    const r = await client.getPrompt({ name: "summarize_repo", arguments: { repo: "a/b" } });
    const content = r.messages[0]?.content as { text: string };
    expect(content.text).toContain("a/b");
  });
});
