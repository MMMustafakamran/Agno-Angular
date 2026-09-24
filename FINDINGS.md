# Findings — Agno-angular
Open doc defects only. An entry is added only after the user approves it. Numbers are stable IDs (code cites `FINDINGS.md #N`), so gaps are removed findings.
Stack: `@copilotkit/angular` 0.5.2, `@copilotkit/runtime` 1.73.3, `@copilotkit/core`/`web-inspector` 1.70.2 (exact-pinned by angular), `@ag-ui/agno` 0.0.5. `ng serve` type-checks, so TS errors show up in dev.

## Dev blockers (seen with `ng serve` and normal use of the page)

### [Quickstart](https://docs.copilotkit.ai/angular/agno/quickstart)
**#7 No backend step, so the app can't be built from the docs.**
- **Doc:** "Connect the selected agent backend" contains only `<!-- setup skipped: agent-setup is not bundled for agno -->`.
- **Effect:** `AgnoAgent` and `@ag-ui/agno` appear on 0 of 47 Angular pages. The harness takes the backend from the React Agno quickstart (`frontend/server.ts:19,38`).

### [Frontend tools & generative UI](https://docs.copilotkit.ai/angular/agno/guides/frontend-tools-generative-ui)
**#1 Open Generative UI sample doesn't compile.**
- **Doc:** `const setDashboardFilter: SandboxFunction<{ filter: string }> = {…}` together with `sandboxFunctions: [setDashboardFilter]`.
- **Error:** `TS2322: Type 'SandboxFunction<{ filter: string; }>' is not assignable to type 'SandboxFunction<Record<string, unknown>>'`. The harness casts it with `as unknown as SandboxFunction` (`app.config.ts:69`).

### [A2UI](https://docs.copilotkit.ai/angular/agno/guides/a2ui)
**#2 Undefined identifiers, and the catalog is never built.**
- **Doc:** `Title: { props: z.object({ text: dynamicString }) }`. `catalog: productCatalog`, `beautifulCatalog`, `declarativeCatalog` and `fixedCatalog` are used but never defined. The page has no imports.
- **Error:** `TS2304: Cannot find name 'dynamicString'` ×4. The renderer only turns on with a real `Catalog` (`new Catalog(...)`), and the page never shows how to build one.

### [Learned skills](https://docs.copilotkit.ai/angular/agno/intelligence/learned-skills)
**#26 No Agno path, and the Python packages don't exist.**
- **Doc:** the adapter table has no Agno row, and the page says "Python uses `copilotkit-intelligence-runtime`".
- **Error:** `copilotkit-intelligence-runtime`, `-langgraph` and `-adk` all return 404 on PyPI.

## Minor notes
- #17 Quickstart: "Your agent is listed", but the Inspector shows "No agent selected" until you pick one.
- #37 Quickstart/Learning: point to the tabs "Rich Threads" / "Automatic Learning". In web-inspector 1.70.2 the tabs are "Threads" / "Learning".
- #3 Frontend tools: `openGenerativeUIEnabled` is undocumented, but the frontend config alone turns it on.
- #4 Several guides use Showcase helpers the reader has to replace (`resolveGradient`, `parseInterruptPayload`, `createMessageId`, `ShowcaseMessage`).
- #19 `registerComponent` snippet: no imports, and `followUp` is undocumented.
- #16 Shared state: the state starts as `{}`, so `?? EMPTY_STATE` never kicks in and the list is silently empty.
- #15 Inspector: the launcher can cover the composer.
- #13 CLI: `verify` exits 1 without Intelligence.
- #29 Copilot Runtime: names `CopilotKitAgentDiscoveryError`, but Angular throws a plain `Error`. The "Agent discovery failed" anchor doesn't exist.
- #25 Runtime endpoints: says `/run` is SSE, but on an Intelligence runtime it returns JSON.
- #31 Runtime endpoints: 3 links go to `auth#thread-authorization`, which doesn't exist.
- #39 Learned skills: `apiUrl` without `wsUrl` only causes a warning.
- #40 Learned skills: `revision: "exact-revision-id"`. Line 70 says to replace it.
- #27 Automatic Learning: `agents` and `identifyUser` are placeholders.
- #21 `premium/*` → `intelligence/*` with no redirect.
- #23 AgentCore and Custom agent each have a link that 404s.
- #38 `intelligence/connect-your-runtime` returns 404 with no redirect.
- #20 Frontend tools: mixed type/value imports, and `standalone` is used inconsistently.
- #5 Chat UI: two samples share the same component name.
- #18 Shared state: the context sample shows nothing in the UI.
- #12 Inspector: the 0.4.0 version floor appears only in a callout.
- #14 CLI: `verify` reports the framework as `t`.
- #24 20 snippets are titled as a Next.js `route.ts`.
- #33 Custom agent: `interrupt` field undocumented, and the typo "an `BuiltInAgentFactoryContext`".
- #22/#41 Sitemap: missing `/angular/agno` URLs.

## Build-only
None. `ng serve` type-checks, so every compile error above shows up in dev.
