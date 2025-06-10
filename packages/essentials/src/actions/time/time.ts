import {
  actions,
  controls,
  InputControlLanguage,
  pins,
} from '@acme/integration';
import * as v from 'valibot';

const category = 'Time';

export const onInterval = actions.trigger({
  category,
  inputs: {
    ms: pins.data({
      displayName: 'Milliseconds',
      schema: v.number(),
      control: controls.input({
        defaultValue: 1000,
      }),
    }),
  },
  subscribe({ inputs, next }) {
    const interval = setInterval(() => next(), inputs.ms);
    return () => {
      clearInterval(interval);
    };
  },
});

export const sleep = actions.callable({
  category,
  inputs: {
    duration: pins.data({
      control: controls.input({
        language: InputControlLanguage.Json,
        defaultValue: 1000,
        description: 'Duration to sleep in milliseconds',
      }),
      schema: v.number(),
    }),
  },
  async run({ inputs, next }) {
    await Bun.sleep(inputs.duration);
    await next();
  },
});
