import * as v from 'valibot';

import * as i from '@acme/integration-framework';

const category = {
  path: ['DataTypes', 'Primitives'],
} satisfies i.NodeCategory;

export const number = i.nodes.pure({
  category,
  outputs: {
    value: i.pins.data({
      displayName: false,
      schema: v.number(),
      control: i.controls.expression({
        placeholder: 'Enter a number',
        defaultValue: 0,
      }),
    }),
  },
});

export const string = i.nodes.pure({
  category,
  outputs: {
    value: i.pins.data({
      displayName: false,
      schema: v.string(),
      control: i.controls.expression({
        placeholder: 'Enter a string',
        defaultValue: '',
      }),
    }),
  },
});

export const boolean = i.nodes.pure({
  category,
  outputs: {
    value: i.pins.data({
      displayName: false,
      schema: v.boolean(),
      control: i.controls.switch({
        defaultValue: true,
      }),
    }),
  },
});
