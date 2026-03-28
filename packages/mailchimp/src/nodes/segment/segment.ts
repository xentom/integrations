import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Segments')

export const listSegments = nodes.callable({
  description: 'Get all segments for a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
  },
  outputs: {
    items: pins.segment.items.with({ control: false }),
  },
  async run(opts) {
    const response = await opts.state.mailchimp.lists.listSegments(
      opts.inputs.listId,
      { count: 1000 },
    )
    return opts.next({ items: response.segments })
  },
})

export const getSegment = nodes.callable({
  description:
    'Get information about a specific segment in a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
    segmentId: pins.segment.id,
  },
  outputs: {
    item: pins.segment.item.with({ control: false }),
  },
  async run(opts) {
    const item = await opts.state.mailchimp.lists.getSegment(
      opts.inputs.listId,
      opts.inputs.segmentId,
    )
    return opts.next({ item })
  },
})

export const createSegment = nodes.callable({
  description: 'Create a new static segment in a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
    name: pins.segment.name,
  },
  outputs: {
    item: pins.segment.item.with({ control: false }),
  },
  async run(opts) {
    const item = await opts.state.mailchimp.lists.createSegment(
      opts.inputs.listId,
      {
        name: opts.inputs.name,
        static_segment: [],
      },
    )
    return opts.next({ item })
  },
})

export const updateSegment = nodes.callable({
  description: 'Update the name of a segment in a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
    segmentId: pins.segment.id,
    name: pins.segment.name,
  },
  outputs: {
    item: pins.segment.item.with({ control: false }),
  },
  async run(opts) {
    const item = await opts.state.mailchimp.lists.updateSegment(
      opts.inputs.listId,
      opts.inputs.segmentId,
      {
        name: opts.inputs.name,
      },
    )
    return opts.next({ item })
  },
})

export const deleteSegment = nodes.callable({
  description: 'Delete a segment from a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
    segmentId: pins.segment.id,
  },
  outputs: {},
  async run(opts) {
    await opts.state.mailchimp.lists.deleteSegment(
      opts.inputs.listId,
      opts.inputs.segmentId,
    )
    return opts.next({})
  },
})
