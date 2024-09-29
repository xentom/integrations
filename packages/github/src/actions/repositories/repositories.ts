import * as pins from '@/pins';
import { createOrganizationWebhhok } from '@/utils/webhook';
import { type EmitterWebhookEventName } from '@octokit/webhooks';
import { type RepositoryEvent } from '@octokit/webhooks-types';
import { IconBook2, IconUser } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Repositories';

export const onRepositoryCreated =
  createBasicRepositoryTrigger('repository.created');

export const onRepositoryDeleted =
  createBasicRepositoryTrigger('repository.deleted');

export const onRepositoryArchived = createBasicRepositoryTrigger(
  'repository.archived',
);

export const onRepositoryUnarchived = createBasicRepositoryTrigger(
  'repository.unarchived',
);

export const onRepositoryPrivatized = createBasicRepositoryTrigger(
  'repository.privatized',
);

export const onRepositoryPublicized = createBasicRepositoryTrigger(
  'repository.publicized',
);

type IssueEventNames<T> = T extends `repository.${string}` ? T : never;

function createBasicRepositoryTrigger(
  event: IssueEventNames<EmitterWebhookEventName>,
) {
  return createAction({
    group,
    icon: IconBook2,
    inputs: {
      organization: pin.string(),
    },
    outputs: {
      exec: pin.exec(),
      repository: pins.repository,
      sender: pin.custom<RepositoryEvent['sender']>().extend({
        icon: IconUser,
        isEditable: false,
      }),
    },
    run(context) {
      context.state.webhooks.on(event, ({ payload }) => {
        if (payload.organization?.login !== context.inputs.organization) {
          return;
        }

        context.next('exec', {
          repository: payload.repository,
          sender: payload.sender,
        });
      });

      createOrganizationWebhhok(context, {
        organization: context.inputs.organization,
        events: ['repository'],
      });
    },
  });
}
