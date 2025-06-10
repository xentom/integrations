import {
  actions,
  controls,
  InputControlLanguage,
  pins,
} from '@acme/integration';
import * as v from 'valibot';

export const number = actions.pure({
  category: 'DataTypes / Primitives',
  outputs: {
    value: pins.data({
      schema: v.number(),
      isLabelVisible: false,
      control: controls.input({
        language: InputControlLanguage.Json,
        defaultValue: 0,
      }),
    }),
  },
});

export const string = actions.pure({
  category: 'DataTypes / Primitives',
  outputs: {
    value: pins.data({
      schema: v.string(),
      isLabelVisible: false,
      control: controls.input({
        defaultValue: '',
      }),
    }),
  },
});

export const boolean = actions.pure({
  category: 'DataTypes / Primitives',
  outputs: {
    value: pins.data({
      schema: v.boolean(),
      isLabelVisible: false,
      control: controls.switch({
        defaultValue: true,
      }),
    }),
  },
});
