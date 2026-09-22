# CopilotKit + Agno Test Suite — Angular

A navigable, working test harness for the Angular section of the CopilotKit Agno documentation — each guide is a route that actually runs the thing it describes.

| | |
|---|---|
| **Doc sync date** | 2026-08-12 (docs last fetched live) |
| **CopilotKit packages** | `@copilotkit/angular` 0.5.1 · `@copilotkit/runtime` 1.70.1 |
| **AG-UI packages** | `@ag-ui/agno` 0.0.5 |
| **Frontend** | Angular 22.1.1 · TypeScript 6.0 · Tailwind 4 · zoneless |
| **Runtime** | Node 24.16.0 · Copilot Runtime v2 Node listener on :8200 |
| **Backend** | Python 3.13.13 · Agno 2.8.7 · FastAPI/AgentOS on :8000 |
| **Build status** | No CI. Locally verified: `ng build` ✅ · 14 doc routes + 12 demo routes serve 200 ✅ · live agent run with tool call ✅ · human-in-the-loop pause ✅ · shared-state snapshot ✅ · A2UI **not** observed over the wire ⚠️ (see Known issues) |

---

## 2. Overview

[Agno](https://docs.agno.com) is a Python agent framework. Its `AgentOS` server can expose an agent over [AG-UI](https://ag-ui.com), the event protocol CopilotKit speaks. `@copilotkit/angular` is the first-party, signal-based Angular frontend for AG-UI agents, and it supports zoneless applications.

This repo is a **living test harness** for that pairing. Each route implements what its guide teaches — not a restatement of it. Every line of CopilotKit code in `frontend/src/app/features/` is taken from the live docs; where a doc snippet is not self-contained, it is displayed on the route page as a quoted sample and explicitly *not* mounted, rather than being completed with invented code.

Tracks: **<https://docs.copilotkit.ai/angular/agno>**

Scope is the eight pages named at build time: the quickstart plus the seven task guides. The last guide covers four topics at once and is split into four routes here.

---

## 3. Architecture

```
Browser (Angular 22, zoneless)
  │  @copilotkit/angular — provideCopilotKit, <copilot-chat>, signal APIs
  │  POST http://localhost:8200/api/copilotkit
  ▼
Copilot Runtime  ·  localhost:8200        ← Node, frontend/server.ts
  │  agents: { default, support } → new AgnoAgent({ url })
  │  a2ui: {}  → A2UIMiddleware
  │  POST http://localhost:8000/agui      ← AG-UI over SSE
  ▼
Agno AgentOS  ·  localhost:8000           ← Python / FastAPI
  │  AgentOS(agents=[agent], interfaces=[AGUI(agent=agent)])
  ▼
OpenAI  (gpt-4o)
```

Three points worth noting:

- **Three processes, not two.** Unlike the React/Next quickstart — where the runtime lives inside the Next app as an API route — Angular has no server route to host it, so the Copilot Runtime is its own Node process. This is the single biggest structural difference from the React version of this harness.
- **The backend for this framework is Python.** Agno is a Python library; the agent runs under `uvicorn`, not Node.
- **The model key never reaches the browser**, and never reaches the runtime either. Only the Agno process holds it.

**Why two agent ids.** `default` and `support` both resolve to the same Agno process. `default` is the id CopilotKit's prebuilt components use with no configuration; `support` exists so that the Chat UI and Threads guides' snippets — which are written as `agentId="support"` — run exactly as published instead of needing an edit.

---

## 4. Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 22+ (built on 24.16.0) | The Angular quickstart specifies Node 22. |
| npm | 10+ (built on 12.0.1) | Or pnpm/yarn. |
| Angular CLI | 20, 21, or 22 (built on 22.1.3) | `@copilotkit/angular` supports these three majors only. |
| Python | 3.13+ (built on 3.13.13) | Per `backend/.python-version`. |
| [`uv`](https://docs.astral.sh/uv/) | 0.11+ (built on 0.11.20) | Used for the backend. `pip` works too. |
| OpenAI API key | — | Required. |
| CopilotKit license key | — | **Optional.** Only affects the Threads and Memory routes. |

`@angular/cdk` must share your Angular major version. If you hit a peer-dependency error, pin it explicitly (`@angular/cdk@^22` on Angular 22).

---

## 5. Setup

**1. Clone**

```bash
git clone <this-repo> agno && cd agno
```

**2. Install frontend deps**

```bash
cd frontend && npm install && cd ..
```

**3. Install backend deps**

```bash
cd backend && uv sync && cd ..
```

**4. Configure the environment**

```bash
cp .env.example backend/.env
```

Then edit `backend/.env`:

| Variable | Where | What it does |
|---|---|---|
| `OPENAI_API_KEY` | `backend/.env` | **Required.** The model key. |
| `AGNO_AGENT_URL` | shell for the runtime | Where the runtime finds the agent. Defaults to `http://localhost:8000/agui`. |
| `PORT` | shell for the runtime | Runtime port. Defaults to `8200`. |
| `COPILOTKIT_TELEMETRY_DISABLED` | shell for the runtime | Opt out of anonymous runtime telemetry. |

> The Angular app's `runtimeUrl` is hardcoded to `http://localhost:8200/api/copilotkit` in `frontend/src/app/app.config.ts`, following the quickstart. If you change `PORT`, change that too.

**5. Update to latest packages (optional)**

Check before you bump. The report is read-only and sorts what is outdated into
the only three things it can be, of which just one is actionable:

```bash
node ci/check-versions.mjs
```

| Cause | Do |
|---|---|
| Our range is behind | Bump it, on a branch — below |
| An upstream package **exact-pins** an older version | Nothing. Report it upstream |
| A **peerDependency** forbids the newer one | Nothing. Bumping breaks the build |

`@copilotkit/angular` exact-pins `@copilotkit/core@1.66.0`, and Angular 22
requires `typescript >=6.0 <6.1` — so TypeScript reads a full major behind and
must stay there. The nightly publishes this report on its own; see
[`ci/VERSION-WATCH.md`](ci/VERSION-WATCH.md).

**Frontend:**
```bash
git checkout -b chore/bump-<package>
npm --prefix frontend install <package>@<version>
git diff frontend/package-lock.json   # one bump can drag in dozens of transitives
npm --prefix frontend run build
```

Then record the affected pages before merging — verifying the docs still run is
what this repo is for. Revert with
`git checkout frontend/package-lock.json && npm ci`.

Note that `@ag-ui/agno` is declared `^0.0.5`, and a caret on a `0.0.x` package
allows *only* that version. It cannot move on its own; it needs the hand edit
above.

**Backend:**
```bash
cd backend
uv lock --upgrade
uv sync
cd ..
```

Not `npx npm-check-updates -u`: it rewrites `package.json` to the newest release
of everything, ignoring the declared ranges, and walks straight into the peer
conflict above. Not `npm install --legacy-peer-deps` either — it does not fix a
peer conflict, it hides one, silencing the exact signal this harness reports on.
Dependabot is the safe alternative if PR-based automation is wanted.

**Default ports:** frontend **4200**, runtime **8200**, agent **8000**.

---

## 6. Running the project

Three processes. The two Node ones share a terminal; the Python agent gets its own.

**Terminal 1 — the agent:**

```bash
cd backend
uv run main.py
```

Success looks like:

```
INFO:     Uvicorn running on http://localhost:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

**Terminal 2 — the runtime and the app together:**

```bash
cd frontend
npm run dev
```

`dev` runs the Copilot Runtime and `ng serve` side by side under `concurrently`, with each line prefixed by which process wrote it. Success looks like:

```
[runtime] Copilot Runtime listening at http://localhost:8200/api/copilotkit
[runtime] Agno agent: http://localhost:8000/agui
[angular]   ➜  Local:   http://localhost:4200/
```

Ctrl-C stops both. `--kill-others` means a crash in either one takes the other down rather than leaving half a stack running — if the runtime dies you'll see `Sending SIGTERM to other processes..` and the app exits too, instead of a chat that silently can't reach anything.

To run them separately — different terminals, independent restarts — the underlying scripts are still there:

```bash
npm run runtime   # Copilot Runtime only, :8200
npm start         # Angular dev server only, :4200
```

Open **<http://localhost:4200>**. The Introduction route probes both backends and shows a connection panel — check it first if anything misbehaves.

The one-command check the quickstart prescribes:

```bash
curl -s http://localhost:8200/api/copilotkit/info
```

It should list `default` and `support` under `agents`.

The CLI check the [CLI page](https://docs.copilotkit.ai/angular/agno/cli) added on 30 Aug, wired to this repo's port:

```bash
npm run verify              # wiring only
npm run verify:round-trip   # also runs the agent once — costs a model call
```

With the runtime up and no license key, the honest result here is **2 passed, 2 failed, 3 could not be checked** — the two failures are the hosted-project and API-key checks, which no unlicensed local setup can pass. See Known issues #12 before treating `verify` as a CI gate.

---

## 7. What to expect — walkthrough per section

Every route shows a status badge and a link to the doc page it tests.

### How each route is split

Routes with a live feature are split in two, following the reference harness:

| | |
|---|---|
| **`<route>`** | Notes, pass/fail criteria, and **the exact source** of the implementation. No live chat here. |
| **`<route>/demo`** | Just the running feature, with no sidebar or page chrome — built for screen recording. Reached via **Open demo ↗** in the route header. |

Two consequences worth knowing:

- **The code on a page is never a re-typed approximation.** `scripts/generate-sources.ts` reads the real files off disk at build time into `src/app/lib/generated-sources.ts`, so what you compare against the doc is what actually runs. Angular's esbuild pipeline has no `?raw` import, which is why this is a prestart/prebuild step rather than an import.
- **Demo routes share the app-root provider**, so a conversation started in one demo continues in another. That's deliberate — Quickstart, Frontend tools, A2UI, and Headless all drive the `default` agent and show the *same* conversation through four different interfaces.

### Getting Started

**`/` — Introduction**
Orientation plus a live connection check of both backends. **Pass:** two green dots, `200` from the runtime's `/info` and the agent's `/status`. **Fail:** a red dot — that process isn't running.

**`/quickstart` — Quickstart**
The minimum viable path: an `AgnoAgent` in the runtime, `provideCopilotKit`, one `<copilot-chat>`. **Try:** `Can you tell me a joke?` **Pass:** tokens stream in one at a time and render as markdown. **Fail:** nothing streams.

### Guides

**`/chat-ui` — Chat UI and customization**
Three surfaces in tabs — only one mounts at a time, since the popup and docked sidebar both use fixed positioning. **Try:** `What is CopilotKit?`, then switch tabs. **Pass:** the inline chat shows the guide's blue user bubbles and pale-blue assistant bubbles; the custom-message tab renders replies through a hand-written component labelled "Assistant"; the popup and sidebar open, trap focus, and close on Escape. **Fail:** a surface renders blank, or all tabs look identical.

**`/frontend-tools-generative-ui` — Frontend tools and generative UI**
A server-side tool call rendered by an Angular component. **Try:** `What's the weather in Tokyo?` **Pass:** the call renders through `WeatherCardComponent` — "Loading weather for Tokyo", then the city in bold with the result beneath. **Fail:** a plain-text answer with no card, meaning the renderer name and the agent's tool name have drifted apart. **Also:** the guide now leads with a third path, `registerComponent` (display-only, no handler, nothing on the agent side). **Try:** `Show me incident INC-4711, severity sev1.` **Pass:** the card renders — and the agent then apologises for it in the next message, which is the finding. The route is ⚠️ Partial. See Known issues #19.

**`/a2ui` — A2UI schemas, styling, and recovery**
Declarative generative UI. **Try:** `Show me a card comparing two flight options.` **Pass:** a rendered declarative surface appears in the chat. **Currently observed:** prose instead — see Known issues #2. **Fail (different failure):** raw JSON or protocol operations printed as text.

**`/voice-multimodal` — Voice and multimodal input**
**Try:** attach a PNG or PDF via the picker, drag-and-drop, and paste; then press the microphone. **Pass (attachments):** files are accepted and sent as content parts; a file over 10 MiB is rejected. **Pass (voice):** the browser asks for microphone permission and records. **Expected failure (voice):** transcription then fails — this runtime reports `audioFileTranscriptionEnabled: false`, and the guide is explicit that a visible microphone does not make an unavailable transcription service succeed.

**`/human-in-the-loop` — Human-in-the-loop and interrupts**
**Try:** `Delete my account, but ask me to approve it first.` **Pass:** an Approve / Reject card renders in the message stream and **nothing further streams until you click**. After clicking, the run resumes with your decision. **Fail:** two options as plain text, or the agent continues without waiting. The interrupt controller is also mounted but stays idle — this Agno agent emits no AG-UI interrupts.

**`/shared-state` — Shared state and agent context**
**Try:** press **Mark high priority**, then ask `What is my current priority?`; press **Use London time**, then ask `What timezone am I in, and which record am I looking at?` **Pass:** the agent reports `high`, then `Europe/London` and `record-42`; asking it to add a note updates the list on the left. **Fail:** the agent has no idea what you're referring to.

### Threads, memory, attachments, headless

These four routes all come from the single `threads-memory-attachments-headless` guide.

**`/threads` — Threads.** **Pass (unlicensed — the case here):** the headless list renders its controls with no threads, and the drawer renders its *locked* state. That locked state is the correct result: it proves the drawer mounted and read the platform's `threads` license feature. **Pass (licensed):** threads list and selecting a row replays that conversation. **Fail:** a blank area with no locked state.

**`/memory` — Memory.** **Pass (this runtime):** "Memory is not available for this runtime." — the `isAvailable()` gate resolved false and the guide's fallback rendered, which is the whole point of the sample. **Fail:** an empty panel with neither list nor fallback, or a thrown error.

**`/attachments` — Attachments.** **Try:** add a file via picker, drag-and-drop, and paste. **Pass:** all three paths work, a file over 10 MiB is rejected, and a failed upload logs its `reason` and `message` through `onUploadFailed`. **Fail:** drag-and-drop or paste does nothing.

**`/headless` — Headless UI.** **Try:** type into the bare textarea and press Send. **Pass:** the message appears in the hand-written transcript, "Agent is working…" shows during the run, and the reply streams — with no CopilotKit chrome anywhere. A conversation started on Quickstart is already visible here. **Fail:** Send does nothing.

### Inspector

**`/inspector` — Inspector.** **Try:** open the demo and look at the bottom-left corner, then open **Agents → Agent** and send a message with **AG-UI Events** open. **Pass:** the badge reads `cpk-web-inspector mounted`, the launcher sits bottom-left (the page's CSS override), the agent is listed, and events move while the reply streams. **Fail:** no launcher, or the badge stays on `no cpk-web-inspector`. Nothing in the demo component mounts the element — that is the claim under test.

**`/status`** — Every route and its status in one table.

---

## 8. Testing checklist / current status

Verified 2026-08-12 against a live stack (real OpenAI key, no license key).

| Doc page | Route | Status | Notes |
|---|---|---|---|
| `/angular/agno` | `/` | 📖 Reference | Landing page + live probe of both backends. |
| `/angular/agno/quickstart` | `/quickstart` | ✅ Working | Verified end-to-end: streamed reply from gpt-4o. |
| `/angular/agno/guides/chat-ui` | `/chat-ui` | ✅ Working | All four surfaces; three mounted, `CopilotChatView` referenced only. |
| `/angular/agno/guides/frontend-tools-generative-ui` | `/frontend-tools-generative-ui` | ⚠️ Partial | `registerRenderToolCall` verified over the wire: `getWeather` called with `{"city":"Tokyo"}`. The guide’s new first section, `registerComponent`, is mounted and runs on `^0.5.1`, and its published snippet is wrong four ways — Known issues #19. `registerFrontendTool` samples shown, not mounted — see Known issues #4. |
| `/angular/agno/guides/a2ui` | `/a2ui` | ⚠️ Partial | Inert without a frontend catalog — that, not the runtime middleware, is the switch. See Known issues #2. |
| `/angular/agno/guides/voice-multimodal` | `/voice-multimodal` | ⚠️ Partial | Attachments work. Transcription unavailable by design — `audioFileTranscriptionEnabled: false`. |
| `/angular/agno/guides/human-in-the-loop` | `/human-in-the-loop` | ⚠️ Partial | Works when the model chooses to ask: `requestApproval` emitted with **no** tool result, run pauses awaiting the browser. The model often answers without asking — Known issues #28. Interrupt half idle — agent emits none. |
| `/angular/agno/guides/shared-state` | `/shared-state` | ✅ Working | Round-trip verified across two written values, with a harness-only diagnostics strip logging every `store().state()` transition. Agent state starts `{}` and loses `notes` on first write — Known issues #16. |
| `/angular/agno/guides/threads-…-headless` | `/threads` | ⚠️ Partial | Premium. `/info` reports `threadEndpoints.mutations: false`. |
| `/angular/agno/guides/threads-…-headless` | `/memory` | ⚠️ Partial | Premium; runtime provides no memory routes, so the fallback renders. |
| `/angular/agno/guides/threads-…-headless` | `/attachments` | ✅ Working | Picker, drag-and-drop, paste. |
| `/angular/agno/guides/threads-…-headless` | `/headless` | ✅ Working | Shares the `default` conversation with the other demos. |
| `/angular/agno/inspector` | `/inspector` | ✅ Working | Verified live: element mounts, panel opens, System Health *Healthy*, `RUN_FINISHED` in Recent activity after a real run. Not reproducible on 0.3.1 — Known issues #12; launcher position caveat #15. The manifest carried no `routes` for this page until 2026-09-21, so `check-page-coverage` reported the live `/inspector` route as untracked and the page as unrouted. Both now point at each other. |
| `/angular/agno/cli` | — | 🚧 Not started | No route. The new `verify` section is exercised through `npm run verify` instead; findings in Known issues #12. |
| `/angular/agno/intelligence/memories` | `/memory` | ⚠️ Partial | The page's Angular path is `injectMemories()`, which `/memory` already mounts. Premium; recording stopped (`756ec4b`). |
| `/angular/agno/intelligence/learned-skills` | — | ❌ Broken | No Agno adapter, and every Python package it names is 404 on PyPI — Known issues #26. The 2026-09-21 sync added a BuiltInAgent row and two BuiltInAgent snippets: `learnedSkills` does not exist on `BuiltInAgent` in the declared `@copilotkit/runtime` 1.70.1, and the factory sample imports `ai` and `@ai-sdk/openai`, which the page never tells you to install (#33, #34). |
| `/angular/agno/learning` | — | ⚠️ Partial | `getLearningContainerId` typechecks on runtime 1.72.0; the snippet's `agents` and `identifyUser` are undefined — #27. Needs a dashboard-created container. The 2026-09-21 sync added the daily-schedule and skill-delivery steps; its adapter list contradicts the learned-skills table it links to (#34). |
| `/angular/agno/copilot-runtime` | — | 📖 Reference | Near-duplicate of `backend/copilot-runtime`. Both gained the same "Which name identifies an agent" section on 2026-09-21 (#29), and one more Next.js-titled snippet each (#24). |
| `/angular/agno/backend/copilot-runtime` | — | 📖 Reference | `server.ts` already follows it (`a2ui: {}`, `intelligence`, `identifyUser`), and registers two agent-map keys (`default`, `support`), which is what the new agent-naming section teaches. Its `CopilotKitAgentDiscoveryError` is not what the Angular surface throws (#29). The new `sseKeepAliveIntervalSeconds` option is absent from the declared runtime (#30). |
| `/angular/agno/backend/agent-runner` | — | 📖 Reference | All five TS snippets compile verbatim on 1.72.0; `runner` + `intelligence` is a type error and throws the quoted message, as documented. `server.ts` sets no runner, but it does pass `intelligence`, and a `CopilotIntelligenceRuntime` constructs an `IntelligenceAgentRunner` for you (read in 1.70.1's `runtime.mjs`), so the in-memory half of the unauthorized-thread-routes callout added on 2026-09-21 is not this harness. What applies here is its last sentence: `threads/events`, `threads/state` and `agent/stop` read the thread by id alone even on the platform, and `server.ts` guards none of them. Its cross-links point at an Auth section that does not exist (#31), and its 422 claim is reported under a different cause (#32). |
| `/angular/agno/backend/runtime-endpoints` | — | ⚠️ Partial | `/info` and `inspector-metadata` (200, `no-store, private`, V1 body) probed and match. `/run` on this Intelligence runtime returns JSON, not the SSE the table promises — #25. The new thread-routes table matches `RouteInfo` in 1.70.1 exactly; its `onBeforeHandler` sample uses two identifiers nothing in the section defines (#31, #32). |
| `/angular/agno/backend/ag-ui` | — | 📖 Reference | Tracked; no code to run. |
| `/angular/agno/backend/custom-agent` | — | 📖 Reference | Tracked. Links to a dead page — #23. Its factory-context interface was renamed to `BuiltInAgentFactoryContext` with a `learnedSkills` field on 2026-09-21; neither exists in the declared runtime range (#33). |
| `/angular/agno/backend/self-managed-agents` | — | 📖 Reference | Tracked. |
| `/angular/agno/agentic-protocols/ag-ui` | — | 📖 Reference | Concept page, no code. |
| `/angular/agno/runtime-server-adapter` | — | 📖 Reference | `server.ts` is its "Node.js HTTP" shape (`createCopilotNodeListener`). |
| `/angular/agno/deploy/agentcore` | — | 📖 Reference | AWS deployment; not testable locally. Links to a dead page — #23. |
| `/angular/agno/troubleshooting/debug-mode` | — | ⚠️ Partial | `debug` defaults table matches 1.72.0 exactly. On this Intelligence runtime `debug: true` logged only `Agent run started` — #25. |
| `/angular/agno/troubleshooting/event-inspector` | — | ⚠️ Partial | The claims probed on 2026-09-18 all held: root path 404s with `{"error":"Not found"}`, basePath answers `: connected`, and the stream stays empty on an Intelligence run, as its warning says. The 2026-09-21 rewrite replaced the gate it documents, and the declared runtime implements the old one, so the page's central safety claim is false here (#35). |
| `/angular/agno/telemetry` | — | 📖 Reference | No route. The 2026-09-21 change is two sentences of prose separating `CPK_INTELLIGENCE_API_KEY` from telemetry identity; consistent with `server.ts`, which uses that key for Intelligence only. |
| `/angular/agno/intelligence/overview` | — | 📖 Reference | No route. The 2026-09-21 change is one table cell (automatic learning now names BuiltInAgent and framework adapters). Nothing in the harness quotes it. |
| `/angular/agno/vs-code-extension` | — | 📖 Reference | Editor extension; tracked. |
| `/angular/agno/contributing/code-contributions/package-linking` | — | 📖 Reference | Contributor setup. |

**Legend:** ✅ Working · ⚠️ Partial (blocked by something outside this repo) · 📖 Reference · ❌ Broken · 🚧 Not started

**On the `[no-route]` lines `npm run drift` prints.** `ci/check-page-coverage.mjs`
reports every manifest page whose `routes` is empty, and 34 of the 45 tracked
pages are reference material with no browser surface: runtime and backend
configuration, deployment, contributor setup, editor tooling, premium platform
docs. Those are tested by compiling or probing what they publish and writing
the result here, not by standing up a UI for them, so the empty `routes` is the
decision rather than an oversight. The list is informational and the drift gate
still exits 0. A `[no-route]` line is worth acting on only when the page really
does have an implementation here, which was the case exactly once: `/inspector`
(see its row above).

---

## 9. Automated Screen Recording Pipeline

Screen recording lives in [`autorecorder/`](autorecorder/) — a portable
Playwright suite shared across the CopilotKit framework repos and adapted to this
one. It produces one 1080p `.webm` per doc page: read the doc, switch to a
simulated VS Code and show the code that implements it, switch back to the
browser and drive the live feature.

> The older [`autorecord/`](autorecord/) folder is the **legacy** recorder kept
> for reference only. It is not maintained; everything below refers to
> `autorecorder/`.

### Standard 3-step walkthrough per page
1. **Doc page** (`https://docs.copilotkit.ai/angular/agno/...`) — smooth scrolling
   at reading cadence, cursor resting on a code block.
2. **Project code** — a VS Code Dark+ simulator rendering this repo's own source
   from disk, Shiki-highlighted, with the page's line range selected. Multi-file
   pages switch tabs.
3. **Live demo** (`/<page>/demo`) — the chrome-free demo surface, driven with a
   visible cursor: prompts typed key by key, token-stream completion detection,
   tool cards, approval clicks, attachment uploads, tab switches, and a Windows 11
   Notepad window for pages whose finding is a limitation rather than a feature.

### One command, from a cold repo

[`ci/`](ci/README.md) drives the whole thing — doc-drift check, preflight,
dependency install, all three servers, recording, mux and report — from a single
Node process, and is what the nightly GitHub Actions workflow runs:

```bash
npm run automate                              # everything, all pages
npm run automate -- --pages=quickstart,threads
npm run automate -- --limit=3 --ignore-doc-drift
```

It starts the servers itself, so the section below applies only when you would
rather drive the recorder by hand against servers you started yourself.

### How to run

The backend (`:8000`), the Copilot Runtime (`:8200`) and the Angular dev server
(`:4200`) must all be up — the recorder refuses to start otherwise.

```bash
cd backend  && uv run main.py     # :8000
cd frontend && npm run dev        # runtime :8200 + ng serve :4200
```

Then:

```bash
cd autorecorder
npm install
npx playwright install chromium

npm run doctor              # is the configuration sane? exits non-zero if not
npm run doctor:online       # also probes every doc/demo URL and the selectors
npm run record -- --list    # what will be recorded
npm run record -- --quickstart   # one page
npm run record              # all 11, in nav order
npm run manifest            # record what the run produced (commit the result)
```

### Output

`autorecorder/videos/AGNO-angular-<NN>-<FeatureName>.webm`, 1920x1080.

`videos/` is **gitignored** — recordings are build output. What is committed is
`videos/manifest.json` and `videos/MANIFEST.md`, which record each clip's hash,
the source files it shows, and whether it has gone stale against them.

Three pages record a documented limitation rather than a working feature and say
so on screen: `a2ui` (the guide's catalog snippets are not self-contained),
`voice-multimodal` (no transcription service configured) and `threads` (licensed
endpoints, unlicensed runtime). See
[`autorecorder/README.md`](autorecorder/README.md) for the full scope table and
[`autorecorder/ADAPT.md`](autorecorder/ADAPT.md) for the porting contract.

---

## 10. Known issues / doc-vs-implementation discrepancies

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
`server.ts` still wires `CopilotKitIntelligence` per `connect-your-runtime`.

**23. Two in-section links 404**

- [AWS AgentCore](https://docs.copilotkit.ai/angular/agno/deploy/agentcore)
  links its "full-stack example" to `/angular/agno/agentcore/full-stack-example`.
- [Custom agent](https://docs.copilotkit.ai/angular/agno/backend/custom-agent)
  links "Advanced Configuration" to `/angular/agno/advanced-configuration`.

Both markdown endpoints return 404, per the drift checker's dead-link scan.

**24. Angular pages title their runtime code as a Next.js route file**

Twenty-one snippets across seven tracked Angular pages carry
`title="app/api/copilotkit/[[...slug]]/route.ts"` (or `.../route.ts`):
`backend/copilot-runtime` (6), `copilot-runtime` (5), `backend/runtime-endpoints` (3),
`backend/agent-runner` (3), `deploy/agentcore` (2), `troubleshooting/debug-mode`,
`intelligence/connect-your-runtime` (the untracked `intelligence/quickstart` has one more). An Angular app has
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

---

## 11. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Chat sends, nothing streams back | Runtime or Agno process down | Check the Introduction route's connection panel; `curl http://localhost:8200/api/copilotkit/info`. |
| `/info` returns nothing | Runtime not started | `npm run runtime` from `frontend/`. |
| A run starts, then hangs forever | The agent called a browser tool with no registered handler, so no result ever returns | Every tool the agent can call must have a matching `registerFrontendTool` / `registerHumanInTheLoop` mounted. |
| Tool runs but the custom card doesn't render | Renderer name ≠ tool name | `registerRenderToolCall({ name })` must equal the Agno tool name exactly, including case. |
| Chat renders unstyled | Missing stylesheet | `@import "@copilotkit/angular/styles.css";` must be in `src/styles.css`. |
| CORS errors from the browser | Runtime CORS off | Keep `cors: true` in `createCopilotNodeListener`. The Agno process separately allows `localhost:4200` via `cors_allowed_origins`. |
| Connection errors mentioning `localhost` | DNS resolving to IPv6 while the server binds IPv4 | Use `127.0.0.1` in `AGNO_AGENT_URL`. |
| Production build fails on size | CopilotKit pulls in markdown and syntax-highlighting deps | Already raised in `angular.json`; see Known issues #9. |
| Peer-dependency error on install | `@angular/cdk` major mismatch | Install the matching major, e.g. `@angular/cdk@^22` on Angular 22. |
| Thread list empty, drawer shows a lock | No license key | Expected — not a bug. |
| "Use London time" looks dead — nothing changes | It writes context, not agent state, so no state transition is logged | Expected. Watch the *Registered context* column of the diagnostics strip: the entry moves to the end of the list with the new value. Known issues #18. |
| Source panels say "Source not generated" | Generated map is stale | `npm run gen:sources` (runs automatically on `npm start` / `npm run build`). |
| No Inspector launcher on `/inspector/demo` | `@copilotkit/angular` older than 0.4.0, or `enableInspector: false` | Bump to `^0.4.0`; the option lives on `provideCopilotKit` in `src/app/app.config.ts`. |
| Inspector disappears after navigating | A hand-written `WebInspector` component still in the app | Delete it — its `DestroyRef.onDestroy` removes the element the framework drives. This repo never had one. |
| `npm run verify` exits 1 on a working stack | Its three Intelligence checks FAIL without a license | Expected here; read the individual checks, not the summary. Known issues #13. |
| Backend exits immediately | No `OPENAI_API_KEY` | `cp .env.example backend/.env` and fill it in. |

---

## 12. Doc drift detection

`/doc-sync` keeps this repo honest about the docs it mirrors. Press **Sync docs now** (on the landing page or on `/doc-sync`) and it fetches the markdown source behind all 9 tracked doc pages, diffs each against the copy stored in `doc-snapshot/`, replaces that copy, and reports what moved — ranked by whether the change can actually break an implementation.

Doc pages are fetched by appending `.md` to their URL, which returns the authored MDX rather than the rendered HTML. Every response is checked for `text/markdown` before it is allowed near the snapshot: a URL that misses the markdown handler still answers `200` with the HTML app shell, and writing that in would destroy the baseline. A run commits all pages or none.

**Severity is decided by where the edit landed**, not how big it was:

| Level | Trigger |
|---|---|
| **High** | a changed line inside a fenced code block, a changed fence count, or a page that now 404s and is gone from the sitemap |
| **Medium** | a changed heading, changed frontmatter `title`/`description`, or prose in the same section as changed code |
| **Low** | other prose |

**Sections checked** lists every tracked page in nav order with a mark — `✓` unchanged, `!` changed, `+` stored, `✗` 404, `~` unstable, `·` not checked. Expanding a row shows the comparison: for a changed page the diff (`−` existing snapshot, `+` newly fetched), and for an unchanged one the two matching hashes, which is the evidence the check ran.

**`doc-snapshot/CHANGELOG.md`** is the record that survives a re-sync. Because syncing replaces the copy it just compared against, the run *after* a change reports nothing — so the changelog is written at the moment of discovery and never rewritten later. Only changed pages are recorded; a clean run does not touch the file. It keeps the three most recent dated entries, counted rather than aged.

**One sync date.** `syncedAt` in `doc-snapshot/manifest.json`, rewritten on every run. There is no hand-maintained date to keep in step with it.

### How it is wired on Angular

Angular has no server-action equivalent, so the boundary is plain HTTP. Everything that fetches docs or touches the snapshot lives in `frontend/src/app/lib/doc-sync/` and is imported **only** from `frontend/src/server.ts`, which exposes two endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /api/doc-sync` | current manifest summary + the latest report |
| `POST /api/doc-sync/run` | runs the sync, returns the result |

They sit on the SSR server rather than the Copilot Runtime because that is the Angular app's own server: `ng serve` routes through it in development (`ssr.entry` in `angular.json`) and it ships in `dist/`, so the button works in both without a second process. The browser half is `DocSyncClient`, a root-provided service holding signals — nothing in the browser bundle imports `node:fs`, which the build verifies by never resolving those modules into `dist/browser`.

**To test it**, edit any `doc-snapshot/pages/*.md` file and press the button — a line inside a code fence for High, a `##` heading for Medium, a sentence for Low. The comparison reads the stored file itself, so nothing else needs changing. Both `/doc-sync` and the changelog label the result as a local snapshot edit rather than upstream drift.

Commit `doc-snapshot/` — `pages/`, `manifest.json` and `CHANGELOG.md` are the baseline every diff is taken against. `reports/` is gitignored.

---

## 13. Project structure

```
agno/
├── CLAUDE.md                  # build instructions this harness follows
├── README.md
├── .env.example
│
├── frontend/                  # Angular 22 app + the Copilot Runtime process
│   ├── AGENTS.md              # Angular style rules this repo's own code follows
│   ├── server.ts              # ★ CopilotRuntime + AgnoAgent binding  → :8200
│   ├── scripts/
│   │   ├── generate-sources.ts  # ★ reads real files → generated-sources.ts
│   │   ├── sync-docs.ts         # ★ automated doc-snapshot sync script
│   │   └── record-all-pages.ts  # ★ Playwright automated video recording suite
│   ├── recordings/            # ★ Output high-definition .webm recordings
│   └── src/
│       ├── styles.css         # CopilotKit stylesheet + the guides' CSS verbatim
│       └── app/
│           ├── app.config.ts        # ★ provideCopilotKit, a2ui, openGenerativeUI
│           ├── app.routes.ts        # doc routes in chrome, demo routes outside it
│           ├── lib/
│           │   ├── nav-config.ts    # ★ single source of truth: routes, docs, status
│           │   └── generated-sources.ts   # GENERATED — do not edit
│           ├── components/          # harness chrome (nav, header, source, health)
│           ├── features/            # ★ the doc code that actually runs
│           │   ├── quickstart/  chat-ui/  tools/  a2ui/
│           │   └── media/  hitl/  shared-state/  threads/  memory/
│           │       attachments/  headless/
│           └── pages/               # one page per doc route + demos.ts + status
│
└── backend/                   # Python agent — Agno AgentOS over AG-UI  → :8000
    ├── pyproject.toml
    └── main.py                # ★ agent, getWeather tool, AgentOS + AGUI interface
```

The nav, every route header, the demo links, and the status table all derive from `frontend/src/app/lib/nav-config.ts`, so a route's status is stated once.

**`features/` vs everything else.** Files under `features/` are doc code, kept as published — including where that conflicts with `frontend/AGENTS.md` (several set `changeDetection: OnPush` explicitly, which AGENTS.md says to omit on v22+). Every deviation from a published snippet is called out in the file's header comment. Everything outside `features/` is this harness's own code and follows AGENTS.md.

---

## 14. References

**Getting Started** — [Angular + Agno quickstart](https://docs.copilotkit.ai/angular/agno/quickstart)

**Guides** — [Chat UI and customization](https://docs.copilotkit.ai/angular/agno/guides/chat-ui) · [Frontend tools and generative UI](https://docs.copilotkit.ai/angular/agno/guides/frontend-tools-generative-ui) · [A2UI](https://docs.copilotkit.ai/angular/agno/guides/a2ui) · [Voice and multimodal](https://docs.copilotkit.ai/angular/agno/guides/voice-multimodal) · [Human-in-the-loop and interrupts](https://docs.copilotkit.ai/angular/agno/guides/human-in-the-loop) · [Shared state and agent context](https://docs.copilotkit.ai/angular/agno/guides/shared-state) · [Threads, memory, attachments, and headless UI](https://docs.copilotkit.ai/angular/agno/guides/threads-memory-attachments-headless)

**Backend** — [Copilot Runtime](https://docs.copilotkit.ai/angular/agno/backend/copilot-runtime) · [React Agno quickstart](https://docs.copilotkit.ai/agno/quickstart) (source of the `AgnoAgent` binding)

**External** — [Agno docs](https://docs.agno.com) · [AG-UI protocol](https://ag-ui.com) · [Angular API reference](https://docs.copilotkit.ai/reference/angular)
