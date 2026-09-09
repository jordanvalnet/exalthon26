// `bun run screenshot <cache> <profil> [sortie.png]` : capture d'écran de deck-<profil>.html via Chrome ou Edge en headless.
// Sortie par défaut : pitch/demo.png, l'image que pitch_fr.html affiche sur la slide « D'une commande à un deck ».
import { existsSync, mkdirSync } from "node:fs";
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

const [dir, profile, out = "pitch/demo.png"] = process.argv.slice(2);
if (!dir || !profile) {
  console.error("Usage : bun run screenshot <dossier du cache> <profil> [sortie.png]");
  process.exit(2);
}

const html = path.resolve(dir, `deck-${profile}.html`);
if (!existsSync(html)) {
  console.error(`${html} manquant : lancer d'abord \`bun run render ${dir} ${profile}\`.`);
  process.exit(1);
}

const browser = BROWSERS.find((candidate) => candidate && existsSync(candidate));
if (!browser) {
  console.error("Aucun Chrome ni Edge trouvé. Indiquer le binaire avec CHROME_PATH.");
  process.exit(2);
}

const png = path.resolve(out);
mkdirSync(path.dirname(png), { recursive: true });
const proc = Bun.spawn(
  [
    browser,
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync",
    "--window-size=1440,900",
    `--user-data-dir=${path.join(tmpdir(), `onboard-shot-${process.pid}`)}`,
    `--screenshot=${png}`,
    pathToFileURL(html).href,
  ],
  { stdio: ["ignore", "ignore", "ignore"] },
);

// Chrome s'attarde après avoir écrit le fichier : on le coupe dès que le PNG est là, ou après 30 s.
const started = Date.now();
while (!existsSync(png) && Date.now() - started < 30_000) await Bun.sleep(300);
await Bun.sleep(300);
proc.kill();
const code = await proc.exited;
if (!existsSync(png)) {
  console.error(`Échec de la capture (${path.basename(browser)} a rendu ${code}).`);
  process.exit(1);
}
console.log(`OK capture : ${png}`);
