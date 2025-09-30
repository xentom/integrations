import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

const category = {
  path: ['Debug'],
} satisfies i.NodeCategory;

export const log = i.nodes.callable({
  category,
  inputs: {
    message: i.pins.data({
      schema: v.any(),
      control: i.controls.expression({
        placeholder: 'Enter message to log',
      }),
    }),
  },
  run(opts) {
    console.log(opts.inputs.message);
    return opts.next();
  },
});

export const error = i.nodes.callable({
  category,
  inputs: {
    message: i.pins.data({
      schema: v.string(),
      control: i.controls.text({
        defaultValue: 'This is an error message',
      }),
    }),
  },
  run(opts) {
    throw new Error(opts.inputs.message);
  },
});

export const evaluate = i.nodes.callable({
  category,
  inputs: {
    code: i.pins.data({
      displayName: false,
      control: i.controls.text({
        language: i.TextControlLanguage.JavaScript,
        defaultValue: 'return Math.random();',
        placeholder: 'return Math.random();',
      }),
      schema: v.string(),
    }),
  },
  outputs: {
    result: i.pins.data(),
  },
  async run(opts) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
    const result = await new Function(
      ...Object.keys(opts.variables),
      `"use strict"; return (async () => { ${opts.inputs.code} })();`,
    )(...Object.values(opts.variables));

    return opts.next({
      result,
    });
  },
});
