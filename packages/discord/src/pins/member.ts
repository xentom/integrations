import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type GuildMember, type PartialGuildMember } from 'discord.js'

export const item = i.pins.data<GuildMember>({
  displayName: 'Member',
  description: 'Discord guild member object.',
})

export const id = i.pins.data({
  displayName: 'Member',
  description: 'Discord user or member ID.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({ placeholder: '123456789012345678' }),
})

export const reason = i.pins.data({
  displayName: 'Reason',
  description: 'Reason for the moderation action.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({ placeholder: 'Reason for action', rows: 2 }),
})

export const duration = i.pins.data({
  displayName: 'Duration',
  description: 'Timeout duration in minutes.',
  schema: v.pipe(v.number(), v.minValue(1)),
  control: i.controls.number({ placeholder: '5', min: 1 }),
})

export type Action = 'add' | 'remove'

export const action = i.pins.data<Action>({
  description: 'The type of member event to listen for.',
  control: i.controls.select({
    options: [
      {
        value: 'add',
        label: 'Joined',
        description: 'Triggered when a member joins the server.',
      },
      {
        value: 'remove',
        label: 'Left',
        description: 'Triggered when a member leaves the server.',
      },
    ],
    default: 'add',
  }),
})

export type MemberEventData = {
  add: GuildMember
  remove: GuildMember | PartialGuildMember
}
