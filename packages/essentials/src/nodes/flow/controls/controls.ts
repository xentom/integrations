import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

const category = {
  path: ['Flow', 'Controls'],
} satisfies i.NodeCategory;

export const branch = i.nodes.callable({
  category,
  inputs: {
    condition: i.pins.data({
      schema: v.boolean(),
      control: i.controls.switch({
        defaultValue: false,
      }),
    }),
  },
  outputs: {
    true: i.pins.exec(),
    false: i.pins.exec(),
  },
  async run(opts) {
    return opts.next(opts.inputs.condition ? 'true' : 'false');
  },
});

export const repeat = i.nodes.callable({
  description: 'Loop for a given number of times',
  category,
  inputs: {
    count: i.pins.data({
      description: 'Number of iterations to perform',
      schema: v.number(),
      control: i.controls.expression({
        placeholder: 'Enter a number',
        defaultValue: 1,
      }),
    }),
  },
  outputs: {
    completed: i.pins.exec({
      description: 'Triggered when the loop completes',
    }),
    loop: i.pins.exec({
      displayName: 'Loop Body',
      description: 'Triggered for each iteration',
      outputs: {
        index: i.pins.data({
          displayName: 'Index',
          description: 'Current iteration index',
          schema: v.number(),
        }),
      },
    }),
  },
  async run(opts) {
    for (let i = 0; i < opts.inputs.count; i++) {
      await opts.next('loop', { index: i });
    }

    return opts.next('completed');
  },
});

export const forEach = i.generic(<
  I extends i.GenericInputs<typeof inputs>,
>() => {
  const inputs = {
    array: i.pins.data({
      description: 'Array to iterate over',
      schema: v.array(v.unknown()),
      control: i.controls.expression({
        defaultValue: [],
      }),
    }),
  };

  return i.nodes.callable({
    category,
    description: 'Loops over a list of elements',
    inputs,
    outputs: {
      completed: i.pins.exec({
        description: 'Triggered when the loop completes',
      }),
      loop: i.pins.exec({
        displayName: 'Loop Body',
        description: 'Triggered for each element in the array',
        outputs: {
          element: i.pins.data<I['array'][number]>({
            displayName: 'Element',
            description: 'Current element in the array',
          }),
          index: i.pins.data({
            displayName: 'Index',
            description: 'Current index in the array',
            schema: v.number(),
          }),
        },
      }),
    },
    async run(opts) {
      for (let i = 0; i < opts.inputs.array.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await opts.next('loop', {
          element: opts.inputs.array[i],
          index: i,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      }

      return opts.next('completed');
    },
  });
});
