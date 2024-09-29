import { IconArrowsSplit, IconRepeat } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Flow Controls';

export const branch = createAction({
  group,
  icon: IconArrowsSplit,
  description: 'Branch the flow based on a condition.',
  inputs: {
    exec: pin.exec({
      run({ inputs, next }) {
        next(inputs.condition ? 'true' : 'false');
      },
    }),
    condition: pin.boolean({
      description: 'The condition to check.',
    }),
  },
  outputs: {
    true: pin.exec({
      label: 'True',
      description: 'Executes if the condition is true.',
    }),
    false: pin.exec({
      label: 'False',
      description: 'Executes if the condition is false.',
    }),
  },
});

export const whileLoop = createAction({
  group,
  icon: IconRepeat,
  description: 'Loop while a condition is true.',
  inputs: {
    exec: pin.exec({
      run({ inputs, next }) {
        while (inputs.condition) {
          next('loopBody');
        }
        next('completed');
      },
    }),
    condition: pin.boolean({
      description: 'The condition to check.',
    }),
  },
  outputs: {
    completed: pin.exec({
      description: 'Executes when the loop completes.',
    }),
    loopBody: pin.exec({
      description: 'Executes each iteration of the loop.',
    }),
  },
});

export const forLoop = createAction({
  group,
  icon: IconRepeat,
  description: 'Loop a set number of times.',
  inputs: {
    exec: pin.exec({
      run({ inputs, next }) {
        for (let i = 0; i < inputs.count; i++) {
          next('loopBody', {
            index: i,
          });
        }
        next('completed');
      },
    }),
    count: pin.number({
      description: 'The number of times to loop.',
    }),
  },
  outputs: {
    completed: pin.exec({
      description: 'Executes when the loop completes.',
    }),
    loopBody: pin.exec({
      description: 'Executes each iteration of the loop.',
    }),
    index: pin.number({
      description: 'The current iteration index.',
      isEditable: false,
    }),
  },
});
