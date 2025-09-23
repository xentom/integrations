import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import * as pins from '@/pins';

const category = {
  path: ['Channels'],
} satisfies i.NodeCategory;

export const getChannelById = i.nodes.pure({
  category,
  displayName: 'Get Channel By ID',
  description: 'Get a TeamSpeak channel by its id',

  inputs: {
    id: pins.channel.idSelection,
  },

  outputs: {
    channel: pins.channel.itemOutput,
  },

  async run(opts) {
    const channel = await opts.state.teamspeak.getChannelById(
      opts.inputs.id.toString(),
    );

    if (!channel) {
      throw new Error(`Channel with the ID "${opts.inputs.id}" not found`);
    }

    opts.outputs.channel = channel;
  },
});

export const getChannelByName = i.nodes.pure({
  category,
  description: 'Get a TeamSpeak channel by its name',

  inputs: {
    name: pins.channel.nameSelection,
  },

  outputs: {
    channel: pins.channel.itemOutput,
  },

  async run(opts) {
    const channel = await opts.state.teamspeak.getChannelByName(
      opts.inputs.name,
    );

    if (!channel) {
      throw new Error(`Channel with the name "${opts.inputs.name}" not found`);
    }

    opts.outputs.channel = channel;
  },
});

export const createChannel = i.nodes.callable({
  category,
  description: 'Create a new TeamSpeak channel',

  inputs: {
    name: pins.channel.name,
    parentId: pins.channel.parentIdSelection.with({
      optional: true,
    }),
    topic: pins.channel.topic.with({
      optional: true,
    }),
    password: pins.channel.password.with({
      optional: true,
    }),
    description: pins.channel.description.with({
      optional: true,
    }),
    type: pins.channel.type.with({
      optional: true,
    }),
    codec: pins.channel.codec.with({
      optional: true,
    }),
    codecQuality: pins.channel.codecQuality.with({
      optional: true,
    }),
    maxClients: pins.channel.maxClients.with({
      optional: true,
    }),
    maxFamilyClients: pins.channel.maxFamilyClients.with({
      optional: true,
    }),
    order: pins.channel.order.with({
      optional: true,
    }),
    neededTalkPower: pins.channel.neededTalkPower.with({
      optional: true,
    }),
    namePhonetic: pins.channel.namePhonetic.with({
      optional: true,
    }),
    flagDefault: pins.channel.flagDefault.with({
      optional: true,
    }),
    flagMaxClientsUnlimited: pins.channel.flagMaxClientsUnlimited.with({
      optional: true,
    }),
    flagMaxFamilyClientsInherited:
      pins.channel.flagMaxFamilyClientsInherited.with({
        optional: true,
      }),
    codecIsUnencrypted: pins.channel.codecIsUnencrypted.with({
      optional: true,
    }),
  },

  outputs: {
    channel: pins.channel.itemOutput,
  },

  async run(opts) {
    const channel = await opts.state.teamspeak.channelCreate(opts.inputs.name, {
      cpid: opts.inputs.parentId,
      channelTopic: opts.inputs.topic,
      channelPassword: opts.inputs.password,
      channelDescription: opts.inputs.description,
      channelCodec: opts.inputs.codec,
      channelCodecQuality: opts.inputs.codecQuality,
      channelMaxclients: opts.inputs.maxClients,
      channelMaxfamilyclients: opts.inputs.maxFamilyClients,
      channelOrder: opts.inputs.order,
      channelNeededTalkPower: opts.inputs.neededTalkPower,
      channelNamePhonetic: opts.inputs.namePhonetic,
      channelFlagTemporary:
        opts.inputs.type === pins.channel.ChannelType.TEMPORARY,
      channelFlagSemiPermanent:
        opts.inputs.type === pins.channel.ChannelType.SEMI_PERMANENT,
      channelFlagPermanent:
        opts.inputs.type === pins.channel.ChannelType.PERMANENT,
      channelFlagDefault: opts.inputs.flagDefault,
      channelFlagMaxclientsUnlimited: opts.inputs.flagMaxClientsUnlimited,
      channelFlagMaxfamilyclientsInherited:
        opts.inputs.flagMaxFamilyClientsInherited,
      channelCodecIsUnencrypted: opts.inputs.codecIsUnencrypted,
    });

    return opts.next({
      channel,
    });
  },
});

export const deleteChannel = i.nodes.callable({
  category,
  description: 'Delete a TeamSpeak channel',

  inputs: {
    channel: pins.channel.itemInput,
    force: i.pins.data({
      description: 'Whether to force the deletion of the channel',
      control: i.controls.switch(),
      schema: v.boolean(),
      optional: true,
    }),
  },

  async run(opts) {
    await opts.inputs.channel.del(opts.inputs.force);
  },
});
