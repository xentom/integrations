import * as discordPins from '@/pins';
import { IconBan } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Bans';

export const onBanAdded = createAction({
  group,
  icon: IconBan,
  description: 'Triggered when a ban is added.',
  outputs: {
    exec: pin.exec(),
    ban: discordPins.ban.extend({
      description: 'Returns the ban that was added.',
    }),
  },
  run({ state, next }) {
    state.client.on('guildBanAdd', (ban) => {
      next('exec', { ban });
    });
  },
});

export const onBanRemoved = createAction({
  group,
  icon: IconBan,
  description: 'Triggered when a ban is removed.',
  outputs: {
    exec: pin.exec(),
    ban: discordPins.ban.extend({
      description: 'Returns the ban that was removed.',
    }),
  },
  run({ state, next }) {
    state.client.on('guildBanRemove', (ban) => {
      next('exec', { ban });
    });
  },
});
