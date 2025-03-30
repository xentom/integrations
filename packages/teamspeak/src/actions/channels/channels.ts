import { actions, pins } from '@acme/integration';
import { channel, channelId, channelName } from '../../pins';
import * as v from 'valibot';
import type { ChannelEntry } from 'ts3-nodejs-library/lib/types/ResponseTypes';

export const getChannelById = actions.pure({
  displayName: 'Get Channel By ID',
  description: 'Get a TeamSpeak channel by its ID',
  inputs: {
    id: channelId,
  },
  outputs: {
    channel,
  },
  run: async ({ ctx, inputs, outputs }) => {
    const channel = await ctx.teamspeak.getChannelById(inputs.id.toString());
    if (!channel) {
      throw new Error(`Channel with the ID "${inputs.id}" not found`);
    }

    outputs.channel = channel.toJSON() as ChannelEntry;
  },
});

export const getChannelByName = actions.pure({
  displayName: 'Get Channel By Name',
  description: 'Get a TeamSpeak channel by its name',
  inputs: {
    name: channelName,
  },
  outputs: {
    channel,
  },
  run: async ({ ctx, inputs, outputs }) => {
    const channel = await ctx.teamspeak.getChannelByName(inputs.name);
    if (!channel) {
      throw new Error(`Channel with the name "${inputs.name}" not found`);
    }

    outputs.channel = channel.toJSON() as ChannelEntry;
  },
});

export const createChannel = actions.callable({
  inputs: {
    name: pins.data({
      schema: v.string(),
      description: 'The name of the channel',
    }),
    description: pins.data({
      schema: v.optional(v.string()),
      description: 'The description of the channel',
    }),
  },
  outputs: {
    channel,
  },
  run: async ({ ctx, inputs }) => {
    const channel = await ctx.teamspeak.channelCreate(inputs.name, {
      channelDescription: inputs.description,
    });

    return {
      channel: channel.toJSON() as ChannelEntry,
    };
  },
});
