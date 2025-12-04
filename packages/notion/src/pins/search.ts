import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type SearchResponse } from '@notionhq/client/build/src/api-endpoints'

export const result = i.pins.data<SearchResponse>({
  displayName: 'Search Result',
  description: 'The result of a search query containing pages and databases.',
})

export const query = i.pins.data({
  displayName: 'Query',
  description: 'The search query text.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Search for...',
  }),
})

export const filterType = i.pins.data<'page' | 'database'>({
  displayName: 'Filter Type',
  description: 'Filter results to only pages or databases.',
  control: i.controls.select({
    options: [
      { label: 'Page', value: 'page' },
      { label: 'Database', value: 'database' },
    ],
  }),
})
