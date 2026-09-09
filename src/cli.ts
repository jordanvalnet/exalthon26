// `bun onboard owner/repo profil [--force]` : lance le chef d'orchestre (onboard/agents/0-onboard.md) via Claude Code.
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage : bun onboard owner/repo profil [--force]   (profils : onboard/profiles/)");
  process.exit(2);
}
const proc = Bun.spawn(["claude", "-p", `/onboard ${args.join(" ")}`, "--permission-mode", "acceptEdits"], {
  stdio: ["inherit", "inherit", "inherit"],
});
process.exit(await proc.exited);

export {};
