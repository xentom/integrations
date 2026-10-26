import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Models } from 'trello.js'

export const id = i.pins.data({
  description: 'The unique identifier for the card.',
  schema: v.string(),
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
})

export const name = i.pins.data({
  description: 'The name of the card.',
  schema: v.pipe(v.string(), v.minLength(1)),
  control: i.controls.text({
    placeholder: 'My Card',
  }),
})

export const description = i.pins.data({
  description: 'The description of the card.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'A description for the card',
    rows: 3,
  }),
})

export const url = i.pins.data({
  description: 'The URL of the card.',
  schema: v.string(),
})

export const due = i.pins.data({
  description: 'The due date for the card (ISO 8601 format).',
  schema: v.string(),
  control: i.controls.text({
    placeholder: '2024-12-31T23:59:00.000Z',
  }),
})

export const item = i.pins.data<Models.Card>({
  description: 'A Trello card object.',
})
