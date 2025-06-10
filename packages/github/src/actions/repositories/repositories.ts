import { createRepositoryWebhook } from '#src/helpers/webhooks';
import { repositoryFullName } from '#src/pins/index';
import {
  actions,
  pins,
  generic,
  controls,
  type InferPinRecordOutput,
  type DataPin,
} from '@acme/integration';
import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

const category = 'Repositories';

type RepositoryActionType =
  | 'archived'
  | 'created'
  | 'deleted'
  | 'edited'
  | 'privatized'
  | 'publicized'
  | 'renamed'
  | 'transferred'
  | 'unarchived';

export const onRepository = generic(<
  I extends InferPinRecordOutput<typeof inputs>
>() => {
  const inputs = {
    repository: repositoryFullName,
    actionType: pins.data({
      control: controls.select<RepositoryActionType>({
        options: [
          {
            label: 'Archived',
            value: 'archived',
          },
          {
            label: 'Created',
            value: 'created',
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
  } as {
    repository: DataPin<string, string>;
    actionType: DataPin<RepositoryActionType, RepositoryActionType>;
  };

  type RepositoryEvent = EmitterWebhookEvent<`repository.${I['actionType']}`>;
  return actions.trigger({
    category,
    inputs: inputs,
    outputs: {
      id: pins.data<RepositoryEvent['id']>(),
      payload: pins.data<RepositoryEvent['payload']>(),
    },
    async subscribe({ state, inputs, webhook, next }) {
      state.webhooks.on(
        `repository.${inputs.actionType}`,
        ({ id, payload }) => {
          if (payload.repository.full_name !== inputs.repository) {
            return;
          }

          next({
            id,
            payload,
          } as any);
        }
      );

      await createRepositoryWebhook({
        repository: inputs.repository,
        webhook,
        state,
      });
    },
  });
});
