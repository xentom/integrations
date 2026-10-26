import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Models } from 'trello.js'

export const id = i.pins.data({
  description: 'The unique identifier for the list.',
  schema: v.string(),
  control: i.controls.select({
    async options({ state }) {
      const boards = await state.client.members.getMemberBoards({ id: 'me' })
      const listsPerBoard = await Promise.all(
        boards.map((board) =>
          state.client.boards.getBoardLists({ id: board.id }),
        ),
      )
      const lists = listsPerBoard.flat()
      return {
        hasMore: false,
        items: lists.map((list) => ({
          value: list.id,
          suffix: list.name,
        })),
      }
    },
  }),
})

export const name = i.pins.data({
  description: 'The name of the list.',
  schema: v.pipe(v.string(), v.minLength(1)),
  control: i.controls.text({
    placeholder: 'To Do',
  }),
})

export const item = i.pins.data<Models.List>({
  description: 'A Trello list object.',
})
