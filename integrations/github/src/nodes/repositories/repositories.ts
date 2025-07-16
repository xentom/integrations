import { createRepositoryWebhook } from '@/helpers/webhooks';
import { repositoryFullName } from '@/pins';
import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

import * as i from '@xentom/integration-framework';

const category = {
  path: ['Repositories'],
} satisfies i.NodeCategory;

export const onRepository = i.generic(<
  I extends i.InferPinRecordOutput<typeof inputs>,
>() => {
  const inputs = {
    repository: repositoryFullName,
    actionType: i.pins.data({
      control: i.controls.select({
        options: [
          {
            label: 'Archived',
            value: 'archived',
          },
          {
            label: 'Deleted',
            value: 'deleted',
          },
          {
            label: 'Edited',
            value: 'edited',
          },
          {
            label: 'Privatized',
            value: 'privatized',
          },
          {
            label: 'Publicized',
            value: 'publicized',
          },
          {
            label: 'Renamed',
            value: 'renamed',
          },
          {
            label: 'Transferred',
            value: 'transferred',
          },
          {
            label: 'Unarchived',
            value: 'unarchived',
          },
        ],
      }),
    }),
  };

  type RepositoryEvent = EmitterWebhookEvent<`repository.${I['actionType']}`>;
  return i.nodes.trigger({
    category,
    inputs,
    outputs: {
      id: i.pins.data<RepositoryEvent['id']>(),
      payload: i.pins.data<RepositoryEvent['payload']>(),
    },
    async subscribe(opts) {
      opts.state.webhooks.on(
        `repository.${opts.inputs.actionType}`,
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
