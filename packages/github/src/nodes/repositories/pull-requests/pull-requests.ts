import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { type components } from '@octokit/openapi-types';
import { type EmitterWebhookEvent } from '@octokit/webhooks/types';

import { extractOwnerAndRepo } from '@/helpers/options';
import { createRepositoryWebhook } from '@/helpers/webhooks';
import * as pins from '@/pins';

const category = {
  path: ['Repositories', 'Pull Requests'],
} satisfies i.NodeCategory;

export const onPullRequest = i.generic(<
  I extends i.GenericInputs<typeof inputs>,
>() => {
  const inputs = {
    repository: pins.repository.name,
    action: pins.pullRequest.action,
  };

  type WebhookEvent = EmitterWebhookEvent<`pull_request.${I['action']}`>;

  return i.nodes.trigger({
    category,
    inputs,
    outputs: {
      id: i.pins.data<WebhookEvent['id']>(),
      payload: i.pins.data<WebhookEvent['payload']>(),
    },
    async subscribe(opts) {
      opts.state.webhooks.on(
        `pull_request.${opts.inputs.action}`,
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

export const createPullRequest = i.nodes.callable({
  category,
  description: 'Create a new pull request',
  inputs: {
    repository: pins.repository.name,
    title: pins.pullRequest.title,
    body: pins.pullRequest.body.with({
      optional: true,
    }),
    head: pins.pullRequest.head,
    base: pins.pullRequest.base,
    draft: pins.pullRequest.draft.with({
      optional: true,
    }),
  },
  outputs: {
    pullRequest: pins.pullRequest.item,
  },
  async run(opts) {
    const pulls = await opts.state.octokit.rest.pulls.create({
      ...extractOwnerAndRepo(opts.inputs.repository),
      title: opts.inputs.title,
      body: opts.inputs.body,
      head: opts.inputs.head,
      base: opts.inputs.base,
      draft: opts.inputs.draft,
    });

    return opts.next({
      pullRequest: pulls.data,
    });
  },
});

export const updatePullRequest = i.nodes.callable({
  category,
  description: 'Update an existing pull request',
  inputs: {
    repository: pins.repository.name,
    pullNumber: pins.pullRequest.number,
    title: pins.pullRequest.title.with({
      optional: true,
    }),
    body: pins.pullRequest.body.with({
      optional: true,
    }),
    state: pins.pullRequest.state.with({
      optional: true,
    }),
    base: pins.pullRequest.base.with({
      optional: true,
    }),
  },
  outputs: {
    pullRequest: pins.pullRequest.item,
  },
  async run(opts) {
    const pulls = await opts.state.octokit.rest.pulls.update({
      ...extractOwnerAndRepo(opts.inputs.repository),
      pull_number: opts.inputs.pullNumber,
      title: opts.inputs.title,
      body: opts.inputs.body,
      state: opts.inputs.state,
      base: opts.inputs.base,
    });

    return opts.next({
      pullRequest: pulls.data,
    });
  },
});

export const getPullRequest = i.nodes.callable({
  category,
  description: 'Get details of a specific pull request',
  inputs: {
    repository: pins.repository.name,
    pullNumber: pins.pullRequest.number,
  },
  outputs: {
    pullRequest: pins.pullRequest.item,
  },
  async run(opts) {
    const pulls = await opts.state.octokit.rest.pulls.get({
      ...extractOwnerAndRepo(opts.inputs.repository),
      pull_number: opts.inputs.pullNumber,
    });

    return opts.next({
      pullRequest: pulls.data,
    });
  },
});

export const mergePullRequest = i.nodes.callable({
  category,
  description: 'Merge a pull request',
  inputs: {
    repository: pins.repository.name,
    pullNumber: pins.pullRequest.number,
    commitTitle: i.pins.data({
      description: 'Title for the automatic commit message',
      schema: v.string(),
      optional: true,
    }),
    commitMessage: i.pins.data({
      description: 'Extra detail to append to automatic commit message',
      schema: v.string(),
      optional: true,
    }),
    mergeMethod: i.pins.data({
      description: 'The merge method to use',
      schema: v.union([
        v.literal('merge'),
        v.literal('squash'),
        v.literal('rebase'),
      ]),
      control: i.controls.select({
        options: [
          {
            label: 'Merge',
            value: 'merge',
          },
          {
            label: 'Squash',
            value: 'squash',
          },
          {
            label: 'Rebase',
            value: 'rebase',
          },
        ],
      }),
      optional: true,
    }),
  },
  outputs: {
    merge: i.pins.data<components['schemas']['pull-request-merge-result']>({
      displayName: 'Merge Result',
    }),
  },
  async run(opts) {
    const pulls = await opts.state.octokit.rest.pulls.merge({
      ...extractOwnerAndRepo(opts.inputs.repository),
      pull_number: opts.inputs.pullNumber,
      commit_title: opts.inputs.commitTitle,
      commit_message: opts.inputs.commitMessage,
      merge_method: opts.inputs.mergeMethod,
    });

    return opts.next({
      merge: pulls.data,
    });
  },
});
