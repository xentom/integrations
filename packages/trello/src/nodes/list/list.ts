import * as i from '@xentom/integration-framework'

import { type Models } from 'trello.js'

import * as pins from '@/pins'

const nodes = i.nodes.group('Lists')

export const createList = nodes.action({
  description: 'Create a new list on a Trello board.',
  inputs: {
    board: pins.board.item.with({
      description: 'The board to create the list on.',
    }),
    name: pins.list.name.with({
      description: 'The name of the new list.',
    }),
  },
  outputs: {
    list: pins.list.item.with({
      description: 'The created list.',
    }),
  },
  async run(opts) {
    const list = await opts.state.client.lists.createList({
      idBoard: opts.inputs.board.id,
      name: opts.inputs.name,
    })

    return opts.next({ list })
  },
})

export const getList = nodes.pure({
  description: 'Get information about a Trello list.',
  inputs: {
    boardId: pins.board.id.with({
      description: 'The ID of the board to retrieve the list from.',
    }),
    id: pins.card.id.with({
      description: 'The ID of the list to retrieve.',
    }),
  },
  outputs: {
    list: pins.list.item.with({
      description: 'The retrieved list.',
    }),
  },
  async run(opts) {
    opts.outputs.list = await opts.state.client.lists.getList<Models.List>({
      id: opts.inputs.id,
    })
  },
})

export const archiveList = nodes.action({
  description: 'Archive a Trello list.',
  inputs: {
    list: pins.list.item.with({
      description: 'The list to archive.',
    }),
  },
  async run(opts) {
    await opts.state.client.lists.setListCloseState({
      id: opts.inputs.list.id,
      value: true,
    })
    return opts.next()
  },
})
