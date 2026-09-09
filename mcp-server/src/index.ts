// Entrée stdio : c'est celle que Claude Code, Copilot ou l'Inspector lancent.
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.ts";
import { log } from "./log.ts";

// Garde-fou : en stdio, stdout appartient au protocole. Un console.log accidentel
// (le vôtre ou celui d'une dépendance) casserait la connexion : on le détourne vers stderr.
console.log = (...args: unknown[]) => console.error(...args);

const server = createServer();
await server.connect(new StdioServerTransport());
log.info("serveur MCP démarré", { transport: "stdio" });
