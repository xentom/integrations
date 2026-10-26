import * as i from '@xentom/integration-framework'

import { type NonThreadGuildBasedChannel } from 'discord.js'

import * as pins from '@/pins'

const nodes = i.nodes.group('Discord/Channels')

export const listChannels = nodes.pure({
  description: 'List all channels in a Discord server.',
  inputs: {
    guildId: pins.guild.id.with({
      description: 'The server to list channels from.',
    }),
  },
  outputs: {
    channels: pins.channel.items.with({
      description: 'The channels in the server.',
      control: false,
    }),
  },
  async run(opts) {
    const guild = await opts.state.client.guilds.fetch(opts.inputs.guildId)
    const fetched = await guild.channels.fetch()
    opts.outputs.channels = fetched
      .filter(
        (channel): channel is NonThreadGuildBasedChannel => channel !== null,
      )
      .toJSON()
  },
})

export const getChannel = nodes.pure({
  description: 'Get details of a Discord channel by ID.',
  inputs: {
    channelId: pins.channel.id.with({
      description: 'The channel to retrieve.',
    }),
  },
  outputs: {
    channel: pins.channel.item.with({
      description: 'The channel object.',
      control: false,
    }),
  },
  async run(opts) {
    const channel = await opts.state.client.channels.fetch(
      opts.inputs.channelId,
    )
    if (!channel) throw new Error('Channel not found.')

    opts.outputs.channel = channel as NonThreadGuildBasedChannel
  },
})
