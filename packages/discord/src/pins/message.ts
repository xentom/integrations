import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type APIEmbed, type Message, type PartialMessage } from 'discord.js'

export const item = i.pins.data<Message>({
  displayName: 'Message',
  description: 'Discord message object.',
})

export const id = i.pins.data({
  displayName: 'Message ID',
  description: 'Discord message snowflake ID.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({ placeholder: '123456789012345678' }),
})

export const content = i.pins.data({
  description: 'The text content of the message.',
  schema: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Message content is required.'),
  ),
  control: i.controls.text({ placeholder: 'Hello from Xentom!', rows: 3 }),
})

export const embeds = i.pins.data<APIEmbed[]>({
  description: 'Message embeds as a JSON array.',
  control: i.controls.expression({
    placeholder: '[{ "title": "Hello", "description": "World" }]',
    rows: 3,
  }),
})

export const count = i.pins.data({
  displayName: 'Message Count',
  description: 'Number of messages (1-100).',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
  control: i.controls.number({ placeholder: '10', min: 1, max: 100, step: 1 }),
})

export type Action = 'create' | 'update' | 'delete'

export const action = i.pins.data<Action>({
  description: 'The type of message event to listen for.',
  control: i.controls.select({
    options: [
      {
        value: 'create',
        label: 'Created',
        description: 'Triggered when a new message is sent.',
      },
      {
        value: 'update',
        label: 'Updated',
        description: 'Triggered when a message is edited.',
      },
      {
        value: 'delete',
        label: 'Deleted',
        description: 'Triggered when a message is deleted.',
      },
    ],
    default: 'create',
  }),
})

export type MessageEventData = {
  create: Message
  update: Message
  delete: Message | PartialMessage
}
