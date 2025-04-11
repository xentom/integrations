import { actions, controls, pins } from '@acme/integration';
import * as v from 'valibot';

export const log = actions.callable({
  inputs: {
    message: pins.data({
      schema: v.any(),
      control: controls.input(),
    }),
  },
  run({ inputs }) {
    console.log(inputs.message);
  },
});
