import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import {
  type AppendBlockChildrenParameters,
  type AppendBlockChildrenResponse,
  type BlockObjectResponse,
  type ListBlockChildrenResponse,
  type UpdateBlockParameters,
} from '@notionhq/client/build/src/api-endpoints'

export const item = i.pins.data<BlockObjectResponse>({
  displayName: 'Block',
  description: 'A Notion block object.',
})

export const items = i.pins.data<BlockObjectResponse[]>({
  displayName: 'Blocks',
  description: 'A list of Notion block objects.',
})

export const childrenResponse = i.pins.data<ListBlockChildrenResponse>({
  displayName: 'Children Response',
  description: 'The response containing block children with pagination info.',
})

export const appendResponse = i.pins.data<AppendBlockChildrenResponse>({
  displayName: 'Append Response',
  description: 'The response after appending block children.',
})

export const id = i.pins.data({
  displayName: 'Block ID',
  description: 'The unique identifier of a Notion block.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'xxxxxxxx...',
  }),
})

export const children = i.pins.data<AppendBlockChildrenParameters['children']>({
  displayName: 'Children',
  description: 'An array of block objects to append as children.',
  control: i.controls.expression(),
  examples: [
    {
      title: 'Paragraph Block',
      value: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'Hello, World!' } }],
          },
        },
      ],
    },
    {
      title: 'Multiple Blocks',
      value: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Section Title' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              { type: 'text', text: { content: 'Paragraph content.' } },
            ],
          },
        },
        {
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'List item' } }],
          },
        },
      ],
    },
  ],
})

export const content = i.pins.data<Partial<UpdateBlockParameters>>({
  displayName: 'Block Content',
  description: 'The content of the block to update.',
  control: i.controls.expression(),
  examples: [
    {
      title: 'Update Paragraph Block',
      value: {
        paragraph: {
          rich_text: [{ type: 'text', text: { content: 'Hello, World!' } }],
        },
      },
    },
  ],
})
