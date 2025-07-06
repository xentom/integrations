import { channel, channelId, channelName } from '@/pins';
import { type ChannelEntry } from 'ts3-nodejs-library/lib/types/ResponseTypes';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

export const getChannelById = i.nodes.pure({
  displayName: 'Get Channel By ID',
  description: 'Get a TeamSpeak channel by its ID',
  inputs: {
    id: channelId,
  },
  outputs: {
    channel,
  },
  async run(opts) {
    const channel = await opts.state.teamspeak.getChannelById(
      opts.inputs.id.toString(),
    );

    if (!channel) {
      throw new Error(`Channel with the ID "${opts.inputs.id}" not found`);
    }

    opts.outputs.channel = channel.toJSON() as ChannelEntry;
  },
});

export const getChannelByName = i.nodes.pure({
  displayName: 'Get Channel By Name',
  description: 'Get a TeamSpeak channel by its name',
  inputs: {
    name: channelName,
  },
  outputs: {
    channel,
  },
  async run(opts) {
    const channel = await opts.state.teamspeak.getChannelByName(
      opts.inputs.name,
    );

    if (!channel) {
      throw new Error(`Channel with the name "${opts.inputs.name}" not found`);
    }

    opts.outputs.channel = channel.toJSON() as ChannelEntry;
  },
});

export const createChannel = i.nodes.callable({
  inputs: {
    name: i.pins.data({
      schema: v.string(),
      description: 'The name of the channel',
    }),
    description: i.pins.data({
      schema: v.optional(v.string()),
      description: 'The description of the channel',
    }),
  },
  outputs: {
    channel,
  },
  async run(opts) {
    const channel = await opts.state.teamspeak.channelCreate(opts.inputs.name, {
      channelDescription: opts.inputs.description,
    });

    return opts.next({
      channel: channel.toJSON() as ChannelEntry,
    });
  },
});
