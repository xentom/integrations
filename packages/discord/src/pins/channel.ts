import { IconHash } from '@tabler/icons-react';
import { type Channel, type NonThreadGuildBasedChannel } from 'discord.js';
import { pin } from '@xentom/integration';

export const channel = pin.custom<Channel>().extend({
  icon: IconHash,
  isEditable: false,
});

export const nonThreadGuildBasedChannel = pin
  .custom<NonThreadGuildBasedChannel>()
  .extend({
    icon: IconHash,
    isEditable: false,
  });
