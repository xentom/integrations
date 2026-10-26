import * as i from '@xentom/integration-framework'

import {
  Events,
  type MessageReaction,
  type PartialMessageReaction,
  type PartialUser,
  type User,
} from 'discord.js'

import * as pins from '@/pins'
import { type Action, type ReactionEventData } from '@/pins/reaction'

const nodes = i.nodes.group('Discord/Reactions')

const reactionEventNames: Record<Action, string> = {
  add: Events.MessageReactionAdd,
  remove: Events.MessageReactionRemove,
}

export const onReactionEvent = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      action: pins.reaction.action,
    }

    return nodes.trigger({
      description:
        'Triggered when a reaction is added to or removed from a message.',
      inputs,
      outputs: {
        reaction: i.pins.data<ReactionEventData[I['action']]['reaction']>(),
        user: i.pins.data<ReactionEventData[I['action']]['user']>(),
      },
      subscribe(opts) {
        function handler(
          reaction: MessageReaction | PartialMessageReaction,
          user: User | PartialUser,
        ) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            reaction,
            user,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any)
        }

        const event = reactionEventNames[opts.inputs.action]
        opts.state.client.on(event, handler)
        return () => {
          opts.state.client.off(event, handler)
        }
      },
    })
  },
)

export const addReaction = nodes.action({
  description: 'Add a reaction emoji to a message.',
  inputs: {
    channelId: pins.channel.id.with({
      description: 'The channel containing the message.',
    }),
    messageId: pins.message.id.with({
      description: 'The ID of the message to react to.',
    }),
    emoji: pins.reaction.emoji.with({
      description: 'The emoji to react with.',
    }),
  },
  async run(opts) {
    const channel = await opts.state.client.channels.fetch(
      opts.inputs.channelId,
    )
    if (!channel?.isTextBased()) throw new Error('Text channel not found.')

    const message = await channel.messages.fetch(opts.inputs.messageId)
    await message.react(opts.inputs.emoji)
  },
})
