// Logger minimal vers stderr, une ligne JSON par événement.
// En transport stdio, stdout est réservé au protocole JSON-RPC : tout ce qui y est
// écrit casse la connexion avec le client. D'où stderr, toujours.
type Level = "debug" | "info" | "warn" | "error";
const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const current = ORDER[(process.env.LOG_LEVEL as Level) ?? "info"] ?? ORDER.info;

function emit(level: Level, msg: string, data?: Record<string, unknown>) {
  if (ORDER[level] < current) return;
  process.stderr.write(JSON.stringify({ ts: new Date().toISOString(), level, msg, ...data }) + "\n");
}

export const log = {
  debug: (msg: string, data?: Record<string, unknown>) => emit("debug", msg, data),
  info: (msg: string, data?: Record<string, unknown>) => emit("info", msg, data),
  warn: (msg: string, data?: Record<string, unknown>) => emit("warn", msg, data),
  error: (msg: string, data?: Record<string, unknown>) => emit("error", msg, data),
};
