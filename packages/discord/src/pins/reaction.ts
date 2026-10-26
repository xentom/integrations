import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import {
  type MessageReaction,
  type PartialMessageReaction,
  type PartialUser,
  type User,
} from 'discord.js'

export const emoji = i.pins.data({
  displayName: 'Emoji',
  description:
    'Emoji to react with. Unicode emoji or custom emoji format (<:name:id>).',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({ placeholder: '👍' }),
})

export type Action = 'add' | 'remove'

export const action = i.pins.data<Action>({
  description: 'The type of reaction event to listen for.',
  control: i.controls.select({
    options: [
      {
        value: 'add',
        label: 'Added',
        description: 'Triggered when a reaction is added to a message.',
      },
      {
        value: 'remove',
        label: 'Removed',
        description: 'Triggered when a reaction is removed from a message.',
      },
    ],
    default: 'add',
  }),
})

export type ReactionEventData = {
  add: {
    reaction: MessageReaction | PartialMessageReaction
    user: User | PartialUser
  }
  remove: {
    reaction: MessageReaction | PartialMessageReaction
    user: User | PartialUser
  }
}
