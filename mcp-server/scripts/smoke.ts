// Smoke test : lance le serveur en stdio exactement comme Claude Code le ferait,
// puis initialize, tools/list, resources/list, prompts/list, et un tools/call optionnel.
//   bun run smoke
//   bun run smoke echo '{"text":"salut"}'
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const [tool, rawArgs] = process.argv.slice(2);
const entry = path.resolve(import.meta.dir, "../src/index.ts");

const client = new Client({ name: "smoke", version: "0.0.0" });
const t0 = performance.now();
await client.connect(new StdioClientTransport({ command: "bun", args: ["run", entry] }));
const info = client.getServerVersion();
console.log(`✓ initialize en ${Math.round(performance.now() - t0)} ms : ${info?.name}@${info?.version}`);

const { tools } = await client.listTools();
console.log(`✓ tools (${tools.length})`);
for (const t of tools) console.log(`    ${t.name} — ${t.description?.slice(0, 80)}`);

const { resources } = await client.listResources();
console.log(`✓ resources (${resources.length}) : ${resources.map((r) => r.uri).join(", ")}`);

const { prompts } = await client.listPrompts();
console.log(`✓ prompts (${prompts.length}) : ${prompts.map((p) => p.name).join(", ")}`);

if (tool) {
  const result = await client.callTool({ name: tool, arguments: rawArgs ? JSON.parse(rawArgs) : {} });
  console.log(`${result.isError ? "✗" : "✓"} tools/call ${tool}`);
  console.log(JSON.stringify(result, null, 2));
  if (result.isError) process.exitCode = 1;
}

await client.close();
