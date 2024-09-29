import * as discordPins from '@/pins';
import { IconSlash } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Interactions';

export const onInteractionCreated = createAction({
  group,
  icon: IconSlash,
  description: 'Triggered when an interaction is created.',
  outputs: {
    exec: pin.exec(),
    interaction: discordPins.interaction.extend({
      description: 'Returns the interaction that was created.',
    }),
  },
  run({ state, next }) {
    state.client.on('interactionCreate', (interaction) => {
      next('exec', { interaction });
    });
  },
});
