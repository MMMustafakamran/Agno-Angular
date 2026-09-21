/**
 * Human-in-the-loop — the run pauses until a human answers.
 *
 * https://docs.copilotkit.ai/angular/agno/guides/human-in-the-loop
 *
 * The prompt is phrased to make the agent reach for `requestApproval` rather
 * than answer directly; the recording is only worth anything if the card
 * actually appears and the run visibly resumes after the click.
 */
import { type Page } from 'playwright';

import { sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { beat, humanClick, humanGlide, sleep } from '../core/overlays/cursor';
import { type PageActionHandler, type PageRecordConfig } from '../core/types';

export const runHitlAction: PageActionHandler = async (
  page: Page,
  config: PageRecordConfig,
  _rootPath,
  ctx,
) => {
  console.log(`   🛡️ Asking for something consequential enough to need approval...`);
  const msgCount = await sendPrompt(page, config.prompt);

  const approvalCard = page.locator('app-approval-card').last();
  const waitForCard = (timeout: number) =>
    approvalCard
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);

  let cardAppeared = await waitForCard(25000);
  let lastCount = msgCount;

  if (!cardAppeared) {
    // Not fatal to the take, but the whole point of the page is the interrupt,
    // so say plainly that it did not happen on the first turn.
    ctx.fail(
      'app-approval-card never appeared -- the agent answered without calling ' +
        'requestApproval, so nothing was paused.',
    );

    // The agent asked for confirmation in prose. Give it, so the clip shows
    // whether the confirmation reaches the tool or is answered in prose again.
    const followUp = config.prompts?.[1];
    if (followUp) {
      await waitForAgentResponseCompletion(page, 1500, msgCount);
      console.log(`   💬 Answering the agent's question: "${followUp}"`);
      lastCount = await sendPrompt(page, followUp);
      cardAppeared = await waitForCard(25000);
      if (cardAppeared) {
        ctx.warn(
          'requestApproval was only called on the second turn, after the user ' +
            'confirmed in chat. As published, the guide pauses on the first.',
        );
      } else {
        ctx.warn('Still no approval card after confirming in chat.');
      }
    }
  }

  if (cardAppeared) {
    await beat(1500);
    const approveBtn = page
      .locator('app-approval-card button:has-text("Approve")')
      .last();

    const box = await approveBtn.boundingBox().catch(() => null);
    if (box) {
      console.log(`   👉 Approving.`);
      await humanGlide(page, box.x + box.width / 2, box.y + box.height / 2, 22);
      await sleep(600);
      await humanClick(page);
    } else {
      ctx.warn('Approval card rendered but no Approve button was found on it.');
      await approveBtn.click().catch(() => {});
    }
  }

  // The decision returns to the agent and the run continues, so the reply that
  // matters is the one after the click (or after the follow-up).
  await waitForAgentResponseCompletion(page, config.waitAfterPromptMs ?? 4000, lastCount);
};
