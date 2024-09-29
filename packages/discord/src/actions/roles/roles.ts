import * as discordPins from '@/pins';
import { IconCrown, IconCrownOff } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Roles';

export const onRoleCreated = createAction({
  group,
  icon: IconCrown,
  description: 'Triggered when a role is created.',
  outputs: {
    exec: pin.exec(),
    role: discordPins.role.extend({
      description: 'Returns the role that was created.',
    }),
  },
  run({ state, next }) {
    state.client.on('roleCreate', (role) => {
      next('exec', { role });
    });
  },
});

export const onRoleUpdated = createAction({
  group,
  icon: IconCrown,
  description: 'Triggered when a role is updated.',
  outputs: {
    exec: pin.exec(),
    oldRole: discordPins.role.extend({
      description: 'Returns the role before it was updated.',
    }),
    newRole: discordPins.role.extend({
      description: 'Returns the role after it was updated.',
    }),
  },
  run({ state, next }) {
    state.client.on('roleUpdate', (oldRole, newRole) => {
      next('exec', { oldRole, newRole });
    });
  },
});

export const onRoleDeleted = createAction({
  group,
  icon: IconCrownOff,
  description: 'Triggered when a role is deleted.',
  outputs: {
    exec: pin.exec(),
    role: discordPins.role.extend({
      description: 'Returns the role that was deleted.',
    }),
  },
  run({ state, next }) {
    state.client.on('roleDelete', (role) => {
      next('exec', { role });
    });
  },
});
