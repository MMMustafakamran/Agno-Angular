import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideCopilotKit,
  type SandboxFunction,
} from '@copilotkit/angular';
import { z } from 'zod';

import { routes } from '../app/app.routes';

/**
 * THE FIX, not doc code: the guide's function with the generic dropped and the
 * cast moved inside the handler (1-Demos/DEMO_SCRIPT.md, Clip 3). Compiled only
 * under `--configuration doc-frontend-tools-fixed`.
 */
const setDashboardFilter: SandboxFunction = {
  name: 'setDashboardFilter',
  description: 'Set the active dashboard filter',
  parameters: z.object({ filter: z.string() }),
  handler: async (args) => {
    const { filter } = args as { filter: string };
    sessionStorage.setItem('dashboard-filter', filter);
    return { applied: filter };
  },
};


/**
 * One provider at the application root, so a conversation started on any demo
 * route continues on every other route.
 *
 * `runtimeUrl` points at the Copilot Runtime from the quickstart — the
 * supported path, where the browser never talks to the Agno agent directly.
 * The `AgnoAgent` binding itself lives server-side in frontend/server.ts.
 *
 * `a2ui.recovery` and `openGenerativeUI.sandboxFunctions` are the A2UI and
 * generative-UI guide options. No `a2ui.catalog` is set yet — supplying one is
 * what actually registers the render_a2ui renderer, so A2UI stays inert until
 * a catalog is added. See README known issues.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideClientHydration(),
    provideCopilotKit({
      runtimeUrl: 'http://localhost:8210/api/copilotkit',
      // The Inspector mounts itself from 0.4.0 on; `enableInspector` is the
      // only control the page gives you. Left `true` so the launcher is on
      // screen for the /inspector recording — the doc's own sample is the
      // opposite, `enableInspector: false` to hide it during development.
      // Production and server renders drop it regardless of this flag.
      // https://docs.copilotkit.ai/angular/agno/inspector
      enableInspector: true,
      a2ui: {
        recovery: { showAfterMs: 2_000, showAfterAttempts: 2 },
      },
      openGenerativeUI: {
        // The guide's own line, unchanged: with the function typed as a plain
        // SandboxFunction it is assignable, so no cast is needed here.
        sandboxFunctions: [setDashboardFilter],
      },
    }),
  ],
};
