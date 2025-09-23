import * as i from '@xentom/integration-framework';

export type Action = 'completed' | 'in_progress' | 'queued' | 'waiting';

export const action = i.pins.data<Action>({
  description: 'The action type of the action job',
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
        label: 'Queued',
        value: 'queued',
      },
      {
        label: 'Waiting',
        value: 'waiting',
      },
    ],
    defaultValue: 'completed',
  }),
});
