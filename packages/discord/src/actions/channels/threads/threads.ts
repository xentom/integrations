import { IconThread } from '@/icons/icon-thread';
import * as discordPins from '@/pins';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  TextChannel,
  type AnyThreadChannel,
  type ThreadChannel,
} from 'discord.js';
import { createAction, pin } from '@xentom/integration';

const group = 'Channels/Threads';

export const onThreadCreated = createAction({
  group,
  icon: IconThread,
  description: 'Triggered when a thread is created.',
  outputs: {
    exec: pin.exec(),
    thread: discordPins.threadChannel.custom<AnyThreadChannel>().extend({
      description: 'Returns the thread that was created.',
    }),
  },
  run({ state, next }) {
    state.client.on('threadCreate', (thread) => {
      next('exec', { thread });
    });
  },
});

export const onThreadUpdated = createAction({
  group,
  icon: IconThread,
  description: 'Triggered when a thread is updated.',
  outputs: {
    exec: pin.exec(),
    oldThread: discordPins.threadChannel.custom<AnyThreadChannel>().extend({
      description: 'Returns the thread before it was updated.',
    }),
    newThread: discordPins.threadChannel.custom<AnyThreadChannel>().extend({
      description: 'Returns the thread after it was updated.',
    }),
  },
  run({ state, next }) {
    state.client.on('threadUpdate', (oldThread, newThread) => {
      next('exec', { oldThread, newThread });
    });
  },
});

export const onThreadDeleted = createAction({
  group,
  icon: IconThread,
  description: 'Triggered when a thread is deleted.',
  outputs: {
    exec: pin.exec(),
    thread: discordPins.threadChannel.custom<AnyThreadChannel>().extend({
      description: 'Returns the thread that was deleted.',
    }),
  },
  run({ state, next }) {
    state.client.on('threadDelete', (thread) => {
      next('exec', { thread });
    });
  },
});

export const createThread = createAction({
  group,
  icon: IconPlus,
  description: 'Create a new thread.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        if (!(inputs.channel instanceof TextChannel)) {
          throw new Error(
            'Failed to create thread: Channel is not a text channel.',
          );
        }

        next('exec', {
          thread: await inputs.channel.threads.create({
            name: inputs.name,
          }),
        });
      },
    }),
    channel: discordPins.channel.extend({
      description: 'The channel to create the thread in.',
    }),
    name: pin.string({
      description: 'The name of the thread.',
    }),
  },
  outputs: {
    exec: pin.exec(),
    thread: discordPins.threadChannel.extend({
      description: 'Returns the thread that was created.',
    }),
  },
});

export const updateThread = createAction({
  group,
  icon: IconPencil,
  description: 'Update a thread.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        next('exec', {
          thread: await (inputs.thread as ThreadChannel).edit({
            name: inputs.name,
          }),
        });
      },
    }),
    thread: discordPins.threadChannel.extend({
      description: 'The thread to update.',
    }),
    name: pin.string({
      description: 'The new name of the thread.',
      isOptional: true,
    }),
  },
  outputs: {
    exec: pin.exec(),
    thread: discordPins.threadChannel.custom<AnyThreadChannel>().extend({
      description: 'Returns the thread that was updated.',
    }),
  },
});

export const deleteThread = createAction({
  group,
  icon: IconTrash,
  description: 'Delete a thread.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        next('exec', {
          thread: await (inputs.thread as ThreadChannel).delete(),
        });
      },
    }),
    thread: discordPins.threadChannel.extend({
      description: 'The thread to delete.',
    }),
  },
  outputs: {
    exec: pin.exec(),
    thread: discordPins.threadChannel.custom<ThreadChannel>().extend({
      description: 'Returns the thread that was deleted.',
    }),
  },
});
