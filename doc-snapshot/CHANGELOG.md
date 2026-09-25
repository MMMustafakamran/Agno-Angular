# Doc drift changelog

What the CopilotKit docs changed under this repo, written by whichever sync
ran — the `/doc-sync` page or `npm run drift:sync`. Only pages that actually
moved are recorded — a sync that finds everything unchanged writes nothing
here at all.

Holds the 3 most recent dated entries. When a change lands on a fourth
date, the oldest entry is dropped. Entries are counted, not aged, so a gap of
weeks between changes does not expire anything.

## 2026-09-25

### 07:49 UTC — 2 pages, highest severity high · _npm run drift:sync_

**Low — /angular/agno/intelligence/overview**

`/angular/agno/intelligence/overview` · `angular__agno__intelligence__overview.md`

Prose / text phrasing updated. Hash acce68d2 ➔ 15fa5c47.

````diff
+ [Skill delivery](/angular/agno/intelligence/learned-skills) combines published Skills from several Learning containers in one agent, with one request for each refresh.
````

**High — /angular/agno/intelligence/learned-skills**

`/angular/agno/intelligence/learned-skills` · `angular__agno__intelligence__learned-skills.md`

Code fence count changed. Hash 9da04534 ➔ 5cc13f2c.

````diff
- Skill delivery makes one Learning container's published skills available to an agent without another CLI download or process restart. A framework adapter adds an alphabetical catalog and two tools.
- <Image
- src="/images/cloud-hosted/cloud-hosted-skill-delivery.png"
- alt="The Skills tab of a Learning container in cloud-hosted Intelligence. The Skill delivery toggle is on, and skill candidates wait for review."
+ Skill delivery makes published skills from one or more Learning containers available to an agent without another CLI download or process restart. A framework adapter adds an alphabetical catalog and two tools.
+ <Image
+ src="/images/cloud-hosted/cloud-hosted-skill-delivery.png"
+ alt="The Skills tab of a Learning container in cloud-hosted Intelligence. The Skill delivery toggle is on, and skill candidates wait for review."
  … region truncated
````

---

## 2026-09-24

### 07:28 UTC — 6 pages, highest severity high · _npm run drift:sync_

**Low — /angular/agno/cli**

`/angular/agno/cli` · `angular__agno__cli.md`

Prose / text phrasing updated. Hash 52562329 ➔ e5919bb5.

````diff
- href="https://dashboard.operations.copilotkit.ai/"
+ href="https://intelligence.copilotkit.ai/"
````

**Medium — /angular/agno/intelligence/overview**

`/angular/agno/intelligence/overview` · `angular__agno__intelligence__overview.md`

Headings / Structure changed. Hash feede64c ➔ acce68d2.

````diff
- <IntelligenceOverview />
- ## What is CopilotKit Intelligence?
- You want Rich Threads, User Memory, Automatic Learning, Channels, and Product Analytics without operating that storage yourself. CopilotKit Intelligence adds that layer to the CopilotKit app you already have. Your frontend, your agent, and your model stay where they are.
- Open the page for the one thing you want to add. Each page below owns that topic.
+ <IntelligenceOverview />
+ ## What is CopilotKit Intelligence?
+ You want Rich Threads, User Memory, Automatic Learning, Channels, and Product Analytics without operating that storage yourself. CopilotKit Intelligence adds that layer to the CopilotKit app you already have. Your frontend, your agent, and your model stay where they are.
+ Open the page for the one thing you want to add. Each page below owns that topic.
  … region truncated
````

**High — /angular/agno/intelligence/managed-intelligence-platform**

`/angular/agno/intelligence/managed-intelligence-platform` · `angular__agno__intelligence__managed-intelligence-platform.md`

Code block content changed. Hash 833914e4 ➔ 04567795.

````diff
- <OpsPlatformCTA
- variant="inline"
- title="Start cloud-hosted setup"
- body="Sign in, create an organization, then return to the CLI or the web app and select a project."
+ The web app is for the people who build and operate the app. The people who chat with your agent do not sign in there. Your app still identifies those people and passes that identity through the runtime.
+ Compare this deployment with self-hosted on the [architecture page](/angular/agno/intelligence/intelligence-platform).
+ ## Get started
+ Start at [intelligence.copilotkit.ai](https://intelligence.copilotkit.ai) or in the CopilotKit CLI.
  … region truncated
````

**Low — /angular/agno/intelligence/intelligence-platform**

`/angular/agno/intelligence/intelligence-platform` · `angular__agno__intelligence__intelligence-platform.md`

Prose / text phrasing updated. Hash 50e9b6c1 ➔ 36df60fc.

````diff
- href="https://dashboard.operations.copilotkit.ai/"
- surface="docs_intelligence_architecture_intro"
- />
- ## Runtime and platform roles
+ href="https://intelligence.copilotkit.ai/"
+ surface="docs_intelligence_architecture_intro"
+ />
+ ## Runtime and platform roles
  … region truncated
````

**Medium — /angular/agno/intelligence/memories**

`/angular/agno/intelligence/memories` · route `/memory` · `angular__agno__intelligence__memories.md`

Headings / Structure changed. Hash b3e9effd ➔ feddeac3.

````diff
- ## What is a memory?
- A memory is a short, durable statement about a user or a project, stored outside
- any single thread. "Prefers concise status updates" is a memory. The forty
- messages that revealed the preference are a thread.
+ ## Start with your coding agent
+ Copy this prompt into your coding agent to inspect your existing CopilotKit app and configure long-term memory for your users. Prefer to work through the setup yourself? Follow the manual steps below.
+ ### Copy this prompt into your coding agent
+ ```text
  … region truncated
````

**Medium — /angular/agno/learning**

`/angular/agno/learning` · `angular__agno__learning.md`

Headings / Structure changed. Hash 24394093 ➔ 6bd439d8.

````diff
- ## How Automatic Learning works
- Learning starts with a container, which groups Threads from the same kind of work. Intelligence analyzes completed runs in that container and summarizes recurring patterns as Insights.
- When a pattern can be reused, Learning proposes a Skill. You review the supporting Threads and decide whether to publish it. A published Skill is a versioned set of instructions that you load into your agent; Learning does not change the model itself.
- Automatic Learning checks eligible containers on a daily schedule. After you approve a skill, [skill delivery](/angular/agno/intelligence/learned-skills) makes it available to connected agents. A scheduled run does not approve skills. Turning on delivery does not connect your agent for you.
+ ## Start with your coding agent
+ Copy this prompt into your coding agent to inspect your existing app and configure Automatic Learning for one focused workflow. Prefer to work through the setup yourself? Follow the manual steps below.
+ #### Copy this prompt into your coding agent
+ ```text
  … region truncated
````

---

---

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

---
