import * as i from '@xentom/integration-framework'

import { type EmitterWebhookEvent } from '@octokit/webhooks/types'

import * as pins from '@/pins'
import { extractOwnerAndRepo } from '@/utils/options'
import { createRepositoryWebhook } from '@/utils/webhooks'

const nodes = i.nodes.group('Repositories')

export const onRepository = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      repository: pins.repository.name,
      action: pins.repository.action,
    }

    type WebhookEvent = EmitterWebhookEvent<`repository.${I['action']}`>

    return nodes.trigger({
      inputs,
      outputs: {
        id: i.pins.data<WebhookEvent['id']>(),
        payload: i.pins.data<WebhookEvent['payload']>(),
      },
      async subscribe(opts) {
        opts.state.webhooks.on(
          `repository.${opts.inputs.action}`,
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

export const getRepository = nodes.callable({
  description: 'Get repository information',
  inputs: {
    name: pins.repository.name,
  },
  outputs: {
    repository: pins.repository.item,
  },
  async run(opts) {
    const repository = await opts.state.octokit.rest.repos.get({
      ...extractOwnerAndRepo(opts.inputs.name),
    })

    return opts.next({
      repository: repository.data,
    })
  },
})
