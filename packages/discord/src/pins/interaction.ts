import { IconSlash } from '@tabler/icons-react';
import { type Interaction } from 'discord.js';
import { pin } from '@xentom/integration';

export const interaction = pin.custom<Interaction>().extend({
  icon: IconSlash,
  isEditable: false,
});
