import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Guild } from 'discord.js'

export const item = i.pins.data<Guild>({
  displayName: 'Server',
  description: 'Discord server (guild) object.',
})

export const id = i.pins.data({
  displayName: 'Server',
  description: 'Discord server (guild).',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.select({
    placeholder: 'Select a server',
    async options(opts) {
      return {
        items: opts.state.client.guilds.cache.map((guild) => ({
          value: guild.id,
          label: guild.name,
        })),
      }
    },
  }),
})

export const name = i.pins.data({
  displayName: 'Server Name',
  description: 'The name of the Discord server.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({ placeholder: 'My Server' }),
})
