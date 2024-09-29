import * as discordPins from '@/pins';
import { IconUserEdit } from '@tabler/icons-react';
import {
  type PartialThreadMember,
  type ReadonlyCollection,
  type ThreadMember,
} from 'discord.js';
import { createAction, pin } from '@xentom/integration';

const group = 'Channels/Threads/Members';

export const onThreadMemberUpdated = createAction({
  group,
  icon: IconUserEdit,
  description: 'Triggered when a thread member is updated.',
  outputs: {
    exec: pin.exec(),
    oldMember: discordPins.threadMember.extend({
      description: 'Returns the member before it was updated.',
    }),
    newMember: discordPins.threadMember.extend({
      description: 'Returns the member after it was updated.',
    }),
  },
  run({ state, next }) {
    state.client.on('threadMemberUpdate', (oldMember, newMember) => {
      next('exec', { oldMember, newMember });
    });
  },
});

export const onThreadMembersUpdated = createAction({
  group,
  icon: IconUserEdit,
  description: 'Triggered when thread members are updated.',
  outputs: {
    exec: pin.exec(),
    addedMembers: discordPins.threadMember
      .custom<ReadonlyCollection<string, ThreadMember<boolean>>>()
      .extend({
        description: 'Returns the members that were added.',
      }),
    removedMembers: discordPins.threadMember
      .custom<
        ReadonlyCollection<string, ThreadMember<boolean> | PartialThreadMember>
      >()
      .extend({
        description: 'Returns the members that were removed.',
      }),
    thread: discordPins.threadChannel.extend({
      description: 'Returns the thread that was updated.',
    }),
  },
  run({ state, next }) {
    state.client.on(
      'threadMembersUpdate',
      (addedMembers, removedMembers, thread) => {
        next('exec', { addedMembers, removedMembers, thread });
      },
    );
  },
});
