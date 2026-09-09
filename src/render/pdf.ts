// `bun run pdf <cache> <profil>` : deck-<profil>.html → deck-<profil>.pdf, via Chrome ou Edge en headless.
// Zéro dépendance : c'est la feuille @media print du deck qui fait la mise en page.
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const BROWSERS = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/microsoft-edge",
];

const [dir, profile] = process.argv.slice(2);
if (!dir || !profile) {
  console.error("Usage : bun run pdf <dossier du cache> <profil>");
  process.exit(2);
}

const html = path.resolve(dir, `deck-${profile}.html`);
if (!existsSync(html)) {
  console.error(`${html} manquant : lancer d'abord \`bun run render ${dir} ${profile}\`.`);
  process.exit(1);
}

const browser = BROWSERS.find((candidate) => candidate && existsSync(candidate));
if (!browser) {
  console.error(
    "Aucun Chrome ni Edge trouvé. Indiquer le binaire avec CHROME_PATH,\n" +
      `ou ouvrir ${html} et faire Ctrl+P → Enregistrer au format PDF.`,
  );
  process.exit(2);
}

// Profil jetable : sans lui, un Chrome déjà ouvert récupère la commande et n'écrit aucun PDF.
const pdf = path.resolve(dir, `deck-${profile}.pdf`);
const proc = Bun.spawn(
  [
    browser,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--user-data-dir=${path.join(tmpdir(), `onboard-pdf-${process.pid}`)}`,
    `--print-to-pdf=${pdf}`,
    pathToFileURL(html).href,
  ],
  { stdio: ["ignore", "inherit", "inherit"] },
);

const code = await proc.exited;
if (code !== 0 || !existsSync(pdf)) {
  console.error(`Échec de l'export PDF (${path.basename(browser)} a rendu ${code}).`);
  process.exit(1);
}
console.log(`OK pdf : ${pdf}`);
