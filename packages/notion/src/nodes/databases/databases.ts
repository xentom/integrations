import * as i from '@xentom/integration-framework'

import {
  type DatabaseObjectResponse,
  type PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

import * as pins from '@/pins'

const nodes = i.nodes.group('Databases')

export const getDatabase = nodes.callable({
  description: 'Retrieve a database by its ID',
  inputs: {
    id: pins.database.id,
  },
  outputs: {
    database: pins.database.item,
  },
  async run(opts) {
    const response = await opts.state.client.databases.retrieve({
      database_id: opts.inputs.id,
    })

    return opts.next({
      database: response as DatabaseObjectResponse,
    })
  },
})

export const queryDatabase = nodes.callable({
  description: 'Query a database to retrieve pages matching optional filters',
  inputs: {
    id: pins.database.id,
    filter: pins.database.filter.with({
      optional: true,
    }),
    sorts: pins.database.sorts.with({
      optional: true,
    }),
  },
  outputs: {
    result: pins.database.queryResult,
    pages: pins.page.items,
  },
  async run(opts) {
    const response = await opts.state.client.databases.query({
      database_id: opts.inputs.id,
      filter: opts.inputs.filter,
      sorts: opts.inputs.sorts,
    })

    return opts.next({
      result: response,
      pages: response.results.filter(
        (result): result is PageObjectResponse => result.object === 'page',
      ),
    })
  },
})

export const createDatabase = nodes.callable({
  description: 'Create a new database as a child of a page',
  inputs: {
    parentPageId: pins.page.id.with({
      displayName: 'Parent Page ID',
      description: 'The ID of the page where the database will be created.',
    }),
    title: pins.database.title.with({
      description: 'The title of the new database.',
    }),
    properties: pins.database.createProperties,
  },
  outputs: {
    database: pins.database.item,
  },
  async run(opts) {
    const response = await opts.state.client.databases.create({
      parent: { type: 'page_id', page_id: opts.inputs.parentPageId },
      title: [{ type: 'text', text: { content: opts.inputs.title } }],
      properties: opts.inputs.properties,
    })

    return opts.next({
      database: response as DatabaseObjectResponse,
    })
  },
})

export const updateDatabase = nodes.callable({
  description: 'Update database title or properties schema',
  inputs: {
    id: pins.database.id,
    title: pins.database.title.with<string, string, true>({
      optional: true,
    }),
    properties: pins.database.updateProperties.with({
      optional: true,
    }),
  },
  outputs: {
    database: pins.database.item,
  },
  async run(opts) {
    const response = await opts.state.client.databases.update({
      database_id: opts.inputs.id,
      title: opts.inputs.title
        ? [{ type: 'text', text: { content: opts.inputs.title } }]
        : undefined,
      properties: opts.inputs.properties,
    })

    return opts.next({
      database: response as DatabaseObjectResponse,
    })
  },
})
