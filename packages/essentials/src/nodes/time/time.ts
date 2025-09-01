import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

const category = {
  path: ['Time'],
} satisfies i.NodeCategory;

export const onInterval = i.nodes.trigger({
  category,
  inputs: {
    ms: i.pins.data({
      displayName: 'Milliseconds',
      schema: v.number(),
      control: i.controls.expression({
        defaultValue: 1000,
      }),
    }),
  },
  subscribe(opts) {
    const interval = setInterval(() => {
      void opts.next();
    }, opts.inputs.ms);

    return () => {
      clearInterval(interval);
    };
  },
});

export const sleep = i.nodes.callable({
  category,
  inputs: {
    duration: i.pins.data({
      schema: v.number(),
      control: i.controls.expression({
        defaultValue: 1000,
        description: 'Duration to sleep in milliseconds',
      }),
    }),
  },
  async run(opts) {
    await Bun.sleep(opts.inputs.duration);
    return opts.next();
  },
});
