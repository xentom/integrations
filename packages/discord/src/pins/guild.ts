import { IconServer } from '@tabler/icons-react';
import { type Guild } from 'discord.js';
import { pin } from '@xentom/integration';

export const guild = pin.custom<Guild>().extend({
  icon: IconServer,
  isEditable: false,
});
