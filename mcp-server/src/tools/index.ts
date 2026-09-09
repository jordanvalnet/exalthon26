import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerEcho } from "./echo.ts";
import { registerReadFile } from "./read_file.ts";
import { registerGithubRepo } from "./github_repo.ts";

// Ajouter un outil = créer src/tools/<nom>.ts qui exporte register<Nom>(server), puis l'appeler ici.
export function registerTools(server: McpServer) {
  registerEcho(server);
  registerReadFile(server);
  registerGithubRepo(server);
}
