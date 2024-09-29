import { IconHash } from '@tabler/icons-react';
import { type ThreadChannel } from 'discord.js';
import { pin } from '@xentom/integration';

export const threadChannel = pin.custom<ThreadChannel>().extend({
  icon: IconHash,
  isEditable: false,
});
