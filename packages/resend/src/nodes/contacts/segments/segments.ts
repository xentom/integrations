import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Contacts/Segments')

export const addContactToSegment = nodes.callable({
  description: 'Add a contact to a segment.',
  inputs: {
    contactId: pins.contact.id.with({
      description: 'The ID of the contact to add.',
      optional: true,
    }),
    email: pins.email.address.with({
      description: 'The email of the contact to add.',
      optional: true,
    }),
    segmentId: pins.segment.id.with({
      description: 'The ID of the segment.',
    }),
  },
  outputs: {
    id: i.pins.data({
      description:
        'The ID returned by Resend for the contact-segment assignment.',
      control: false,
    }),
  },
  async run(opts) {
    if (!opts.inputs.contactId && !opts.inputs.email) {
      throw new Error('Either contact ID or email must be provided.')
    }

    const payload:
      | { contactId: string; segmentId: string }
      | { email: string; segmentId: string } = opts.inputs.contactId
      ? {
          contactId: opts.inputs.contactId,
          segmentId: opts.inputs.segmentId,
        }
      : {
          // email is guaranteed by the earlier check
          email: opts.inputs.email as string,
          segmentId: opts.inputs.segmentId,
        }

    const response = await opts.state.resend.contacts.segments.add(payload)

    if (response.error) {
      throw new Error(response.error.message)
    }

    if (!response.data) {
      throw new Error('Failed to add contact to segment.')
    }

    return opts.next({
      id: response.data.id,
    })
  },
})

export const listContactSegments = nodes.callable({
  description: 'List all segments a contact belongs to.',
  inputs: {
    contactId: pins.contact.id.with({
      description: 'The ID of the contact to list segments for.',
      optional: true,
    }),
    email: pins.email.address.with({
      description: 'The email of the contact to list segments for.',
      optional: true,
    }),
  },
  outputs: {
    segments: pins.segment.items.with({
      control: false,
    }),
  },
  async run(opts) {
    if (!opts.inputs.contactId && !opts.inputs.email) {
      throw new Error('Either contact ID or email must be provided.')
    }

    const response = await opts.state.resend.contacts.segments.list(
      opts.inputs.contactId
        ? { contactId: opts.inputs.contactId }
        : { email: opts.inputs.email as string },
    )

    if (response.error) {
      throw new Error(response.error.message)
    }

    if (!response.data) {
      throw new Error('Failed to list contact segments.')
    }

    return opts.next({
      segments: response.data.data,
    })
  },
})

export const removeContactFromSegment = nodes.callable({
  description: 'Remove a contact from a segment.',
  inputs: {
    contactId: pins.contact.id.with({
      description: 'The ID of the contact to remove.',
      optional: true,
    }),
    email: pins.email.address.with({
      description: 'The email of the contact to remove.',
      optional: true,
    }),
    segmentId: pins.segment.id.with({
      description: 'The ID of the segment.',
    }),
  },
  outputs: {
    id: i.pins.data({
      description: 'The ID returned by Resend for the removal.',
      control: false,
    }),
  },
  async run(opts) {
    if (!opts.inputs.contactId && !opts.inputs.email) {
      throw new Error('Either contact ID or email must be provided.')
    }

    const response = await opts.state.resend.contacts.segments.remove(
      opts.inputs.contactId
        ? {
            contactId: opts.inputs.contactId,
            segmentId: opts.inputs.segmentId,
          }
        : {
            email: opts.inputs.email as string,
            segmentId: opts.inputs.segmentId,
          },
    )

    if (response.error) {
      throw new Error(response.error.message)
    }

    if (!response.data) {
      throw new Error('Failed to remove contact from segment.')
    }

    if (!response.data.deleted) {
      throw new Error('Contact was not removed from segment.')
    }

    return opts.next({
      id: response.data.id,
    })
  },
})
