/**
 * Copilot Runtime for this harness.
 *
 * Shape comes from the Angular quickstart's Node runtime server
 * (https://docs.copilotkit.ai/angular/agno/quickstart), with the agent
 * swapped for the `AgnoAgent` binding the Agno quickstart specifies
 * (https://docs.copilotkit.ai/agno/quickstart) — the Angular/Agno quickstart
 * defers the backend step to "register this backend as the `default` agent".
 *
 * `default` and `support` resolve to the same Agno process. `support` exists so
 * the doc snippets that use `agentId="support"` (Chat UI, Threads) run verbatim.
 *
 * `a2ui: {}` enables A2UIMiddleware for every registered agent, per
 * https://docs.copilotkit.ai/angular/agno/backend/copilot-runtime
 */
import { createServer } from "node:http";
import { CopilotRuntime, CopilotKitIntelligence } from "@copilotkit/runtime/v2";
import { createCopilotNodeListener } from "@copilotkit/runtime/v2/node";
import { AgnoAgent } from "@ag-ui/agno";

const agentUrl = process.env["AGNO_AGENT_URL"] ?? "http://localhost:8211/agui";

/**
 * Intelligence client, verbatim from
 * https://docs.copilotkit.ai/angular/agno/intelligence/connect-your-runtime
 * ("Wire the runtime") and the Intelligence quickstart's step 2. That source
 * page was removed on 2026-09-23 and merged into
 * https://docs.copilotkit.ai/angular/agno/intelligence/quickstart
 *
 * `apiUrl`/`wsUrl` default to the cloud-hosted platform, so both stay unset.
 */
const intelligence = new CopilotKitIntelligence({
  apiKey: process.env["CPK_INTELLIGENCE_API_KEY"]!,
});

const runtime = new CopilotRuntime({
  agents: {
    default: new AgnoAgent({ url: agentUrl }),
    support: new AgnoAgent({ url: agentUrl }),
  },
  a2ui: {},
  intelligence,
  // Threads are per-user. Without this every visitor shares one history.
  identifyUser: (request) => ({
    id: request.headers.get("x-user-id") ?? "anonymous",
    name: request.headers.get("x-user-name") ?? "Anonymous",
  }),
});

const port = Number(process.env["PORT"] ?? 8210);

createServer(
  createCopilotNodeListener({
    runtime,
    basePath: "/api/copilotkit",
    cors: true,
  }),
).listen(port, () => {
  console.log(
    `Copilot Runtime listening at http://localhost:${port}/api/copilotkit`,
  );
  console.log(`Agno agent: ${agentUrl}`);
});
