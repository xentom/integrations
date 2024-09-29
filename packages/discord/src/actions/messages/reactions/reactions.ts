import * as discordPins from '@/pins';
import { IconThumbUp, IconThumbUpOff } from '@tabler/icons-react';
import {
  type Message,
  type MessageReaction,
  type PartialMessage,
  type PartialMessageReaction,
  type PartialUser,
  type ReadonlyCollection,
  type User,
} from 'discord.js';
import { createAction, pin } from '@xentom/integration';

const group = 'Messages/Reactions';

type MessageReactionPayload = MessageReaction | PartialMessageReaction;

export const onReactionAdded = createAction({
  group,
  icon: IconThumbUp,
  description: 'Triggered when a reaction is added.',
  outputs: {
    exec: pin.exec(),
    reaction: discordPins.messageReaction
      .custom<MessageReactionPayload>()
      .extend({
        description: 'Returns the reaction that was added.',
      }),
    user: discordPins.user.custom<User | PartialUser>().extend({
      description: 'Returns the user that added the reaction.',
    }),
  },
  run({ state, next }) {
    state.client.on('messageReactionAdd', (reaction, user) => {
      next('exec', { reaction, user });
    });
  },
});

export const onReactionRemoved = createAction({
  group,
  icon: IconThumbUpOff,
  description: 'Triggered when a reaction is removed.',
  outputs: {
    exec: pin.exec(),
    reaction: discordPins.messageReaction
      .custom<MessageReactionPayload>()
      .extend({
        description: 'Returns the reaction that was removed.',
      }),
    user: discordPins.user.custom<User | PartialUser>().extend({
      description: 'Returns the user that removed the reaction.',
    }),
  },
  run({ state, next }) {
    state.client.on('messageReactionRemove', (reaction, user) => {
      next('exec', { reaction, user });
    });
  },
});

export const onReactionRemovedAll = createAction({
  group,
  icon: IconThumbUpOff,
  description: 'Triggered when all reactions are removed from a message.',
  outputs: {
    exec: pin.exec(),
    message: discordPins.message.custom<Message | PartialMessage>().extend({
      description: 'Returns the message that all reactions were removed from.',
    }),
    reactions: discordPins.messageReaction
      .custom<ReadonlyCollection<string, MessageReaction>>()
      .extend({
        description: 'Returns the reactions that were removed.',
      }),
  },
  run({ state, next }) {
    state.client.on('messageReactionRemoveAll', (message, reactions) => {
      next('exec', { message, reactions });
    });
  },
});

export const onReactionRemovedEmoji = createAction({
  group,
  icon: IconThumbUpOff,
  description: 'Triggered when an emoji is removed from a message.',
  outputs: {
    exec: pin.exec(),
    reaction: discordPins.messageReaction
      .custom<MessageReactionPayload>()
      .extend({
        description: 'Returns the reaction that the emoji was removed from.',
      }),
  },
  run({ state, next }) {
    state.client.on('messageReactionRemoveEmoji', (reaction) => {
      next('exec', { reaction });
    });
  },
});
