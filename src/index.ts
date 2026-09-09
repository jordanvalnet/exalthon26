// Point d'entrée du projet : `bun start`, ou `bun run dev` pour relancer à chaque modification.
// Pour l'instant il vérifie l'environnement (bun + token GitHub). Le chat d'équipe est dans chat/.
import { whoami } from "./github.ts";

try {
  console.log(`GitHub OK : ${await whoami()}`);
} catch (err) {
  console.error((err as Error).message);
  process.exit(1);
}
