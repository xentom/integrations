import { createRepositoryWebhook } from '@/helpers/webhooks';
import { repositoryFullName } from '@/pins';
import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

import * as i from '@acme/integration';

const category = {
  path: ['Commits'],
} satisfies i.ActionCategory;

export const onPush = i.trigger({
  category,
  inputs: {
    repository: repositoryFullName,
  },
  outputs: {
    id: i.pins.data<EmitterWebhookEvent<'push'>['id']>(),
    payload: i.pins.data<EmitterWebhookEvent<'push'>['payload']>(),
  },
  async subscribe(opts) {
    opts.state.webhooks.on('push', ({ id, payload }) => {
      if (payload.repository.full_name !== opts.inputs.repository) {
        return;
      }

      void opts.next({
        id,
        payload,
      });
    });

    await createRepositoryWebhook({
      repository: opts.inputs.repository,
      webhook: opts.webhook,
      state: opts.state,
    });
  },
});
