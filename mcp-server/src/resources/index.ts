// Ressources : données en lecture que le client peut attacher au contexte.
// Une ressource statique (URI fixe) et une ressource à template (URI paramétrée + listing).
import { ResourceTemplate, type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SERVER_INFO } from "../meta.ts";

const NOTES = new Map<string, string>([
  ["1", "Première note d'exemple."],
  ["2", "Deuxième note d'exemple."],
]);

export function registerResources(server: McpServer) {
  server.registerResource(
    "about",
    "hackathon://about",
    {
      title: "À propos du serveur",
      description: "Identité et version du serveur MCP.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(SERVER_INFO) }],
    }),
  );

  server.registerResource(
    "note",
    new ResourceTemplate("hackathon://notes/{id}", {
      list: async () => ({
        resources: [...NOTES.keys()].map((id) => ({
          uri: `hackathon://notes/${id}`,
          name: `note-${id}`,
          mimeType: "text/plain",
        })),
      }),
    }),
    { title: "Note", description: "Une note identifiée par son id.", mimeType: "text/plain" },
    async (uri, { id }) => {
      const text = NOTES.get(String(id));
      if (text === undefined) throw new Error(`Note introuvable : ${String(id)}`);
      return { contents: [{ uri: uri.href, mimeType: "text/plain", text }] };
    },
  );
}
