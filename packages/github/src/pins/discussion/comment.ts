import * as i from '@xentom/integration-framework'

import * as general from '@/pins/general'

export type Action = 'created' | 'deleted' | 'edited'

export const action = i.pins.data<Action>({
  description: 'The action type of the discussion comment',
  control: i.controls.select({
    options: [
      {
        label: 'Created',
        value: 'created',
      },
      {
        label: 'Deleted',
        value: 'deleted',
      },
      {
        label: 'Edited',
        value: 'edited',
      },
    ],
  }),
})

export const body = general.markdown.with({
  description: 'The body content of the discussion comment',
})
