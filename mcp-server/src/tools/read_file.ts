// Outil avec accès disque : montre le garde-fou de chemin et le retour d'erreur propre.
import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { errorResult, textResult } from "./_helpers.ts";
import { log } from "../log.ts";

// Racine autorisée : MCP_FILES_ROOT, sinon le dossier courant au lancement.
export const FILES_ROOT = path.resolve(process.env.MCP_FILES_ROOT ?? process.cwd());
const MAX_BYTES = 200_000;

export function registerReadFile(server: McpServer) {
  server.registerTool(
    "read_file",
    {
      title: "Lire un fichier",
      description:
        `Lit un fichier texte situé sous la racine autorisée (${FILES_ROOT}). ` +
        `Le chemin est relatif à cette racine ; tout chemin qui en sort est refusé. ` +
        `Le contenu est tronqué au-delà de ${MAX_BYTES} octets.`,
      inputSchema: {
        path: z.string().min(1).describe("Chemin relatif à la racine, ex : README.md"),
      },
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    },
    async ({ path: rel }) => {
      const abs = path.resolve(FILES_ROOT, rel);
      if (abs !== FILES_ROOT && !abs.startsWith(FILES_ROOT + path.sep)) {
        return errorResult(`Chemin refusé : "${rel}" sort de la racine autorisée.`);
      }
      try {
        const info = await stat(abs);
        if (!info.isFile()) return errorResult(`"${rel}" n'est pas un fichier.`);
        const buf = await readFile(abs);
        const text = buf.subarray(0, MAX_BYTES).toString("utf8");
        const suffix = buf.length > MAX_BYTES ? `\n…[tronqué à ${MAX_BYTES} octets]` : "";
        return textResult(text + suffix);
      } catch (err) {
        log.warn("read_file: échec", { path: rel, err: String(err) });
        return errorResult(`Lecture impossible de "${rel}" : ${(err as Error).message}`);
      }
    },
  );
}
