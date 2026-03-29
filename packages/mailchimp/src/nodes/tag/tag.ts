import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'
import { subscriberHash } from '@/utils/hash'

const nodes = i.nodes.group('Tags')

export const getMemberTags = nodes.action({
  description: 'Get all tags applied to a Mailchimp audience member.',
  inputs: {
    listId: pins.list.id,
    email: pins.member.email,
  },
  outputs: {
    tags: pins.member.tags.with({ control: false }),
  },
  async run(opts) {
    const response = await opts.state.mailchimp.lists.getListMemberTags(
      opts.inputs.listId,
      subscriberHash(opts.inputs.email),
      { count: 1000 },
    )
    if (!('tags' in response)) throw new Error('Failed to fetch member tags.')
    return opts.next({ tags: response.tags.map((t) => t.name) })
  },
})

export const addMemberTags = nodes.action({
  description: 'Add tags to a Mailchimp audience member.',
  inputs: {
    listId: pins.list.id,
    email: pins.member.email,
    tags: i.pins.data<string[]>({
      description: 'The tag names to add.',
    }),
  },
  outputs: {},
  async run(opts) {
    await opts.state.mailchimp.lists.updateListMemberTags(
      opts.inputs.listId,
      subscriberHash(opts.inputs.email),
      {
        tags: opts.inputs.tags.map((name) => ({ name, status: 'active' })),
      },
    )
    return opts.next({})
  },
})

export const removeMemberTags = nodes.action({
  description: 'Remove tags from a Mailchimp audience member.',
  inputs: {
    listId: pins.list.id,
    email: pins.member.email,
    tags: i.pins.data<string[]>({
      description: 'The tag names to remove.',
    }),
  },
  outputs: {},
  async run(opts) {
    await opts.state.mailchimp.lists.updateListMemberTags(
      opts.inputs.listId,
      subscriberHash(opts.inputs.email),
      {
        tags: opts.inputs.tags.map((name) => ({ name, status: 'inactive' })),
      },
    )
    return opts.next({})
  },
})
