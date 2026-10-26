import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Models } from 'trello.js'

export const id = i.pins.data({
  description: 'The unique identifier for the board.',
  schema: v.string(),
  control: i.controls.select({
    async options({ state }) {
      const boards = await state.client.members.getMemberBoards({ id: 'me' })
      return {
        hasMore: false,
        items: boards.map((board) => ({
          value: board.id,
          suffix: board.name,
        })),
      }
    },
  }),
})

export const name = i.pins.data({
  description: 'The name of the board.',
  schema: v.pipe(v.string(), v.minLength(1), v.maxLength(16384)),
  control: i.controls.text({
    placeholder: 'My Board',
  }),
})

export const description = i.pins.data({
  description: 'The description of the board.',
  schema: v.pipe(v.string(), v.maxLength(16384)),
  control: i.controls.text({
    placeholder: 'A description for the board',
    rows: 3,
  }),
})

export const url = i.pins.data({
  displayName: 'URL',
  description: 'The URL of the board.',
  schema: v.string(),
})

export const item = i.pins.data<Models.Board>({
  description: 'A Trello board object.',
})
