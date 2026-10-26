import * as i from '@xentom/integration-framework'

import { Events, type Message, type PartialMessage } from 'discord.js'

import * as pins from '@/pins'
import { type Action, type MessageEventData } from '@/pins/message'

const nodes = i.nodes.group('Discord/Messages')

const messageEventNames: Record<Action, string> = {
  create: Events.MessageCreate,
  update: Events.MessageUpdate,
  delete: Events.MessageDelete,
}

export const onMessageEvent = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      action: pins.message.action,
      channelId: pins.channel.id.with({ optional: true }),
    }

    return nodes.trigger({
      description: 'Triggered when a message is created, updated, or deleted.',
      inputs,
      outputs: {
        message: i.pins.data<MessageEventData[I['action']]>(),
      },
      subscribe(opts) {
        function handler(...args: unknown[]) {
          const message = (args.length > 1 ? args[1] : args[0]) as
            | Message
            | PartialMessage
          if (
            opts.inputs.channelId &&
            message.channelId !== opts.inputs.channelId
          ) {
            return
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            message,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any)
        }

        const event = messageEventNames[opts.inputs.action]
        opts.state.client.on(event, handler)
        return () => {
          opts.state.client.off(event, handler)
        }
      },
    })
  },
)

export const sendMessage = nodes.action({
  description: 'Send a message to a Discord channel.',
  inputs: {
    channelId: pins.channel.id.with({
      description: 'The channel to send the message to.',
    }),
    content: pins.message.content.with({
      description: 'The text content of the message.',
      optional: true,
    }),
    embeds: pins.message.embeds.with({
      description: 'Message embeds to include.',
      optional: true,
    }),
  },
  outputs: {
    message: pins.message.item.with({
      description: 'The sent message.',
      control: false,
    }),
  },
  async run(opts) {
    const channel = await opts.state.client.channels.fetch(
      opts.inputs.channelId,
    )
    if (!channel) throw new Error('Channel not found.')
    if (!channel.isSendable())
      throw new Error('Cannot send messages to this channel.')

    const message = await channel.send({
      content: opts.inputs.content,
      embeds: opts.inputs.embeds,
    })

    return opts.next({ message })
  },
})

export const editMessage = nodes.action({
  description: 'Edit an existing message in a Discord channel.',
  inputs: {
    channelId: pins.channel.id.with({
      description: 'The channel containing the message.',
    }),
    messageId: pins.message.id.with({
      description: 'The ID of the message to edit.',
    }),
    content: pins.message.content.with({
      description: 'The new text content.',
      optional: true,
    }),
    embeds: pins.message.embeds.with({
      description: 'The new embeds.',
      optional: true,
    }),
  },
  outputs: {
    message: pins.message.item.with({
      description: 'The edited message.',
      control: false,
    }),
  },
  async run(opts) {
    const channel = await opts.state.client.channels.fetch(
      opts.inputs.channelId,
    )
    if (!channel?.isTextBased()) throw new Error('Text channel not found.')

    const message = await channel.messages.fetch(opts.inputs.messageId)
    const edited = await message.edit({
      content: opts.inputs.content,
      embeds: opts.inputs.embeds,
    })

    return opts.next({ message: edited })
  },
})

export const deleteMessage = nodes.action({
  description: 'Delete a message from a Discord channel.',
  inputs: {
    channelId: pins.channel.id.with({
      description: 'The channel containing the message.',
    }),
    messageId: pins.message.id.with({
      description: 'The ID of the message to delete.',
    }),
  },
  async run(opts) {
    const channel = await opts.state.client.channels.fetch(
      opts.inputs.channelId,
    )
    if (!channel?.isTextBased()) throw new Error('Text channel not found.')

    const message = await channel.messages.fetch(opts.inputs.messageId)
    await message.delete()
  },
})

export const bulkDeleteMessages = nodes.action({
  description:
    'Bulk delete recent messages from a Discord channel. Messages must be less than 14 days old.',
  inputs: {
    channelId: pins.channel.id.with({
      description: 'The channel to delete messages from.',
    }),
    count: pins.message.count.with({
      description: 'Number of recent messages to delete (1-100).',
    }),
  },
  async run(opts) {
    const channel = await opts.state.client.channels.fetch(
      opts.inputs.channelId,
    )
    if (!channel?.isTextBased()) throw new Error('Text channel not found.')
    if (!('bulkDelete' in channel))
      throw new Error('Bulk delete is not supported in this channel.')

    await channel.bulkDelete(opts.inputs.count)
  },
})
