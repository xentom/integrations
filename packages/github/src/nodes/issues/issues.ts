import * as i from '@xentom/integration-framework';

import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

import { createRepositoryWebhook } from '@/helpers/webhooks';
import * as pins from '@/pins';

const category = {
  path: ['Issues'],
} satisfies i.NodeCategory;

export const onIssue = i.generic(<
  I extends i.GenericInputs<typeof inputs>,
>() => {
  const inputs = {
    repository: pins.repository.fullName,
    actionType: pins.issue.actionType,
  };

  type IssueEvent = EmitterWebhookEvent<`issues.${I['actionType']}`>;
  return i.nodes.trigger({
    category,
    inputs,
    outputs: {
      id: i.pins.data<IssueEvent['id']>(),
      payload: i.pins.data<IssueEvent['payload']>(),
    },
    async subscribe(opts) {
      opts.state.webhooks.on(
        `issues.${opts.inputs.actionType}`,
        ({ id, payload }) => {
          if (payload.repository.full_name !== opts.inputs.repository) {
            return;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            id,
            payload,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
        },
      );

      await createRepositoryWebhook({
        repository: opts.inputs.repository,
        webhook: opts.webhook,
        state: opts.state,
      });
    },
  });
});
