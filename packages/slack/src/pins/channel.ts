import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import {
  type ChannelArchiveEvent,
  type ChannelCreatedEvent,
  type ChannelDeletedEvent,
  type ChannelHistoryChangedEvent,
  type ChannelIDChangedEvent,
  type ChannelLeftEvent,
  type ChannelRenameEvent,
  type ChannelSharedEvent,
  type ChannelUnarchiveEvent,
  type ChannelUnsharedEvent,
  type MessageEvent,
} from '@slack/web-api'
import { type Channel } from '@slack/web-api/dist/types/response/ConversationsListResponse'

export const item = i.pins.data<Channel>({
  displayName: 'Channel',
  description: 'Slack conversation metadata as returned by the Web API.',
})

export const items = i.pins.data<Channel[]>({
  displayName: 'Channels',
  description:
    'Collection of Slack conversations accessible to the integration.',
})

export const id = i.pins.data({
  displayName: 'Channel ID',
  description: 'Slack channel or conversation ID.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.select({
    placeholder: 'C1234567890',
    async options(opts) {
      const options: i.SelectControlOption<string>[] = []

      let cursor: string | undefined
      do {
        const response = await opts.state.client.conversations.list({
          limit: 200,
          cursor,
          exclude_archived: true,
          types: 'public_channel,private_channel',
        })

        if (!response.ok) {
          throw new Error(
            response.error ?? 'Slack conversations.list request failed',
          )
        }

        for (const channel of response.channels ?? []) {
          if (!channel.id) {
            continue
          }

          options.push({
            value: channel.id,
            suffix: `#${channel.name}`,
          })
        }

        cursor = response.response_metadata?.next_cursor || undefined
      } while (cursor)

      return options
    },
  }),
})

export const name = i.pins.data({
  displayName: 'Channel Name',
  description: 'Human-friendly channel name (without # prefix).',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({
    placeholder: 'general',
  }),
})

export type ChannelEvent =
  | ChannelArchiveEvent
  | ChannelCreatedEvent
  | ChannelDeletedEvent
  | ChannelHistoryChangedEvent
  | ChannelIDChangedEvent
  | ChannelLeftEvent
  | ChannelRenameEvent
  | ChannelSharedEvent
  | ChannelUnarchiveEvent
  | ChannelUnsharedEvent

export const eventType = i.pins.data<ChannelEvent['type']>({
  description: 'The type of channel event to trigger on.',
  control: i.controls.select({
    options: [
      {
        label: 'Archived',
        value: 'channel_archive',
        description: 'A channel was archived',
      },
      {
        label: 'Created',
        value: 'channel_created',
        description: 'A channel was created',
      },
      {
        label: 'Deleted',
        value: 'channel_deleted',
        description: 'A channel was deleted',
      },
      {
        label: 'History Changed',
        value: 'channel_history_changed',
        description: 'Bulk updates were made to a channel history',
      },
      {
        label: 'ID Changed',
        value: 'channel_id_changed',
        description: 'A channel ID changed',
      },
      {
        label: 'Left',
        value: 'channel_left',
        description: 'You left a channel',
      },
      {
        label: 'Renamed',
        value: 'channel_rename',
        description: 'A channel was renamed',
      },
      {
        label: 'Shared',
        value: 'channel_shared',
        description: 'A channel has been shared with an external workspace',
      },
      {
        label: 'Unarchived',
        value: 'channel_unarchive',
        description: 'A channel was unarchived',
      },
      {
        label: 'Unshared',
        value: 'channel_unshared',
        description: 'A channel has been unshared with an external workspace',
      },
    ],
  }),
})

export type ChannelTypes = MessageEvent['channel_type']

export const type = i.pins.data<ChannelTypes>({
  description: 'The type of channel the message was sent in.',
  control: i.controls.select({
    options: [
      {
        label: 'Channel',
        value: 'channel',
        description:
          'A public Slack channel that anyone in the workspace can join',
      },
      {
        label: 'Group',
        value: 'group',
        description:
          'A private Slack channel that only invited members can access',
      },
      {
        label: 'Im',
        value: 'im',
        description: 'A direct message between two users',
      },
      {
        label: 'Mpim',
        value: 'mpim',
        description: 'A group direct message between multiple users',
      },
      {
        label: 'App Home',
        value: 'app_home',
        description:
          'The private home tab of a Slack app for an individual user',
      },
    ],
  }),
})
