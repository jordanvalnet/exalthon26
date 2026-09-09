// Entrée HTTP (Streamable HTTP, mode stateless) : pour tester avec curl, l'Inspector
// en mode HTTP, ou exposer le serveur à un client distant.
//   bun run http           → http://localhost:3333/mcp
//   PORT=4000 bun run http
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createServer } from "./server.ts";
import { log } from "./log.ts";

const PORT = Number(process.env.PORT ?? 3333);

Bun.serve({
  port: PORT,
  async fetch(req) {
    const { pathname } = new URL(req.url);
    if (pathname === "/health") return Response.json({ ok: true });
    if (pathname !== "/mcp") return new Response("Not found", { status: 404 });

    // Stateless : un serveur et un transport neufs par requête, aucune session à gérer.
    const server = createServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);
    return transport.handleRequest(req);
  },
});

log.info("serveur MCP démarré", { transport: "http", url: `http://localhost:${PORT}/mcp` });
