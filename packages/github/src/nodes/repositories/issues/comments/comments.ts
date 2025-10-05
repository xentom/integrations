import * as i from '@xentom/integration-framework';

import { type EmitterWebhookEvent } from '@octokit/webhooks';

import { extractOwnerAndRepo } from '@/helpers/options';
import { createRepositoryWebhook } from '@/helpers/webhooks';
import * as pins from '@/pins';

const nodes = i.nodes.group('Repositories/Issues/Comments');

export const onIssueComment = i.generic(<
  I extends i.GenericInputs<typeof inputs>,
>() => {
  const inputs = {
    repository: pins.repository.name,
    action: pins.issue.comment.action,
  };

  type WebhookEvent = EmitterWebhookEvent<`issue_comment.${I['action']}`>;

  return nodes.trigger({
    inputs,
    outputs: {
      id: i.pins.data<WebhookEvent['id']>(),
      payload: i.pins.data<WebhookEvent['payload']>(),
    },
    async subscribe(opts) {
      opts.state.webhooks.on(
        `issue_comment.${opts.inputs.action}`,
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

export const addIssueComment = nodes.callable({
  description: 'Add a comment to an issue',
  inputs: {
    repository: pins.repository.name,
    issueNumber: pins.issue.number,
    body: pins.issue.comment.body,
  },
  outputs: {
    comment: pins.issue.comment.item,
  },
  async run(opts) {
    const comment = await opts.state.octokit.rest.issues.createComment({
      ...extractOwnerAndRepo(opts.inputs.repository),
      issue_number: opts.inputs.issueNumber,
      body: opts.inputs.body,
    });

    return opts.next({
      comment: comment.data,
    });
  },
});
