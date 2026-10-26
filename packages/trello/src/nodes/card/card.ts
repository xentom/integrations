import * as i from '@xentom/integration-framework'

import { type Models } from 'trello.js'

import * as pins from '@/pins'

const nodes = i.nodes.group('Cards')

export const createCard = nodes.action({
  description: 'Create a new card in a Trello list.',
  inputs: {
    list: pins.list.item.with({
      description: 'The list to create the card in.',
    }),
    name: pins.card.name.with({
      description: 'The name of the new card.',
    }),
    description: pins.card.description.with({
      description: 'The description for the new card.',
      optional: true,
    }),
    due: pins.card.due.with({
      description: 'The due date for the card (ISO 8601 format).',
      optional: true,
    }),
  },
  outputs: {
    card: pins.card.item.with({
      description: 'The created card.',
    }),
  },
  async run(opts) {
    const card = await opts.state.client.cards.createCard({
      idList: opts.inputs.list.id,
      name: opts.inputs.name,
      desc: opts.inputs.description,
      due: opts.inputs.due,
    })

    return opts.next({ card })
  },
})

export const getCard = nodes.pure({
  description: 'Get information about a Trello card.',
  inputs: {
    board: pins.board.item.with({
      description: 'The board to retrieve the card from.',
    }),
    id: pins.card.id.with({
      description: 'The ID of the card to retrieve.',
      control: i.controls.select({
        async options({ state, node }) {
          const board = node.inputs.board as Models.Board | undefined
          if (!board?.id) {
            return {
              hasMore: false,
              items: [],
            }
          }

          const cards = await state.client.boards.getBoardCards<Models.Card[]>({
            id: board.id,
          })

          return {
            hasMore: false,
            items: cards.map((card) => ({
              value: card.id,
              suffix: card.name,
            })),
          }
        },
      }),
    }),
  },
  outputs: {
    card: pins.card.item.with({
      description: 'The retrieved card.',
    }),
  },
  async run(opts) {
    opts.outputs.card = await opts.state.client.cards.getCard({
      id: opts.inputs.id,
    })
  },
})

export const updateCard = nodes.action({
  description: 'Update the properties of a Trello card.',
  inputs: {
    card: pins.card.item.with({
      description: 'The card to update.',
    }),
    name: pins.card.name.with({
      description: 'The new name for the card.',
      optional: true,
    }),
    description: pins.card.description.with({
      description: 'The new description for the card.',
      optional: true,
    }),
    list: pins.list.item.with({
      description: 'Move the card to a different list.',
      optional: true,
    }),
    due: pins.card.due.with({
      description: 'The new due date for the card (ISO 8601 format).',
      optional: true,
    }),
  },
  outputs: {
    card: pins.card.item.with({
      description: 'The updated card.',
    }),
  },
  async run(opts) {
    const card = await opts.state.client.cards.updateCard({
      id: opts.inputs.card.id,
      name: opts.inputs.name,
      desc: opts.inputs.description,
      idList: opts.inputs.list?.id,
      due: opts.inputs.due,
    })

    return opts.next({ card })
  },
})

export const deleteCard = nodes.action({
  description: 'Delete a Trello card.',
  inputs: {
    card: pins.card.item.with({
      description: 'The card to delete.',
    }),
  },
  async run(opts) {
    await opts.state.client.cards.deleteCard({ id: opts.inputs.card.id })
    return opts.next()
  },
})
