import * as discordPins from '@/pins';
import {
  IconMessageCog,
  IconMessagePlus,
  IconMessageUp,
  IconMessageX,
} from '@tabler/icons-react';
import { BaseGuildTextChannel, Message, type PartialMessage } from 'discord.js';
import { createAction, pin } from '@xentom/integration';

const group = 'Messages';

export const onMessageCreated = createAction({
  group,
  icon: IconMessagePlus,
  description: 'Triggered when a message is created.',
  outputs: {
    exec: pin.exec(),
    message: discordPins.message.extend({
      description: 'Returns the message that was created.',
    }),
  },
  run({ state, next }) {
    state.client.on('messageCreate', (message) => {
      next('exec', { message });
    });
  },
});

export const onMessageUpdated = createAction({
  group,
  icon: IconMessageCog,
  description: 'Triggered when a message is updated.',
  outputs: {
    exec: pin.exec(),
    oldMessage: discordPins.message.custom<Message | PartialMessage>().extend({
      description: 'Returns the message before it was updated.',
    }),
    newMessage: discordPins.message.custom<Message | PartialMessage>().extend({
      description: 'Returns the message after it was updated.',
    }),
  },
  run({ state, next }) {
    state.client.on('messageUpdate', (oldMessage, newMessage) => {
      next('exec', { oldMessage, newMessage });
    });
  },
});

export const onMessageDeleted = createAction({
  group,
  icon: IconMessageX,
  description: 'Triggered when a message is deleted.',
  outputs: {
    exec: pin.exec(),
    message: discordPins.message.custom<Message | PartialMessage>().extend({
      description: 'Returns the message that was deleted.',
    }),
  },
  run({ state, next }) {
    state.client.on('messageDelete', (message) => {
      next('exec', { message });
    });
  },
});

export const sendMessage = createAction({
  group,
  icon: IconMessageUp,
  description: 'Send a message to a channel.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        if (!(inputs.channel instanceof BaseGuildTextChannel)) {
          throw new Error(
            'Failed to send message: Channel is not a text channel.',
          );
        }

        next('exec', {
          message: await inputs.channel.send(inputs.content),
        });
      },
    }),
    channel: discordPins.channel.extend({
      description: 'The channel to send the message to.',
    }),
    content: pin.string({
      description: 'The content of the message.',
    }),
  },
  outputs: {
    exec: pin.exec(),
    message: discordPins.message.extend({
      description: 'Returns the message that was sent.',
    }),
  },
});

export const updateMessage = createAction({
  group,
  icon: IconMessageCog,
  description: 'Update a message.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        if (!(inputs.message instanceof Message)) {
          throw new Error('Failed to update message: Message is invalid.');
        }

        next('exec', {
          message: await inputs.message.edit(inputs.content),
        });
      },
    }),
    message: discordPins.message.extend({
      description: 'The message to update.',
    }),
  },
  outputs: {
    exec: pin.exec(),
    message: discordPins.message.extend({
      description: 'Returns the message that was updated.',
    }),
  },
});

export const deleteMessage = createAction({
  group,
  icon: IconMessageX,
  description: 'Delete a message.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        if (!(inputs.message instanceof Message)) {
          throw new Error('Failed to delete message: Message is invalid.');
        }

        next('exec', {
          message: await inputs.message.delete(),
        });
      },
    }),
    message: discordPins.message.extend({
      description: 'The message to delete.',
    }),
  },
  outputs: {
    exec: pin.exec(),
    message: discordPins.message.extend({
      description: 'Returns the message that was deleted.',
    }),
  },
});
