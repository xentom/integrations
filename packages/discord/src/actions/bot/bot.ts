import * as discordPins from '@/pins';
import {
  IconAlertCircle,
  IconCircleCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Bot';

export const onReady = createAction({
  group,
  icon: IconCircleCheck,
  description: 'Triggered when the bot is ready.',
  outputs: {
    exec: pin.exec(),
    client: discordPins.client.extend({
      description: 'Returns the client that is ready.',
    }),
  },
  run({ state, next }) {
    state.client.on('ready', (client) => {
      next('exec', { client });
    });
  },
});

export const onDebug = createAction({
  group,
  icon: IconInfoCircle,
  description: 'Triggered when the bot logs a debug message.',
  outputs: {
    exec: pin.exec(),
    message: pin.string({
      description: 'Returns the debug message.',
      isEditable: false,
    }),
  },
  run({ state, next }) {
    state.client.on('debug', (message) => {
      next('exec', { message });
    });
  },
});

export const onWarn = createAction({
  group,
  icon: IconAlertCircle,
  description: 'Triggered when the bot logs a warning message.',
  outputs: {
    exec: pin.exec(),
    message: pin.string({
      description: 'Returns the warning message.',
      isEditable: false,
    }),
  },
  run({ state, next }) {
    state.client.on('warn', (message) => {
      next('exec', { message });
    });
  },
});
