# Findings — Agno-angular
Current open doc defects only. A finding is added here only after a human reviews and approves it; page failures in a run are never written here automatically. Resolved or superseded findings are removed (see git history).
Stack: `@copilotkit/angular ^0.5.2` (installed 0.5.2), `@copilotkit/runtime ^1.73.3` (installed 1.73.3), `@copilotkit/core`/`shared`/`web-inspector` 1.70.2 (exact-pinned by angular 0.5.2), `@ag-ui/agno ^0.0.5`.
Major = blocks a reader (doesn't compile, crashes/throws, silently broken behaviour, step impossible to follow, missing required step/package, 404 target). Minor = one-line notes.

Numbers are stable IDs (code references `FINDINGS.md #N`). Gaps are findings that were removed.

## Major

### [Quickstart](https://docs.copilotkit.ai/angular/agno/quickstart)
**7. No backend step.** The page contains `<!-- setup skipped: agent-setup is not bundled for agno -->`. `AgnoAgent` had to come from the React quickstart.
**8. `zod` missing from install.** Samples import `zod`, but the install command leaves it out.
**17. "Your agent is listed": it isn't yet.** The Inspector shows "No agent selected" until the agent is picked via `[data-inspector-sidebar-agent-selector]`, and the step leaves that out.
**37. Points to Inspector tabs that don't exist.** The quickstart and landing page say **Rich Threads**, and [Automatic Learning](https://docs.copilotkit.ai/angular/agno/learning) says **Automatic Learning**. angular 0.5.2 pins web-inspector 1.70.2 (`"Threads"` / `"Learning"`).

### [Frontend tools & generative UI](https://docs.copilotkit.ai/angular/agno/guides/frontend-tools-generative-ui)
**1. Open Generative UI sample doesn't typecheck.** `SandboxFunction<{ filter: string }>` isn't assignable to `SandboxFunction[]` (the handler is invariant). The repo casts `as unknown as`.
**3. `openGenerativeUIEnabled` is an undocumented runtime flag.** `/info` reports `false` even with `sandboxFunctions` set. No server-side counterpart is documented.
**4. Excerpts use undefined identifiers.** Examples: `resolveGradient`, `dynamicString`, `createCatalog`, `createMultimodalMessage`, `parseInterruptPayload`, `createMessageId`, `ShowcaseMessage` (Frontend tools, A2UI, Voice, HITL, Headless).
**19. `registerComponent` snippet is broken.** An empty result makes the agent apologise (undocumented `followUp: false` fixes it). The guard checks `"in-progress"`, but the status is `"executing"`, and the status never reaches `"complete"`. The snippet has no imports or injection context.

### [A2UI](https://docs.copilotkit.ai/angular/agno/guides/a2ui)
**2. The renderer doesn't activate automatically.** With `a2ui: {}`, `/info` reports `a2uiEnabled: true`, but `render_a2ui` is never called. The real switch is the frontend `a2ui.catalog`, which the guide's code can't build (#4). Catalogs need `zod/v3`, and importing `DynamicString` exhausts the TS heap.

### [Shared state](https://docs.copilotkit.ai/angular/agno/guides/shared-state)
**16. State is never initialised; the fallback hides it.** The real state is `{}`, and `agent.state ?? EMPTY_STATE` never fires on `{}`. A write before the first run silently drops `notes`.

### [Human in the loop](https://docs.copilotkit.ai/angular/agno/guides/human-in-the-loop)
**28. The approval card depends on the model's choice.** The page gives no prompting or tool-choice guidance. On `gpt-5.4-mini` the card failed in 2 of 5 takes, even with an explicit request.

### [Inspector](https://docs.copilotkit.ai/angular/agno/inspector)
**15. Recommended launcher corner blocks the composer.** On a full-height `copilot-chat`, `<cpk-web-inspector>` intercepts pointer events.

### [CLI](https://docs.copilotkit.ai/angular/agno/cli)
**13. `verify` exits 1 without Intelligence.** 3 of the 7 checks report FAIL instead of UNKNOWN, and there is no flag to scope the checks, so it can't gate CI.

### [Copilot Runtime](https://docs.copilotkit.ai/angular/agno/backend/copilot-runtime) (and [duplicate](https://docs.copilotkit.ai/angular/agno/copilot-runtime))
**29. Names `CopilotKitAgentDiscoveryError`, which Angular never throws.** angular 0.5.2 throws a plain `Error` (`injectAgentStore: Agent 'x' not found…`), and core 1.70.2 throws `Agent not found: …`. The "Agent discovery failed" link goes to a section that doesn't exist.

### [Runtime endpoints](https://docs.copilotkit.ai/angular/agno/backend/runtime-endpoints) / [Agent runner](https://docs.copilotkit.ai/angular/agno/backend/agent-runner)
**25. On an Intelligence runtime, `/run` isn't SSE.** It returns JSON `{threadId, runId, joinToken, realtime}`, while these pages and [Debug Mode](https://docs.copilotkit.ai/angular/agno/troubleshooting/debug-mode) say SSE. A `threadId` that isn't a UUID fails with an undocumented `400 VALIDATION_ERROR`.
**31. Links to a missing "Thread authorization" section.** 3 links point to `/angular/agno/auth#thread-authorization`, which doesn't exist. `resolveUser`/`userOwnsThread` are undefined (`TS2304` ×3).
**32. The 422 wrongly blames Intelligence.** The thread read routes say `Missing CopilotKitIntelligence configuration`, but the real gate is `ɵsupportsLocalThreadEndpoints` (only `InMemoryAgentRunner` passes). `stop/:threadId` returns 403 but is listed as unscoped.

### [Learned skills](https://docs.copilotkit.ai/angular/agno/intelligence/learned-skills)
**26. No Agno path; Python packages 404.** There is no Agno row. `copilotkit-intelligence-runtime`/`-langgraph`/`-adk` return 404 on PyPI, and there are no install commands.
**39. `apiUrl` is set without `wsUrl`.** On 1.73.3, `warnOnPartialHostOverride` warns that realtime falls back to the cloud.
**40. Placeholder `revision: "exact-revision-id"` is live code.** All 8 examples leave it uncommented, so it overrides `CPK_INTELLIGENCE_SKILLS_REVISION` and 1.73.3 sends `?revision=exact-revision-id`.

### [Automatic Learning](https://docs.copilotkit.ai/angular/agno/learning)
**27. Snippet uses undefined identifiers.** `agents` and `identifyUser` fail with `TS18004`. `agentId === "expense-agent"` matches nothing.
**34. Missing install for BuiltInAgent.** `ai`/`@ai-sdk/openai` are required, but there is no install command. Agno is also missing (#26).

### Site structure (redirects, links)
**21. Six pages moved `premium/*` → `intelligence/*` with no redirect.** The old paths return 404.
**23. Two in-section links 404.** [AgentCore](https://docs.copilotkit.ai/angular/agno/deploy/agentcore) links to `/angular/agno/agentcore/full-stack-example`. [Custom agent](https://docs.copilotkit.ai/angular/agno/backend/custom-agent) links to `/angular/agno/advanced-configuration` (`/angular/advanced-configuration` returns 200).
**38. Connect your runtime removed with no redirect.** [`intelligence/connect-your-runtime`](https://docs.copilotkit.ai/angular/agno/intelligence/connect-your-runtime) returns 404. Its content moved to [Intelligence quickstart](https://docs.copilotkit.ai/angular/agno/intelligence/quickstart).

## Minor notes
- #20 [Frontend tools & generative UI](https://docs.copilotkit.ai/angular/agno/guides/frontend-tools-generative-ui): mixes type-only and value imports of `AngularToolCall`/`ToolRenderer`, and uses both `standalone: true` and no `standalone`.
- #5 [Chat UI](https://docs.copilotkit.ai/angular/agno/guides/chat-ui): two samples are both `SupportChatComponent`/`app-support-chat`, and the popup is `AppComponent`/`app-root`.
- #18 [Shared state](https://docs.copilotkit.ai/angular/agno/guides/shared-state): the context sample works on the wire (`America/Los_Angeles` → `Europe/London`) but shows nothing in the UI, so you have to poll `core.getContextForAgent()`.
- #12 [Inspector](https://docs.copilotkit.ai/angular/agno/inspector): the 0.4.0 version floor appears only in a callout (below it, `enableInspector` isn't in `CopilotKitConfig`).
- #14 [CLI](https://docs.copilotkit.ai/angular/agno/cli): `verify` reports framework as `t` (the minified `className` on runtime 1.73.3).
- #24 [Copilot Runtime](https://docs.copilotkit.ai/angular/agno/backend/copilot-runtime) + 4 other pages: 20 snippets are titled as a Next.js `app/api/copilotkit/[[...slug]]/route.ts`, but Angular runs a Node server.
- #33 [Custom agent](https://docs.copilotkit.ai/angular/agno/backend/custom-agent): the `BuiltInAgentFactoryContext` `interrupt` field is undocumented, there is no version floor, and the page has the typo "an `BuiltInAgentFactoryContext`".
- #22 Sitemap: lists only 4 `/angular/agno` URLs, and `intelligence/quickstart` is reachable only through links (#38).
- #41 Sitemap: shared pages are listed as `/angular/X` without the framework. `cli`, `build-with-agents`, `agentic-protocols`, `contributing/code-contributions/package-linking` and `vs-code-extension` are missing.
