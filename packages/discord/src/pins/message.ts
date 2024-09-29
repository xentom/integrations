import { IconMessage } from '@tabler/icons-react';
import { type Message } from 'discord.js';
import { pin } from '@xentom/integration';

export const message = pin.custom<Message>().extend({
  icon: IconMessage,
  isEditable: false,
});
