import * as i from '@xentom/integration-framework'

import { type EmitterWebhookEvent } from '@octokit/webhooks/types'

import { extractOwnerAndRepo } from '@/helpers/options'
import { createRepositoryWebhook } from '@/helpers/webhooks'
import * as pins from '@/pins'

const nodes = i.nodes.group('Repositories/Releases')

export const onRelease = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      repository: pins.repository.name,
      action: pins.release.action,
    }

    type WebhookEvent = EmitterWebhookEvent<`release.${I['action']}`>

    return nodes.trigger({
      inputs,
      outputs: {
        id: i.pins.data<WebhookEvent['id']>(),
        payload: i.pins.data<WebhookEvent['payload']>(),
      },
      async subscribe(opts) {
        opts.state.webhooks.on(
          `release.${opts.inputs.action}`,
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

export const createRelease = nodes.callable({
  description: 'Create a new release',
  inputs: {
    repository: pins.repository.name,
    tagName: pins.release.tagName,
    targetCommitish: pins.release.targetCommitish.with({
      optional: true,
    }),
    name: pins.release.name.with({
      optional: true,
    }),
    body: pins.release.body.with({
      optional: true,
    }),
    draft: pins.release.draft.with({
      optional: true,
    }),
    prerelease: pins.release.prerelease.with({
      optional: true,
    }),
  },
  outputs: {
    release: pins.release.item,
  },
  async run(opts) {
    const release = await opts.state.octokit.rest.repos.createRelease({
      ...extractOwnerAndRepo(opts.inputs.repository),
      tag_name: opts.inputs.tagName,
      target_commitish: opts.inputs.targetCommitish,
      name: opts.inputs.name,
      body: opts.inputs.body,
      draft: opts.inputs.draft,
      prerelease: opts.inputs.prerelease,
    })

    return opts.next({
      release: release.data,
    })
  },
})

export const updateRelease = nodes.callable({
  description: 'Update an existing release',
  inputs: {
    repository: pins.repository.name,
    releaseId: pins.release.id,
    tagName: pins.release.tagName.with({
      optional: true,
    }),
    targetCommitish: pins.release.targetCommitish.with({
      optional: true,
    }),
    name: pins.release.name.with({
      optional: true,
    }),
    body: pins.release.body.with({
      optional: true,
    }),
    draft: pins.release.draft.with({
      optional: true,
    }),
    prerelease: pins.release.prerelease.with({
      optional: true,
    }),
    makeLatest: pins.release.makeLatest.with({
      optional: true,
    }),
  },
  outputs: {
    release: pins.release.item,
  },
  async run(opts) {
    const release = await opts.state.octokit.rest.repos.updateRelease({
      ...extractOwnerAndRepo(opts.inputs.repository),
      release_id: opts.inputs.releaseId,
      tag_name: opts.inputs.tagName,
      target_commitish: opts.inputs.targetCommitish,
      name: opts.inputs.name,
      body: opts.inputs.body,
      draft: opts.inputs.draft,
      prerelease: opts.inputs.prerelease,
      make_latest: opts.inputs.makeLatest,
    })

    return opts.next({
      release: release.data,
    })
  },
})

export const getRelease = nodes.callable({
  description: 'Get a release by ID',
  inputs: {
    repository: pins.repository.name,
    releaseId: pins.release.id,
  },
  outputs: {
    release: pins.release.item,
  },
  async run(opts) {
    const release = await opts.state.octokit.rest.repos.getRelease({
      ...extractOwnerAndRepo(opts.inputs.repository),
      release_id: opts.inputs.releaseId,
    })

    return opts.next({
      release: release.data,
    })
  },
})

export const getReleaseByTag = nodes.callable({
  description: 'Get a release by tag name',
  inputs: {
    repository: pins.repository.name,
    tagName: pins.release.tagName,
  },
  outputs: {
    release: pins.release.item,
  },
  async run(opts) {
    const release = await opts.state.octokit.rest.repos.getReleaseByTag({
      ...extractOwnerAndRepo(opts.inputs.repository),
      tag: opts.inputs.tagName,
    })

    return opts.next({
      release: release.data,
    })
  },
})

export const getLatestRelease = nodes.callable({
  description: 'Get the latest non-prerelease, non-draft release',
  inputs: {
    repository: pins.repository.name,
  },
  outputs: {
    release: pins.release.item,
  },
  async run(opts) {
    const release = await opts.state.octokit.rest.repos.getLatestRelease({
      ...extractOwnerAndRepo(opts.inputs.repository),
    })

    return opts.next({
      release: release.data,
    })
  },
})

export const listReleases = nodes.callable({
  description: 'List all releases for a repository',
  inputs: {
    repository: pins.repository.name,
  },
  outputs: {
    releases: pins.release.items,
  },
  async run(opts) {
    const releases = await opts.state.octokit.rest.repos.listReleases({
      ...extractOwnerAndRepo(opts.inputs.repository),
    })

    return opts.next({
      releases: releases.data,
    })
  },
})

export const deleteRelease = nodes.callable({
  description: 'Delete a release',
  inputs: {
    repository: pins.repository.name,
    releaseId: pins.release.id,
  },
  async run(opts) {
    await opts.state.octokit.rest.repos.deleteRelease({
      ...extractOwnerAndRepo(opts.inputs.repository),
      release_id: opts.inputs.releaseId,
    })

    return opts.next()
  },
})
