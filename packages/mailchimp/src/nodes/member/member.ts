import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'
import { subscriberHash } from '@/utils/hash'

const nodes = i.nodes.group('Members')

export const addMember = nodes.action({
  description: 'Add a new subscriber to a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
    email: pins.member.email,
    status: pins.member.status,
    firstName: pins.member.firstName.with({ optional: true }),
    lastName: pins.member.lastName.with({ optional: true }),
    tags: pins.member.tags.with({ optional: true }),
  },
  outputs: {
    item: pins.member.item.with({ control: false }),
  },
  async run(opts) {
    const body: Parameters<typeof opts.state.mailchimp.lists.addListMember>[1] =
      {
        email_address: opts.inputs.email,
        status: opts.inputs.status,
      }
    if (
      opts.inputs.firstName !== undefined ||
      opts.inputs.lastName !== undefined
    ) {
      body.merge_fields = {}
      if (opts.inputs.firstName !== undefined)
        body.merge_fields.FNAME = opts.inputs.firstName
      if (opts.inputs.lastName !== undefined)
        body.merge_fields.LNAME = opts.inputs.lastName
    }
    if (opts.inputs.tags !== undefined) body.tags = opts.inputs.tags
    const response = await opts.state.mailchimp.lists.addListMember(
      opts.inputs.listId,
      body,
    )
    if (!('id' in response)) throw new Error('Failed to add member.')
    return opts.next({ item: response })
  },
})

export const getMember = nodes.action({
  description:
    'Get information about a specific member of a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
    email: pins.member.email,
  },
  outputs: {
    item: pins.member.item.with({ control: false }),
  },
  async run(opts) {
    const response = await opts.state.mailchimp.lists.getListMember(
      opts.inputs.listId,
      subscriberHash(opts.inputs.email),
    )
    if (!('id' in response)) throw new Error('Failed to fetch member.')
    return opts.next({ item: response })
  },
})

export const listMembers = nodes.action({
  description: 'Get a list of members in a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
    status: pins.member.status.with({ optional: true }),
  },
  outputs: {
    items: pins.member.items.with({ control: false }),
  },
  async run(opts) {
    const listOpts: Record<string, unknown> = { count: 1000 }
    if (opts.inputs.status !== undefined) listOpts.status = opts.inputs.status
    const response = await opts.state.mailchimp.lists.getListMembersInfo(
      opts.inputs.listId,
      listOpts as Parameters<
        typeof opts.state.mailchimp.lists.getListMembersInfo
      >[1],
    )
    if (!('members' in response)) throw new Error('Failed to fetch members.')
    return opts.next({ items: response.members })
  },
})

export const updateMember = nodes.action({
  description: 'Update information for a specific Mailchimp audience member.',
  inputs: {
    listId: pins.list.id,
    email: pins.member.email,
    status: pins.member.status.with({ optional: true }),
    firstName: pins.member.firstName.with({ optional: true }),
    lastName: pins.member.lastName.with({ optional: true }),
  },
  outputs: {
    item: pins.member.item.with({ control: false }),
  },
  async run(opts) {
    const body: Parameters<
      typeof opts.state.mailchimp.lists.updateListMember
    >[2] = {}
    if (opts.inputs.status !== undefined) body.status = opts.inputs.status
    if (
      opts.inputs.firstName !== undefined ||
      opts.inputs.lastName !== undefined
    ) {
      body.merge_fields = {}
      if (opts.inputs.firstName !== undefined)
        body.merge_fields.FNAME = opts.inputs.firstName
      if (opts.inputs.lastName !== undefined)
        body.merge_fields.LNAME = opts.inputs.lastName
    }
    const response = await opts.state.mailchimp.lists.updateListMember(
      opts.inputs.listId,
      subscriberHash(opts.inputs.email),
      body,
    )
    if (!('id' in response)) throw new Error('Failed to update member.')
    return opts.next({ item: response })
  },
})

export const archiveMember = nodes.action({
  description: 'Archive (unsubscribe) a member from a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
    email: pins.member.email,
  },
  outputs: {},
  async run(opts) {
    await opts.state.mailchimp.lists.deleteListMember(
      opts.inputs.listId,
      subscriberHash(opts.inputs.email),
    )
    return opts.next({})
  },
})

export const deleteMember = nodes.action({
  description:
    'Permanently delete a member and all their data from a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
    email: pins.member.email,
  },
  outputs: {},
  async run(opts) {
    await opts.state.mailchimp.lists.deleteListMemberPermanent(
      opts.inputs.listId,
      subscriberHash(opts.inputs.email),
    )
    return opts.next({})
  },
})
