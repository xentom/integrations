import * as i from '@xentom/integration-framework'

export type Action = 'completed' | 'in_progress' | 'requested'

export const action = i.pins.data<Action>({
  description: 'The action type of the action run',
  control: i.controls.select({
    options: [
      {
        label: 'Completed',
        value: 'completed',
      },
      {
        label: 'In Progress',
        value: 'in_progress',
      },
      {
        label: 'Requested',
        value: 'requested',
      },
    ],
    defaultValue: 'completed',
  }),
})
