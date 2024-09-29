import { IconBan } from '@tabler/icons-react';
import { type GuildBan } from 'discord.js';
import { pin } from '@xentom/integration';

export const ban = pin.custom<GuildBan>().extend({
  icon: IconBan,
  isEditable: false,
});
