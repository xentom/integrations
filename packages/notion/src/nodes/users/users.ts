import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type UserObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import * as pins from '@/pins'

const nodes = i.nodes.group('Users')

export const getCurrentUser = nodes.callable({
  displayName: 'Get Current User',
  description: 'Retrieve the bot user associated with the integration token',
  outputs: {
    user: pins.user.item,
  },
  async run(opts) {
    const response = await opts.state.client.users.me({})

    return opts.next({
      user: response as UserObjectResponse,
    })
  },
})

export const getUser = nodes.callable({
  description: 'Retrieve a user by their ID',
  inputs: {
    id: pins.user.id,
  },
  outputs: {
    user: pins.user.item,
  },
  async run(opts) {
    const response = await opts.state.client.users.retrieve({
      user_id: opts.inputs.id,
    })

    return opts.next({
      user: response as UserObjectResponse,
    })
  },
})

export const listUsers = nodes.callable({
  description: 'List all users in the workspace',
  inputs: {
    startCursor: i.pins.data({
      displayName: 'Start Cursor',
      description: 'Pagination cursor from a previous response.',
      schema: v.string(),
      control: i.controls.text({
        placeholder: 'Cursor for pagination',
      }),
      optional: true,
    }),
    pageSize: i.pins.data({
      displayName: 'Page Size',
      description: 'Number of results per page (max 100).',
      schema: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
      control: i.controls.expression(),
      optional: true,
    }),
  },
  outputs: {
    users: pins.user.items,
    hasMore: i.pins.data<boolean>({
      displayName: 'Has More',
      description: 'Whether there are more results available.',
    }),
    nextCursor: i.pins.data<string | null>({
      displayName: 'Next Cursor',
      description: 'Cursor for the next page of results.',
    }),
  },
  async run(opts) {
    const response = await opts.state.client.users.list({
      start_cursor: opts.inputs.startCursor,
      page_size: opts.inputs.pageSize,
    })

    return opts.next({
      users: response.results as UserObjectResponse[],
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    })
  },
})
