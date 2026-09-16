/**
 * Threads — recorded as a finding about what the guide leaves out.
 *
 * https://docs.copilotkit.ai/angular/agno/guides/threads-memory-attachments-headless
 *
 * Both surfaces work here: `frontend/server.ts` passes `intelligence` to
 * `CopilotRuntime`, so `injectThreads` resolves and the drawer lists real
 * threads. The guide never says that is needed. It presents `injectThreads` and
 * `CopilotThreadsDrawer` as drop-ins and mentions neither
 * `CopilotKitIntelligence` nor a project API key; the wiring lives on
 * `/angular/agno/intelligence/connect-your-runtime`, which this page never
 * links. Follow this page alone and both surfaces stay empty with no error.
 *
 * The second finding is on screen the moment a thread exists: the guide's
 * custom list emits bare `<button>` elements with no wrapper, so "New
 * conversation" and every thread name run together on one line. That is the
 * published markup and it stays unstyled.
 *
 * The Notepad note opens before the demo so the claim is on screen while the
 * evidence is still behind it, and is elaborated once a thread has appeared in
 * both surfaces.
 */
import { type Page } from 'playwright';

import { sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { beat, humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';

import { closeNotepadNote, openNotepadWindow, typeInNotepad } from './notepad';

/** Clicks a control if it is there, and says so if it is not. */
async function clickIfPresent(page: Page, selector: string, label: string): Promise<void> {
  const el = page.locator(selector).first();
  const box = await el
    .waitFor({ state: 'visible', timeout: 4000 })
    .then(() => el.boundingBox())
    .catch(() => null);

  if (!box) {
    console.log(`   · ${label} not present.`);
    return;
  }

  await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 22);
  await sleep(250);
  await humanClick(page);
  await beat(1000);
}

export const runThreadsAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
) => {
  await page
    .locator('app-thread-list')
    .first()
    .waitFor({ state: 'visible', timeout: 15000 })
    .catch(() => {});
  await sleep(600);

  console.log(`   📝 Stating the finding before demonstrating it...`);
  await openNotepadWindow(page, 'threads-issue.txt', {
    right: '28px',
    top: '95px',
    width: '640px',
    height: '560px',
  });
  await typeInNotepad(
    page,
    [
      'threads — works, but only because of an unstated step',
      '',
      '- the guide teaches injectThreads + CopilotThreadsDrawer',
      '  as drop-ins, and never mentions Intelligence',
      '- both need CopilotKitIntelligence passed to the runtime',
      '- that wiring is on intelligence/connect-your-runtime,',
      '  which this page never links',
    ],
    1550,
    280,
  );
  await beat(1500);

  // ── The headless list: start a conversation from the guide's own button ────
  console.log(`   🧵 Driving the hand-built injectThreads list...`);
  await clickIfPresent(
    page,
    'app-thread-list button:has-text("New conversation")',
    'New conversation',
  );
  await clickIfPresent(page, 'app-thread-list button:has-text("Retry")', 'Retry');

  // ── Send a message so a thread actually exists to be listed ───────────────
  console.log(`   💬 Sending a message so the thread gets created and named...`);
  const msgCount = await sendPrompt(page, config.prompt, {
    inputSelector: 'app-conversations textarea',
    submitSelector: 'app-conversations copilot-chat-send-button button',
  });
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 4000, msgCount);
  await beat(1500);

  // ── The drawer now lists that thread; select it ───────────────────────────
  const threadEntry = page
    .locator('copilot-threads-drawer button, copilot-threads-drawer [role="button"]')
    .filter({ hasNotText: 'New Conversation' })
    .first();
  const entryBox = await threadEntry
    .waitFor({ state: 'visible', timeout: 8000 })
    .then(() => threadEntry.boundingBox())
    .catch(() => null);

  if (entryBox) {
    console.log(`   🧵 Selecting the thread from CopilotThreadsDrawer...`);
    await humanGlide(page, entryBox.x + entryBox.width / 2, entryBox.y + entryBox.height / 2, 22);
    await sleep(350);
    await humanClick(page);
    await beat(1600);
  } else {
    console.log(`   · No thread entry appeared in the drawer.`);
  }

  // ── Linger on the headless list, where the unstyled markup is visible ─────
  const list = page.locator('app-thread-list').first();
  const listBox = await list.boundingBox().catch(() => null);
  if (listBox) {
    console.log(`   🔎 Holding on the guide's unstyled thread list...`);
    await humanGlide(page, listBox.x + listBox.width / 2, listBox.y + 20, 22);
    await beat(1800);
  }

  console.log(`   📝 Elaborating now that both surfaces have resolved...`);
  await typeInNotepad(
    page,
    [
      '',
      '- with intelligence wired, both surfaces resolve:',
      '  the thread is created, named and listed',
      '- follow the page alone and they stay empty, silently',
      '- the guide’s custom list emits bare <button>s with',
      '  no wrapper, so they run together on one line',
      '',
      'pkgs: @copilotkit/angular 0.5.1, runtime 1.70.1,',
      '@angular/cdk 22.1.5',
    ],
    1550,
    380,
  );
  await beat(5000);
  await closeNotepadNote(page);
  await beat(1200);
};
