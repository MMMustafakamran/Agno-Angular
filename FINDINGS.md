# Findings — Agno-angular
Current open doc defects only. A finding is added here only after a human reviews and approves it; page failures in a run are never written here automatically. Resolved or superseded findings are removed (see git history).
Stack: `@copilotkit/angular ^0.5.2` (installed 0.5.2), `@copilotkit/runtime ^1.73.3` (installed 1.73.3), `@copilotkit/core`/`shared`/`web-inspector` 1.70.2 (exact-pinned by angular 0.5.2), `@ag-ui/agno ^0.0.5`.

Numbers are stable IDs (code references `FINDINGS.md #N`). Gaps are findings that were removed.

## [Quickstart](https://docs.copilotkit.ai/angular/agno/quickstart)
**7. Angular/Agno quickstart has no backend step.** The page contains `<!-- setup skipped: agent-setup is not bundled for agno -->`. `AgnoAgent` came from the React quickstart. `server.ts` combines both pages.
**8. `zod` is an undocumented direct dependency.** Samples import `zod`, but the install command leaves it out.
**17. "Your agent is listed": it isn't yet.** The Inspector step shows "No agent selected" until the agent is picked via `[data-inspector-sidebar-agent-selector]`, which the step leaves out.
**37. Points to Inspector tabs that don't exist.** The quickstart and landing page say **Rich Threads**, and [Automatic Learning](https://docs.copilotkit.ai/angular/agno/learning) says **Automatic Learning**. angular 0.5.2 pins web-inspector 1.70.2 (`label: "Threads"` / `"Learning"`), so upgrading doesn't bring the new labels.

## [Frontend tools & generative UI](https://docs.copilotkit.ai/angular/agno/guides/frontend-tools-generative-ui)
**1. Open Generative UI sample doesn't typecheck.** `SandboxFunction<{ filter: string }>` isn't assignable to `sandboxFunctions: SandboxFunction[]` because the handler is invariant. The repo casts `as unknown as`.
**3. `openGenerativeUIEnabled` is an undocumented runtime flag.** `/info` reports `false` even with `sandboxFunctions` configured, and no server-side counterpart is documented.
**4. Showcase excerpts aren't self-contained.** Missing identifiers: Frontend tools `createBackgroundTool` (`resolveGradient`, `BackgroundToolArgs`); A2UI `fixedDefinitions` (`dynamicString`), `a2uiConfigForFeature` (catalogs, `createCatalog`); Voice `voiceWeatherRendererConfigs`, `createMultimodalMessage`; HITL `InterruptFeatureComponent` (`agentIdForCurrentIntegration`, `parseInterruptPayload`, …); Headless `HeadlessChatController` (`createMessageId`, `ShowcaseMessage`).
**19. `registerComponent` snippet is wrong four ways.** (1) An empty tool result makes the agent apologise. `followUp: false` fixes it but is undocumented. (2) The guard checks `"in-progress"`, but the status is `"executing"`. (3) The status never reaches `"complete"`. (4) There is no CSS or whitespace, so it renders `INC-4711sev1`. The snippet also has no imports, doesn't state the injection context, and a preamble gets prepended to the description.
**20. Same page teaches two renderer styles.** It uses both type-only and value imports of `AngularToolCall`/`ToolRenderer`, and both `standalone: true` and no `standalone`.

## [A2UI](https://docs.copilotkit.ai/angular/agno/guides/a2ui)
**2. "A2UI renderer activates automatically" is misleading.** With `a2ui: {}`, `/info` reports `"a2uiEnabled": true`, yet the agent never calls `render_a2ui`. The frontend `a2ui.catalog` is the real switch, and it can't be built from the guide's code (#4). Undocumented traps: catalogs need Zod 3 (`zod/v3`), and importing `DynamicString` from `@copilotkit/a2ui-renderer` exhausts the TS heap.

## [Chat UI](https://docs.copilotkit.ai/angular/agno/guides/chat-ui)
**5. Reuses a name/selector.** Two samples are both `SupportChatComponent`/`app-support-chat`, and the popup is `AppComponent`/`app-root`.

## [Shared state](https://docs.copilotkit.ai/angular/agno/guides/shared-state)
**16. Shared state is never initialised; the fallback hides it.** The real state is `{}` while `EMPTY_STATE` renders `Priority: normal`. `agent.state ?? EMPTY_STATE` never fires on `{}`, so a write before the first run drops `notes`.
**18. Context sample is unobservable.** "Use London time" works on the wire (`America/Los_Angeles` → `Europe/London`) but nothing shows in the UI. There is no context signal, so you have to poll `core.getContextForAgent()`.

## [Human in the loop](https://docs.copilotkit.ai/angular/agno/guides/human-in-the-loop)
**28. The approval card is the model's call.** The page gives no prompting or tool-choice guidance. On `gpt-5.4-mini` the card failed in 2 of 5 takes, even with an explicit request.

## [Inspector](https://docs.copilotkit.ai/angular/agno/inspector)
**12. Version floor is misplaced.** The 0.4.0 floor appears only in a callout. Below it, `enableInspector` isn't in `CopilotKitConfig`.
**15. Recommended launcher corner covers the composer.** The launcher moves to the bottom left. On a full-height `copilot-chat` it blocks the composer: `<cpk-web-inspector> intercepts pointer events`.

## [CLI](https://docs.copilotkit.ai/angular/agno/cli)
**13. `verify` can't gate CI without Intelligence.** 3 of the 7 checks are Intelligence checks that report FAIL instead of UNKNOWN, so a working stack exits 1. There is no flag to scope the checks.
**14. `verify` reports framework as `t`.** On runtime 1.73.3, `/info` returns `"className": "t"` (minified).

## [Copilot Runtime](https://docs.copilotkit.ai/angular/agno/backend/copilot-runtime) (and [duplicate](https://docs.copilotkit.ai/angular/agno/copilot-runtime))
**24. Runtime code titled as a Next.js route.** 20 snippets are titled `app/api/copilotkit/[[...slug]]/route.ts`, across `backend/copilot-runtime` (6), `copilot-runtime` (5), `backend/runtime-endpoints` (3), `backend/agent-runner` (3), `deploy/agentcore` (2) and `troubleshooting/debug-mode` (1). Angular runs a Node server.
**29. Names `CopilotKitAgentDiscoveryError`, which Angular never throws.** angular 0.5.2 throws a plain `Error` (`injectAgentStore: Agent 'x' not found after runtime sync…`), and core 1.70.2 throws `Agent not found: …`. The "Agent discovery failed" link goes to `guides/troubleshooting`, which has no such section.

## [Runtime endpoints](https://docs.copilotkit.ai/angular/agno/backend/runtime-endpoints) / [Agent runner](https://docs.copilotkit.ai/angular/agno/backend/agent-runner)
**25. On an Intelligence runtime, `/run` isn't SSE.** It returns JSON `{threadId, runId, joinToken, realtime:{clientUrl, topic}}`, but the pages say SSE, and so does the log in [Debug Mode](https://docs.copilotkit.ai/angular/agno/troubleshooting/debug-mode). A `threadId` that isn't a UUID fails with `400 VALIDATION_ERROR`, which is undocumented.
**31. Links to a missing "Thread authorization" section.** 3 links point to `/angular/agno/auth#thread-authorization`, but [Auth](https://docs.copilotkit.ai/angular/agno/auth) has no such section and no `onBeforeHandler`. `resolveUser`/`userOwnsThread` are undefined (`TS2304` ×3).
**32. The runner-caused 422 says Intelligence is missing.** All four thread read routes return `Missing CopilotKitIntelligence configuration…`. The real gate is `ɵsupportsLocalThreadEndpoints`, which only `InMemoryAgentRunner` passes. On 1.73.3, `agent/:agentId/stop/:threadId` checks access (403), yet the pages still list it as unscoped.

## [Custom agent](https://docs.copilotkit.ai/angular/agno/backend/custom-agent)
**33. `BuiltInAgentFactoryContext` details.** The `interrupt` field is undocumented, there is no version floor, and the page has the typo "an `BuiltInAgentFactoryContext`".

## [Learned skills](https://docs.copilotkit.ai/angular/agno/intelligence/learned-skills)
**26. No Agno path; Python packages 404.** There is no Agno row. `copilotkit-intelligence-runtime`/`-langgraph`/`-adk` return 404 on PyPI, and there are no install commands.
**39. "Reuse an Intelligence SDK client" sets `apiUrl` without `wsUrl`.** Other pages say to set both. On 1.73.3, `warnOnPartialHostOverride` warns that realtime falls back to the cloud.
**40. Placeholder `revision: "exact-revision-id"` is live code.** All eight examples (TS/Python/.NET) have it uncommented. A value in code overrides `CPK_INTELLIGENCE_SKILLS_REVISION`, and 1.73.3 sends `?revision=exact-revision-id`.

## [Automatic Learning](https://docs.copilotkit.ai/angular/agno/learning)
**27. Snippet uses undefined identifiers.** `agents` and `identifyUser` fail with `TS18004`. The example `agentId === "expense-agent"` matches nothing.
**34. Adapter list omits BuiltInAgent (and Agno, #26).** `ai`/`@ai-sdk/openai` are needed, but there is no install command for them.

## Site structure (sitemap, redirects, links)
**21. Six pages moved `premium/*` → `intelligence/*` with no redirect.** The old paths return 404.
**22. Live pages missing from the sitemap.** The sitemap lists only 4 `/angular/agno` URLs; the other pages can only be reached through links. `intelligence/quickstart` is now the only source for the Intelligence code in `server.ts` (#38).
**23. Two in-section links 404.** [AgentCore](https://docs.copilotkit.ai/angular/agno/deploy/agentcore) links to `/angular/agno/agentcore/full-stack-example`. [Custom agent](https://docs.copilotkit.ai/angular/agno/backend/custom-agent) links to `/angular/agno/advanced-configuration`; `/angular/advanced-configuration` returns 200.
**38. Connect your runtime removed with no redirect.** [`intelligence/connect-your-runtime`](https://docs.copilotkit.ai/angular/agno/intelligence/connect-your-runtime) returns 404. Its content was merged into [Intelligence quickstart](https://docs.copilotkit.ai/angular/agno/intelligence/quickstart).
**41. Sitemap lists shared Angular pages without the framework.** Shared guides appear as `/angular/X`. Mapping them to `/angular/agno/X` doesn't always work: `advanced-configuration` returns 404 under the framework path (#23). `cli`, `build-with-agents`, `agentic-protocols`, `contributing/code-contributions/package-linking` and `vs-code-extension` are missing from the sitemap.

KEPT: 1,2,3,4,5,7,8,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31,32,33,34,37,38,39,40,41
REMOVED: 6,9,10,11 (harness notes), 30,35,36 (resolved)
NOTE: chat-ui page link for #5 was inferred as /angular/agno/guides/chat-ui (the original had no link)
