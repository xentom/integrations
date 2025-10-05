import * as i from '@xentom/integration-framework';

import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

import { createRepositoryWebhook } from '@/helpers/webhooks';
import * as pins from '@/pins';

const nodes = i.nodes.group('Repositories/Commits');

type WebhookEvent = EmitterWebhookEvent<'push'>;

export const onPush = nodes.trigger({
  inputs: {
    repository: pins.repository.name,
  },
  outputs: {
    id: i.pins.data<WebhookEvent['id']>(),
    payload: i.pins.data<WebhookEvent['payload']>(),
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
