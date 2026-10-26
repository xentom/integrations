import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type Role } from 'discord.js'

export const item = i.pins.data<Role>({
  displayName: 'Role',
  description: 'Discord role object.',
})

export const id = i.pins.data({
  displayName: 'Role',
  description: 'Discord role.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.select({
    placeholder: 'Select a role',
    async options(opts) {
      const guildId = opts.node.inputs.guildId as string | undefined
      if (!guildId) {
        return {
          items: [],
        }
      }

      const guild = await opts.state.client.guilds.fetch(guildId)
      const roles = await guild.roles.fetch()

      return {
        items: roles.map((role) => ({
          value: role.id,
          label: role.name,
        })),
      }
    },
  }),
})

export const name = i.pins.data({
  displayName: 'Role Name',
  description: 'The name of the Discord role.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({ placeholder: 'Moderator' }),
})
