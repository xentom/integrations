import * as v from 'valibot';

import * as i from '@acme/integration';

const category = {
  path: ['Debug'],
} satisfies i.ActionCategory;

export const log = i.actions.callable({
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

export const error = i.actions.callable({
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

export const evaluate = i.actions.callable({
  category,
  inputs: {
    code: i.pins.data({
      control: i.controls.expression({
        defaultValue:
          '// Write the JavaScript code you want\n// to execute and return the result:\n\nMath.random();',
      }),
      isLabelVisible: false,
    }),
  },
  outputs: {
    result: i.pins.data({
      schema: v.any(),
    }),
  },
  async run(opts) {
    return opts.next({
      result: opts.inputs.code,
    });
  },
});
