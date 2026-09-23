# Doc drift changelog

What the CopilotKit docs changed under this repo, written by whichever sync
ran — the `/doc-sync` page or `npm run drift:sync`. Only pages that actually
moved are recorded — a sync that finds everything unchanged writes nothing
here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-09-23

### 07:50 UTC — 17 pages, highest severity high · _npm run drift:sync_

**Low — /angular/agno**

`/angular/agno` · route `/` · `angular__agno.md`

Prose / text phrasing updated. Hash 4fa82280 ➔ 3ebb5f6d.

````diff
- body="Add durable threads, inspection, and managed or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
- surface="docs:angular/quickstart:production"
- />
- ## Start with your coding agent
+ body="Add threads, inspection, and cloud-hosted or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
+ surface="docs:angular/quickstart:production"
+ />
+ ## Start with your coding agent
  … region truncated
````

**Low — /angular/agno/quickstart**

`/angular/agno/quickstart` · route `/quickstart` · `angular__agno__quickstart.md`

Prose / text phrasing updated. Hash 4fa82280 ➔ 3ebb5f6d.

````diff
- body="Add durable threads, inspection, and managed or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
- surface="docs:angular/quickstart:production"
- />
- ## Start with your coding agent
+ body="Add threads, inspection, and cloud-hosted or self-hosted CopilotKit Intelligence without changing the Angular frontend APIs in this guide."
+ surface="docs:angular/quickstart:production"
+ />
+ ## Start with your coding agent
  … region truncated
````

**High — /angular/agno/cli**

`/angular/agno/cli` · `angular__agno__cli.md`

Code block content changed. Hash 28b12580 ➔ 52562329.

````diff
- The CopilotKit CLI helps you create CopilotKit apps connected to CopilotKit Intelligence, whether cloud-hosted or self-hosted. It handles browser sign-in, project selection, project-scoped runtime API keys, historical thread import, and local project configuration so your app can use durable threads and conversation history.
- Use the CLI when you want to start a new app, import historical ADK or LangGraph conversations, or install CopilotKit agent skills for your coding agent.
- <OpsPlatformCTA
- variant="inline"
+ The CopilotKit CLI helps you create CopilotKit apps connected to CopilotKit Intelligence, whether cloud-hosted or self-hosted. It handles browser sign-in, project selection, project-scoped runtime API keys, historical thread import, and local project configuration so your app can use threads and conversation history.
+ Use the CLI when you want to start a new app, import historical ADK or LangGraph conversations, or install CopilotKit agent skills for your coding agent.
+ <OpsPlatformCTA
+ variant="inline"
  … region truncated
````

**High — /angular/agno/intelligence/managed-intelligence-platform**

`/angular/agno/intelligence/managed-intelligence-platform` · `angular__agno__intelligence__managed-intelligence-platform.md`

Code block content changed. Hash d850caf6 ➔ 833914e4.

````diff
- # Cloud-hosted CopilotKit Intelligence
- > How the cloud-hosted version of CopilotKit Intelligence works — login, organizations, projects, project API keys, conversation history, thread inspection, and plan management.
- Cloud-hosted CopilotKit Intelligence is the CopilotKit-operated deployment of the same CopilotKit Intelligence you can also self-host. Use it when you want durable threads, project-scoped API keys, conversation history, the hosted web app, and plan management without operating Kubernetes infrastructure.
- ![The cloud-hosted CopilotKit Intelligence ready page with starter commands and project navigation.](/angular/agno/images/enterprise-intelligence/managed-ready.png)
+ # Cloud-hosted Intelligence
+ > Sign in, create a project, and connect your runtime with a project API key.
+ ## Overview
+ Cloud-hosted Intelligence runs the platform for you, with a project and an API key and no cluster to operate. Your app still uses the CopilotKit SDK.
  … region truncated
````

**High — /angular/agno/intelligence/connect-your-runtime**

`/angular/agno/intelligence/connect-your-runtime` · `angular__agno__intelligence__connect-your-runtime.md`

Page 404 / Removed. Hash ? ➔ ?.

**Medium — /angular/agno/intelligence/threads-explained**

`/angular/agno/intelligence/threads-explained` · `angular__agno__intelligence__threads-explained.md`

Headings / Structure changed. Hash b2647c72 ➔ 2094467b.

````diff
- Start with the [Rich Threads overview](/angular/agno/guides/threads-memory-attachments-headless) to understand what Rich Threads provide
- and choose between the prebuilt Drawer and a custom headless UI. This page
- explains the persistence and replay architecture beneath both paths. For the
- client-side lifecycle (minting a `threadId`, hydrating history on load, and
+ ## Overview
+ Start with the [Rich Threads overview](/angular/agno/guides/threads-memory-attachments-headless) to understand what Rich Threads provide
+ and choose between the prebuilt Drawer and a custom headless UI. This page
+ explains the persistence and replay architecture beneath both paths. For the
  … region truncated
````

**High — /angular/agno/intelligence/overview**

`/angular/agno/intelligence/overview` · `angular__agno__intelligence__overview.md`

Code block content changed. Hash 28835f5e ➔ feede64c.

````diff
- > CopilotKit Intelligence adds persistent Rich Threads, messaging Channels, User Memories, Product Analytics, and Automatic Learning. Import supported LangGraph and Google ADK history, then synchronize future CopilotKit runs.
- <IntelligenceOverview />
- ## What is CopilotKit Intelligence?
- CopilotKit Intelligence is CopilotKit's production layer for persistent Rich Threads, User Memories, Product Analytics, Automatic Learning, and messaging Channels. It sits beside your CopilotKit runtime and gives production agentic applications shared infrastructure without changing the frontend SDK, AG-UI protocol, or agent framework you use.
+ > CopilotKit Intelligence adds Rich Threads, User Memories, Automatic Learning, Channels, and Product Analytics to the CopilotKit app you already run.
+ <IntelligenceOverview />
+ ## What is CopilotKit Intelligence?
+ You want Rich Threads, User Memory, Automatic Learning, Channels, and Product Analytics without operating that storage yourself. CopilotKit Intelligence adds that layer to the CopilotKit app you already have. Your frontend, your agent, and your model stay where they are.
  … region truncated
````

**Medium — /angular/agno/intelligence/self-hosting**

`/angular/agno/intelligence/self-hosting` · `angular__agno__intelligence__self-hosting.md`

Headings / Structure changed. Hash ec86caaa ➔ be55abee.

````diff
- ## What is this?
+ ## Overview
````

**Medium — /angular/agno/intelligence/intelligence-platform**

`/angular/agno/intelligence/intelligence-platform` · `angular__agno__intelligence__intelligence-platform.md`

Headings / Structure changed. Hash 3bebac3a ➔ 50e9b6c1.

````diff
- > CopilotKit Intelligence architecture — how CopilotKit runtimes connect to platform projects, durable threads, realtime sync, operational history, and cloud-hosted or self-hosted deployments.
- CopilotKit Intelligence is the platform backend behind production CopilotKit capabilities such as durable threads, realtime sync, project-scoped history, the hosted web app, and operational visibility. This page explains the mental model that applies to both [Cloud-hosted CopilotKit Intelligence](/angular/agno/intelligence/managed-intelligence-platform) and [Self-host CopilotKit Intelligence](/angular/agno/intelligence/self-hosting).
- For a product-level map of features and hosting options, start with the [CopilotKit Intelligence overview](/angular/agno/intelligence/overview). To wire an existing runtime to the platform, see [Connect your runtime to Intelligence](/angular/agno/intelligence/connect-your-runtime). For Kubernetes installation, go straight to [Self-host CopilotKit Intelligence](/angular/agno/intelligence/self-hosting).
- <OpsPlatformCTA
+ > How a CopilotKit runtime connects to Intelligence, and how cloud-hosted differs from self-hosted.
+ ## Overview
+ You want to see how your app, your runtime, and Intelligence fit together, and which deployment to run. This page is that map. It applies to [cloud-hosted Intelligence](/angular/agno/intelligence/managed-intelligence-platform) and to [self-hosted Intelligence](/angular/agno/intelligence/self-hosting).
+ To connect a runtime, follow the [quickstart](/angular/agno/intelligence/quickstart). For the Kubernetes install, go to [self-host on Kubernetes](/angular/agno/intelligence/self-hosting).
  … region truncated
````

**Low — /angular/agno/telemetry**

`/angular/agno/telemetry` · `angular__agno__telemetry.md`

Prose / text phrasing updated. Hash b668cfa7 ➔ 5ca74881.

````diff
- Managed Intelligence starters use `CPK_INTELLIGENCE_API_KEY` for platform access.
- The project API key is not a telemetry identity.
- Managed project setup does not issue `COPILOTKIT_LICENSE_TOKEN`. That token is
- only for offline or self-hosted licensing, so a managed starter carries no
+ Cloud-hosted Intelligence starters use `CPK_INTELLIGENCE_API_KEY` for platform access.
+ The project API key is not a telemetry identity.
+ Cloud-hosted setup does not issue `COPILOTKIT_LICENSE_TOKEN`. That token is
+ only for offline or self-hosted licensing, so a cloud-hosted starter carries no
````

**Low — /angular/agno/concepts/architecture**

`/angular/agno/concepts/architecture` · `angular__agno__concepts__architecture.md`

Prose / text phrasing updated. Hash 481743f2 ➔ 85341a1d.

````diff
- - **CopilotKit Intelligence overview** — [CopilotKit Intelligence](/angular/agno/intelligence/overview) covers Threads, Persistence, hosted inspection, and the cloud-hosted-vs-self-hosted decision.
+ - **CopilotKit Intelligence overview** — [CopilotKit Intelligence](/angular/agno/intelligence/overview) covers Threads, persistence, inspection, and the cloud-hosted or self-hosted decision.
````

**Low — /angular/agno/backend/agent-runner**

`/angular/agno/backend/agent-runner` · `angular__agno__backend__agent-runner.md`

Prose / text phrasing updated. Hash 2406f809 ➔ 0e56990f.

````diff
- | `IntelligenceAgentRunner` | `@copilotkit/runtime/v2` | Backs CopilotKit Intelligence with durable threads, cross-instance persistence, and threads/history features. Used automatically on an Intelligence runtime. |
- | `TelemetryAgentRunner` | `@copilotkit/runtime` | Legacy wrapper behavior. The root runtime composes telemetry around a runner when telemetry is enabled; `@copilotkit/runtime/v2` does not. |
- If you don't pass a `runner`, the runtime uses `InMemoryAgentRunner`. Because it
- holds threads in process memory, history is lost on restart, **bounded** while
+ | `IntelligenceAgentRunner` | `@copilotkit/runtime/v2` | Backs CopilotKit Intelligence with threads, cross-instance persistence, and threads/history features. Used automatically on an Intelligence runtime. |
+ | `TelemetryAgentRunner` | `@copilotkit/runtime` | Legacy wrapper behavior. The root runtime composes telemetry around a runner when telemetry is enabled; `@copilotkit/runtime/v2` does not. |
+ If you don't pass a `runner`, the runtime uses `InMemoryAgentRunner`. Because it
+ holds threads in process memory, history is lost on restart, **bounded** while
  … region truncated
````

**Low — /angular/agno/backend/copilot-runtime**

`/angular/agno/backend/copilot-runtime` · `angular__agno__backend__copilot-runtime.md`

Prose / text phrasing updated. Hash a42a4407 ➔ ae2a5f49.

````diff
- The examples below take `intelligence` and `identifyUser` as given. `intelligence` is a `CopilotKitIntelligence` instance — see [Connect your runtime to Intelligence](/angular/agno/intelligence/connect-your-runtime) for the constructor and where the project API key comes from.
+ The examples below take `intelligence` and `identifyUser` as given. `intelligence` is a `CopilotKitIntelligence` instance — see [Connect your runtime to Intelligence](/angular/agno/intelligence/quickstart) for the constructor and where the project API key comes from.
````

**Low — /angular/agno/backend/runtime-endpoints**

`/angular/agno/backend/runtime-endpoints` · `angular__agno__backend__runtime-endpoints.md`

Prose / text phrasing updated. Hash 0e91c764 ➔ 7e7e2404.

````diff
- `apiUrl` and `wsUrl` default to CopilotKit's managed platform. The API and
- realtime planes are deployed to **different hosts**, so one cannot be derived
- from the other by swapping the scheme. Override them only for a self-hosted or
- non-production deployment, and override **both together** — setting one alone
+ `apiUrl` and `wsUrl` default to the cloud-hosted platform. The API and
+ realtime planes are deployed to **different hosts**, so one cannot be derived
+ from the other by swapping the scheme. Override them only for a self-hosted or
+ non-production deployment, and override **both together** — setting one alone
  … region truncated
````

**High — /angular/agno/intelligence/memories**

`/angular/agno/intelligence/memories` · route `/memory` · `angular__agno__intelligence__memories.md`

Code block content changed. Hash 9d5f544a ➔ b3e9effd.

````diff
- Rich Threads remember a conversation. User Memories remember a person. This page explains
- what a memory is, how recall selects them, and what has to be true of your
- deployment before the memory surfaces exist at all.
- If you are looking for the persistence architecture beneath a single
+ ## Overview
+ Rich Threads remember a conversation. User Memory remembers a person. This page explains
+ what a memory is, how recall selects them, and what has to be true of your
+ deployment before the memory surfaces exist at all.
  … region truncated
````

**High — /angular/agno/intelligence/learned-skills**

`/angular/agno/intelligence/learned-skills` · `angular__agno__intelligence__learned-skills.md`

Code fence count changed. Hash be54c4ef ➔ 9da04534.

````diff
- # Automatic learned skill delivery
- > Keep published Learning skills available to agents with verified snapshots, automatic refresh, and exact revision pins.
- Learned skill delivery makes one Learning container's published skills available to an agent without another CLI download or process restart. A framework adapter adds an alphabetical catalog and two tools. The model decides when to load and follow a skill.
- Developer instructions retain precedence. Learned skills cannot override the agent's role, safety rules, tool restrictions, or application policy.
+ # Skill delivery
+ > Keep published skills available to agents, with verified snapshots and exact revision pins.
+ ## Overview
+ Skill delivery makes one Learning container's published skills available to an agent without another CLI download or process restart. A framework adapter adds an alphabetical catalog and two tools.
  … region truncated
````

**High — /angular/agno/learning**

`/angular/agno/learning` · `angular__agno__learning.md`

Code fence count changed. Hash d1932db5 ➔ 24394093.

````diff
- > Turn real application use into evidence-backed Insights and reviewed, reusable Skills.
- ## Overview
- Automatic Learning turns patterns from real agent runs into reusable Skills. It looks at completed conversations and application interactions in [Rich Threads](/angular/agno/guides/threads-memory-attachments-headless), produces evidence-backed Insights, and proposes instructions you can review before publishing.
- <div className="not-prose shell-docs-radius-surface aspect-[7/4] w-full overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-panel)]">
+ > Turn real use of your app into skills you can review and publish.
+ ## Overview
+ Automatic Learning turns patterns from real agent runs into skills you can publish. It reads completed conversations in [Rich Threads](/angular/agno/guides/threads-memory-attachments-headless), writes insights, and proposes instructions you review before you publish them.
+ <div className="not-prose shell-docs-radius-surface aspect-[7/4] w-full overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--shadow-panel)]">
  … region truncated
````

---

## 2026-09-22

### 08:52 UTC — 10 pages, highest severity high · _npm run drift:sync_

**Low — /angular/agno**

`/angular/agno` · route `/` · `angular__agno.md`

Prose / text phrasing updated. Hash 571db1cf ➔ 4fa82280.

````diff
- 3. Open **Threads**. The list is unlocked (Intelligence is on), or locked with Enable Intelligence (Intelligence is off).
+ 3. Open **Rich Threads**. The list is unlocked (Intelligence is on), or locked with Enable Intelligence (Intelligence is off).
````

**Low — /angular/agno/quickstart**

`/angular/agno/quickstart` · route `/quickstart` · `angular__agno__quickstart.md`

Prose / text phrasing updated. Hash 571db1cf ➔ 4fa82280.

````diff
- 3. Open **Threads**. The list is unlocked (Intelligence is on), or locked with Enable Intelligence (Intelligence is off).
+ 3. Open **Rich Threads**. The list is unlocked (Intelligence is on), or locked with Enable Intelligence (Intelligence is off).
````

**Low — /angular/agno/intelligence/overview**

`/angular/agno/intelligence/overview` · `angular__agno__intelligence__overview.md`

Prose / text phrasing updated. Hash b7cae9c5 ➔ 28835f5e.

````diff
- > CopilotKit Intelligence adds persistent Rich Threads, messaging Channels, memory, analytics, and automatic learning. Import supported LangGraph and Google ADK history, then synchronize future CopilotKit runs.
- <IntelligenceOverview />
- ## What is CopilotKit Intelligence?
- CopilotKit Intelligence is CopilotKit's production layer for persistent Rich Threads, memory, analytics, automatic learning, and messaging Channels. It sits beside your CopilotKit runtime and gives production agentic applications shared infrastructure without changing the frontend SDK, AG-UI protocol, or agent framework you use.
+ > CopilotKit Intelligence adds persistent Rich Threads, messaging Channels, User Memories, Product Analytics, and Automatic Learning. Import supported LangGraph and Google ADK history, then synchronize future CopilotKit runs.
+ <IntelligenceOverview />
+ ## What is CopilotKit Intelligence?
+ CopilotKit Intelligence is CopilotKit's production layer for persistent Rich Threads, User Memories, Product Analytics, Automatic Learning, and messaging Channels. It sits beside your CopilotKit runtime and gives production agentic applications shared infrastructure without changing the frontend SDK, AG-UI protocol, or agent framework you use.
  … region truncated
````

**Low — /angular/agno/intelligence/self-hosting**

`/angular/agno/intelligence/self-hosting` · `angular__agno__intelligence__self-hosting.md`

Prose / text phrasing updated. Hash 37e0d955 ➔ ec86caaa.

````diff
+ <Callout type="info" title="Deploying on AWS ECS/Fargate?">
+ Follow [Self-host Intelligence on AWS ECS/Fargate](/angular/agno/intelligence/self-hosting-ecs) for the versioned CloudFormation bundle, configuration, deployment, and verification steps. This page covers Kubernetes and Helm.
+ </Callout>
````

**Low — /angular/agno/intelligence/connect-your-runtime**

`/angular/agno/intelligence/connect-your-runtime` · `angular__agno__intelligence__connect-your-runtime.md`

Prose / text phrasing updated. Hash 56b22eb3 ➔ dcb8ce64.

````diff
- See [Self-host CopilotKit Intelligence](/angular/agno/intelligence/self-hosting) for the full
- deployment path.
+ For the full deployment path, follow [Kubernetes and Helm](/angular/agno/intelligence/self-hosting)
+ or [AWS ECS/Fargate](/angular/agno/intelligence/self-hosting-ecs).
````

**Low — /angular/agno/backend/runtime-endpoints**

`/angular/agno/backend/runtime-endpoints` · `angular__agno__backend__runtime-endpoints.md`

Prose / text phrasing updated. Hash a219e854 ➔ 0e91c764.

````diff
+ <Callout type="info" title="Install `express` yourself">
+ `express` is an optional peer dependency of `@copilotkit/runtime`, so it is
+ not installed for you. Run `npm install express` (`^4.18.0 || ^5.0.0`) in the
+ app that mounts the adapter. Calling `createCopilotExpressHandler` without it
+ throws and names the fix. Nothing else in the runtime needs express, so Hono
+ and Next.js apps install nothing.
+ </Callout>
````

**Low — /angular/agno/intelligence/learned-skills**

`/angular/agno/intelligence/learned-skills` · `angular__agno__intelligence__learned-skills.md`

Prose / text phrasing updated. Hash d091b61d ➔ be54c4ef.

````diff
- Start with the [Learning guide](/angular/agno/learning) to collect Threads, configure daily runs, and review Skills. Before connecting an adapter, check that **Skill delivery** is enabled in the container's **Skills** tab. For guided setup, select **Set up skill delivery** there and copy the prompt into your coding agent.
- </Callout>
- ## Choose an adapter
- | Framework                 | Package                                  | Native extension                                                     |
+ Start with the [Automatic Learning guide](/angular/agno/learning) to collect Threads, configure daily runs, and review Skills. Before connecting an adapter, check that **Skill delivery** is enabled in the container's **Skills** tab. For guided setup, select **Set up skill delivery** there and copy the prompt into your coding agent.
+ </Callout>
+ ## Choose an adapter
+ | Framework                 | Package                                  | Native extension                                                     |
  … region truncated
````

**Medium — /angular/agno/intelligence/memories**

`/angular/agno/intelligence/memories` · route `/memory` · `angular__agno__intelligence__memories.md`

Headings / Structure changed. Hash d4b78dd2 ➔ 9d5f544a.

````diff
- # Memories & Recall
- > Give your agents long-term memory across conversations.
- Threads remember a conversation. Memories remember a person. This page explains
- what a memory is, how recall selects them, and what has to be true of your
+ # User Memories
+ > Give your agents long-term memory across conversations.
+ Rich Threads remember a conversation. User Memories remember a person. This page explains
+ what a memory is, how recall selects them, and what has to be true of your
  … region truncated
````

**High — /angular/agno/learning**

`/angular/agno/learning` · `angular__agno__learning.md`

Code block content changed. Hash 7a98d875 ➔ d1932db5.

````diff
- # Learning
- > Turn real application use into evidence-backed Insights and reviewed, reusable Skills.
- ## Overview
- Learning turns patterns from real agent runs into reusable Skills. It looks at completed conversations and application interactions in [Rich Threads](/angular/agno/guides/threads-memory-attachments-headless), produces evidence-backed Insights, and proposes instructions you can review before publishing.
+ # Automatic Learning
+ > Turn real application use into evidence-backed Insights and reviewed, reusable Skills.
+ ## Overview
+ Automatic Learning turns patterns from real agent runs into reusable Skills. It looks at completed conversations and application interactions in [Rich Threads](/angular/agno/guides/threads-memory-attachments-headless), produces evidence-backed Insights, and proposes instructions you can review before publishing.
  … region truncated
````

**Low — /angular/agno/runtime-server-adapter**

`/angular/agno/runtime-server-adapter` · `angular__agno__runtime-server-adapter.md`

Prose / text phrasing updated. Hash cbe8cd4e ➔ c7733457.

````diff
- The Express adapter returns an Express `Router` that you mount with `app.use()`.
+ The Express adapter returns a router that you mount with `app.use()`. The value
+ is a real `express.Router()`. Its declared type is `CopilotExpressRouter`, which
+ names no Express major, so it mounts on Express 4 and Express 5 alike.
+ `express` is an optional peer dependency of `@copilotkit/runtime`, so install it
+ in your own app. Both majors are supported.
````

---

---

## 2026-09-21

### 09:03 UTC — 1 page, highest severity low · _npm run drift:sync_

**Low — /angular/agno/backend/runtime-endpoints**

`/angular/agno/backend/runtime-endpoints` · `angular__agno__backend__runtime-endpoints.md`

Prose / text phrasing updated. Hash 488c2cee ➔ a219e854.

````diff
- | `POST /api/copilotkit/agent/:agentId/stop/:threadId` | Stop an in-progress run on a given thread.                                                                                                                                                                   |
+ | `POST /api/copilotkit/agent/:agentId/stop/:threadId` | Stop the in-progress run on a given thread. An optional JSON body `{ "runId": "..." }` stops only that run. A body that is not valid JSON, or carries any other key, is rejected with 400 and stops nothing.                                                                                                |
````

### 07:26 UTC — 10 pages, highest severity high · _npm run drift:sync_

**Low — /angular/agno/intelligence/overview**

`/angular/agno/intelligence/overview` · `angular__agno__intelligence__overview.md`

Prose / text phrasing updated. Hash 2bc7c7f1 ➔ b7cae9c5.

````diff
- | Automatic learning | Agents improve from real usage. No fine-tuning pipeline required. | [Learning](/angular/agno/learning) and [Automatic skill delivery](/angular/agno/intelligence/learned-skills) |
+ | Automatic learning | Agents improve from real usage. BuiltInAgent and framework adapters can load published skills automatically. | [Learning](/angular/agno/learning) and [Automatic skill delivery](/angular/agno/intelligence/learned-skills) |
````

**High — /angular/agno/copilot-runtime**

`/angular/agno/copilot-runtime` · `angular__agno__copilot-runtime.md`

Code fence count changed. Hash 5e3190c9 ➔ 5249908a.

````diff
- The Copilot Runtime is the backend layer that connects your frontend application to your AI agents. It's set up during the [quickstart](/angular/agno/quickstart) and is the recommended way to use CopilotKit.
- ## Setting Up the Runtime
- The runtime is a lightweight server endpoint that you add to your backend:
- ```npm
+ The Copilot Runtime is the backend layer that connects your frontend application to your AI agents. It's set up during the [quickstart](/angular/agno/quickstart) and is the recommended way to use CopilotKit.
+ ## Setting Up the Runtime
+ The runtime is a lightweight server endpoint that you add to your backend:
+ ```npm
  … region truncated
````

**Low — /angular/agno/telemetry**

`/angular/agno/telemetry` · `angular__agno__telemetry.md`

Prose / text phrasing updated. Hash 74d5a6f9 ➔ b668cfa7.

````diff
+ Managed Intelligence starters use `CPK_INTELLIGENCE_API_KEY` for platform access.
+ The project API key is not a telemetry identity.
````

**Low — /angular/agno/backend/agent-runner**

`/angular/agno/backend/agent-runner` · `angular__agno__backend__agent-runner.md`

Prose / text phrasing updated. Hash 6f552bcf ➔ 2406f809.

````diff
+ <Callout type="warn" title="The in-memory runner records no thread owner">
+ Its store is keyed by `threadId` alone, so the runtime's
+ [thread routes](/angular/agno/backend/runtime-endpoints#thread-routes) cannot tell one
+ caller's threads from another's: `GET /threads/:threadId/messages` returns the
+ history for any id it is given, `GET /threads` lists every thread in the
+ process, and `POST /threads/clear` wipes all of them.
+ That is fine for local development and for a deployment serving one person. If
+ more than one person uses it, authorize those routes yourself before you ship.
  … region truncated
````

**High — /angular/agno/backend/copilot-runtime**

`/angular/agno/backend/copilot-runtime` · `angular__agno__backend__copilot-runtime.md`

Code fence count changed. Hash df77cdae ➔ a42a4407.

````diff
- The Copilot Runtime is the backend layer that connects your frontend application to your AI agents. It's set up during the [quickstart](/angular/agno/quickstart) and is the recommended way to use CopilotKit.
- ## Setting up the runtime
- The runtime is a lightweight server endpoint that you add to your backend. Here's a minimal example using Next.js:
- ```ts title="app/api/copilotkit/[[...slug]]/route.ts" doctest="component"
+ The Copilot Runtime is the backend layer that connects your frontend application to your AI agents. It's set up during the [quickstart](/angular/agno/quickstart) and is the recommended way to use CopilotKit.
+ ## Setting up the runtime
+ The runtime is a lightweight server endpoint that you add to your backend. Here's a minimal example using Next.js:
+ ```ts title="app/api/copilotkit/[[...slug]]/route.ts" doctest="component"
  … region truncated
````

**High — /angular/agno/backend/runtime-endpoints**

`/angular/agno/backend/runtime-endpoints` · `angular__agno__backend__runtime-endpoints.md`

Code fence count changed. Hash 3be80bd5 ➔ 488c2cee.

````diff
- ### Probing the runtime with curl
- The fastest way to confirm a self-hosted runtime is wired up is to hit `/info`
- directly:
- ```bash
+ ### Thread routes
+ The runtime also serves the conversation history behind the threads UI. These
+ routes exist in multi-route mode whichever runner you use:
+ | Method & path | Purpose |
  … region truncated
````

**High — /angular/agno/intelligence/learned-skills**

`/angular/agno/intelligence/learned-skills` · `angular__agno__intelligence__learned-skills.md`

Code fence count changed. Hash 106a9f9c ➔ d091b61d.

````diff
- ## Choose an adapter
- | Framework                 | Package                                  | Native extension                                                     |
- | ------------------------- | ---------------------------------------- | -------------------------------------------------------------------- |
- | LangGraph Python          | `copilotkit-intelligence-langgraph`      | `create_skill_registry_middleware`                                   |
+ <Callout type="info">
+ Start with the [Learning guide](/angular/agno/learning) to collect Threads, configure daily runs, and review Skills. Before connecting an adapter, check that **Skill delivery** is enabled in the container's **Skills** tab. For guided setup, select **Set up skill delivery** there and copy the prompt into your coding agent.
+ </Callout>
+ ## Choose an adapter
  … region truncated
````

**High — /angular/agno/learning**

`/angular/agno/learning` · `angular__agno__learning.md`

Code fence count changed. Hash 573995eb ➔ 7a98d875.

````diff
- ## Start with your coding agent
- Copy this prompt into your coding agent to inspect your existing app and configure Automatic Learning for one focused workflow. Prefer to work through the setup yourself? Follow the manual steps below.
- #### Copy this prompt into your coding agent
- ```text
+ Automatic Learning checks eligible containers on a daily schedule. After you approve a Skill, automatic skill delivery makes it available to connected agents. Scheduling, publication, and delivery are separate: a scheduled run does not approve Skills, and enabling delivery does not connect your agent for you.
+ ## Start with your coding agent
+ Copy this prompt into your coding agent to inspect your existing app and configure Automatic Learning for one focused workflow. Prefer to work through the setup yourself? Follow the manual steps below.
+ #### Copy this prompt into your coding agent
  … region truncated
````

**High — /angular/agno/troubleshooting/event-inspector**

`/angular/agno/troubleshooting/event-inspector` · `angular__agno__troubleshooting__event-inspector.md`

Code fence count changed. Hash 217558a5 ➔ 2299868a.

````diff
- - A CopilotKit runtime running locally in development mode (`NODE_ENV` is **not** `production`)
- - The [CopilotKit VS Code extension](/angular/agno/vs-code-extension) installed
- <Callout type="warning">
- The `/cpk-debug-events` endpoint is disabled when `NODE_ENV=production`. This is intentional — it streams internal event data that should not be exposed in production environments.
+ - A CopilotKit runtime running locally with `NODE_ENV` set to `development`, or with `debug` enabled on the runtime
+ - The [CopilotKit VS Code extension](/angular/agno/vs-code-extension) installed
+ <Callout type="warning">
+ The `/cpk-debug-events` endpoint streams every event of every thread, including full message content, to any subscriber. It is served in exactly two cases: `NODE_ENV` is `development`, or the runtime sets `debug`. Everywhere else it returns 404.
  … region truncated
````

**Low — /angular/agno/backend/custom-agent**

`/angular/agno/backend/custom-agent` · `angular__agno__backend__custom-agent.md`

Prose / text phrasing updated. Hash bd8791e6 ➔ b0c5b502.

````diff
- The factory receives an `AgentFactoryContext` (from `@copilotkit/runtime/v2`):
- ```typescript
- interface AgentFactoryContext {
+ The factory receives an `BuiltInAgentFactoryContext` (from `@copilotkit/runtime/v2`):
+ ```typescript
+ interface BuiltInAgentFactoryContext {
+ learnedSkills: BuiltInAgentLearnedSkills; // catalog and read-only AI SDK tools, empty when disabled
````

---

---

---
