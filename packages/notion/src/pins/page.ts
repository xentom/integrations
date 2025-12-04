import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import {
  type CreatePageParameters,
  type PageObjectResponse,
  type UpdatePageParameters,
} from '@notionhq/client/build/src/api-endpoints'

export const item = i.pins.data<PageObjectResponse>({
  displayName: 'Page',
  description: 'A Notion page object.',
})

export const items = i.pins.data<PageObjectResponse[]>({
  displayName: 'Pages',
  description: 'A list of Notion page objects.',
})

export const id = i.pins.data({
  displayName: 'Page ID',
  description: 'The unique identifier of a Notion page.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'xxxxxxxx...',
  }),
})

export const createProperties = i.pins.data<CreatePageParameters['properties']>(
  {
    displayName: 'Properties',
    description:
      'The property values of the page. Keys are property names or IDs, values follow Notion property value schema.',
    control: i.controls.expression(),
    examples: [
      {
        title: 'Title Property',
        value: {
          Name: {
            title: [{ text: { content: 'My Page Title' } }],
          },
        },
      },
      {
        title: 'Multiple Properties',
        value: {
          Name: {
            title: [{ text: { content: 'Task Name' } }],
          },
          Status: {
            select: { name: 'In Progress' },
          },
          Priority: {
            select: { name: 'High' },
          },
        },
      },
    ],
  },
)

export const updateProperties = i.pins.data<UpdatePageParameters['properties']>(
  {
    displayName: 'Properties',
    description:
      'Updated property values. Properties not included will remain unchanged.',
    control: i.controls.expression(),
  },
)

export const createIcon = i.pins.data<CreatePageParameters['icon']>({
  displayName: 'Icon',
  description: 'The icon of the page (emoji or external URL).',
  control: i.controls.expression(),
  examples: [
    {
      title: 'Emoji Icon',
      value: { type: 'emoji', emoji: '📝' },
    },
    {
      title: 'External Icon',
      value: {
        type: 'external',
        external: { url: 'https://example.com/icon.png' },
      },
    },
  ],
})

export const updateIcon = i.pins.data<UpdatePageParameters['icon']>({
  displayName: 'Icon',
  description: 'The icon of the page (emoji or external URL).',
  control: i.controls.expression(),
})

export const createCover = i.pins.data<CreatePageParameters['cover']>({
  displayName: 'Cover',
  description: 'The cover image of the page.',
  control: i.controls.expression(),
  examples: [
    {
      title: 'External Cover',
      value: {
        type: 'external',
        external: { url: 'https://example.com/cover.jpg' },
      },
    },
  ],
})

export const updateCover = i.pins.data<UpdatePageParameters['cover']>({
  displayName: 'Cover',
  description: 'The cover image of the page.',
  control: i.controls.expression(),
})

export const archived = i.pins.data({
  displayName: 'Archived',
  description: 'Whether the page is archived.',
  schema: v.boolean(),
  control: i.controls.switch(),
})
