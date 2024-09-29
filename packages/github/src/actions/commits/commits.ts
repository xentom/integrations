import * as pins from '@/pins';
import { createRepositoryWebhook } from '@/utils/webhook';
import { IconGitCommit } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Commits';

export const onCommit = createAction({
  group,
  icon: IconGitCommit,
  inputs: {
    owner: pin.string(),
    repository: pin.string(),
  },
  outputs: {
    exec: pin.exec(),
    commit: pins.commit,
  },
  run(context) {
    context.state.webhooks.on('push', ({ payload }) => {
      if (
        payload.repository.full_name !==
        `${context.inputs.owner}/${context.inputs.repository}`
      ) {
        return;
      }

      payload.commits.forEach((commit) => {
        context.next('exec', {
          commit,
        });
      });
    });

    createRepositoryWebhook(context, {
      owner: context.inputs.owner,
      repository: context.inputs.repository,
      events: ['push'],
    });
  },
});
