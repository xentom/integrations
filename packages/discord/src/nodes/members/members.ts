import * as i from '@xentom/integration-framework'

import { Events, type GuildMember, type PartialGuildMember } from 'discord.js'

import * as pins from '@/pins'
import { type Action, type MemberEventData } from '@/pins/member'

const nodes = i.nodes.group('Discord/Members')

const memberEventNames: Record<Action, string> = {
  add: Events.GuildMemberAdd,
  remove: Events.GuildMemberRemove,
}

export const onMemberEvent = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      action: pins.member.action,
    }

    return nodes.trigger({
      description: 'Triggered when a member joins or leaves a server.',
      inputs,
      outputs: {
        member: i.pins.data<MemberEventData[I['action']]>(),
      },
      subscribe(opts) {
        function handler(member: GuildMember | PartialGuildMember) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            member,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any)
        }

        const event = memberEventNames[opts.inputs.action]
        opts.state.client.on(event, handler)
        return () => {
          opts.state.client.off(event, handler)
        }
      },
    })
  },
)

export const kickMember = nodes.action({
  description: 'Kick a member from a Discord server.',
  inputs: {
    guildId: pins.guild.id.with({
      description: 'The server to kick the member from.',
    }),
    memberId: pins.member.id.with({
      description: 'The member to kick.',
    }),
    reason: pins.member.reason.with({
      description: 'Reason for the kick.',
      optional: true,
    }),
  },
  async run(opts) {
    const guild = await opts.state.client.guilds.fetch(opts.inputs.guildId)
    const member = await guild.members.fetch(opts.inputs.memberId)
    await member.kick(opts.inputs.reason)
  },
})

export const banMember = nodes.action({
  description: 'Ban a member from a Discord server.',
  inputs: {
    guildId: pins.guild.id.with({
      description: 'The server to ban the member from.',
    }),
    memberId: pins.member.id.with({
      description: 'The member to ban.',
    }),
    reason: pins.member.reason.with({
      description: 'Reason for the ban.',
      optional: true,
    }),
  },
  async run(opts) {
    const guild = await opts.state.client.guilds.fetch(opts.inputs.guildId)
    await guild.members.ban(opts.inputs.memberId, {
      reason: opts.inputs.reason,
    })
  },
})

export const timeoutMember = nodes.action({
  description:
    'Timeout a member in a Discord server, preventing them from sending messages.',
  inputs: {
    guildId: pins.guild.id.with({
      description: 'The server the member belongs to.',
    }),
    memberId: pins.member.id.with({
      description: 'The member to timeout.',
    }),
    duration: pins.member.duration.with({
      description: 'Timeout duration in minutes.',
    }),
    reason: pins.member.reason.with({
      description: 'Reason for the timeout.',
      optional: true,
    }),
  },
  async run(opts) {
    const guild = await opts.state.client.guilds.fetch(opts.inputs.guildId)
    const member = await guild.members.fetch(opts.inputs.memberId)
    await member.timeout(opts.inputs.duration * 60 * 1000, opts.inputs.reason)
  },
})
