import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons-react';
import { createAction, onCleanup, pin } from '@xentom/integration';

const group = 'Events';

export const onWorkflowStart = createAction({
  group,
  icon: IconPlayerPlay,
  description: 'Triggered when the workflow starts.',
  outputs: {
    exec: pin.exec(),
  },
  run({ next }) {
    next('exec');
  },
});

export const onWorkflowStop = createAction({
  group,
  icon: IconPlayerStop,
  description: 'Triggered when the workflow stops.',
  outputs: {
    exec: pin.exec(),
  },
  run({ next }) {
    onCleanup(async () => {
      await next('exec');
    });
  },
});

export const onInterval = createAction({
  group,
  icon: IconPlayerPlay,
  description: 'Triggered at a set interval.',
  inputs: {
    milliseconds: pin.number({
      description: 'The interval in milliseconds.',
    }),
  },
  outputs: {
    exec: pin.exec(),
  },
  run({ inputs, next }) {
    const interval = setInterval(() => {
      next('exec');
    }, inputs.milliseconds);

    onCleanup(() => {
      clearInterval(interval);
    });
  },
});
