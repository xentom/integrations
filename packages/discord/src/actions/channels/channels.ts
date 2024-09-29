import * as discordPins from '@/pins';
import { IconHash, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  Guild,
  type Channel,
  type ChannelType,
  type DMChannel,
  type NonThreadGuildBasedChannel,
} from 'discord.js';
import { createAction, pin } from '@xentom/integration';

const group = 'Channels';

export const onChannelCreated = createAction({
  group,
  icon: IconHash,
  description: 'Triggered when a channel is created.',
  outputs: {
    exec: pin.exec(),
    channel: discordPins.channel.custom<NonThreadGuildBasedChannel>().extend({
      description: 'Returns the channel that was created.',
    }),
  },
  run({ state, next }) {
    state.client.on('channelCreate', (channel) => {
      next('exec', { channel });
    });
  },
});

export const onChannelUpdated = createAction({
  group,
  icon: IconHash,
  description: 'Triggered when a channel is updated.',
  outputs: {
    exec: pin.exec(),
    oldChannel: discordPins.channel
      .custom<DMChannel | NonThreadGuildBasedChannel>()
      .extend({
        description: 'Returns the channel before it was updated.',
      }),
    newChannel: discordPins.channel
      .custom<DMChannel | NonThreadGuildBasedChannel>()
      .extend({
        description: 'Returns the channel after it was updated.',
      }),
  },
  run({ state, next }) {
    state.client.on('channelUpdate', (oldChannel, newChannel) => {
      next('exec', { oldChannel, newChannel });
    });
  },
});

export const onChannelDeleted = createAction({
  group,
  icon: IconHash,
  description: 'Triggered when a channel is deleted.',
  outputs: {
    exec: pin.exec(),
    channel: discordPins.channel
      .custom<DMChannel | NonThreadGuildBasedChannel>()
      .extend({
        description: 'Returns the channel that was deleted.',
      }),
  },
  run({ state, next }) {
    state.client.on('channelDelete', (channel) => {
      next('exec', { channel });
    });
  },
});

export const getChannel = createAction({
  group,
  icon: IconHash,
  description: 'Get a channel by ID.',
  inputs: {
    guild: discordPins.guild.extend({
      description: 'The guild to get the channel from.',
    }),
    id: pin.number({
      label: 'ID',
      description: 'The ID of the channel to get.',
    }),
  },
  outputs: {
    channel: discordPins.channel.extend({
      description: 'Returns the channel with the specified ID.',
      isOptional: true,
    }),
  },
  async run({ inputs, outputs }) {
    if (!(inputs.guild instanceof Guild)) {
      throw new Error('Failed to get channel: Guild is invalid.');
    }

    outputs.channel = await inputs.guild.channels.fetch(inputs.id);
  },
});

export const createChannel = createAction({
  group,
  icon: IconPlus,
  description: 'Create a new channel.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        if (!(inputs.guild instanceof Guild)) {
          throw new Error('Failed to create channel: Guild is invalid.');
        }

        next('exec', {
          channel: await inputs.guild.channels.create<
            | ChannelType.GuildText
            | ChannelType.GuildVoice
            | ChannelType.GuildCategory
          >({
            name: inputs.name,
            type: inputs.type,
            position: inputs.position,
          }),
        });
      },
    }),
    guild: discordPins.guild.extend({
      description: 'The guild to create the channel in.',
    }),
    name: pin.string({
      description: 'The name of the channel.',
    }),
    type: pin.enum({
      description: 'The type of channel to create.',
      options: [
        { label: 'Text', value: 0 },
        { label: 'Voice', value: 2 },
        { label: 'Category', value: 4 },
      ],
      defaultValue: 0,
    }),
    position: pin.number({
      description:
        'The position of the channel within the list of channels. A higher number indicates that the channel will appear lower in the list.',
      isOptional: true,
    }),
  },
  outputs: {
    exec: pin.exec(),
    channel: discordPins.channel.custom<NonThreadGuildBasedChannel>().extend({
      description: 'Returns the channel that was created.',
    }),
  },
});

export const updateChannel = createAction({
  group,
  icon: IconPencil,
  description: 'Update a channel.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        next('exec', {
          channel: await (inputs.channel as NonThreadGuildBasedChannel).edit({
            name: inputs.name,
            position: inputs.position,
          }),
        });
      },
    }),
    channel: discordPins.channel.extend({
      description: 'The channel to update.',
    }),
    name: pin.string({
      description: 'The new name of the channel.',
      isOptional: true,
    }),
    position: pin.number({
      description:
        'The new position of the channel in the list of channels. A higher number indicates that the channel will appear lower in the list.',
      isOptional: true,
    }),
  },
  outputs: {
    exec: pin.exec(),
    channel: discordPins.channel.custom<NonThreadGuildBasedChannel>().extend({
      description: 'Returns the channel that was updated.',
    }),
  },
});

export const deleteChannel = createAction({
  group,
  icon: IconTrash,
  description: 'Delete a channel.',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        next('exec', {
          channel: await (inputs.channel as Channel).delete(),
        });
      },
    }),
    channel: discordPins.channel.extend({
      description: 'The channel to delete.',
    }),
  },
  outputs: {
    exec: pin.exec(),
    channel: discordPins.channel.extend({
      description: 'Returns the channel that was deleted.',
    }),
  },
});
