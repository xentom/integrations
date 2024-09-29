import { IconMessageHeart } from '@tabler/icons-react';
import { type MessageReaction } from 'discord.js';
import { pin } from '@xentom/integration';

export const messageReaction = pin.custom<MessageReaction>().extend({
  icon: IconMessageHeart,
  isEditable: false,
});
