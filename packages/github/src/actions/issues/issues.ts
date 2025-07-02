import { createRepositoryWebhook } from '@/helpers/webhooks';
import { repositoryFullName } from '@/pins';
import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

import * as i from '@acme/integration';

const category = {
  path: ['Issues'],
} satisfies i.ActionCategory;

export const onIssue = i.generic(<
  I extends i.InferPinRecordOutput<typeof inputs>,
>() => {
  const inputs = {
    repository: repositoryFullName,
    actionType: i.pins.data({
      control: i.controls.select({
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
  return i.trigger({
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
