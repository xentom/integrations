import * as discordPins from '@/pins';
import { IconLogin, IconLogout, IconUserEdit } from '@tabler/icons-react';
import { type GuildMember, type PartialGuildMember } from 'discord.js';
import { createAction, pin } from '@xentom/integration';

const group = 'Members';

export const onMemberJoined = createAction({
  group,
  icon: IconLogin,
  description: 'Triggered when a member joins the guild.',
  outputs: {
    exec: pin.exec(),
    member: discordPins.guildMember.extend({
      description: 'Returns the member that joined the guild.',
    }),
  },
  run({ state, next }) {
    state.client.on('guildMemberAdd', (member) => {
      next('exec', { member });
    });
  },
});

export const onMemberUpdated = createAction({
  group,
  icon: IconUserEdit,
  description: 'Triggered when a member is updated.',
  outputs: {
    exec: pin.exec(),
    oldMember: discordPins.guildMember
      .custom<GuildMember | PartialGuildMember>()
      .extend({
        description: 'Returns the member before it was updated.',
      }),
    newMember: discordPins.guildMember.extend({
      description: 'Returns the member after it was updated.',
    }),
  },
  run({ state, next }) {
    state.client.on('guildMemberUpdate', (oldMember, newMember) => {
      next('exec', { oldMember, newMember });
    });
  },
});

export const onMemberLeft = createAction({
  group,
  icon: IconLogout,
  description: 'Triggered when a member leaves the guild.',
  outputs: {
    exec: pin.exec(),
    member: discordPins.guildMember
      .custom<GuildMember | PartialGuildMember>()
      .extend({
        description: 'Returns the member that left the guild.',
      }),
  },
  run({ state, next }) {
    state.client.on('guildMemberRemove', (member) => {
      next('exec', { member });
    });
  },
});
