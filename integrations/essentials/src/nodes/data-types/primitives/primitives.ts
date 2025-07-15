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
      control: i.controls.expression({
        placeholder: 'Enter a number',
        defaultValue: 0,
      }),
      schema: v.number(),
    }),
  },
});

export const string = i.nodes.pure({
  category,
  outputs: {
    value: i.pins.data({
      displayName: false,
      control: i.controls.text({
        placeholder: 'Enter a string',
        defaultValue: '',
      }),
      schema: v.string(),
    }),
  },
});

export const boolean = i.nodes.pure({
  category,
  outputs: {
    value: i.pins.data({
      displayName: false,
      control: i.controls.switch({
        defaultValue: true,
      }),
      schema: v.boolean(),
    }),
  },
});
