import { IconUserCircle } from '@tabler/icons-react';
import { type ThreadMember } from 'discord.js';
import { pin } from '@xentom/integration';

export const threadMember = pin.custom<ThreadMember>().extend({
  icon: IconUserCircle,
  isEditable: false,
});
