# Self-managed agents

> Connect AG-UI agents that you host and secure yourself.

The frontend provider usually talks to your agents through the
[runtime](/angular/agno/backend/copilot-runtime): the frontend hits `runtimeUrl`, the runtime
discovers agents from `/info`, and a proxy forwards every run server-side. But you
can also hand the provider **AG-UI agent instances directly** and skip the runtime
for those agents. There are separate production and local-development options,
and choosing the right one matters.

## Production: self-managed agents

`selfManagedAgents` is the supported configuration option for connecting agents you manage
yourself, for example an [`HttpAgent`](/angular/agno/backend/ag-ui) pointing at an
AG-UI-compatible backend you own and have already secured:

<Callout type="info" title="Part of CopilotKit Intelligence">
  `selfManagedAgents` is part of CopilotKit's [Enterprise
  Intelligence tier](/angular/agno/intelligence/intelligence-platform). [Talk to an
  engineer](https://copilotkit.ai/talk-to-an-engineer) about licensing for
  production use.
</Callout>




```ts title="src/app/app.config.ts"
import { ApplicationConfig } from "@angular/core";
import { HttpAgent } from "@ag-ui/client";
import { provideCopilotKit } from "@copilotkit/angular";

const supportAgent = new HttpAgent({
  url: "https://agents.example.com/support",
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideCopilotKit({
      selfManagedAgents: { "support-agent": supportAgent },
    }),
  ],
};
```


Each key is the `agentId` that chat components and frontend agent APIs use to
address that agent. Self-managed agents use your transport and your security
model. Because the requests don't pass through the CopilotKit runtime, the
runtime's server-side auth, middleware, and routing do not apply. Your agent
endpoint must authenticate and authorize every request.

<Callout type="info">
You can combine `selfManagedAgents` with `runtimeUrl`. Runtime-discovered agents
and self-managed agents coexist; address each by its `agentId`.
</Callout>

## Development: local agents




The Angular provider's `agents` option accepts the same shape for local,
in-browser development:

```ts title="src/app/app.config.ts"
import { HttpAgent } from "@ag-ui/client";
import { provideCopilotKit } from "@copilotkit/angular";

const localAgent = new HttpAgent({ url: "http://localhost:8000" });

provideCopilotKit({
  agents: { "my-agent": localAgent },
})
```

Use `agents` only for local development and prototyping. For production,
switch to `selfManagedAgents` after securing the endpoint, or move the agent
behind the [runtime](/angular/agno/backend/copilot-runtime).


## How they relate

Both sources feed the same client-side agent registry. When both are supplied
they are merged, and **`selfManagedAgents` wins on a key collision**:




```ts
// effective agents ≈ { ...agents, ...selfManagedAgents }
```


Supplying agents through either provider option also satisfies the frontend
configuration check when at least one local agent is registered.



| | `selfManagedAgents` | Local agents |
|---|---|---|
| **Intended for** | Production, agents you manage | Local dev / prototyping |
| **Auth** | Your responsibility | Your responsibility |
| **Runtime middleware / routing** | Not applied | Not applied |
| **Precedence on collision** | Wins | Overridden by `selfManagedAgents` |

## Related

- [Copilot Runtime](/angular/agno/backend/copilot-runtime): the recommended runtime-backed path and its trade-offs compared with direct connections.
- [Connect AG-UI agents](/angular/agno/backend/ag-ui): the `AbstractAgent` / `HttpAgent` interface these options accept.
- [Auth](/angular/agno/auth): securing agent traffic when you self-manage the connection.
