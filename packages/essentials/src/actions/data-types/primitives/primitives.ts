import * as v from 'valibot';

import * as i from '@acme/integration';

const category = {
  path: ['DataTypes', 'Primitives'],
} satisfies i.ActionCategory;

export const number = i.actions.pure({
  category,
  outputs: {
    value: i.pins.data({
      schema: v.number(),
      control: i.controls.expression({
        placeholder: 'Enter a number',
        defaultValue: 0,
      }),
      isLabelVisible: false,
    }),
  },
});

export const string = i.actions.pure({
  category,
  outputs: {
    value: i.pins.data({
      schema: v.string(),
      control: i.controls.expression({
        placeholder: 'Enter a string',
        defaultValue: '',
      }),
      isLabelVisible: false,
    }),
  },
});

export const boolean = i.actions.pure({
  category,
  outputs: {
    value: i.pins.data({
      schema: v.boolean(),
      control: i.controls.switch({
        defaultValue: true,
      }),
      isLabelVisible: false,
    }),
  },
});
