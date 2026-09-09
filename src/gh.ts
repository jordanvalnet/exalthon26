// Secours pour ce que les outils github:* ne donnent pas : `bun run gh /repos/owner/repo/languages` affiche le JSON.
import { gh } from "./github.ts";

const p = process.argv[2];
if (!p?.startsWith("/")) {
  console.error("Usage : bun run gh /repos/<owner>/<repo>/languages");
  process.exit(2);
}
console.log(JSON.stringify(await gh(p), null, 2));
