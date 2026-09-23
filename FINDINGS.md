# Findings — Agno-angular

Doc defects and doc-vs-implementation discrepancies found by this harness.
Moved out of `README.md` (10. Known issues / doc-vs-implementation discrepancies) on 2026-09-23; numbering is unchanged.

## Known issues / doc-vs-implementation discrepancies

Found while building against `@copilotkit/angular` **0.3.1** and `@copilotkit/runtime` **1.67.1**.

**1. The Open Generative UI sample does not typecheck as written**

[Frontend tools and generative UI](https://docs.copilotkit.ai/angular/agno/guides/frontend-tools-generative-ui) declares `const setDashboardFilter: SandboxFunction<{ filter: string }>` and then puts it in `openGenerativeUI.sandboxFunctions`. But `OpenGenerativeUIConfig.sandboxFunctions` is typed `SandboxFunction[]`, i.e. `SandboxFunction<Record<string, unknown>>[]`, and `SandboxFunction` is invariant in its `handler` parameter. The build fails with:

```
Type 'SandboxFunction<{ filter: string; }>' is not assignable to
type 'SandboxFunction<Record<string, unknown>>'.
```

The generic parameter is effectively unusable at that call site. This repo keeps the guide's declaration and casts at the array site — the same `as unknown as` idiom the docs themselves use for the equivalent `component` variance problem in the Human-in-the-loop Showcase snippet.

**2. "The A2UI renderer activates automatically" is misleading — the catalog is the switch**

[A2UI](https://docs.copilotkit.ai/angular/agno/guides/a2ui) says the browser renderer "activates automatically. No extra configuration is needed", and the [Copilot Runtime](https://docs.copilotkit.ai/angular/agno/backend/copilot-runtime) page says `a2ui: {}` applies `A2UIMiddleware` to all registered agents. Both are configured here and `/api/copilotkit/info` reports `"a2uiEnabled": true`.

Nothing renders. Across four runs against the Agno agent — including one that explicitly instructed the model to use the tool, and one that advertised `render_a2ui` in the run input — the agent never called it, and request `input_tokens` stayed at ~205–278.

The cause is the **missing frontend catalog**, not the middleware. Supplying `a2ui.catalog` to `provideCopilotKit` is what registers the built-in `render_a2ui` tool renderer and pushes the catalog id, component schemas, and generation guidelines into agent context. With no catalog, there is nothing for the agent to generate against and no renderer to receive it — so `a2uiEnabled: true` on the server is necessary but not sufficient, and the guide's "no extra configuration is needed" reads as if it were.

Still open here, because the catalog cannot be built from the guide's own code (see issue #4). The route is marked Partial. Building one is the fix; it needs `createCatalog` plus a Lit renderer per component, and two traps the docs do not mention:

- **Catalogs must use Zod 3, not Zod 4.** `createCatalog` serialises each `props` schema with `zod-to-json-schema@3`, which reads Zod 3's internal `_def.typeName`. Zod 4 no longer exposes it, so a Zod 4 catalog silently produces an **empty schema** and the agent gets nothing to generate against. Use Zod 4's own `zod/v3` compatibility entry, which costs no extra dependency.
- **Do not import the protocol's `DynamicString` from the renderer package.** `@copilotkit/a2ui-renderer` nests its own standalone `zod@3.25`, so comparing its `ZodObject` against the one from `zod/v3` sends TypeScript into a recursive structural comparison between two nominally distinct generic classes — heap exhaustion on a single component. Restate the primitive locally (`z.union([z.string(), z.object({ path: z.string() })])`) and cast once at the `createCatalog` boundary; the binder identifies it structurally, not by type identity.

**3. `openGenerativeUIEnabled` is a runtime-side flag the guide never mentions**

`/info` reports `"openGenerativeUIEnabled": false` even with `openGenerativeUI.sandboxFunctions` configured on the frontend. The guide presents Open Generative UI purely as a frontend `provideCopilotKit` option and documents no server-side counterpart, so it is unclear whether the sandboxed renderer can be driven with the runtime reporting false.

**4. Several guide snippets are Showcase excerpts that are not self-contained**

Five samples are quoted from the live Angular Showcase with their supporting code omitted, so they cannot be compiled as published. Each is displayed on its route page as a quoted sample, clearly marked as not mounted:

| Guide | Snippet | Missing |
|---|---|---|
| Frontend tools | `createBackgroundTool` | `resolveGradient`, `BackgroundToolArgs`, imports |
| A2UI | `fixedDefinitions` | `dynamicString` |
| A2UI | `a2uiConfigForFeature` | `beautifulCatalog`, `declarativeCatalog`, `fixedCatalog`, and any `createCatalog` call |
| Voice | `voiceWeatherRendererConfigs` | `VOICE_WEATHER_TOOL_NAMES`, `VoiceWeatherArgs`, `WeatherToolCard` |
| Voice | `createMultimodalMessage` | `SampleSpec`, `MediaAgentMessage` |
| Human-in-the-loop | `InterruptFeatureComponent` | `agentIdForCurrentIntegration`, `parseInterruptPayload`, `usesFrontendSchedulingTool`, `integrationId`, `ScheduleMeetingArgs`, `InterruptSlot`, `TimePickerCard` |
| Headless | `HeadlessChatController` | `agentIdForCurrentIntegration`, `createMessageId`, `ShowcaseMessage` |

Because no A2UI catalog can be built from the guide's own code, the A2UI route runs on the default catalog.

**5. The Chat UI guide gives two different components the same name and selector**

Both the inline-chat sample and the custom-assistant-message sample are `SupportChatComponent` / `app-support-chat`, and the popup/sidebar sample is `AppComponent` / `app-root`. Mounting all three at once is impossible as published. This repo keeps the first as `SupportChatComponent` and renames the other two (`CustomMessageChatComponent`, `PopupSidebarComponent`), noted on the route page.

**6. `agentId="support"` has no backing agent in the quickstart**

The Chat UI and Threads guides use `agentId="support"` throughout, but the quickstart only ever registers `default`. Run as published against a quickstart runtime, those snippets resolve to a non-existent agent. This repo registers a second `support` agent pointing at the same Agno process so the snippets work unedited.

**7. The Angular/Agno quickstart has no backend step**

[The quickstart](https://docs.copilotkit.ai/angular/agno/quickstart) contains the literal comment `<!-- setup skipped: agent-setup is not bundled for agno -->` where the Agno setup should be, and its runtime step only says to "register this backend as the `default` agent" with a link to the generic Copilot Runtime page — which shows a Next.js route handler and `BuiltInAgent`, not `AgnoAgent`. The `AgnoAgent` binding had to come from the **React** Agno quickstart (`https://docs.copilotkit.ai/agno/quickstart`). `frontend/server.ts` is therefore a composition of two doc pages: the Angular quickstart's Node server shape with the React quickstart's `AgnoAgent` construction.

**8. `zod` is an undocumented direct dependency**

`registerRenderToolCall`, `registerHumanInTheLoop`, and `SandboxFunction` samples all `import { z } from "zod"`, but the quickstart's install command is `npm install @copilotkit/angular @angular/cdk @copilotkit/runtime`. `zod` only resolves transitively; added explicitly here.

**9. The production bundle exceeds Angular's default budget**

Predicted by the quickstart's own troubleshooting box, and confirmed: a build fails at **4.65 MB** against the default 1 MB `initial` budget. `angular.json` raises it to 5 MB warning / 7 MB error. The build also emits CommonJS bailout warnings for `whatwg-url`, `@jetbrains/websandbox`, `partial-json`, and `chalk`.

**10. Agno tool names must be camelCase to match the guides**

The renderer name in `registerRenderToolCall({ name })` must equal the agent's tool name exactly. The guides are written against `getWeather(city)`, so `backend/main.py` declares `@tool(name="getWeather")` with a `city` parameter. A Python-idiomatic `get_weather(location)` would stream a plain-text answer with no card and look like a frontend bug.

**11. Frontend-only tools need no Python declaration**

`requestApproval` exists only in the browser, and the agent called it normally — verified over the wire, with the run pausing for the browser's response. CopilotKit forwards frontend tools to the agent in the AG-UI run input. The inverse still bites: a tool declared on the agent with **no** frontend handler registered will hang the run forever.

**12. The Inspector page's version floor is stated for the wrong thing**

[Inspector](https://docs.copilotkit.ai/angular/agno/inspector) says `@copilotkit/angular` "did not mount the Inspector before **0.4.0**" only inside the callout about deleting a hand-written mount. Everything else on the page — the automatic mount, `enableInspector`, the "nothing to install" claim — is written unconditionally. On 0.3.1, which is what this repo ran until this route was added, none of it holds: the package does not depend on `@copilotkit/web-inspector`, and `enableInspector` is not a member of `CopilotKitConfig`, so the page's only TypeScript sample does not compile. A reader on 0.3.x follows a page that describes a version they are not on and gets no error message saying so. This repo bumped to `^0.4.0`; the floor belongs at the top of the page.

**13. `verify` cannot gate CI for a project that does not use Intelligence**

The [CLI page](https://docs.copilotkit.ai/angular/agno/cli) says `verify` "exits non-zero unless every check passed, so it is usable as a CI gate". Exit 1 is confirmed. But three of its seven checks are Intelligence checks — hosted project selected, project API key present, key authenticates — and they **FAIL**, not `UNKNOWN`, when the project simply does not use Intelligence. This stack is fully working (runtime answers, two agents declared) and still exits 1. There is no documented flag to scope the run to the wiring checks, so the CI-gate advice does not hold for the majority of local setups, including the one the Angular quickstart produces.

**14. `verify` reports the agent framework as `t`**

The summary block prints `framework  t`. `/api/copilotkit/info` is the source: it reports `"className": "t"` for both agents — a **minified** class name from the runtime bundle, not `AgnoAgent`. The CLI passes it through verbatim, so the field that is supposed to tell you which integration answered is unreadable. Same run reports `generative UI  disabled`, consistent with issue #2.

*Still reproduces on `@copilotkit/runtime` 1.73.3* (2026-09-23): `/info` reports `"version":"1.73.3"` and `"className":"t"` for both agents, and `"openGenerativeUIEnabled": false` (#3).

**15. The launcher corner the page recommends lands on the composer**

The Inspector page's CSS sample moves the launcher bottom-left because that
"keeps the launcher clear of the close button on a chat panel or sidebar". On a
full-height `copilot-chat` — the quickstart's own layout, and this route's — the
bottom-left corner is where the composer is. Applied verbatim here, the open
panel sits over the text area: a Playwright click on the composer fails with
`<cpk-web-inspector> intercepts pointer events` while the panel is open. The
sample is correct about the docked chat surfaces and wrong about the default
one, and the page does not say which layout it assumes.

**16. The Shared state guide never initialises agent state, and its own fallback hides it**

[Shared state](https://docs.copilotkit.ai/angular/agno/guides/shared-state)
opens with a read sample whose `EMPTY_STATE` const implies the agent starts at
`{ notes: [], priority: "normal" }`. It does not. The diagnostics strip on
`/shared-state/demo` reports the agent's real state as `{}` until the browser
writes to it, and the page renders `Priority: normal` anyway because
`EMPTY_STATE` is applied at render time and never sent anywhere. So an agent
asked about priority before any write has nothing in state to read, while the
UI insists a value exists. The guide never says to seed the state, and the
sample reads as if it had.

Two consequences the page does not mention:

- **`notes` disappears when the first write precedes the first run.** The
  guide's `setPriority` does `agent.state ?? EMPTY_STATE`, but on a fresh page
  `agent.state` is `{}` — present, so the `??` never fires and the spread
  yields `{ priority }` with no `notes` key. Verified locally: press a priority
  button before sending any message and the state becomes
  `{"priority":"high"}`, after which the notes list iterates a key that is gone.

  It does **not** reproduce once the agent has run at least once: CI drives a
  baseline question first, the agent emits a state snapshot carrying `notes`,
  and every later write then preserves it —
  `{ "notes": [], "priority": "high" }`. So the bug is ordering-dependent, which
  is worse than a consistent one: the guide's sample works in the order its own
  prose implies and breaks in the order its UI invites, and nothing on the page
  says a run has to happen first. `??` is the wrong operator for a value the
  runtime initialises to an empty object.
- **A "correct" answer can be read off the screen instead of the state.** The
  left panel prints the priority as text, so a model can answer the question
  from context alone. This is why the recorder now asks a baseline question
  before any write and then asks across two different written values.

**17. "Open Agents, then Agent. Your agent is listed" — it is not, yet**

The [quickstart](https://docs.copilotkit.ai/angular/agno/quickstart)'s
confirm-setup step reads: *"Open **Agents**, then **Agent**. Your agent is
listed."* Opening that panel renders **"No agent selected — Select an agent
from …"**. Nothing is listed until an agent is picked from a separate sidebar
control (`[data-inspector-sidebar-agent-selector]`), which the step never
mentions. Verified by recording both states: on arrival the panel says
`No agent selected`; after choosing `default` it says
`default Idle Last activity: …`.

The step is one interaction short of what it describes, and a reader following
it literally sees an empty panel at exactly the moment the page is telling them
their setup is correct.

**18. The context sample gives the reader nothing to observe**

[Shared state](https://docs.copilotkit.ai/angular/agno/guides/shared-state)'s
read-only context sample renders a bare **Use London time** button. Pressing it
produces no visual change anywhere: it does not write agent state, it does not
display the current timezone, and the component renders no value at all. A
working button and a dead one are indistinguishable, and the only confirmation
offered is to ask the agent and trust the prose that comes back.

It does work. Captured on the wire, with the request aborted so no model call
was spent:

```
before:  "timezone\":\"America/Los_Angeles\"
after:   "timezone\":\"Europe/London\"
```

Three things the page never says, all of which a reader hits immediately:

- **Re-registration is a remove-then-append, not an update.** The entry leaves
  its position and returns at the *end* of the context list with a new id. The
  count is unchanged, so a reader watching the top of a context list sees the
  entry vanish. Verified: position 0 before the click, position 7 after.
- **Nothing observable happens in the UI**, so the natural conclusion is that
  the button is broken. This one cost real debugging time here before the wire
  capture settled it.
- **There is no reactive way to watch context.** `CopilotKit` exposes signals
  for `agents`, `runtimeConnectionStatus`, `threadEndpoints`, `intelligence`,
  `licenseStatus` and `suggestionsByAgent` — but none for context.
  `core.getContextForAgent()` is public and read-only, and polling it is the
  only hook available. The harness diagnostics strip polls at 750ms for exactly
  this reason.

Not a defect in the sample's behaviour — a defect in its testability, which
rule 3 of `project-context.md` counts the same way.

**19. The new `registerComponent` section runs, and its snippet is wrong four ways**

[Frontend tools and generative UI](https://docs.copilotkit.ai/angular/agno/guides/frontend-tools-generative-ui)
gained a new **first** section, "Let the agent display one of your components",
teaching `registerComponent`: display-only generative UI, no `handler`, nothing
on the agent side. It also added a row to the "Choose a generative UI path"
table and a Next-steps link to `/reference/angular/functions/registerComponent`.

The premise holds. `show_incident` is declared by the browser, forwarded over
AG-UI, and called by the model with the Agno process untouched. Implemented
verbatim at `@copilotkit/angular` 0.5.1, the published snippet then fails four
ways, all reproduced against a live agent:

1. **The agent apologises for the card it just drew.** With no `handler`, core
   returns an empty tool result, the model reads the emptiness as failure, and
   posts a second message contradicting the correct card above it. Every run.
   `followUp: false` suppresses it — `RegisterComponentConfig` carries the field
   and the guide never mentions it.
2. **The loading guard never fires.** It gates on `status === "in-progress"`;
   the observed status while arguments stream is `"executing"`, so the `@else`
   branch runs with empty args and paints a blank card before the values land.
3. **The status never reaches `"complete"`.** Sampled once a second for 25
   seconds: `"executing"` throughout. The `registerRenderToolCall` snippet
   higher up this same page gates its content on `"complete"`, so that
   documented pattern applied to a display-only tool loads forever.
4. **The card is not a card.** The snippet ships no CSS and pairs an inline
   `<strong>` with an inline `<span>`; Angular's default
   `preserveWhitespaces: false` strips the gap, so it renders as the unstyled
   run-together string `INC-4711sev1`.

Smaller gaps: the registration is a bare ` ```ts ` fence with no imports, so
`registerComponent` and `z` are undefined identifiers as published; the section
never says it must run in an Angular injection context, though the API
reference requires one and the `registerFrontendTool` section below does say
so; and the `description` you pass is not what the model receives — core
prepends a fixed preamble.

Everything is kept verbatim at
`frontend/src/app/features/tools/incident-card.component.ts` and in
`tools-chat.component.ts`. The defects are the snippet's own.

*Note, not a finding:* `registerComponent` does not exist in
`@copilotkit/angular` 0.4.0, which this repo declared until now, and `^0.4.0`
can never reach 0.5.x. The quickstart's unpinned `npm install` gives a new
reader 0.5.1, so the frontend moved to `^0.5.1` (and `@copilotkit/runtime` to
`^1.70.1`, which 0.5.1 pins) to QA the section at all.

**20. The same page now teaches two incompatible renderer styles**

Still on [Frontend tools and generative UI](https://docs.copilotkit.ai/angular/agno/guides/frontend-tools-generative-ui):
the older "Render a tool result" snippet imports
`{ type AngularToolCall, type ToolRenderer }` and sets no `standalone`. The new
`registerComponent` snippet imports the same two symbols as **values** and sets
`standalone: true`. Two renderers, one page, one package, two import styles and
two decorator shapes, with nothing on the page acknowledging the difference.

`frontend/AGENTS.md` in this repo also states that components must **not** set
`standalone: true` — it is the default in Angular v20+ — so the guide's new
snippet violates the house rule its older sibling on the same page happens to
respect. Both are kept verbatim here (rule 1); normalising either would hide
the conflict.

**21. Six documentation pages moved with no redirect and no note**

The docs section `premium/*` was renamed to `intelligence/*` upstream. All six
pages this repo tracks under it — `overview`, `intelligence-platform`,
`managed-intelligence-platform`, `connect-your-runtime`, `self-hosting`,
`threads-explained` — began returning **404** at their old paths, while the
identical content serves 200 at the new ones. No redirect was left behind and
no changelog entry announces the move.

Cost here: `node ci/check-doc-drift.mjs` exited **2** on six HIGH "Page 404 /
Removed" results, which reds the nightly pipeline's drift gate and sets
`should_record=false` — so nothing in this repo recorded at all until the paths
were retargeted. `threads-explained` hashed identical at the new path, which is
the proof it was a move and not a rewrite; the other five carried ordinary
prose drift on top.

Retargeted in `frontend/scripts/sync-docs.ts`, `doc-snapshot/manifest.json`, and
the six `doc-snapshot/pages/angular__agno__intelligence__*.md` filenames.

One of the six has since gone for good: `connect-your-runtime` 404s at its
new path too as of 2026-09-23, with no redirect again, and is retired here
(#38).

**22. Seventeen live pages are missing from the section's sitemap**

`sitemap.xml` lists 4 URLs under `/angular/agno`. Twenty-five pages this repo
tracks are live (every one hashes clean) but absent from it, and 17 further live
pages were reachable **only** by following links from tracked pages. The drift
gate's link scan (`ci/lib/linked-pages.mjs`, added in `3f19fe2`) found 13 on
2026-09-18; tracking those surfaced 4 more (`backend/ag-ui`,
`backend/custom-agent`, `backend/self-managed-agents`, `vs-code-extension`).
The 13 alone held the nightly gate shut all day (`STATE: drift`,
`should_record=false`) while every tracked page matched.

Sixteen of them are now in `frontend/scripts/sync-docs.ts` and `doc-snapshot/`
(45 pages); the gate exits 0. The seventeenth, `intelligence/quickstart`, is
deliberately not tracked — dropped fleet-wide as in the React repos (`108c1ed`),
its URL listed in `sitemap.knownUnmapped` so the gate does not report it as new.
`server.ts` still wires `CopilotKitIntelligence` as `connect-your-runtime`
taught; that page was removed on 2026-09-23 and merged into
`intelligence/quickstart` (#38), so the untracked quickstart is now the only
live source for that code. The 2026-09-23 sitemap restructure changed how this
gap presents, not whether it exists (#41).

**23. Two in-section links 404**

- [AWS AgentCore](https://docs.copilotkit.ai/angular/agno/deploy/agentcore)
  links its "full-stack example" to `/angular/agno/agentcore/full-stack-example`.
- [Custom agent](https://docs.copilotkit.ai/angular/agno/backend/custom-agent)
  links "Advanced Configuration" to `/angular/agno/advanced-configuration`.

Both markdown endpoints return 404, per the drift checker's dead-link scan.

Since 2026-09-23 the sitemap lists `/angular/advanced-configuration`
(framework-less, 200), while the framework-scoped
`/angular/agno/advanced-configuration` that Custom agent links to still 404s,
page and `.md` alike (checked 2026-09-23). The drift checker maps shared
`/angular/X` sitemap entries onto `/angular/agno/X` (#41), so it now lists this
dead URL as a new upstream page as well; it is acknowledged in
`sitemap.knownUnmapped` for that reason only, and stays a dead link. Side
effect: the dead-link scan (`ci/lib/linked-pages.mjs`) skips every URL in
`knownUnmapped`, so `npm run drift` now prints only
`agentcore/full-stack-example` under dead links. This entry is the record of
the second one; re-check it by hand
(`curl -I https://docs.copilotkit.ai/angular/agno/advanced-configuration`).

**24. Angular pages title their runtime code as a Next.js route file**

Twenty snippets across six tracked Angular pages carry
`title="app/api/copilotkit/[[...slug]]/route.ts"` (or `.../route.ts`):
`backend/copilot-runtime` (6), `copilot-runtime` (5), `backend/runtime-endpoints` (3),
`backend/agent-runner` (3), `deploy/agentcore` (2), `troubleshooting/debug-mode` (1).
`intelligence/connect-your-runtime` carried a twenty-first until it was
removed on 2026-09-23 (#38). The untracked `intelligence/quickstart` it merged
into no longer has one: it titles its runtime snippets
`"Your CopilotKit runtime"` / `"Your runtime server"` (checked live
2026-09-23). An Angular app has
no such file — the Angular quickstart runs the runtime as its own Node server
(`frontend/server.ts` here). `runtime-server-adapter`'s two are excluded: they sit
in its own Next.js section, where they belong. A reader has to infer that each
snippet goes into the Node server instead.

The 2026-09-21 sync added one more to each `copilot-runtime` page (19 to 21).
The section it arrived in does pair that Next.js-titled snippet with a real
Angular one (`title="src/app/app.component.html"`), so the two halves of one
example name two different frameworks' files.

**25. On an Intelligence runtime, `/run` is not an SSE stream — two pages assume it is**

Probed on `@copilotkit/runtime` **1.72.0** with this repo's `server.ts`
(`/info` reports `"mode": "intelligence"`). `POST /api/copilotkit/agent/default/run`
returns a JSON body, not SSE:

```json
{"threadId":"…","runId":"…","joinToken":"…",
 "realtime":{"clientUrl":"wss://realtime.intelligence.copilotkit.ai/client","topic":"thread:…"}}
```

- [Runtime HTTP endpoints](https://docs.copilotkit.ai/angular/agno/backend/runtime-endpoints)
  describes that route as "the response is an SSE stream of AG-UI events" and
  never mentions the join-token response.
- [Debug Mode](https://docs.copilotkit.ai/angular/agno/troubleshooting/debug-mode)
  never mentions Intelligence. Its sample log is an SSE lifecycle
  (`SSE stream opened` → `Event emitted` → `SSE stream completed`). With its
  `debug: true` added, this runtime logged one line for a run: `Agent run started`.
  Not verified: whether per-event lines appear once a browser joins the realtime
  channel (a curl caller cannot).
- Only [AG-UI Event Inspector](https://docs.copilotkit.ai/angular/agno/troubleshooting/event-inspector)
  warns about this, and its warning is accurate: `/cpk-debug-events` answered
  `: connected` and carried nothing across the run.

Also seen: the thread id must be a UUID. A non-UUID `threadId` fails with
`{"error":"Failed to initialize thread"}` after Intelligence returns
`400 VALIDATION_ERROR`; no page states the constraint.

**26. Learned skill delivery has no Agno path, and its Python packages do not exist**

[Automatic learned skill delivery](https://docs.copilotkit.ai/angular/agno/intelligence/learned-skills)
is published under `/angular/agno`, but its adapter table lists LangGraph
Python/TS, Mastra, Google ADK, and Microsoft Agent Framework — no Agno row, and
"agno" appears only in link URLs. It says "Python uses
`copilotkit-intelligence-runtime`"; that and both Python adapters
(`copilotkit-intelligence-langgraph`, `copilotkit-intelligence-adk`) return
**404** on PyPI as of 2026-09-18. The TypeScript adapters are published
(`@copilotkit/intelligence-langgraph` / `-mastra` 1.71.2), and the .NET one only
as `0.1.0-rc.1`. The page gives no install commands. This repo's backend is
Python Agno, so nothing on the page can be followed here.

Still true after the 2026-09-21 sync, which added a **BuiltInAgent** row to the
same table. BuiltInAgent is CopilotKit's own agent, not an adapter for a
framework backend, so the page's answer for an Agno reader is to stop running
Agno. See #33 and #34 for what that row costs on the declared versions.

**27. The Learning snippet uses two identifiers it never defines**

[Learning](https://docs.copilotkit.ai/angular/agno/learning)'s runtime snippet
passes `agents` and `identifyUser` as shorthand; compiled verbatim, `tsc` fails
with `TS18004` for both. The `getLearningContainerId` option itself typechecks
on 1.72.0. Its example routes on `agentId === "expense-agent"`, which matches
no agent this repo registers, and a container must first be created in the
Intelligence dashboard — so no Thread here is assigned.

**28. Whether the approval card appears is the model's call, and the guide gives no way to make it reliable**

[Human-in-the-loop and interrupts](https://docs.copilotkit.ai/angular/agno/guides/human-in-the-loop)
frames the tool path as the one to use "when the model should decide whether to
ask", then registers `requestApproval` with only a one-line description ("Ask
the user before a consequential action"). It says nothing about prompting,
instructions, or tool choice — nothing that makes the model ask.

In practice it often does not. The recorder sends "Please delete my account.
Check with me before you actually do it." — an explicit request to be asked —
and `backend/main.py` additionally instructs the agent to call `requestApproval`
for consequential actions (not in the guide). On `gpt-5.4-mini`, runs on
2026-09-18:

| Repo · attempt | Card shown? |
|---|---|
| Agno-angular · 1 | ❌ agent answered without calling `requestApproval` |
| Agno-angular · 2 | ✅ |
| MsPy-angular · 2 | ❌ same |
| MsPy-angular · 1, DeepAgentspy-angular · 1 | ✅ |

A reader following the guide gets a feature that failed 2 of 5 takes today,
with nothing in the guide to diagnose it by. Deliberately left as-is here:
forcing the call (`tool_choice`, a stronger prompt) would turn a coin flip into
a guaranteed green clip and hide this. A take where the card never appears is
kept as evidence, not retried until it passes.

### Findings from the 2026-09-21 sync

Ten pages moved upstream. All ten are reference pages with no browser surface
here, so the findings below are what the sync produced; no route changed.

Every code claim below was checked by compiling the published snippet verbatim
against the packages in `frontend/node_modules`, in a scratch file outside the
repo (`tsc --noEmit --strict --module nodenext`, TypeScript 6.0.2). Nothing was
installed, upgraded or added to the repo to do it. The whole result:

```
snippets.ts(4,15): error TS2724: '"@copilotkit/runtime/v2"' has no exported member named 'BuiltInAgentFactoryContext'. Did you mean 'AgentFactoryContext'?
snippets.ts(19,3): error TS2769: No overload matches this call.
    Object literal may only specify known properties, and 'sseKeepAliveIntervalSeconds' does not exist in type 'CopilotRuntimeOptions'.
snippets.ts(29,3): error TS2353: Object literal may only specify known properties, and 'learnedSkills' does not exist in type 'BuiltInAgentConfiguration'.
snippets.ts(44,26): error TS2304: Cannot find name 'resolveUser'.
snippets.ts(48,21): error TS2304: Cannot find name 'userOwnsThread'.
snippets.ts(58,33): error TS2304: Cannot find name 'userOwnsThread'.
ei.ts(2,38): error TS18004: No value exists in scope for the shorthand property 'agents'. Either declare one or provide an initializer.
```

The agent-naming snippet (`agents: { my_agent: new HttpAgent(...) }`) and
`debug: true` are the only new code that compiles clean.

Versions pinned for every entry in this block. Declared in
`frontend/package.json`: `@copilotkit/angular ^0.5.1`,
`@copilotkit/runtime ^1.70.1`, `@ag-ui/agno ^0.0.5`. Installed in
`frontend/node_modules`: `@copilotkit/angular` **0.5.1**,
`@copilotkit/runtime` **1.70.1**, `@copilotkit/core` **1.70.1**,
`@copilotkit/shared` **1.70.1**, `@ag-ui/agno` **0.0.5**. Resolved by CI on
2026-09-19 (`ci/resolved-versions.json`): `@copilotkit/angular` **0.5.2**,
`@copilotkit/runtime` **1.73.0**. Nothing was installed or upgraded to write
these up: 1.73.0 and 0.5.2 were read with `npm pack` into a scratch directory
outside the repo.

**Re-checked 2026-09-23, after upgrading.** Declared now:
`@copilotkit/angular ^0.5.2`, `@copilotkit/runtime ^1.73.3`, `@ag-ui/agno ^0.0.5`.
Installed: `@copilotkit/angular` **0.5.2**, `@copilotkit/runtime` **1.73.3**,
`@copilotkit/core` / `shared` / `web-inspector` **1.70.2** (exact-pinned by
`@copilotkit/angular` 0.5.2; the runtime's own nested `shared` is 1.73.3),
`@ag-ui/agno` **0.0.5**. The same snippets, compiled verbatim the same way
against the upgraded tree, leave only the undefined-identifier errors:
`TS18004` for `agents` (#27, #35) and `TS2304` for `resolveUser` /
`userOwnsThread` (#31). `BuiltInAgentFactoryContext`,
`sseKeepAliveIntervalSeconds` and `learnedSkills` all compile. Per finding:
#29 and #32 still reproduce, #30, #33, #35 and #36 no longer reproduce on the
declared version and are marked resolved-at-version below, #34 is partly
resolved. Nothing here is deleted: each still documents a page that states no
version floor, so a reader on 1.70.x still hits it.

One side effect of the upgrade, recorded because the doc snippet causes it:
`server.ts` copies the quickstart's `apiKey: process.env.CPK_INTELLIGENCE_API_KEY!`.
On 1.70.1 an unset key constructed a client anyway; on 1.73.3 the constructor
throws `CopilotKitIntelligence \`apiKey\` is required and cannot be blank` at
startup. The `!` in the published snippet silences the type checker, so the
page gives no compile-time hint that the variable is mandatory. The harness
starts normally with the key set (checked: `/info` answers with
`"version":"1.73.3"`).

**29. Both runtime pages now name an error class the Angular surface never throws**

[Copilot Runtime](https://docs.copilotkit.ai/angular/agno/backend/copilot-runtime)
and its near-duplicate [Copilot Runtime](https://docs.copilotkit.ai/angular/agno/copilot-runtime)
both gained the section "Which name identifies an agent", word for word. Its
warning callout says:

> Asking for a name the runtime did not register resolves no agent, and the
> frontend raises `CopilotKitAgentDiscoveryError`

That class is real but unreachable from here. `@copilotkit/angular` 0.5.1
throws a plain `Error` from `injectAgentStore`, built from this template in
`dist/fesm2022/copilotkit-angular.mjs` (read from the bundle, not observed in a
run):

```
injectAgentStore: Agent 'x' not found after runtime sync (runtimeUrl=…).
Known agents: [default, support] Verify your runtime /info and/or
agents__unsafe_dev_only.
```

`@copilotkit/core` 1.70.1 throws `new Error("Agent not found: …")`.
`CopilotKitAgentDiscoveryError` is defined in `@copilotkit/shared` 1.70.1 and
constructed in exactly one place in the tree, `@copilotkit/runtime`'s v1
GraphQL `state.resolver`, which the v2 Angular path does not use. 0.5.2 (what
CI installs) throws the same plain `Error`, so a reader who searches their
Angular app for the documented class name finds nothing to catch.

The same callout links "Agent discovery failed" to
`/angular/agno/guides/troubleshooting`, which has no section by that name; the
closest is "Agent id does not resolve". The React edition of this page links
the same words to `/agno/troubleshooting/error-reference` instead, so the two
editions do not agree on where the error is explained.

Not reproduced live: this repo registers `default` and `support` and asks for
nothing else, and a run needs servers that were not started for this pass.

*Still open at the upgraded versions (2026-09-23):* installed
`@copilotkit/angular` 0.5.2 has the same `injectAgentStore` template, and
installed `@copilotkit/core` 1.70.2 the same `Agent not found: …` `Error`;
neither references `CopilotKitAgentDiscoveryError`.

**30. The new keep-alive option does not exist in the version the page's own quickstart installs**

[Copilot Runtime](https://docs.copilotkit.ai/angular/agno/backend/copilot-runtime)
gained "Keeping quiet streams alive": the runtime writes a `: keep-alive` SSE
comment after 15 seconds of silence, tunable with
`sseKeepAliveIntervalSeconds` (`0` disables it). No version is stated.

`@copilotkit/runtime` 1.70.1, which this repo declares and installs, contains
neither the option nor the frame. `sseKeepAliveIntervalSeconds` has zero
occurrences anywhere in its `dist/`, and the snippet `new CopilotRuntime({ agents,
sseKeepAliveIntervalSeconds: 30 })` fails with `TS2769` / "does not exist in
type 'CopilotRuntimeOptions'", and its only `keep-alive` strings are the
HTTP `Connection: keep-alive` response header in three SSE handlers, which is
a different thing. 1.73.0 adds
`dist/v2/runtime/handlers/shared/sse-keep-alive.mjs` with
`KEEP_ALIVE_FRAME = ": keep-alive\n\n"` and
`DEFAULT_SSE_KEEP_ALIVE_INTERVAL_SECONDS = 15`, and declares
`sseKeepAliveIntervalSeconds?: number` on both runtime options interfaces. So
the paragraph is true only from some release between 1.70.1 and 1.73.0 onward,
and a reader on the version an unpinned install gave this repo gets neither the
frames nor the option.

`server.ts` does not set it, and the option was not added: setting a field the
installed types do not have would fail the build, and the page does not ask
anyone to set it.

*Resolved at `@copilotkit/runtime` 1.73.3* (declared `^1.73.3` since
2026-09-23): the option is declared in `dist/v2/runtime/core/runtime.d.mts`
and the snippet compiles. Still no version floor on the page.

**31. Three new links promise a "Thread authorization" section the Auth page does not have**

[Agent runner](https://docs.copilotkit.ai/angular/agno/backend/agent-runner)
and [Runtime HTTP endpoints](https://docs.copilotkit.ai/angular/agno/backend/runtime-endpoints)
each gained a warning that thread routes are not authorized for you, and
between them link three times to `/angular/agno/auth#thread-authorization` for
"the ownership-table pattern and the `onBeforeHandler` enforcement point" and
for "the ownership map this example assumes".

[Auth](https://docs.copilotkit.ai/angular/agno/auth) has seven sections and
none of them is Thread authorization. The word `onBeforeHandler` does not
appear on it, and threads appear only as two checklist bullets ("Scope thread
operations to the authenticated user and project"). The page linked to as the
definition of the pattern does not contain the pattern.

This lands on the new `onBeforeHandler` sample in `runtime-endpoints`, which
calls `resolveUser(request)` and `userOwnsThread(user.id, …)`. Neither is
defined in the snippet, on the page, or anywhere in the section, and the
closing line points at the missing Auth section for them. Compiled verbatim
that is three `TS2304` errors (`resolveUser` once, `userOwnsThread` twice), the
same defect class as #27.

The drift checker's dead-link scan resolves page paths only, so a link to a
live page with a fragment that does not exist passes it. Both dead links it
does report (#23) are still the only two.

What the sample gets right, checked against `RouteInfo` in 1.70.1: `threadId`
is present on exactly `agent/stop`, `threads/messages`, `threads/events`,
`threads/state`, `threads/update` and `threads/archive`, and absent from
`threads/list`, `threads/clear` and `threads/subscribe`, exactly as the page
says. `onBeforeHandler` exists with the documented `{ request, route }`
context and the documented throw-a-`Response` behaviour.

**32. The 422 both pages blame on the runner is reported as a missing Intelligence configuration**

The same two callouts say that a runner keeping no local store, "such as
`SqliteAgentRunner`", answers the four thread read routes with a `422`.

The status code is right and the explanation a reader will see is not. In both
1.70.1 and 1.73.0, `v2/runtime/handlers/intelligence/threads.mjs` falls through
to one body for all four routes:

```
Missing CopilotKitIntelligence configuration. Thread operations require a
CopilotKitIntelligence instance to be provided in CopilotRuntime options.
```

The gate is `supportsLocalThreadEndpoints(runner)`, i.e.
`runner.ɵsupportsLocalThreadEndpoints === true`, which only
`InMemoryAgentRunner` sets. So the runner does decide it, as documented, but
the 422 tells the reader to add Intelligence rather than to change runner, and
nothing in the response mentions a runner at all. `POST /threads/clear`
returning 204 unconditionally is accurate (`handleClearThreads` clears only
when the runner opts in, then returns 204 either way).

Which branch this harness takes: `server.ts` passes `intelligence`, so the
runtime builds an `IntelligenceAgentRunner` itself and the thread routes go
down the Intelligence path, not the local-store one. The parts of the two new
callouts that still apply here are the three routes they say stay unscoped on
the platform as well (`threads/events`, `threads/state`,
`agent/:agentId/stop/:threadId`), and `server.ts` adds no hook for them.

Unverified here: `SqliteAgentRunner` itself. It ships in `@copilotkit/sqlite-runner`,
a package this repo does not install, so only the two runners exported by
`@copilotkit/runtime/v2` (`InMemoryAgentRunner`, `IntelligenceAgentRunner`)
were inspected. `AgentCoreRunner`, named in both callouts, is a class the
reader writes in `deploy/agentcore` (`extends InMemoryAgentRunner`), so it
inherits the opt-in as claimed.

*Re-checked at `@copilotkit/runtime` 1.73.3 (2026-09-23):* the 422 body is
unchanged, still the "Missing CopilotKitIntelligence configuration" text for
all four read routes, so the finding stands. What changed is the other half of
both callouts: 1.73.3's `handle-stop.mjs` now resolves the user on an
Intelligence runtime and calls `intelligence.getThread({ threadId, userId })`
before stopping, answering 403 `Thread access denied` for a thread the user
cannot see. So `agent/:agentId/stop/:threadId` no longer reads the thread
by id alone on the platform, while both pages (re-synced the same day) still
list it beside `threads/events` and `threads/state`, which do (they resolve a
user and then fetch by `threadId` only). Read from the installed bundle, not
exercised over the wire.

**33. `BuiltInAgentFactoryContext` and `learnedSkills` are published against a version the pages never name**

[Custom agent](https://docs.copilotkit.ai/angular/agno/backend/custom-agent)
renamed the factory context and added a field:

```typescript
interface BuiltInAgentFactoryContext {
  learnedSkills: BuiltInAgentLearnedSkills; // catalog and read-only AI SDK tools, empty when disabled
  input: RunAgentInput;        // messages, tools, state, context, threadId, runId, forwardedProps
  abortController: AbortController;  // for TanStack AI (requires AbortController)
  abortSignal: AbortSignal;          // preferred for AI SDK, fetch, and custom backends
}
```

In `@copilotkit/runtime` 1.70.1 there is no `BuiltInAgentFactoryContext`
export and no `learnedSkills` field: the type is `AgentFactoryContext`, with
`input`, `abortController`, `abortSignal` and `interrupt`. 1.73.0 adds
`type BuiltInAgentFactoryContext = AgentFactoryContext` and the
`learnedSkills: BuiltInAgentLearnedSkills` field. Neither page states a floor,
so on the declared range the import
`import type { BuiltInAgentFactoryContext } from "@copilotkit/runtime/v2"`
that [learned skills](https://docs.copilotkit.ai/angular/agno/intelligence/learned-skills)
instructs you to write fails with `TS2724: '"@copilotkit/runtime/v2"' has no
exported member named 'BuiltInAgentFactoryContext'. Did you mean
'AgentFactoryContext'?`

The published prose also reads "The factory receives **an**
`BuiltInAgentFactoryContext`", left as-is here since the snapshot is the
evidence.

The published interface is also still missing `interrupt`, the fourth field
both 1.70.1 and 1.73.0 carry on this context and the only way a factory can
pause a run for human input. The page never mentions it under any name. That
was true before the rename too; the rename kept it while adding a field.

*Resolved at `@copilotkit/runtime` 1.73.3* (declared `^1.73.3` since
2026-09-23) for the export and the field: `BuiltInAgentFactoryContext` is
exported from `@copilotkit/runtime/v2` and the verbatim import compiles. The
missing `interrupt` field and the absent version floor still stand.

**34. The BuiltInAgent skill-delivery path and the Learning page that links to it disagree**

[Learned skills](https://docs.copilotkit.ai/angular/agno/intelligence/learned-skills)
gained a BuiltInAgent adapter row and a BuiltInAgent section with two
snippets. [Learning](https://docs.copilotkit.ai/angular/agno/learning) gained a
"Set up automatic skill delivery" step in the same sync, which sends the reader
to those same examples "for LangGraph Python, LangGraph TypeScript, Mastra,
Google ADK, or Microsoft Agent Framework". BuiltInAgent, now the first row of
the table it links to, is not in that list. Agno is in neither (#26).

Three further gaps in the new BuiltInAgent section:

- `learnedSkills` is not a `BuiltInAgent` option in 1.70.1: the classic-mode
  snippet compiles to `TS2353`, "does not exist in type
  `BuiltInAgentConfiguration`". It is in 1.73.0. No floor is stated (#33).
  *Resolved at 1.73.3*, which this repo declares since 2026-09-23: the snippet
  compiles, including the now-uncommented `revision` line (#40).
- The factory sample imports `streamText` and `stepCountIs` from `ai` and
  `openai` from `@ai-sdk/openai`. Neither package is declared in this repo's
  `frontend/package.json`; both exist only as transitive dependencies of
  `@copilotkit/runtime`. The page gives no install command for either.
- Environment names do check out against 1.73.0:
  `CPK_INTELLIGENCE_API_KEY`, `CPK_INTELLIGENCE_LEARNING_CONTAINER_ID`,
  `CPK_INTELLIGENCE_SKILLS_REVISION` and the un-prefixed `INTELLIGENCE_API_URL`
  are all read by the shipped code, and Learning's bash block agrees with
  learned-skills' own block.

**35. Event Inspector documents a debug-feed gate that the declared runtime inverts**

[AG-UI Event Inspector](https://docs.copilotkit.ai/angular/agno/troubleshooting/event-inspector)
was rewritten from "disabled when `NODE_ENV=production`" to:

> It is served in exactly two cases: `NODE_ENV` is `development`, or the
> runtime sets `debug`. Everywhere else it returns 404.
>
> An *unset* `NODE_ENV` counts as everywhere else. A plain `node server.js`
> sets no value, so a self-hosted runtime does not expose the feed by accident.

`@copilotkit/runtime` 1.73.0 implements exactly that
(`isDebugEventFeedEnabled`: `debug?.enabled` or `NODE_ENV === "development"`).
The declared and installed 1.70.1 implements the previous gate, in two places:

```js
// v2/runtime/core/runtime.mjs
if (process.env.NODE_ENV !== "production") this.debugEventBus = new DebugEventBus();
// v2/runtime/handlers/handle-debug-events.mjs
if (process.env.NODE_ENV === "production") return new Response("Not Found", { status: 404 });
```

So on 1.70.1 both halves of the new text are wrong, and wrong in the unsafe
direction: an unset `NODE_ENV`, which is exactly how this repo's runtime runs
(`tsx server.ts`, with no `NODE_ENV` set anywhere in `frontend/package.json`,
`ci/` or `.github/`), **does** open the feed, which is precisely the accident
the callout says cannot happen; and `debug: true` does **not** open it on a
host that sets `NODE_ENV=production`. What comes down the open feed here is a
separate question, answered by #25: on this Intelligence runtime it stays
empty. The page states no version floor, so a reader on the
range this repo declares is told a security property their runtime does not
have. That is also why the page's status moves from Working to Partial: the
claims probed on 2026-09-18 were the old ones.

The new snippet is `const runtime = new CopilotRuntime({ agents, debug: true });`.
`debug: true` is valid (`DebugConfig = boolean | { events?, lifecycle?,
verbose? }` in `@copilotkit/shared` 1.70.1), but `agents` is shorthand for an
identifier the page never defines, so compiled verbatim it is `TS18004`, the
same defect as #27 and #31. Nothing was added to `server.ts` for it: this
harness must not enable a public event feed, and the page does not ask it to.

*Resolved at `@copilotkit/runtime` 1.73.3* (declared `^1.73.3` since
2026-09-23): the installed `core/runtime.mjs` gates the bus on
`isDebugEventFeedEnabled`, so this repo's unset-`NODE_ENV` runtime no longer
opens the feed. The `TS18004` on `agents` and the missing version floor still
stand.

**36. The stop endpoint's new `runId` body does not exist in the declared runtime**

[Runtime endpoints](https://docs.copilotkit.ai/angular/agno/backend/runtime-endpoints)
changed its `POST /api/copilotkit/agent/:agentId/stop/:threadId` row on
2026-09-21, a few hours after the same page's earlier change in this sync. It
now reads:

> Stop the in-progress run on a given thread. An optional JSON body
> `{ "runId": "..." }` stops only that run. A body that is not valid JSON, or
> carries any other key, is rejected with 400 and stops nothing.

None of that holds on the declared `@copilotkit/runtime ^1.70.1` (installed
1.70.1). `dist/v2/runtime/handlers/handle-stop.mjs` destructures
`{ runtime, request, agentId, threadId }` and never reads the body: there is no
`JSON.parse`, no `runId`, and no 400 branch anywhere in the handler. It calls
`runtime.runner.stop({ threadId })` and returns 404 for an unknown agent, 200
with `stopped: false` when no run is active, 200 with `stopped: true` otherwise,
or 500 on a throw.

So a caller following the new row gets the opposite of the documented
behaviour twice over: a `runId` naming one of several runs is ignored and the
thread's run is stopped anyway, and a malformed or extra-key body is accepted
rather than rejected. The page states no version floor, and the severity
classifier called this LOW because the change is prose in a table cell rather
than a code fence. Verified by reading the installed bundle; not exercised over
the wire, since this page has no route here.

*Resolved at `@copilotkit/runtime` 1.73.3* (declared `^1.73.3` since
2026-09-23): the installed `handle-stop.mjs` has `parseStopScope`, which
accepts an optional `runId`, returns 400 for non-JSON bodies and extra keys,
and passes `runId` to `runner.stop`. Still no version floor on the page.

### Findings from the 2026-09-22 sync

Ten pages moved; none needs code here. Most of it is renaming: Learning is now
"Automatic Learning", Memories & Recall is now "User Memories", memory and
analytics are now "User Memories" and "Product Analytics", and Threads is "Rich
Threads" wherever a page sends you into Inspector. The drift classifier rated
`/angular/agno/learning` HIGH only because its changed lines are indented prose
inside `<Step>` blocks, which it counts as code. Two pages gained real content,
neither of which has a route here: Intelligence gained an AWS ECS/Fargate
self-hosting path (`/angular/agno/intelligence/self-hosting-ecs`, acknowledged in
`sitemap.knownUnmapped`, since nothing here deploys Intelligence), and
Runtime endpoints and the Runtime server adapter now say `express` is an
optional peer dependency of `@copilotkit/runtime` that the app must install
itself (`^4.18.0 || ^5.0.0`). This frontend already declares `express ^5.2.1`
(installed 5.2.1) for SSR, so nothing changes.

The sitemap now lists 4 URLs under `/angular/agno` and 41 tracked pages are
missing from it, but every one of them still resolves and hashed normally in
this run, so this is the sitemap shrinking, not pages being removed.

**37. Quickstart now sends you to an Inspector tab that does not exist**

[Quickstart](https://docs.copilotkit.ai/angular/agno/quickstart) and the landing
page now say to open **Rich Threads** in Inspector, and Automatic Learning and
the Intelligence overview say to go to **Automatic Learning**. The Inspector
still labels those tabs `Threads` and `Learning`: `label: "Threads"` and
`label: "Learning"` in `@copilotkit/web-inspector` 1.70.1 (installed, not
declared) and in 1.73.0 (latest on npm, read from the tarball). The React
`/agno/inspector` page still uses the old names while `/deepagents/inspector`
has switched (checked 2026-09-22), so the rename is also applied unevenly.

*Updated 2026-09-23.* The Intelligence overview was rewritten and no longer
says "Go to **Automatic Learning**"; only
[Automatic Learning](https://docs.copilotkit.ai/angular/agno/learning) still
does. Quickstart and landing page still say "Open **Rich Threads**". On the
package side the rename has now shipped, but not to Angular:
`@copilotkit/web-inspector` 1.73.3 (latest on npm, read from the tarball)
labels the tabs `Rich Threads` and `Automatic Learning`, while
`@copilotkit/angular` 0.5.2 (latest, installed, declared `^0.5.2`)
exact-pins `@copilotkit/web-inspector` **1.70.2**, whose installed bundle still
says `label: "Threads"` / `label: "Learning"`. An Angular reader on the newest
packages the quickstart installs therefore still sees the old names, and
cannot reach the new ones by upgrading.

### Findings from the 2026-09-23 sync

Sixteen tracked pages changed and one was removed. Most of the prose change
is renaming ("managed" is now "cloud-hosted", "durable threads" is now
"threads", "What is this?" headings became "Overview") and none of it is quoted
by harness code, so no route changed. The Inspector step "Open **Rich
Threads**" was already in the quickstart before this sync; the recorder quotes
only the quickstart's first two Inspector steps
(`autorecorder/actions/inspector.action.ts`), so there was nothing to re-quote.

The same day this repo upgraded to `@copilotkit/angular` **0.5.2** and
`@copilotkit/runtime` **1.73.3** (declared `^0.5.2` / `^1.73.3`, installed
0.5.2 / 1.73.3, with `@copilotkit/core`, `shared` and `web-inspector` at
1.70.2 because `@copilotkit/angular` 0.5.2 exact-pins them). Every entry below
is pinned to those versions.

**38. Connect your runtime was removed with no redirect**

[`/angular/agno/intelligence/connect-your-runtime`](https://docs.copilotkit.ai/angular/agno/intelligence/connect-your-runtime)
returns **404** as a page and as `.md` (checked 2026-09-23), and it is gone from
the sitemap. Its content, the `CopilotKitIntelligence` client passed to
`CopilotRuntime`, now lives in
[Intelligence quickstart](https://docs.copilotkit.ai/angular/agno/intelligence/quickstart)
step "Connect your runtime", which serves 200. No redirect was left and no note
says the page moved, which is the same pattern as #21, where this page had
already moved once (from `premium/`). No tracked page links to the old URL any
more, so the drift gate's dead-link scan does not catch it; only its
"removed or renamed" check does, and that exited **2** on this page until it
was retired.

Retired here: removed from `doc-snapshot/manifest.json` and
`frontend/scripts/sync-docs.ts`, and its snapshot file deleted. The code in
`frontend/server.ts` is unchanged; its comment still cites the removed page as
the source, with a note that it was merged into the Intelligence quickstart,
because that is where the code was copied from.

**39. Learned skills' "Reuse an Intelligence SDK client" sets `apiUrl` without `wsUrl`**

[Learned skills](https://docs.copilotkit.ai/angular/agno/intelligence/learned-skills)
gained a section "Reuse an Intelligence SDK client", for a server that "already
creates an Intelligence client". Its sample:

```typescript
const intelligence = new CopilotKitIntelligence({
  apiKey: process.env.CPK_INTELLIGENCE_API_KEY!,
  apiUrl: process.env.INTELLIGENCE_API_URL,
});
```

Two other pages say this is the wrong way to override the host.
[Runtime endpoints](https://docs.copilotkit.ai/angular/agno/backend/runtime-endpoints)
says to "override **both together** — setting one alone points the two planes
at different deployments, which logs a warning", and the Intelligence
quickstart says "Set both, or set neither". The same page's environment block
marks `INTELLIGENCE_API_URL` as "Self-hosted deployments only", which is
exactly when the sample goes wrong. `@copilotkit/runtime` 1.73.3 (installed)
does what the other pages say: `warnOnPartialHostOverride` in
`dist/v2/runtime/intelligence-platform/client.mjs` logs that `wsUrl` "falls
back to the managed default" whenever `apiUrl` is set alone. The skill
registry itself uses only REST, but the section's premise is a client your
server already has, and that client is the one passed to `CopilotRuntime`,
whose realtime connection would go to the cloud-hosted gateway while the API
calls go to the self-hosted one. The sample compiles verbatim on 1.73.3. The
warning comes from reading the installed code; it was not triggered here,
since this repo sets no `INTELLIGENCE_API_URL`.

**40. The placeholder revision pin is now live code in every example**

Before 2026-09-23, Learned skills' one BuiltInAgent example carried
`// revision: "exact-revision-id", // Optional: pin a published revision.` as a
comment. Now all eight code examples (TypeScript, Python and .NET) set it
uncommented, for example `revision: "exact-revision-id", // Optional: pin a
published revision.`. The new prose says to replace it with a published
revision ID or remove it.

Copied as published, every example therefore pins a revision that cannot
exist. By the page's own rules this is worse than it looks:

- "An explicit code value overrides its environment variable", so a reader
  who sets `CPK_INTELLIGENCE_SKILLS_REVISION`, or leaves it unset to follow the
  latest published skills as the page and
  [Automatic Learning](https://docs.copilotkit.ai/angular/agno/learning)
  recommend, is overridden by the placeholder.
- "Model work cannot start until a verified snapshot exists", so an
  unresolvable pin blocks the agent's model work rather than just skipping
  skills.
- "Make sure delivery works" begins by telling the reader to remove the
  `revision` they were just shown.

On `@copilotkit/runtime` 1.73.3 the BuiltInAgent sample compiles verbatim, and
`getLearnedSkillsSnapshot` sends the string unchanged as `?revision=exact-revision-id`.
What the platform answers was not checked: this repo has no Learning
container and no Agno adapter (#26).

**41. The sitemap now lists shared Angular pages only once, without the framework**

Since 2026-09-23, `sitemap.xml` lists the guides that every Angular framework
shares once, framework-less, as `/angular/X`, and keeps only four
framework-specific URLs under `/angular/agno`. The framework-scoped copies
still serve 200 and still sit in the `/angular/agno` sidebar, so the sitemap no
longer lists the URLs a reader of this section actually lands on. This
continues #22, where the section's sitemap had already shrunk to 4 URLs and 41
tracked pages were missing from it.

Two results for this repo:

- `ci/check-doc-drift.mjs` now maps each shared `/angular/X` sitemap entry onto
  `/angular/agno/X`. Without that, every shared page read as "no longer
  listed", and pages added upstream went unseen. With it, 18 pages appeared
  that this repo had never tracked: `advanced-configuration`,
  `agentic-protocols/{a2a,ag-ui-middleware,index}`, `backend/message-history`,
  `concepts/{generative-ui-overview,oss-vs-enterprise}`,
  `contributing/docs-contributions`, `deploy/{aws-lambda,langsmith}`,
  `intelligence/{analytics,channels,plans}`, `mcp-servers`, `model-selection`,
  `multi-agent/subagents`, `server-tools` and `webmcp`. They are acknowledged
  in `sitemap.knownUnmapped` as reference-only pages, not recorded.
- The mapping is an assumption the sitemap no longer supports: a shared page
  listed at `/angular/X` does not promise that `/angular/agno/X` serves.
  `advanced-configuration` is the counterexample: listed at
  `/angular/advanced-configuration` (200), 404 at `/angular/agno/advanced-configuration`,
  which is the URL Custom agent links to (#23).
  Five tracked pages (`cli`, `build-with-agents`, `agentic-protocols`,
  `contributing/code-contributions/package-linking`, `vs-code-extension`) are
  still reported as "not in sitemap" after the mapping, yet all of them hash
  normally at their framework-scoped URLs.

---
