import { IconUserCircle } from '@tabler/icons-react';
import { type GuildMember } from 'discord.js';
import { pin } from '@xentom/integration';

export const guildMember = pin.custom<GuildMember>().extend({
  icon: IconUserCircle,
  isEditable: false,
});
