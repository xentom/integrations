import * as teamspeakPin from '@/pins';
import { IconVolume } from '@tabler/icons-react';
import { TeamSpeakChannel } from 'ts3-nodejs-library';
import { createAction, pin } from '@xentom/integration';

const group = 'Channels';

export const onChannelCreated = createAction({
  group,
  icon: IconVolume,
  description: 'Triggers when a channel is created',
  outputs: {
    exec: pin.exec(),
    channel: teamspeakPin.channel.extend({
      description: 'Returns the channel that was created',
    }),
    invoker: teamspeakPin.client.extend({
      description: 'Returns the client that created the channel',
    }),
  },
  run({ state, next }) {
    state.ts.on('channelcreate', (event) => {
      next('exec', {
        channel: event.channel,
        invoker: event.invoker,
      });
    });
  },
});

export const onChannelUpdated = createAction({
  group,
  icon: IconVolume,
  description: 'Triggers when a channel is updated',
  outputs: {
    exec: pin.exec(),
    channel: teamspeakPin.channel.extend({
      description: 'Returns the channel that was updated',
    }),
    invoker: teamspeakPin.client.extend({
      description: 'Returns the client that updated the channel',
    }),
  },
  run({ state, next }) {
    state.ts.on('channeledit', (event) => {
      next('exec', {
        channel: event.channel,
        invoker: event.invoker,
      });
    });
  },
});

export const onChannelMoved = createAction({
  group,
  icon: IconVolume,
  description: 'Triggers when a channel is moved',
  outputs: {
    exec: pin.exec(),
    channel: teamspeakPin.channel.extend({
      description: 'Returns the channel that was moved',
    }),
    invoker: teamspeakPin.client.extend({
      description: 'Returns the client that moved the channel',
    }),
    parent: teamspeakPin.channel.extend({
      description: 'Returns the parent channel of the channel that was moved',
    }),
    order: pin.number({
      description: 'Returns the new order of the channel',
      isEditable: false,
    }),
  },
  run({ state, next }) {
    state.ts.on('channelmoved', (event) => {
      next('exec', {
        channel: event.channel,
        invoker: event.invoker,
        parent: event.parent,
        order: event.order,
      });
    });
  },
});

export const onChannelDeleted = createAction({
  group,
  icon: IconVolume,
  description: 'Triggers when a channel is deleted',
  outputs: {
    exec: pin.exec(),
    channelId: pin.string({
      label: 'Channel ID',
      description: 'Returns the ID of the channel that was deleted',
      isEditable: false,
    }),
    invoker: teamspeakPin.client.extend({
      description: 'Returns the client that deleted the channel',
      isOptional: true,
    }),
  },
  run({ state, next }) {
    state.ts.on('channeldelete', (event) => {
      next('exec', {
        channelId: event.cid,
        invoker: event.invoker,
      });
    });
  },
});

export const getChannels = createAction({
  group,
  icon: IconVolume,
  description: 'Returns a list of all channels',
  inputs: {
    exec: pin.exec({
      async run({ state, next }) {
        next('exec', {
          channels: await state.ts.channelList(),
        });
      },
    }),
  },
  outputs: {
    exec: pin.exec(),
    channels: teamspeakPin.channel.custom<TeamSpeakChannel[]>().extend({
      description: 'Returns a list of all channels',
    }),
  },
});

export const getChannelById = createAction({
  group,
  icon: IconVolume,
  description: 'Returns the channel with the specified ID',
  inputs: {
    channelId: pin.string({
      label: 'Channel ID',
      description: 'The ID of the channel to get',
    }),
  },
  outputs: {
    channel: teamspeakPin.channel.extend({
      description: 'Returns the channel with the specified ID',
      isOptional: true,
    }),
  },
  async run({ inputs, outputs, state }) {
    outputs.channel = await state.ts.getChannelById(inputs.channelId);
  },
});

export const getChannelByName = createAction({
  group,
  icon: IconVolume,
  description: 'Returns the channel with the specified name',
  inputs: {
    channelName: pin.string({
      description: 'The name of the channel to get',
    }),
  },
  outputs: {
    channel: teamspeakPin.channel.extend({
      description: 'Returns the channel with the specified name',
      isOptional: true,
    }),
  },
  async run({ inputs, outputs, state }) {
    outputs.channel = await state.ts.getChannelByName(inputs.channelName);
  },
});

export const createChannel = createAction({
  group,
  icon: IconVolume,
  description: 'Creates a new channel',
  inputs: {
    exec: pin.exec({
      async run({ inputs, state, next }) {
        const channel = await state.ts.channelCreate(inputs.name, {
          channelDescription: inputs.description,
          channelPassword: inputs.password,
          channelFlagPermanent: inputs.permanent,
          channelCodec: inputs.codec,
          cpid: inputs.parent?.cid,
        });

        next('exec', {
          channel,
        });
      },
    }),
    name: pin.string({
      description: 'The name of the channel',
    }),
    description: pin.string({
      description: 'The description of the channel',
      isOptional: true,
    }),
    password: pin.string({
      description: 'The password of the channel',
      isOptional: true,
      isSensitive: true,
    }),
    permanent: pin.boolean({
      description: 'Whether the channel is permanent',
      defaultValue: true,
      isOptional: true,
    }),
    codec: pin.enum({
      description: 'The codec of the channel',
      options: [
        { label: 'Opus Voice', value: 4 },
        { label: 'Opus Music', value: 5 },
      ],
      defaultValue: 4,
      isOptional: true,
    }),
    parent: teamspeakPin.channel.extend({
      description: 'The parent channel of the new channel',
      isOptional: true,
    }),
  },
  outputs: {
    exec: pin.exec(),
    channel: teamspeakPin.channel.extend({
      description: 'Returns the channel that was created',
    }),
  },
});

export const updateChannel = createAction({
  group,
  icon: IconVolume,
  description: 'Updates an existing channel',
  inputs: {
    exec: pin.exec({
      async run({ inputs, state, next }) {
        if (!(inputs.channel instanceof TeamSpeakChannel)) {
          throw new Error('Failed to update channel: Invalid channel');
        }

        await inputs.channel.edit({
          channelName: inputs.name,
          channelDescription: inputs.description,
          channelPassword: inputs.password,
          channelFlagPermanent: inputs.permanent,
          channelCodec: inputs.codec,
        });

        next('exec', {
          channel: await state.ts.getChannelById(inputs.channel.cid),
        });
      },
    }),
    channel: teamspeakPin.channel.extend({
      description: 'The channel to update',
    }),
    name: pin.string({
      description: 'The new name of the channel',
      isOptional: true,
    }),
    description: pin.string({
      description: 'The new description of the channel',
      isOptional: true,
    }),
    password: pin.string({
      description: 'The new password of the channel',
      isOptional: true,
      isSensitive: true,
    }),
    permanent: pin.boolean({
      description: 'Whether the channel is permanent',
      isOptional: true,
    }),
    codec: pin.enum({
      description: 'The new codec of the channel',
      options: [
        { label: 'Opus Voice', value: 4 },
        { label: 'Opus Music', value: 5 },
      ],
      isOptional: true,
    }),
  },
  outputs: {
    exec: pin.exec(),
    channel: teamspeakPin.channel.extend({
      description: 'Returns the channel that was updated',
    }),
  },
});

export const deleteChannel = createAction({
  group,
  icon: IconVolume,
  description: 'Deletes a channel',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        if (!(inputs.channel instanceof TeamSpeakChannel)) {
          throw new Error('Failed to delete channel: Invalid channel');
        }

        await inputs.channel.del(inputs.force);
        next('exec');
      },
    }),
    channel: teamspeakPin.channel.extend({
      description: 'The channel to delete',
    }),
    force: pin.boolean({
      description:
        'If the force parameter is true, the channel will be deleted regardless of the presence of clients.',
      defaultValue: false,
      isOptional: true,
    }),
  },
  outputs: {
    exec: pin.exec(),
  },
});
