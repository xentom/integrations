import { IconUser } from '@tabler/icons-react';
import { type User } from 'discord.js';
import { pin } from '@xentom/integration';

export const user = pin.custom<User>().extend({
  icon: IconUser,
  isEditable: false,
});
