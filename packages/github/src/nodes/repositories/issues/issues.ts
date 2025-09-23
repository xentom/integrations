import * as i from '@xentom/integration-framework';

import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

import { extractOwnerAndRepo } from '@/helpers/options';
import { createRepositoryWebhook } from '@/helpers/webhooks';
import * as pins from '@/pins';

const category = {
  path: ['Repositories', 'Issues'],
} satisfies i.NodeCategory;

export const onIssue = i.generic(<
  I extends i.GenericInputs<typeof inputs>,
>() => {
  const inputs = {
    repository: pins.repository.name,
    action: pins.issue.action,
  };

  type WebhookEvent = EmitterWebhookEvent<`issues.${I['action']}`>;

  return i.nodes.trigger({
    category,
    inputs,
    outputs: {
      id: i.pins.data<WebhookEvent['id']>(),
      payload: i.pins.data<WebhookEvent['payload']>(),
    },
    async subscribe(opts) {
      opts.state.webhooks.on(
        `issues.${opts.inputs.action}`,
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

export const getIssue = i.nodes.callable({
  category,
  description: 'Get details of a specific issue',
  inputs: {
    repository: pins.repository.name,
    issueNumber: pins.issue.number,
  },
  outputs: {
    issue: pins.issue.item,
  },
  async run(opts) {
    const issue = await opts.state.octokit.rest.issues.get({
      ...extractOwnerAndRepo(opts.inputs.repository),
      issue_number: opts.inputs.issueNumber,
    });

    return opts.next({
      issue: issue.data,
    });
  },
});

export const createIssue = i.nodes.callable({
  category,
  description: 'Create a new issue in a repository',
  inputs: {
    repository: pins.repository.name,
    title: pins.issue.title,
    body: pins.issue.body.with({
      optional: true,
    }),
    labels: pins.issue.labels.with({
      optional: true,
    }),
    assignees: pins.issue.assignees.with({
      optional: true,
    }),
  },
  outputs: {
    issue: pins.issue.item,
  },
  async run(opts) {
    const issues = await opts.state.octokit.rest.issues.create({
      ...extractOwnerAndRepo(opts.inputs.repository),
      title: opts.inputs.title,
      body: opts.inputs.body,
      labels: opts.inputs.labels,
      assignees: opts.inputs.assignees,
    });

    return opts.next({
      issue: issues.data,
    });
  },
});

export const updateIssue = i.nodes.callable({
  category,
  description: 'Update an existing issue',
  inputs: {
    repository: pins.repository.name,
    issueNumber: pins.issue.number,
    title: pins.issue.title.with({
      optional: true,
    }),
    body: pins.issue.body.with({
      optional: true,
    }),
    state: pins.issue.state.with({
      optional: true,
    }),
    labels: pins.issue.labels.with({
      optional: true,
    }),
    assignees: pins.issue.assignees.with({
      optional: true,
    }),
  },
  outputs: {
    issue: pins.issue.item,
  },
  async run(opts) {
    const issues = await opts.state.octokit.rest.issues.update({
      ...extractOwnerAndRepo(opts.inputs.repository),
      issue_number: opts.inputs.issueNumber,
      labels: opts.inputs.labels,
      assignees: opts.inputs.assignees,
      title: opts.inputs.title,
      body: opts.inputs.body,
      state: opts.inputs.state,
    });

    return opts.next({
      issue: issues.data,
    });
  },
});
