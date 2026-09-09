# CopilotKit Intelligence

> CopilotKit Intelligence adds persistent threads, memory, analytics, automatic learning, and production operations on top of the runtime you already run.



<IntelligenceOverview />

## What is CopilotKit Intelligence?

CopilotKit Intelligence is CopilotKit's production layer for durable threads, persistence, hosted inspection, and operational visibility. It sits beside your CopilotKit runtime and gives production agentic applications shared infrastructure without changing the frontend SDK, AG-UI protocol, or agent framework you use.

Start here when you are deciding what the platform gives you and where it should run. The rest of the Intelligence docs are deeper dives into the specific feature or hosting path you choose.

Ready to connect an existing app? Follow the [CopilotKit Intelligence quickstart](/angular/agno/intelligence/quickstart) to store and inspect your first thread.

<Callout type="info" title="See this in Inspector">
  Open Inspector on localhost. Go to **Learning**.
  Review published Skills, their supporting Insights, and the Thread evidence
  behind each pattern. Inspector also shows when new Threads are ready for a
  Learning run; start runs and review Skill candidates in the Intelligence web
  app.

  More detail: [Inspector](/angular/agno/inspector).
</Callout>


## What the platform adds

| Capability | What it gives you | Deeper dive |
|---|---|---|
| Durable threads and persistence | Resumable conversations that survive reloads, devices, and browser sessions. | [Threads](/angular/agno/guides/threads-memory-attachments-headless) and [Threads & Persistence Architecture](/angular/agno/intelligence/threads-explained) |
| Memory | Durable facts and preferences that can be recalled across conversations. | [Memories & Recall](/angular/agno/intelligence/memories) |
| Analytics | See what your agents do and where users get value, from the same interaction data. | [Analytics](https://www.copilotkit.ai/copilotkit-intelligence#analytics-insights) |
| Automatic learning | Agents improve from real usage. No fine-tuning pipeline required. | [Learning](/angular/agno/learning) |
| Cloud-hosted Intelligence features | Projects, project API keys, conversation history, thread inspection, and plan management. | [Cloud-hosted CopilotKit Intelligence](/angular/agno/intelligence/managed-intelligence-platform) |
| Platform-gated UI capabilities | Platform-gated UI surfaces such as Fully Headless Chat UI. | [Fully Headless Chat UI](/angular/agno/guides/threads-memory-attachments-headless) |
| Self-hosting | The same platform running inside your own Kubernetes cluster, VPC, or data boundary. | [Self-host CopilotKit Intelligence](/angular/agno/intelligence/self-hosting) |

<IntelligenceFeatureCards />

Follow the Intelligence quickstart to connect your runtime and confirm threads work.

[Open the Intelligence quickstart](/angular/agno/intelligence/quickstart)

## Hosting options

| Option | Choose it when | What you operate |
|---|---|---|
| [Cloud-hosted CopilotKit Intelligence](/angular/agno/intelligence/managed-intelligence-platform) | You want CopilotKit to run the platform for you: hosted projects, API keys, thread history, dashboard inspection, and plan management. | Your app, your runtime, your agent, and your model provider credentials. |
| [Self-host CopilotKit Intelligence](/angular/agno/intelligence/self-hosting) | You need the platform inside your own VPC, Kubernetes cluster, data residency boundary, or enterprise operations model. | The `copilot-intelligence` Helm release, Postgres, Redis, ingress, OIDC, secrets, upgrades, and monitoring. |

Both options use the same CopilotKit application surface. Your frontend still uses CopilotKit APIs, your runtime still speaks AG-UI, and your agents keep the same framework integration. The deployment choice changes the platform endpoint and credentials your runtime uses.

## Plans and access

The cloud-hosted version includes self-service plans for individual developers and teams, plus the Enterprise Intelligence tier for larger deployments. You manage cloud-hosted plans in the web app.

Self-hosted access is available on the Team self-hosted plan or a custom Enterprise plan. Use it when you have a concrete compliance, residency, network, or platform-operations requirement that makes a hosted service the wrong fit.

<OpsPlatformCTA
  variant="inline"
  title="Create a free CopilotKit Intelligence account"
  body="Start with the cloud-hosted Developer tier, create a project, and inspect persistent threads from the web app."
  surface="docs_intelligence_overview"
/>

## Which page should I read next?

| Goal | Read this |
|---|---|
| Decide what the platform includes | Stay on this overview. |
| Connect an app to hosted projects and API keys | [Cloud-hosted CopilotKit Intelligence](/angular/agno/intelligence/managed-intelligence-platform) |
| Run the platform in your own cluster | [Self-host CopilotKit Intelligence](/angular/agno/intelligence/self-hosting) |
| Understand the runtime/platform architecture | [CopilotKit Intelligence architecture](/angular/agno/intelligence/intelligence-platform) |
| Add persistent conversations to an app | [Threads](/angular/agno/guides/threads-memory-attachments-headless) |
| Give an agent durable context across conversations | [Memories & Recall](/angular/agno/intelligence/memories) |
| Turn real usage into reusable agent behavior | [Learning](/angular/agno/learning) |
| Understand thread replay and realtime sync | [Threads & Persistence Architecture](/angular/agno/intelligence/threads-explained) |

## FAQs

### Does my application code change between hosting options?

No. Your frontend UI, CopilotKit runtime, and agent integration stay focused on CopilotKit APIs. The deployment mode changes which platform URL and credentials your runtime uses.

### What is the difference between a project API key and a license key?

A project API key connects your runtime to one cloud-hosted CopilotKit Intelligence project. A license key unlocks self-hosted CopilotKit Intelligence capabilities and does not require runtime traffic to go through the cloud-hosted service.

### Can I start cloud-hosted and move to self-hosted later?

Yes. The application integration is intentionally the same. Moving from cloud-hosted projects to self-hosting is available on the Team self-hosted plan or a custom Enterprise plan. Plan the migration around data movement, identity, network endpoints, and operational ownership rather than a frontend rewrite.
