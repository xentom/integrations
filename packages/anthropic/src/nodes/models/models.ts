import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type ModelInfo } from '@anthropic-ai/sdk/resources'

import * as pins from '@/pins'

const nodes = i.nodes.group('Models')

export const getModels = nodes.pure({
  inputs: {
    limit: i.pins.data({
      optional: true,
      schema: v.number(),
      control: i.controls.expression({
        defaultValue: 100,
      }),
    }),
    afterId: pins.model.id.with({
      displayName: 'After ID',
      optional: true,
    }),
    beforeId: pins.model.id.with({
      displayName: 'Before ID',
      optional: true,
    }),
  },
  outputs: {
    models: i.pins.data<ModelInfo[]>(),
  },
  async run(opts) {
    const models = await opts.state.client.models.list({
      limit: opts.inputs.limit,
      after_id: opts.inputs.afterId,
      before_id: opts.inputs.beforeId,
    })

    opts.outputs.models = models.data
  },
})
