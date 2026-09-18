# Doc drift changelog

What the CopilotKit docs changed under this repo, written by whichever sync
ran — the `/doc-sync` page or `npm run drift:sync`. Only pages that actually
moved are recorded — a sync that finds everything unchanged writes nothing
here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-09-18

### 07:46 UTC — 15 pages, highest severity high · _npm run drift:sync_

**Medium — /angular/agno/intelligence/threads-explained**

`/angular/agno/intelligence/threads-explained` · `angular__agno__intelligence__threads-explained.md`

Headings / Structure changed. Hash 012a8452 ➔ b2647c72.

````diff
- Threads are a platform-level concept, not tied to any specific agent framework. Whether your backend uses LangGraph, Mastra, CrewAI, or any other framework, threads work the same way.
- ## Key concepts
- ### Thread vs. Run
- A **thread** is the durable container. A **run** is a single agent execution within that thread. One thread can have many runs. Each time the user sends a message and the agent responds, that is a new run, and the thread accumulates events across all of its runs.
+ CopilotKit threads are a platform-level concept that works across agent frameworks.
+ ## How Rich Threads complement framework persistence
+ Starting fresh? CopilotKit Intelligence provides conversation persistence: it stores interaction events so users can reopen rich conversations across sessions and devices, reconnect to active runs, and manage their threads.
+ Already using framework persistence? Keep it configured. [LangGraph threads](https://docs.langchain.com/oss/python/langgraph/persistence) retain graph state and checkpoints; [Google ADK sessions](https://google.github.io/adk-docs/sessions/session/) retain conversation events and state. Intelligence adds the event history and synchronization used to restore the user's interactive conversation. Replaying that history is distinct from resuming framework execution from a checkpoint; framework-specific execution recovery remains with the framework.
  … region truncated
````

**High — /angular/agno/build-with-agents**

`/angular/agno/build-with-agents` · `angular__agno__build-with-agents.md`

Code block content changed. Hash 53faefc5 ➔ de942144.

````diff
- </Step>
- <Step>
- ### Add MCP Server to Cursor
- Copy CopilotKit MCP's configuration and paste it under the mcpServers key in the mcp.json file.
+ This screen opens the global `~/.cursor/mcp.json`, which registers the server for every
+ project you open. To register it for this project alone, create `.cursor/mcp.json` at
+ the project root instead and put the same configuration there.
+ </Step>
  … region truncated
````

**New — https://docs.copilotkit.ai/angular/agno/agentic-protocols/ag-ui**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/backend/agent-runner**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/backend/copilot-runtime**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/backend/runtime-endpoints**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/contributing/code-contributions/package-linking**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/deploy/agentcore**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/intelligence/learned-skills**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/intelligence/memories**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/intelligence/quickstart**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/learning**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/runtime-server-adapter**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/troubleshooting/debug-mode**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/troubleshooting/event-inspector**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

---

## 2026-09-17

### 07:24 UTC — 17 pages, highest severity high · _npm run drift:sync_

**Medium — /angular/agno**

`/angular/agno` · route `/` · `angular__agno.md`

Headings / Structure changed. Hash 506e08e9 ➔ 571db1cf.

````diff
+ ## Start with your coding agent
+ Use this prompt to connect your Angular app to Copilot Runtime with the selected agent backend, then verify a working conversation. You can also follow the manual steps below.
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
````

**Medium — /angular/agno/quickstart**

`/angular/agno/quickstart` · route `/quickstart` · `angular__agno__quickstart.md`

Headings / Structure changed. Hash 506e08e9 ➔ 571db1cf.

````diff
+ ## Start with your coding agent
+ Use this prompt to connect your Angular app to Copilot Runtime with the selected agent backend, then verify a working conversation. You can also follow the manual steps below.
+ Ask your coding agent to follow the setup steps on this page for your selected framework and frontend.
````

**High — /angular/agno/intelligence/connect-your-runtime**

`/angular/agno/intelligence/connect-your-runtime` · `angular__agno__intelligence__connect-your-runtime.md`

Code block content changed. Hash 2733d10e ➔ 56b22eb3.

````diff
- ```ts title="app/api/copilotkit/[[...slug]]/route.ts"
- import {
- CopilotRuntime,
- CopilotKitIntelligence,
+ ```ts title="app/api/copilotkit/[[...slug]]/route.ts" doctest="component"
+ import {
+ BuiltInAgent,
+ CopilotRuntime,
  … region truncated
````

**Medium — /angular/agno/telemetry**

`/angular/agno/telemetry` · `angular__agno__telemetry.md`

Headings / Structure changed. Hash c744bc62 ➔ 74d5a6f9.

````diff
- supplies the fallback identity and Runtime sends identified events without
- sampling. Runtime samples events identified by an explicit `telemetryId`
- or `CPK_TELEMETRY_ID` at the configured rate. With none of these identities,
- Runtime sends anonymous sampled telemetry.
+ supplies the fallback identity. With none of these identities, Runtime sends
+ anonymous telemetry.
+ The Inspector stores a random browser ID in local storage and sends it directly
+ with feature-use events. CopilotKit signup links can carry that ID so we can
  … region truncated
````

**New — https://docs.copilotkit.ai/angular/agno/agentic-protocols/ag-ui**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/backend/agent-runner**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/backend/copilot-runtime**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/backend/runtime-endpoints**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/contributing/code-contributions/package-linking**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/deploy/agentcore**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/intelligence/learned-skills**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/intelligence/memories**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/intelligence/quickstart**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/learning**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/runtime-server-adapter**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/troubleshooting/debug-mode**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

**New — https://docs.copilotkit.ai/angular/agno/troubleshooting/event-inspector**

Listed upstream, tracked nowhere in this repo. Not snapshotted by this run.

---

---

## 2026-08-30

### 13:42 UTC — 5 pages, highest severity high

**Low — Angular**

`/angular/agno` · route `/` · under “Getting started”

0 code lines, 2 prose lines changed.

````diff
          ### Open Inspector and confirm setup
  
- Angular does not mount Inspector by default. First follow [Inspector for Angular](/angular/agno/inspector). Then, on localhost, click the Inspector button.
+ On localhost, click the Inspector button in the corner of the app.
  
````

**Low — Angular**

`/angular/agno/quickstart` · route `/quickstart` · under “Getting started”

0 code lines, 2 prose lines changed.

````diff
          ### Open Inspector and confirm setup
  
- Angular does not mount Inspector by default. First follow [Inspector for Angular](/angular/agno/inspector). Then, on localhost, click the Inspector button.
+ On localhost, click the Inspector button in the corner of the app.
  
````

**High — CopilotKit CLI**

`/angular/agno/cli` · under “Verify your setup”

6 code lines, 49 prose lines changed.

````diff
  
  For the full adoption flow, see [Import & Synchronize Thread History](/angular/agno/guides/threads-memory-attachments-headless). Source-specific setup lives in [Synchronize ADK threads](/angular/google-adk/threads-import) and [Synchronize LangGraph threads](/angular/langgraph-python/threads-import).
+ 
+ ## Verify your setup
+ 
+ `verify` answers the question every integration reaches: *is this actually
+ working?* It checks the wiring from outside the browser, so it is the proof to
+ reach for on a surface that has no browser at all — React Native, or a runtime
+ on a remote host.
+ 
+ ```bash
+ npx copilotkit@latest verify
+ ```
+ 
+ It checks that a hosted project is selected, that a project API key
+ authenticates, that the runtime responds, and that the runtime declares at least
+ one agent — then reports the runtime version, the agent framework, gateway
+ wiring, and license state.
+ 
+ <Callout type="warn" title="Read the individual checks, not the summary">
+   Every check reports **PASS**, **FAIL**, or **UNKNOWN**. `UNKNOWN` means the
+   check could not run. It never means the check passed.
+ </Callout>
+ 
+ To prove the agent actually *runs* rather than that it is *configured*, add
+ `--round-trip`. It sends one real request through the runtime and reads the
+ answer back off the thread:
+ 
+ ```bash
+ npx copilotkit@latest verify --round-trip
+ ```
+ 
+ <Callout type="warn" title="What --round-trip does not prove">
+   It sends a **fixed** prompt and records the answer's character count and any
+   tool-call names — **never the answer's text**. It proves an answer came back;
+   it can never tell you what the answer said, so it is no substitute for
+   checking a response against the data your project actually holds.
+ 
+   It also proves an agent answered under the *declared id*, not **which
+   deployment** answered — a runtime pointed at another project's agent responds
+   identically.
+ 
+   Because it runs the agent, it costs a model call and records a thread. That is
+   why it is opt-in rather than the default.
+ </Callout>
+ 
+ | Option | What it does |
+ |---|---|
+ | `--runtime-url <url>` | The runtime endpoint to probe. Default `http://localhost:3000/api/copilotkit` — pass this whenever your runtime is elsewhere. |
+ | `--round-trip` | Also run the agent and read its answer back. |
+ | `--agent <id>` | Which declared agent to run, when the runtime declares several. |
+ | `--expect-runtime <mode>` | `intelligence` (default) or `oss`. With `oss`, hosted-project and credential checks do not apply. |
+ | `--timeout <seconds>` | How long to wait for the answer. Default `90`. |
+ | `--header "<name>: <value>"` | Extra request header, repeatable. Use it when your `identifyUser` reads a session the CLI does not carry. |
+ | `--json` | Emit a machine-readable payload alone on stdout. |
+ 
+ `verify` exits non-zero unless every check passed, so it works as a CI gate.
  
````

**Low — Threads & Persistence Architecture**

`/angular/agno/premium/threads-explained` · under “Threads & Persistence Architecture”

0 code lines, 6 prose lines changed.

````diff
  > Architecture and mental model behind CopilotKit threads: how persistent conversations work, how reconnection replays history, and what to expect from thread lifecycle operations.
  
- <OpsPlatformCTA
-   variant="inline"
-   title="Want to see threads in your own app?"
-   body="Persistent threads ship with CopilotKit Intelligence on the free Developer tier."
+ <IntelligenceOnboardingPrompt
+   feature="threads"
    surface="docs_learn_threads"
````

**High — Inspector**

`/angular/agno/inspector` · under “Production and server rendering”

75 code lines, 82 prose lines changed.

````diff
  # Inspector
- 
- > Mount the CopilotKit Inspector in an Angular application and keep it out of production builds.
- 
- The Inspector is a debugging overlay for the live connection between your Angular
- application and your agents. It opens from a floating launcher and reports what
- the application and the runtime exchange as a run happens.
- 
- Its navigation has three groups — **Threads**, **Agents**, and **Learning** — and
- opens on Threads, whose contents depend on the runtime's license state. The
- agent-debugging views sit under Agents:
- 
- | View                 | What it shows                                                        |
- | -------------------- | -------------------------------------------------------------------- |
- | **AG-UI Events**     | The raw event stream between your application and the agent.          |
- | **Available Agents** | The agents the runtime advertises to your application.                |
- | **Agent State**      | The selected agent's state as it updates.                             |
- | **Frontend Tools**   | The tools you registered, with their parameter schemas.               |
- | **Context**          | The context you sent to the agent, including readables and documents. |
- 
- ## Mount the element
- 
- The Inspector is `cpk-web-inspector`, a framework-agnostic web component in
- `@copilotkit/web-inspector`. `@copilotkit/angular` does not depend on that
- package and does not mount the element, so an Angular application creates it and
- supplies the core itself.
- 
- Install the package as a dev dependency to keep it out of your production
- dependency graph:
- 
- ```bash
- npm install --save-dev @copilotkit/web-inspector
- ```
- 
- Add a component that owns the element's lifecycle. It reuses an existing element
- or creates one after the first browser render, supplies the core, appends the
- element to `document.body`, and removes it when the component is destroyed:
- 
- ```ts title="src/app/web-inspector.ts"
- import { afterNextRender, Component, DestroyRef, inject } from "@angular/core";
- import { CopilotKit } from "@copilotkit/angular";
- import { WEB_INSPECTOR_TAG } from "@copilotkit/web-inspector";
- import type { WebInspectorElement } from "@copilotkit/web-inspector";
- 
- @Component({
-   selector: "app-web-inspector",
-   template: "",
- })
- export class WebInspector {
-   readonly #copilotKit = inject(CopilotKit);
-   readonly #destroyRef = inject(DestroyRef);
  
-   constructor() {
-     afterNextRender(() => {
-       const existing =
-         document.querySelector<WebInspectorElement>(WEB_INSPECTOR_TAG);
-       const inspector =
-         existing ??
-         (document.createElement(WEB_INSPECTOR_TAG) as WebInspectorElement);
+ > The Inspector mounts itself in Angular applications. What changed, and what to remove if you mounted it by hand.
  
-       // Supply the application's core instead of letting the element find one.
-       inspector.core = this.#copilotKit.core;
-       inspector.setAttribute("auto-attach-core", "false");
+ `@copilotkit/angular` mounts the Inspector for you. It depends on
+ `@copilotkit/web-inspector` directly, so there is nothing to install and no
+ version to pin — the `CopilotKit` service creates `cpk-web-inspector`, supplies
+ your application's core, and appends it to `document.body` after the first
+ browser render.
  
-       if (!existing) {
-         document.body.appendChild(inspector);
-       }
+ **[Inspector](/angular/agno/inspector)** is the page to read for what the panes show and how
+ `enableInspector` controls visibility. Angular sets it through
+ `provideCopilotKit`:
  
-       this.#destroyRef.onDestroy(() => {
-         if (inspector.isConnected) {
-           inspector.remove();
-         }
-       });
-     });
-   }
- }
+ ```ts title="src/app/app.config.ts"
+ provideCopilotKit({
+   runtimeUrl: "http://localhost:8200/api/copilotkit",
+   enableInspector: false, // hide it during development
+ });
  ```
- 
- Render the component once, from the root component, behind a development-only
- `@defer`:
- 
- ```ts title="src/app/app.ts"
- import { Component, isDevMode } from "@angular/core";
- import { WebInspector } from "./web-inspector";
  
- @Component({
-   selector: "app-root",
-   imports: [WebInspector],
-   template: `
-     <!-- your application -->
+ <Callout type="warn" title="Remove a hand-written mount before upgrading">
+   `@copilotkit/angular` did not mount the Inspector before **0.4.0**, and this
+   page previously described a `WebInspector` component that created the element
+   by hand. If your application still has that component, delete it — along with
+   its `<app-web-inspector />` usage and any direct `@copilotkit/web-inspector`
+   dependency in `package.json`.
  
-     @defer (when isDev) {
-       <app-web-inspector />
-     }
-   `,
- })
- export class App {
-   protected readonly isDev = isDevMode();
- }
- ```
+   Leaving it in place is worse than redundant. The framework reuses an existing
+   `cpk-web-inspector` rather than creating a second one, but the hand-written
+   component's `DestroyRef.onDestroy` removes that element unconditionally — so
+   a route change that destroys the component tears out the Inspector the
+   framework is now driving, and it does not come back without a full reload.
+ </Callout>
  
- ## Supply the application's core
+ ## Production and server rendering
  
- `inspector.core = copilotKit.core` is what makes the Inspector report your
- application rather than show an empty panel. Without an assigned core, the
- element searches development globals such as `window.__COPILOTKIT_CORE__` for
- one. Setting `auto-attach-core="false"` disables that search, so the element
- observes the core you assigned and nothing else.
+ Nothing to do for either.
  
- Assign `core` directly. It is a property, not an attribute, and
- `auto-attach-core` is the only attribute the element observes.
+ The `@copilotkit/web-inspector` import is a dynamic `import()` inside the
+ service, so the bundler splits it into its own chunk and a production build
+ never requests it. Mounting runs in `afterNextRender` behind an
+ `isPlatformBrowser` check, so the element is never created during a server
+ render. Both matter, because the web component registers itself against
+ `customElements`, which does not exist on the server.
  
  }
  ```
- 
- ## Keep it out of production builds
- 
- The element has no production guard of its own, so exclude it in the same place
- you mount it. `@defer (when isDev)` compiles the component and its
- `@copilotkit/web-inspector` import into a lazy chunk, and `isDevMode()` returns
- `false` in a production build, so that chunk is never requested. Removing the
- component and its `<app-web-inspector />` usage removes the Inspector entirely.
- 
- ## Server rendering
- 
- `afterNextRender` runs only in the browser, so the element is never created
- during a server render. The deferred import also keeps the package out of the
- server bundle. Both matter: the web component registers itself against
- `customElements`, which does not exist on the server.
- 
- ## Clean up on destroy
- 
- The element lives in `document.body`, outside the component's own view, so
- Angular does not remove it. `DestroyRef.onDestroy` removes it explicitly.
- Without that cleanup, a route change that destroys the component leaves an
- orphaned panel bound to a core the application no longer uses.
  
  ## Next steps
  
+ - [Inspector](/angular/agno/inspector)
  - [Troubleshooting Angular apps](/angular/agno/guides/troubleshooting)
````

---
