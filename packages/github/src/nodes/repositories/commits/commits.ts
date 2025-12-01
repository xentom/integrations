import * as i from '@xentom/integration-framework'

import { type EmitterWebhookEvent } from '@octokit/webhooks/types'

import * as pins from '@/pins'
import { extractOwnerAndRepo } from '@/utils/options'
import { createRepositoryWebhook } from '@/utils/webhooks'

const nodes = i.nodes.group('Repositories/Commits')

type WebhookEvent = EmitterWebhookEvent<'push'>

export const onPush = nodes.trigger({
  inputs: {
    repository: pins.repository.name,
  },
  outputs: {
    id: i.pins.data<WebhookEvent['id']>(),
    payload: i.pins.data<WebhookEvent['payload']>(),
  },
  async subscribe(opts) {
    opts.state.webhooks.on('push', ({ id, payload }) => {
      if (payload.repository.full_name !== opts.inputs.repository) {
        return
      }

      void opts.next({
        id,
        payload,
      })
    })

    await createRepositoryWebhook({
      repository: opts.inputs.repository,
      webhook: opts.webhook,
      state: opts.state,
    })
  },
})

export const listCommits = nodes.callable({
  description: 'List recent commits for a repository',
  inputs: {
    repository: pins.repository.name,
    branch: pins.branch.name.with({
      description: 'Branch to list commits for',
      optional: true,
    }),
  },
  outputs: {
    commits: pins.commit.items,
  },
  async run(opts) {
    const commits = await opts.state.octokit.rest.repos.listCommits({
      ...extractOwnerAndRepo(opts.inputs.repository),
      sha: opts.inputs.branch,
    })

    return opts.next({
      commits: commits.data,
    })
  },
})

export const getCommit = nodes.callable({
  description: 'Get details for a commit',
  inputs: {
    repository: pins.repository.name,
    sha: pins.commit.sha,
  },
  outputs: {
    commit: pins.commit.item,
  },
  async run(opts) {
    const commit = await opts.state.octokit.rest.repos.getCommit({
      ...extractOwnerAndRepo(opts.inputs.repository),
      ref: opts.inputs.sha,
    })

    return opts.next({
      commit: commit.data,
    })
  },
})
