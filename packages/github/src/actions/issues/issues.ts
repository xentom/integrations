import { createRepositoryWebhook } from '#src/helpers/webhooks';
import { repositoryFullName } from '#src/pins/index';
import {
  actions,
  pins,
  generic,
  controls,
  type InferPinRecordOutput,
} from '@acme/integration';
import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

const category = 'Issues';

export const onIssue = generic(<
  I extends InferPinRecordOutput<typeof inputs>
>() => {
  const inputs = {
    repository: repositoryFullName,
    actionType: pins.data({
      control: controls.select({
        options: [
          {
            label: 'Assigned',
            value: 'assigned',
          },
          {
            label: 'Closed',
            value: 'closed',
          },
          {
            label: 'Deleted',
            value: 'deleted',
          },
          {
            label: 'Demilestoned',
            value: 'demilestoned',
          },
          {
            label: 'Edited',
            value: 'edited',
          },
          {
            label: 'Labeled',
            value: 'labeled',
          },
          {
            label: 'Locked',
            value: 'locked',
          },
          {
            label: 'Milestoned',
            value: 'milestoned',
          },
          {
            label: 'Opened',
            value: 'opened',
          },
          {
            label: 'Pinned',
            value: 'pinned',
          },
          {
            label: 'Reopened',
            value: 'reopened',
          },
          {
            label: 'Transferred',
            value: 'transferred',
          },
          {
            label: 'Typed',
            value: 'typed',
          },
          {
            label: 'Unassigned',
            value: 'unassigned',
          },
          {
            label: 'Unlabeled',
            value: 'unlabeled',
          },
          {
            label: 'Unlocked',
            value: 'unlocked',
          },
          {
            label: 'Unpinned',
            value: 'unpinned',
          },
          {
            label: 'Untyped',
            value: 'untyped',
          },
        ],
      }),
    }),
  };

  type IssueEvent = EmitterWebhookEvent<`issues.${I['actionType']}`>;
  return actions.trigger({
    category,
    inputs,
    outputs: {
      id: pins.data<IssueEvent['id']>(),
      payload: pins.data<IssueEvent['payload']>(),
    },
    async subscribe({ state, inputs, webhook, next }) {
      state.webhooks.on(`issues.${inputs.actionType}`, ({ id, payload }) => {
        if (payload.repository.full_name !== inputs.repository) {
          return;
        }

        next({
          id,
          payload,
        } as any);
      });

      await createRepositoryWebhook({
        repository: inputs.repository,
        webhook,
        state,
      });
    },
  });
});
