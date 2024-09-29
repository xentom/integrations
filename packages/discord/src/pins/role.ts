import { IconCrown } from '@tabler/icons-react';
import { type Role } from 'discord.js';
import { pin } from '@xentom/integration';

export const role = pin.custom<Role>().extend({
  icon: IconCrown,
  isEditable: false,
});
