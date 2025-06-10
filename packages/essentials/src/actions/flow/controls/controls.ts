import {
  actions,
  controls,
  generic,
  InputControlLanguage,
  pins,
  type GenericInputs,
} from '@acme/integration';
import * as v from 'valibot';

const category = 'Flow / Controls';

export const branch = actions.callable({
  category,
  inputs: {
    condition: pins.data({
      schema: v.boolean(),
      control: controls.switch(),
    }),
  },
  outputs: {
    true: pins.exec(),
    false: pins.exec(),
  },
  run({ inputs, next }) {
    next(inputs.condition ? 'true' : 'false');
  },
});

export const forEach = generic(<I extends GenericInputs<typeof inputs>>() => {
  const inputs = {
    array: pins.data({
      description: 'Array to iterate over',
      schema: v.array(v.unknown()),
      control: controls.input({
        language: InputControlLanguage.Json,
        defaultValue: [],
      }),
    }),
  };

  return actions.callable({
    category,
    inputs,
    outputs: {
      completed: pins.exec({
        displayName: 'Completed',
      }),
      loopBody: pins.exec({
        displayName: 'Loop Body',
        description: 'Triggered for each element in the array',
        outputs: {
          element: pins.data({
            displayName: 'Array Element',
            description: 'Current element in the array',
            schema: v.custom<I['array'][number]>(() => true),
          }),
          index: pins.data({
            displayName: 'Array Index',
            description: 'Current index in the array',
            schema: v.number(),
          }),
        },
      }),
    },
    async run({ inputs, next }) {
      for (let i = 0; i < inputs.array.length; i++) {
        await next('loopBody', {
          element: inputs.array[i],
          index: i,
        } as any);
      }

      await next('completed');
    },
  });
});
