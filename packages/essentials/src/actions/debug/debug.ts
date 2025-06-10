import {
  actions,
  controls,
  DefaultExecPinName,
  InputControlLanguage,
  pins,
} from '@acme/integration';
import * as v from 'valibot';

const category = 'Debug';

export const log = actions.callable({
  category,
  inputs: {
    message: pins.data({
      schema: v.any(),
      control: controls.input({
        placeholder: 'Enter message to log',
      }),
    }),
  },
  run({ inputs, next }) {
    console.log(inputs.message);
    next();
  },
});

export const error = actions.callable({
  category,
  inputs: {
    message: pins.data({
      control: controls.input({
        defaultValue: 'This is an error message',
      }),
      schema: v.string(),
    }),
  },
  run({ inputs }) {
    throw new Error(inputs.message);
  },
});

export const evaluate = actions.callable({
  category: 'JavaScript',
  inputs: {
    code: pins.data({
      schema: v.string(),
      isLabelVisible: false,
      control: controls.input({
        language: InputControlLanguage.JavaScript,
        defaultValue:
          '// Write the JavaScript code you want to execute\n// and return the result:\n\nreturn Math.random();',
      }),
    }),
  },
  outputs: {
    output: pins.data({
      schema: v.any(),
    }),
  },
  async run({ inputs, variables, next }) {
    const dynamicFunction = new Function(
      'globals',
      `return (async () => {
        with (globals) {
          ${inputs.code}
        }
      })();`
    );

    next({
      output: await dynamicFunction(variables),
    });
  },
});
