import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Lists')

export const getAllLists = nodes.action({
  description: 'Get all audiences (lists) in the Mailchimp account.',
  inputs: {},
  outputs: {
    items: pins.list.items.with({ control: false }),
  },
  async run(opts) {
    const response = await opts.state.mailchimp.lists.getAllLists({
      count: 1000,
    })
    if (!('lists' in response)) throw new Error('Failed to fetch lists.')
    return opts.next({ items: response.lists })
  },
})

export const getList = nodes.action({
  description: 'Get information about a specific Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
  },
  outputs: {
    item: pins.list.item.with({ control: false }),
  },
  async run(opts) {
    const item = await opts.state.mailchimp.lists.getList(opts.inputs.listId)
    return opts.next({ item })
  },
})

export const createList = nodes.action({
  description: 'Create a new Mailchimp audience (list).',
  inputs: {
    name: pins.list.name,
    permissionReminder: pins.list.permissionReminder,
    fromName: pins.campaign.fromName,
    fromEmail: pins.member.email.with({
      description: 'The default from email address for campaigns.',
    }),
  },
  outputs: {
    item: pins.list.item.with({ control: false }),
  },
  async run(opts) {
    const item = await opts.state.mailchimp.lists.createList({
      name: opts.inputs.name,
      permission_reminder: opts.inputs.permissionReminder,
      email_type_option: true,
      contact: {
        company: '',
        address1: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
      },
      campaign_defaults: {
        from_name: opts.inputs.fromName,
        from_email: opts.inputs.fromEmail,
        subject: '',
        language: 'EN_US',
      },
    })
    return opts.next({ item })
  },
})

export const updateList = nodes.action({
  description: 'Update settings for a Mailchimp audience.',
  inputs: {
    listId: pins.list.id,
    name: pins.list.name.with({ optional: true }),
    permissionReminder: pins.list.permissionReminder.with({ optional: true }),
  },
  outputs: {
    item: pins.list.item.with({ control: false }),
  },
  async run(opts) {
    const body: Record<string, unknown> = {}
    if (opts.inputs.name !== undefined) body.name = opts.inputs.name
    if (opts.inputs.permissionReminder !== undefined)
      body.permission_reminder = opts.inputs.permissionReminder
    const item = await opts.state.mailchimp.lists.updateList(
      opts.inputs.listId,
      body,
    )
    return opts.next({ item })
  },
})

export const deleteList = nodes.action({
  description: 'Delete a Mailchimp audience. This action is permanent.',
  inputs: {
    listId: pins.list.id,
  },
  outputs: {},
  async run(opts) {
    await opts.state.mailchimp.lists.deleteList(opts.inputs.listId)
    return opts.next({})
  },
})
