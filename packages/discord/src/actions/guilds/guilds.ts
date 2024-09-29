import * as discordPins from '@/pins';
import { IconServer } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Guilds';

export const getGuild = createAction({
  group,
  icon: IconServer,
  description: 'Get a guild by ID.',
  inputs: {
    id: pin.number({
      label: 'ID',
      description: 'The ID of the guild to get.',
    }),
  },
  outputs: {
    guild: discordPins.guild.extend({
      description: 'Returns the guild.',
    }),
  },
  async run({ inputs, outputs, state }) {
    outputs.guild = await state.client.guilds.fetch(inputs.id);
  },
});
