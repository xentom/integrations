import * as pins from '@/pins';
import { createRepositoryWebhook } from '@/utils/webhook';
import { type EmitterWebhookEventName } from '@octokit/webhooks';
import { type IssuesEvent } from '@octokit/webhooks-types';
import { IconCircleDot, IconUser } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Issues';

export const onIssueOpened = createBasicIssueTrigger('issues.opened');
export const onIssueClosed = createBasicIssueTrigger('issues.closed');
export const onIssueReopened = createBasicIssueTrigger('issues.reopened');
export const onIssueDeleted = createBasicIssueTrigger('issues.deleted');
export const onIssueLocked = createBasicIssueTrigger('issues.locked');
export const onIssueUnlocked = createBasicIssueTrigger('issues.unlocked');
export const onIssuePinned = createBasicIssueTrigger('issues.pinned');
export const onIssueUnpinned = createBasicIssueTrigger('issues.unpinned');

type IssueEventNames<T> = T extends `issues.${string}` ? T : never;

function createBasicIssueTrigger(
  event: IssueEventNames<EmitterWebhookEventName>,
) {
  return createAction({
    group,
    icon: IconCircleDot,
    inputs: {
      owner: pin.string(),
      repository: pin.string(),
    },
    outputs: {
      exec: pin.exec(),
      issue: pins.issue,
      repository: pins.repository,
      sender: pin.custom<IssuesEvent['sender']>().extend({
        icon: IconUser,
        isEditable: false,
      }),
    },
    run(context) {
      context.state.webhooks.on(event, ({ payload }) => {
        if (
          payload.repository.full_name !==
          `${context.inputs.owner}/${context.inputs.repository}`
        ) {
          return;
        }

        context.next('exec', {
          issue: payload.issue,
          repository: payload.repository,
          sender: payload.sender,
        });
      });

      createRepositoryWebhook(context, {
        owner: context.inputs.owner,
        repository: context.inputs.repository,
        events: ['issues'],
      });
    },
  });
}
