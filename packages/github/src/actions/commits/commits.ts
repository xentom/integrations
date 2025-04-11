import { actions, pins } from '@acme/integration';
import * as v from 'valibot';
import { repositoryFullName } from '../../pins';
import { createRepositoryWebhook } from '../../helpers/webhooks';
import { type WebhookEventDefinition } from '@octokit/webhooks/types';

export const onPush = actions.trigger({
  inputs: {
    repository: repositoryFullName,
  },

  outputs: {
    payload: pins.data({
      displayName: 'Payload',
      description: 'A push event from GitHub',
      schema: v.custom<WebhookEventDefinition<'push'>>(() => true),
    }),
  },

  async subscribe({ state, inputs, webhook, next }) {
    state.webhooks.on('push', ({ payload }) => {
      if (payload.repository.full_name !== inputs.repository) {
        return;
      }

      next({ payload });
    });

    await createRepositoryWebhook({
      repository: inputs.repository,
      webhook,
      state,
    });
  },
});
