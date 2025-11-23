import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Segments')

export const createSegment = nodes.callable({
  description: 'Create a new segment in Resend.',
  inputs: {
    name: pins.segment.name.with({
      description: 'The name of the segment to create.',
    }),
  },
  outputs: {
    id: pins.segment.id.with({
      description: 'The ID of the created segment.',
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.segments.create({
      name: opts.inputs.name,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return opts.next({
      id: response.data.id,
    })
  },
})

export const listSegments = nodes.callable({
  description: 'List all segments in Resend.',
  outputs: {
    segments: pins.segment.items.with({
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.segments.list()

    if (response.error) {
      throw new Error(response.error.message)
    }

    return opts.next({
      segments: response.data.data,
    })
  },
})

export const getSegment = nodes.callable({
  description: 'Get a specific segment by ID.',
  inputs: {
    id: pins.segment.id.with({
      description: 'The ID of the segment to retrieve.',
    }),
  },
  outputs: {
    segment: pins.segment.item.with({
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.segments.get(opts.inputs.id)

    if (response.error) {
      throw new Error(response.error.message)
    }

    return opts.next({
      segment: response.data,
    })
  },
})

export const deleteSegment = nodes.callable({
  description: 'Delete a segment by ID.',
  inputs: {
    id: pins.segment.id.with({
      description: 'The ID of the segment to delete.',
    }),
  },
  outputs: {
    id: pins.segment.id.with({
      description: 'The ID of the deleted segment.',
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.segments.remove(opts.inputs.id)

    if (response.error) {
      throw new Error(response.error.message)
    }

    if (!response.data.deleted) {
      throw new Error('Failed to delete segment')
    }

    return opts.next({
      id: response.data.id,
    })
  },
})
