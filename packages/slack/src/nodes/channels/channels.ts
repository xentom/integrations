import * as i from '@xentom/integration-framework';

import { type Channel } from '@slack/web-api/dist/types/response/ConversationsListResponse';

import * as pins from '@/pins';

const nodes = i.nodes.group('Slack/Channels');

export const listChannels = nodes.callable({
  description: 'List Slack channels the connected bot can access.',
  outputs: {
    channels: pins.channel.items.with({
      description: 'Channels returned by the Slack Web API.',
      control: false,
    }),
  },
  async run(opts) {
    const channels: Channel[] = [];
    let cursor: string | undefined;

    do {
      const response = await opts.state.slack.conversations.list({
        limit: 200,
        cursor,
        exclude_archived: true,
        types: 'public_channel,private_channel',
      });

      if (!response.ok) {
        throw new Error(
          response.error ?? 'Slack conversations.list request failed',
        );
      }

      channels.push(...(response.channels ?? []));

      cursor = response.response_metadata?.next_cursor || undefined;
    } while (cursor);

    return opts.next({
      channels,
    });
  },
});
