# CopilotKit Intelligence

> CopilotKit Intelligence adds Rich Threads, User Memories, Automatic Learning, Channels, and Product Analytics to the CopilotKit app you already run.


<IntelligenceOverview />

## What is CopilotKit Intelligence?

You want Rich Threads, User Memory, Automatic Learning, Channels, and Product Analytics without operating that storage yourself. CopilotKit Intelligence adds that layer to the CopilotKit app you already have. Your frontend, your agent, and your model stay where they are.

Open the page for the one thing you want to add. Each page below owns that topic.

Connect an existing app in the [quickstart](/angular/agno/intelligence/quickstart).

## What Intelligence gives you

- [Rich Threads](/angular/agno/guides/threads-memory-attachments-headless): Save the conversation and open it again on another device.
- [User Memories](/angular/agno/intelligence/memories): Keep facts about a person after the conversation ends.
- [Automatic Learning](/angular/agno/learning): Turn real usage into skills you can review and publish.
- [Product Analytics](/angular/agno/intelligence/analytics): See what people do with your agent.
- [Channels](/angular/agno/intelligence/channels): Run the same agent in Slack or Microsoft Teams.
- [Inspector](/angular/agno/inspector): Watch threads, learning, and tool calls from your app on localhost.

## Already have LangGraph threads or ADK sessions?

Import existing history once, then add Rich Threads around your current agent:

- [Import LangGraph threads](/angular/langgraph-python/threads-import) from LangGraph Server, LangGraph Platform, or LangSmith Deployments that expose the LangGraph SDK thread and run APIs. Arbitrary LangChain message stores, LangSmith traces, and embedded checkpointers are not supported sources.
- [Import Google ADK sessions](/angular/google-adk/threads-import) from supported ADK database session stores or Vertex/Agent Engine session history.

Import copies history; it does not establish ongoing database replication. Future CopilotKit-mediated runs persist to Intelligence and continue through native persistence when your agent remains connected to a durable LangGraph checkpointer or deployment, or an ADK session service with appropriate retention. Keep that native persistence in place.

## Choose where Intelligence runs

Cloud-hosted and self-hosted use the same app APIs, so you can start on one and move later.

<div className="intelligence-accent-cards">
<CTACards
  columns={2}
  cards={[
    {
      iconKey: "cloud",
      title: "Cloud-hosted",
      description:
        "CopilotKit runs Intelligence for you. Create a project, get a key, and manage your plan in the web app.",
      href: "/intelligence/managed-intelligence-platform",
    },
    {
      iconKey: "server",
      title: "Self-hosted",
      description:
        "Run Intelligence in your own Kubernetes cluster or AWS account with the Helm chart or the ECS bundle.",
      href: "/intelligence/self-hosting",
    },
  ]}
/>
</div>
