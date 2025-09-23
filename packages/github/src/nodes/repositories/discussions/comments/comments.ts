import * as i from '@xentom/integration-framework';

import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

import { createRepositoryWebhook } from '@/helpers/webhooks';
import * as pins from '@/pins';

const category = {
  path: ['Repositories', 'Discussions', 'Comments'],
} satisfies i.NodeCategory;

export const onDiscussionComment = i.generic(<
  I extends i.GenericInputs<typeof inputs>,
>() => {
  const inputs = {
    repository: pins.repository.name,
    action: pins.discussion.comment.action,
  };

  type WebhookEvent = EmitterWebhookEvent<`discussion_comment.${I['action']}`>;

  return i.nodes.trigger({
    category,
    inputs,
    outputs: {
      id: i.pins.data<WebhookEvent['id']>(),
      payload: i.pins.data<WebhookEvent['payload']>(),
    },
    async subscribe(opts) {
      opts.state.webhooks.on(
        `discussion_comment.${opts.inputs.action}`,
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
