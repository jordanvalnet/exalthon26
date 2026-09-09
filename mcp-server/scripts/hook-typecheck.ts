// Hook Claude Code (PostToolUse sur Edit|Write) : typecheck dès qu'un .ts du serveur change.
// Exit 2 renvoie les erreurs à Claude, qui les corrige avant de continuer.
let file = "";
try {
  file = JSON.parse(await Bun.stdin.text())?.tool_input?.file_path ?? "";
} catch {}
if (!/mcp-server\/.*\.ts$/.test(file)) process.exit(0);

const root = new URL("..", import.meta.url).pathname;
const proc = Bun.spawnSync(["bun", "run", "typecheck"], { cwd: root, stdout: "pipe", stderr: "pipe" });
if (proc.exitCode !== 0) {
  console.error(`typecheck KO\n${proc.stdout.toString()}${proc.stderr.toString()}`);
  process.exit(2);
}
