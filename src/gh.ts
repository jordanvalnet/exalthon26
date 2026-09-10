// Appel brut d'un outil du serveur MCP GitHub, pour ce que les skills ne couvrent pas :
//   bun run gh tools                                   → liste des outils du serveur
//   bun run gh <outil> '<arguments JSON>'              → résultat de l'outil (JSON ou texte)
// Exemple : bun run gh search_repositories '{"query":"repo:jordanvalnet/exalthon26"}'
// Passe par la couche de quota : une erreur de quota GitHub est attendue une seule fois si le reset est à moins de 60 s,
// sinon affichée avec l'heure de reset, sans nouvel essai.
import { mcp, quota } from "./github.ts";
import { toolText } from "../onboarding/src/mcp/client.ts";

const [tool, rawArgs] = process.argv.slice(2);
if (!tool) {
  console.error("Usage : bun run gh tools | bun run gh <outil> '<arguments JSON>'");
  process.exit(2);
}
if (tool === "tools") {
  for (const t of await mcp().listTools()) console.log(t.name);
} else {
  const result = await quota({ by: "gh" }).call(tool, tool, rawArgs ? JSON.parse(rawArgs) : {});
  const text = toolText(result);
  if (result.isError) {
    console.error(`${tool} : ${text}`);
    process.exit(1);
  }
  try {
    console.log(JSON.stringify(JSON.parse(text), null, 2));
  } catch {
    console.log(text);
  }
}
