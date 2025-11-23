import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import {
  type ListBroadcastsResponseSuccess,
  type SendBroadcastResponseSuccess,
  type UpdateBroadcastResponseSuccess,
} from 'resend'

import * as pins from '@/pins'

const nodes = i.nodes.group('Broadcasts')

export const createBroadcast = nodes.callable({
  description: 'Create a new broadcast.',
  inputs: {
    segmentId: pins.segment.id.with({
      description: 'The ID of the segment to send the broadcast to.',
    }),
    from: pins.email.addressWithDisplayName.with({
      description:
        'Sender email address. Include a name using format: "Your Name <sender@domain.com>".',
    }),
    subject: pins.broadcast.subject.with({
      description: 'Email subject line.',
    }),
    name: pins.broadcast.name.with({
      description: 'The name of the broadcast.',
      optional: true,
    }),
    html: pins.email.html.with({
      description: 'The HTML content of the broadcast.',
      optional: true,
    }),
    text: pins.email.text.with({
      description: 'The plain text content of the broadcast.',
      optional: true,
    }),
    previewText: pins.email.previewText.with({
      description: 'A short snippet shown in email previews.',
      optional: true,
    }),
    replyTo: pins.email.addresses.with({
      description: 'Reply-to email addresses.',
      optional: true,
    }),
  },
  outputs: {
    id: pins.broadcast.id.with({
      description: 'The ID of the created broadcast.',
      control: false,
    }),
  },
  async run(opts) {
    // Validate that at least one EmailRenderOption is provided
    if (!opts.inputs.html && !opts.inputs.text) {
      throw new Error('At least one of html or text must be provided')
    }

    const response = await opts.state.resend.broadcasts.create({
      segmentId: opts.inputs.segmentId,
      from: opts.inputs.from,
      subject: opts.inputs.subject,
      html: opts.inputs.html,
      text: opts.inputs.text,
      react: undefined,
      name: opts.inputs.name,
      previewText: opts.inputs.previewText,
      replyTo: opts.inputs.replyTo,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return opts.next({
      id: response.data.id,
    })
  },
})

export const getBroadcast = nodes.callable({
  description: 'Retrieve details of a broadcast by its ID.',
  inputs: {
    id: pins.broadcast.id.with({
      description: 'The ID of the broadcast to retrieve.',
    }),
  },
  outputs: {
    broadcast: pins.broadcast.item.with({
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.broadcasts.get(opts.inputs.id)

    if (response.error) {
      throw new Error(response.error.message)
    }

    return opts.next({
      broadcast: response.data,
    })
  },
})

export const listBroadcasts = nodes.callable({
  description: 'Retrieve a list of broadcasts.',
  outputs: {
    broadcasts: pins.broadcast.items.with<ListBroadcastsResponseSuccess>({
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.broadcasts.list()

    if (response.error) {
      throw new Error(response.error.message)
    }

    return opts.next({
      broadcasts: response.data,
    })
  },
})

export const updateBroadcast = nodes.callable({
  description: 'Update an existing broadcast.',
  inputs: {
    id: pins.broadcast.id.with({
      description: 'The ID of the broadcast to update.',
    }),
    name: pins.broadcast.name.with({
      description: 'The name of the broadcast.',
      optional: true,
    }),
    segmentId: pins.segment.id.with({
      description: 'The ID of the segment to send the broadcast to.',
      optional: true,
    }),
    from: pins.email.addressWithDisplayName.with({
      description: 'Sender email address.',
      optional: true,
    }),
    subject: pins.broadcast.subject.with({
      description: 'Email subject line.',
      optional: true,
    }),
    html: pins.email.html.with({
      description: 'The HTML content of the broadcast.',
      optional: true,
    }),
    text: pins.email.text.with({
      description: 'The plain text content of the broadcast.',
      optional: true,
    }),
    previewText: pins.email.previewText.with({
      description: 'A short snippet shown in email previews.',
      optional: true,
    }),
    replyTo: pins.email.addresses.with({
      description: 'Reply-to email addresses.',
      optional: true,
    }),
  },
  outputs: {
    broadcast: pins.broadcast.item.with<UpdateBroadcastResponseSuccess>({
      description: 'The updated broadcast object.',
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.broadcasts.update(opts.inputs.id, {
      name: opts.inputs.name,
      segmentId: opts.inputs.segmentId,
      from: opts.inputs.from,
      subject: opts.inputs.subject,
      html: opts.inputs.html,
      text: opts.inputs.text,
      previewText: opts.inputs.previewText,
      replyTo: opts.inputs.replyTo,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return opts.next({
      broadcast: response.data,
    })
  },
})

export const sendBroadcast = nodes.callable({
  description: 'Send a broadcast to its segment.',
  inputs: {
    id: pins.broadcast.id.with({
      description: 'The ID of the broadcast to send.',
    }),
    scheduledAt: i.pins.data({
      description:
        'When to send the broadcast in ISO 8601 format or relative time (e.g., "in 2 days"). If not provided, sends immediately.',
      control: i.controls.text({
        placeholder: '2023-10-01T12:00:00Z',
      }),
      schema: v.optional(v.pipe(v.string(), v.minLength(1))),
      optional: true,
    }),
  },
  outputs: {
    broadcast: pins.broadcast.item.with<SendBroadcastResponseSuccess>({
      description: 'The sent broadcast object.',
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.broadcasts.send(opts.inputs.id, {
      scheduledAt: opts.inputs.scheduledAt,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return opts.next({
      broadcast: response.data,
    })
  },
})

export const deleteBroadcast = nodes.callable({
  description: 'Delete a broadcast by its ID.',
  inputs: {
    id: pins.broadcast.id.with({
      description: 'The ID of the broadcast to delete.',
    }),
  },
  outputs: {
    id: pins.broadcast.id.with({
      description: 'The ID of the deleted broadcast.',
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.broadcasts.remove(opts.inputs.id)

    if (response.error) {
      throw new Error(response.error.message)
    }

    if (!response.data.deleted) {
      throw new Error('Failed to delete broadcast')
    }

    return opts.next({
      id: response.data.id,
    })
  },
})
