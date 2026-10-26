import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Boards')

export const createBoard = nodes.action({
  description: 'Create a new Trello board.',
  inputs: {
    name: pins.board.name.with({
      description: 'The name of the new board.',
    }),
    description: pins.board.description.with({
      description: 'The description for the new board.',
      optional: true,
    }),
  },
  outputs: {
    board: pins.board.item.with({
      description: 'The created board.',
    }),
  },
  async run(opts) {
    const board = await opts.state.client.boards.createBoard({
      name: opts.inputs.name,
      desc: opts.inputs.description,
    })

    return opts.next({ board })
  },
})

export const getBoard = nodes.pure({
  description: 'Get information about a Trello board.',
  inputs: {
    id: pins.board.id.with({
      description: 'The ID of the board to retrieve.',
    }),
  },
  outputs: {
    board: pins.board.item.with({
      description: 'The retrieved board.',
    }),
  },
  async run(opts) {
    opts.outputs.board = await opts.state.client.boards.getBoard({
      id: opts.inputs.id,
    })
  },
})

export const updateBoard = nodes.action({
  description: 'Update the properties of a Trello board.',
  inputs: {
    board: pins.board.item.with({
      description: 'The board to update.',
    }),
    name: pins.board.name.with({
      description: 'The new name for the board.',
      optional: true,
    }),
    description: pins.board.description.with({
      description: 'The new description for the board.',
      optional: true,
    }),
  },
  outputs: {
    board: pins.board.item.with({
      description: 'The updated board.',
    }),
  },
  async run(opts) {
    await opts.state.client.boards.updateBoard({
      id: opts.inputs.board.id,
      name: opts.inputs.name,
      desc: opts.inputs.description,
    })

    const board = await opts.state.client.boards.getBoard({
      id: opts.inputs.board.id,
    })

    return opts.next({ board })
  },
})

export const deleteBoard = nodes.action({
  description: 'Delete a Trello board.',
  inputs: {
    board: pins.board.item.with({
      description: 'The board to delete.',
    }),
  },
  async run(opts) {
    await opts.state.client.boards.deleteBoard({ id: opts.inputs.board.id })
    return opts.next()
  },
})
