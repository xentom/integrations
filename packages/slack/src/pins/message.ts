import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type AnyBlock, type MessageEvent } from '@slack/web-api'
import { type ChatPostMessageResponseMessage } from '@slack/web-api/dist/types/response/ChatPostMessageResponse'

export const item = i.pins.data<ChatPostMessageResponseMessage>({
  displayName: 'Message',
  description: 'Slack message payload returned by the Web API.',
})

export const text = i.pins.data({
  description: 'Content that will be delivered to Slack users.',
  schema: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Message text is required.'),
  ),
  control: i.controls.text({
    placeholder: 'Hello from Xentom!',
    rows: 3,
  }),
})

export const markdown = i.pins.data({
  description: 'Content that will be delivered to Slack users.',
  schema: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, 'Message markdown is required.'),
    v.maxLength(12000, 'Message markdown is too long.'),
  ),
  control: i.controls.text({
    language: i.TextControlLanguage.Markdown,
    placeholder: '# Markdown',
    rows: 3,
  }),
})

export const blocks = i.pins.data<AnyBlock[]>({
  description: 'The message blocks to deliver.',
  control: i.controls.expression({
    placeholder: JSON.stringify(
      [
        {
          type: 'markdown',
          text: '# Hello from Xentom!',
        },
      ],
      null,
      2,
    ),
    rows: 3,
  }),
})

export const ts = i.pins.data({
  displayName: 'Message Timestamp',
  description: 'Slack message identifier in epoch seconds with microseconds.',
  schema: v.pipe(
    v.string(),
    v.trim(),
    v.regex(
      /^[0-9]+\.[0-9]{6}$/,
      'Slack timestamps follow the format 1234567890.123456',
    ),
  ),
  control: i.controls.text({
    placeholder: '1700000000.000000',
  }),
})

export const threadTs = i.pins.data({
  displayName: 'Thread Timestamp',
  description: 'Parent message timestamp used when replying in a thread.',
  schema: v.pipe(
    v.string(),
    v.trim(),
    v.regex(
      /^[0-9]+\.[0-9]{6}$/,
      'Slack timestamps follow the format 1234567890.123456',
    ),
  ),
  control: i.controls.text({
    placeholder: '1700000000.000000',
  }),
})

export const eventSubtype = i.pins.data<MessageEvent['subtype']>({
  description: 'The subtype of message to trigger on.',
  control: i.controls.select({
    options: [
      {
        label: 'Bot Message',
        value: 'bot_message',
      },
      {
        label: 'Channel Archive',
        value: 'channel_archive',
      },
      {
        label: 'Channel Join',
        value: 'channel_join',
      },
      {
        label: 'Channel Leave',
        value: 'channel_leave',
      },
      {
        label: 'Channel Name',
        value: 'channel_name',
      },
      {
        label: 'Channel Posting Permissions',
        value: 'channel_posting_permissions',
      },
      {
        label: 'Channel Purpose',
        value: 'channel_purpose',
      },
      {
        label: 'Channel Topic',
        value: 'channel_topic',
      },
      {
        label: 'Channel Unarchive',
        value: 'channel_unarchive',
      },
      {
        label: 'EKMAccess Denied',
        value: 'ekm_access_denied',
      },
      {
        label: 'File Share',
        value: 'file_share',
      },
      {
        label: 'Me Message',
        value: 'me_message',
      },
      {
        label: 'Message Changed',
        value: 'message_changed',
      },
      {
        label: 'Message Deleted',
        value: 'message_deleted',
      },
      {
        label: 'Message Replied',
        value: 'message_replied',
      },
      {
        label: 'Thread Broadcast',
        value: 'thread_broadcast',
      },
    ],
  }),
})
