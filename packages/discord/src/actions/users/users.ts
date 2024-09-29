import * as discordPins from '@/pins';
import { IconUserCog } from '@tabler/icons-react';
import { type PartialUser, type User } from 'discord.js';
import { createAction, pin } from '@xentom/integration';

const group = 'Users';

export const onUserUpdated = createAction({
  group,
  icon: IconUserCog,
  description: 'Triggers when a user is updated.',
  outputs: {
    exec: pin.exec(),
    oldUser: discordPins.user.custom<User | PartialUser>().extend({
      description: 'Returns the user before it was updated.',
    }),
    newUser: discordPins.user.extend({
      description: 'Returns the user after it was updated.',
    }),
  },
  run({ state, next }) {
    state.client.on('userUpdate', (oldUser, newUser) => {
      next('exec', { oldUser, newUser });
    });
  },
});
