import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

import * as pins from '@/pins'

const nodes = i.nodes.group('Blocks')

export const getBlock = nodes.callable({
  description: 'Retrieve a block by its ID',
  inputs: {
    id: pins.block.id,
  },
  outputs: {
    block: pins.block.item,
  },
  async run(opts) {
    const response = await opts.state.client.blocks.retrieve({
      block_id: opts.inputs.id,
    })

    return opts.next({
      block: response as BlockObjectResponse,
    })
  },
})

export const listBlockChildren = nodes.callable({
  description: 'Retrieve the children blocks of a block or page',
  inputs: {
    id: pins.block.id.with({
      displayName: 'Block or Page ID',
      description: 'The ID of the block or page to retrieve children from.',
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
    response: pins.block.childrenResponse,
    blocks: pins.block.items,
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
    const response = await opts.state.client.blocks.children.list({
      block_id: opts.inputs.id,
      start_cursor: opts.inputs.startCursor,
      page_size: opts.inputs.pageSize,
    })

    return opts.next({
      response,
      blocks: response.results.filter(
        (result): result is BlockObjectResponse => 'type' in result,
      ),
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    })
  },
})

export const appendBlockChildren = nodes.callable({
  description: 'Append new blocks as children of a block or page',
  inputs: {
    id: pins.block.id.with({
      displayName: 'Block or Page ID',
      description: 'The ID of the block or page to append children to.',
    }),
    children: pins.block.children,
    after: i.pins.data({
      displayName: 'After Block ID',
      description: 'Append after this block ID (optional).',
      schema: v.string(),
      control: i.controls.text({
        placeholder: 'Block ID to insert after',
      }),
      optional: true,
    }),
  },
  outputs: {
    response: pins.block.appendResponse,
    blocks: pins.block.items,
  },
  async run(opts) {
    const response = await opts.state.client.blocks.children.append({
      block_id: opts.inputs.id,
      children: opts.inputs.children,
      after: opts.inputs.after,
    })

    return opts.next({
      response,
      blocks: response.results.filter(
        (result): result is BlockObjectResponse => 'type' in result,
      ),
    })
  },
})

export const updateBlock = nodes.callable({
  description: 'Update the content of a block',
  inputs: {
    id: pins.block.id,
    content: pins.block.content,
  },
  outputs: {
    block: pins.block.item,
  },
  async run(opts) {
    const response = await opts.state.client.blocks.update({
      block_id: opts.inputs.id,
      ...opts.inputs.content,
    })

    return opts.next({
      block: response as BlockObjectResponse,
    })
  },
})

export const deleteBlock = nodes.callable({
  description: 'Delete a block (archive it)',
  inputs: {
    id: pins.block.id,
  },
  outputs: {
    block: pins.block.item,
  },
  async run(opts) {
    const response = await opts.state.client.blocks.delete({
      block_id: opts.inputs.id,
    })

    return opts.next({
      block: response as BlockObjectResponse,
    })
  },
})
