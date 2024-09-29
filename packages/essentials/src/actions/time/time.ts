import { IconClockPause } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Time';

export const timeout = createAction({
  group,
  icon: IconClockPause,
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        await new Promise((resolve) =>
          setTimeout(resolve, inputs.milliseconds),
        );
        next('exec');
      },
    }),
    milliseconds: pin.number({
      defaultValue: 1000,
    }),
  },
  outputs: {
    exec: pin.exec(),
  },
});
