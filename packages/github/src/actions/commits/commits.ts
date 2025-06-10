import { createRepositoryWebhook } from '#src/helpers/webhooks';
import { repositoryFullName } from '#src/pins/index';
import { actions, pins } from '@acme/integration';
import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

const category = 'Commits';

export const onPush = actions.trigger({
  category,
  inputs: {
    repository: repositoryFullName,
  },
  outputs: {
    id: pins.data<EmitterWebhookEvent<'push'>['id']>(),
    payload: pins.data<EmitterWebhookEvent<'push'>['payload']>(),
  },
  async subscribe({ state, inputs, webhook, next }) {
    state.webhooks.on('push', ({ id, payload }) => {
      if (payload.repository.full_name !== inputs.repository) {
        return;
      }

      next({
        id,
        payload,
      });
    });

    await createRepositoryWebhook({
      repository: inputs.repository,
      webhook,
      state,
    });
  },
});
