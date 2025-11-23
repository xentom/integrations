import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type components } from '@octokit/openapi-types'
import { type EmitterWebhookEvent } from '@octokit/webhooks/types'

import { extractOwnerAndRepo } from '@/helpers/options'
import { createRepositoryWebhook } from '@/helpers/webhooks'
import * as pins from '@/pins'

const nodes = i.nodes.group('Repositories/Pull Requests')

export const onPullRequest = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      repository: pins.repository.name,
      action: pins.pullRequest.action,
    }

    type WebhookEvent = EmitterWebhookEvent<`pull_request.${I['action']}`>

    return nodes.trigger({
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
              return
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            void opts.next({
              id,
              payload,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any)
          },
        )

        await createRepositoryWebhook({
          repository: opts.inputs.repository,
          webhook: opts.webhook,
          state: opts.state,
        })
      },
    })
  },
)

export const createPullRequest = nodes.callable({
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
    })

    return opts.next({
      pullRequest: pulls.data,
    })
  },
})

export const updatePullRequest = nodes.callable({
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
    })

    return opts.next({
      pullRequest: pulls.data,
    })
  },
})

export const getPullRequest = nodes.callable({
  description: 'Get details of a specific pull request',
  inputs: {
    repository: pins.repository.name,
    number: pins.pullRequest.number,
  },
  outputs: {
    pullRequest: pins.pullRequest.item,
  },
  async run(opts) {
    const pulls = await opts.state.octokit.rest.pulls.get({
      ...extractOwnerAndRepo(opts.inputs.repository),
      pull_number: opts.inputs.number,
    })

    return opts.next({
      pullRequest: pulls.data,
    })
  },
})

export const mergePullRequest = nodes.callable({
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
    })

    return opts.next({
      merge: pulls.data,
    })
  },
})

export const listPullRequests = nodes.callable({
  description: 'List pull requests in a repository',
  inputs: {
    repository: pins.repository.name,
    state: pins.pullRequest.state.with({
      optional: true,
    }),
    base: pins.pullRequest.base.with({
      description: 'Filter by base branch',
      optional: true,
    }),
  },
  outputs: {
    pullRequests: pins.pullRequest.items,
  },
  async run(opts) {
    const pullRequests = await opts.state.octokit.rest.pulls.list({
      ...extractOwnerAndRepo(opts.inputs.repository),
      state: opts.inputs.state,
      base: opts.inputs.base,
    })

    return opts.next({
      pullRequests: pullRequests.data,
    })
  },
})
