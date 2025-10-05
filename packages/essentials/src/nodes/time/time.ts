import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

const nodes = i.nodes.group('Time');

export const onInterval = nodes.trigger({
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

export const sleep = nodes.callable({
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
