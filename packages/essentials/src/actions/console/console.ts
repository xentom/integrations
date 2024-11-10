import { IconLogs } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Console';

export const log = createAction({
  group,
  icon: IconLogs,
  description: 'Log a message to the console.',
  inputs: {
    exec: pin.exec({
      run({ inputs, next }) {
        console.log(inputs.value);
        next('exec');
      },
    }),
    value: pin
      .string({
        label: null,
        description: 'The message to log.',
        placeholder: 'Hello, world!',
      })
      .custom<any>(),
  },
  outputs: {
    exec: pin.exec(),
  },
});

export const warn = createAction({
  group,
  icon: IconLogs,
  description: 'Log a warning to the console.',
  inputs: {
    exec: pin.exec({
      run({ inputs, next }) {
        console.warn(inputs.value);
        next('exec');
      },
    }),
    value: pin.string({
      label: null,
      description: 'The warning message to log.',
      placeholder: 'Warning!',
    }),
  },
  outputs: {
    exec: pin.exec(),
  },
});

export const error = createAction({
  group,
  icon: IconLogs,
  description: 'Log an error to the console.',
  inputs: {
    exec: pin.exec({
      run({ inputs, next }) {
        console.error(inputs.value);
        next('exec');
      },
    }),
    value: pin.string({
      label: null,
      description: 'The error message to log.',
      placeholder: 'Error!',
    }),
  },
  outputs: {
    exec: pin.exec(),
  },
});
