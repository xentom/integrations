import { IconRobot } from '@tabler/icons-react';
import { type Client } from 'discord.js';
import { pin } from '@xentom/integration';

export const client = pin.custom<Client>().extend({
  icon: IconRobot,
  isEditable: false,
});
