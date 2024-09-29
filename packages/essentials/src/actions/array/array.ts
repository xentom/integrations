import { IconRepeat } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Array';

export const forEach = createAction({
  group,
  icon: IconRepeat,
  description: 'Loop through each item in an array.',
  inputs: {
    exec: pin.exec({
      run({ inputs, next }) {
        (inputs.list as unknown[]).forEach((item, index) => {
          next('loopBody', { item, index });
        });
        next('completed');
      },
    }),
    list: pin.array({
      isEditable: true,
    }),
  },
  outputs: {
    completed: pin.exec({
      description: 'Executes when the loop completes.',
    }),
    loopBody: pin.exec({
      description: 'Executed for each item in the array.',
    }),
    item: pin.unknown({
      description: 'The current item in the array.',
    }),
    index: pin.number({
      isEditable: false,
      description: 'The current item index.',
    }),
  },
});
