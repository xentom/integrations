import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import {
  type DatabaseObjectResponse,
  type PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

import * as pins from '@/pins'

const nodes = i.nodes.group('Search')

export const search = nodes.callable({
  description: 'Search pages and databases by title',
  inputs: {
    query: pins.search.query.with({
      description: 'The text to search for in page and database titles.',
      optional: true,
    }),
    filterType: pins.search.filterType.with({
      description: 'Filter to only return pages or databases.',
      optional: true,
    }),
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
    result: pins.search.result,
    pages: pins.page.items,
    databases: pins.database.items,
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
    const response = await opts.state.client.search({
      query: opts.inputs.query,
      filter: opts.inputs.filterType
        ? { property: 'object', value: opts.inputs.filterType }
        : undefined,
      start_cursor: opts.inputs.startCursor,
      page_size: opts.inputs.pageSize,
    })

    const pages: PageObjectResponse[] = []
    const databases: DatabaseObjectResponse[] = []

    for (const result of response.results) {
      if (result.object === 'page' && 'properties' in result) {
        pages.push(result as PageObjectResponse)
      } else if (result.object === 'database' && 'title' in result) {
        databases.push(result as DatabaseObjectResponse)
      }
    }

    return opts.next({
      result: response,
      pages,
      databases,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    })
  },
})
