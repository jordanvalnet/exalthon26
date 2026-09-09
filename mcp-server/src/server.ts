import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SERVER_INFO, SERVER_INSTRUCTIONS } from "./meta.ts";
import { registerTools } from "./tools/index.ts";
import { registerResources } from "./resources/index.ts";
import { registerPrompts } from "./prompts/index.ts";

// Fabrique le serveur complet, indépendamment du transport.
// Utilisée par l'entrée stdio (index.ts), l'entrée http (http.ts) et les tests (in-memory).
export function createServer(): McpServer {
  const server = new McpServer(SERVER_INFO, { instructions: SERVER_INSTRUCTIONS });
  registerTools(server);
  registerResources(server);
  registerPrompts(server);
  return server;
}
