import * as i from '@xentom/integration-framework';

export type Action = 'created' | 'deleted' | 'edited';

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
});
