import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import {
  type ChannelDeleteEvent,
  type ChannelEditEvent,
  type ChannelMoveEvent,
} from 'ts3-nodejs-library'
import { type ChannelCreate } from 'ts3-nodejs-library/lib/types/Events'

import * as pins from '@/pins'

const nodes = i.nodes.group('Channels')

export const onChannelCreated = nodes.trigger({
  outputs: {
    channel: pins.channel.item,
    invoker: pins.client.item,
  },
  subscribe(opts) {
    function onChannelCreated(event: ChannelCreate) {
      void opts.next(
        {
          channel: event.channel,
          invoker: event.invoker,
        },
        {
          deduplication: {
            id: event.channel.cid,
          },
        },
      )
    }

    opts.state.teamspeak.on('channelcreate', onChannelCreated)
    return () => {
      opts.state.teamspeak.off('channelcreate', onChannelCreated)
    }
  },
})

export const onChannelEdited = nodes.trigger({
  outputs: {
    channel: pins.channel.item,
    invoker: pins.client.item,
  },
  subscribe(opts) {
    function onChannelEdited(event: ChannelEditEvent) {
      void opts.next(
        { channel: event.channel, invoker: event.invoker },
        {
          deduplication: {
            id: event.channel.cid,
          },
        },
      )
    }

    opts.state.teamspeak.on('channeledit', onChannelEdited)
    return () => {
      opts.state.teamspeak.off('channeledit', onChannelEdited)
    }
  },
})

export const onChannelMoved = nodes.trigger({
  outputs: {
    channel: pins.channel.item,
    invoker: pins.client.item,
    order: i.pins.data({
      schema: v.number(),
    }),
    parent: pins.channel.item.with({
      control: false,
    }),
  },
  subscribe(opts) {
    function onChannelMoved(event: ChannelMoveEvent) {
      void opts.next(
        {
          channel: event.channel,
          invoker: event.invoker,
          order: event.order,
          parent: event.parent,
        },
        {
          deduplication: {
            id: event.channel.cid,
          },
        },
      )
    }

    opts.state.teamspeak.on('channelmoved', onChannelMoved)
    return () => {
      opts.state.teamspeak.off('channelmoved', onChannelMoved)
    }
  },
})

export const onChannelDeleted = nodes.trigger({
  outputs: {
    id: pins.channel.id.with({
      control: false,
    }),
    invoker: pins.client.item.with({
      optional: true,
      control: false,
    }),
  },
  subscribe(opts) {
    function onChannelDeleted({ cid, invoker }: ChannelDeleteEvent) {
      void opts.next(
        { id: cid, invoker },
        {
          deduplication: {
            id: cid,
          },
        },
      )
    }

    opts.state.teamspeak.on('channeldelete', onChannelDeleted)
    return () => {
      opts.state.teamspeak.off('channeldelete', onChannelDeleted)
    }
  },
})

export const getChannelById = nodes.pure({
  displayName: 'Get Channel By ID',
  description: 'Get a TeamSpeak channel by its id',
  inputs: {
    id: pins.channel.id,
  },
  outputs: {
    channel: pins.channel.item,
  },
  async run(opts) {
    const channel = await opts.state.teamspeak.getChannelById(opts.inputs.id)
    if (!channel) {
      throw new Error(`Channel with the ID "${opts.inputs.id}" not found`)
    }

    opts.outputs.channel = channel
  },
})

export const getChannelByName = nodes.pure({
  description: 'Get a TeamSpeak channel by its name',
  inputs: {
    name: pins.channel.nameSelection,
  },
  outputs: {
    channel: pins.channel.item,
  },
  async run(opts) {
    const channel = await opts.state.teamspeak.getChannelByName(
      opts.inputs.name,
    )

    if (!channel) {
      throw new Error(`Channel with the name "${opts.inputs.name}" not found`)
    }

    opts.outputs.channel = channel
  },
})

export const listChannels = nodes.pure({
  description: 'List all TeamSpeak channels',
  outputs: {
    channels: pins.channel.items,
  },
  async run(opts) {
    opts.outputs.channels = await opts.state.teamspeak.channelList()
  },
})

export const createChannel = nodes.action({
  description: 'Create a new TeamSpeak channel',
  inputs: {
    name: pins.channel.name,
    type: pins.channel.type.with({
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
    parentId: pins.channel.parentIdSelection.with({
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
    channel: pins.channel.item,
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
    })

    return opts.next({
      channel,
    })
  },
})

export const deleteChannel = nodes.action({
  description: 'Delete a TeamSpeak channel',
  inputs: {
    channel: pins.channel.item,
    force: i.pins.data({
      description: 'Whether to force the deletion of the channel',
      control: i.controls.boolean(),
      schema: v.boolean(),
      optional: true,
    }),
  },
  async run(opts) {
    await opts.inputs.channel.del(opts.inputs.force)
    return opts.next()
  },
})
