// Single responsibility: speak MCP (JSON-RPC 2.0 over Streamable HTTP) to one server. Zero dependency.
// Knows nothing about GitHub: only initialize / tools/list / tools/call.
export interface McpToolResult {
  content?: Array<{ type: string; text?: string; resource?: { text?: string; blob?: string; mimeType?: string } }>;
  isError?: boolean;
  structuredContent?: unknown;
}

export class McpClient {
  private sessionId: string | null = null;
  private nextId = 1;
  private initialized: Promise<void> | null = null;

  constructor(private readonly url: string, private readonly authorization: string) {}

  async listTools(): Promise<Array<{ name: string; description?: string }>> {
    await this.ensureInitialized();
    const result = (await this.request("tools/list", {})) as { tools: Array<{ name: string; description?: string }> };
    return result.tools;
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<McpToolResult> {
    await this.ensureInitialized();
    return (await this.request("tools/call", { name, arguments: args })) as McpToolResult;
  }

  private ensureInitialized(): Promise<void> {
    this.initialized ??= (async () => {
      await this.request("initialize", {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "exalthon26-onboarding", version: "0.1.0" },
      });
      await this.notify("notifications/initialized");
    })();
    return this.initialized;
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      Authorization: this.authorization,
      "MCP-Protocol-Version": "2025-06-18",
    };
    if (this.sessionId) h["Mcp-Session-Id"] = this.sessionId;
    return h;
  }

  private async notify(method: string): Promise<void> {
    await fetch(this.url, { method: "POST", headers: this.headers(), body: JSON.stringify({ jsonrpc: "2.0", method }) });
  }

  private async request(method: string, params: unknown): Promise<unknown> {
    const id = this.nextId++;
    const res = await fetch(this.url, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
    });
    const sid = res.headers.get("mcp-session-id");
    if (sid) this.sessionId = sid;
    if (!res.ok) throw new Error(`MCP ${method}: HTTP ${res.status} ${await res.text()}`);
    const message = await this.readJsonRpc(res, id);
    if (message.error) throw new Error(`MCP ${method}: ${message.error.code} ${message.error.message}`);
    return message.result;
  }

  private async readJsonRpc(res: Response, id: number): Promise<{ result?: unknown; error?: { code: number; message: string } }> {
    const type = res.headers.get("content-type") ?? "";
    const body = await res.text();
    if (!type.includes("text/event-stream")) return JSON.parse(body);
    // SSE: take the "data:" payload whose id matches our request.
    for (const event of body.split(/\n\n/)) {
      const data = event.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim()).join("");
      if (!data) continue;
      const msg = JSON.parse(data);
      if (msg.id === id) return msg;
    }
    throw new Error("MCP: no JSON-RPC response found in event stream");
  }
}

/** Text carried by a tool result (GitHub tools return JSON as text, files as resources). */
export function toolText(result: McpToolResult): string {
  const parts = (result.content ?? []).map((c) => {
    if (c.type === "text") return c.text ?? "";
    if (c.type === "resource" && c.resource) {
      if (c.resource.text != null) return c.resource.text;
      if (c.resource.blob) return Buffer.from(c.resource.blob, "base64").toString("utf8");
    }
    return "";
  });
  return parts.join("\n");
}
