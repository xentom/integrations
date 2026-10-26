import * as i from '@xentom/integration-framework'

import * as pins from '@/pins'

const nodes = i.nodes.group('Discord/Roles')

export const addRole = nodes.action({
  description: 'Add a role to a member in a Discord server.',
  inputs: {
    guildId: pins.guild.id.with({
      description: 'The server the member belongs to.',
    }),
    memberId: pins.member.id.with({
      description: 'The member to add the role to.',
    }),
    roleId: pins.role.id.with({
      description: 'The role to add.',
    }),
    reason: pins.member.reason.with({
      description: 'Reason for adding the role.',
      optional: true,
    }),
  },
  async run(opts) {
    const guild = await opts.state.client.guilds.fetch(opts.inputs.guildId)
    const member = await guild.members.fetch(opts.inputs.memberId)
    await member.roles.add(opts.inputs.roleId, opts.inputs.reason)
  },
})

export const removeRole = nodes.action({
  description: 'Remove a role from a member in a Discord server.',
  inputs: {
    guildId: pins.guild.id.with({
      description: 'The server the member belongs to.',
    }),
    memberId: pins.member.id.with({
      description: 'The member to remove the role from.',
    }),
    roleId: pins.role.id.with({
      description: 'The role to remove.',
    }),
    reason: pins.member.reason.with({
      description: 'Reason for removing the role.',
      optional: true,
    }),
  },
  async run(opts) {
    const guild = await opts.state.client.guilds.fetch(opts.inputs.guildId)
    const member = await guild.members.fetch(opts.inputs.memberId)
    await member.roles.remove(opts.inputs.roleId, opts.inputs.reason)
  },
})
