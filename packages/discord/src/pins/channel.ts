import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type NonThreadGuildBasedChannel } from 'discord.js'

export const item = i.pins.data<NonThreadGuildBasedChannel>({
  displayName: 'Channel',
  description: 'Discord channel object.',
})

export const items = i.pins.data<NonThreadGuildBasedChannel[]>({
  displayName: 'Channels',
  description: 'Collection of Discord channels.',
})

export const id = i.pins.data({
  displayName: 'Channel',
  description: 'Discord channel.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.select({
    placeholder: 'Select a channel',
    async options(opts) {
      const results = await Promise.all(
        opts.state.client.guilds.cache.map(async (guild) => {
          const channels = await guild.channels.fetch()
          return channels
            .filter(
              (channel): channel is NonThreadGuildBasedChannel =>
                channel !== null,
            )
            .map((channel) => ({
              value: channel.id,
              label: channel.name,
              suffix: guild.name,
            }))
        }),
      )
      return { items: results.flat() }
    },
  }),
})

export const name = i.pins.data({
  displayName: 'Channel Name',
  description: 'The name of the Discord channel.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({ placeholder: 'general' }),
})

export const topic = i.pins.data({
  displayName: 'Channel Topic',
  description: 'The topic of the Discord channel.',
  schema: v.pipe(v.string(), v.trim()),
  control: i.controls.text({ placeholder: 'Channel topic', rows: 2 }),
})
