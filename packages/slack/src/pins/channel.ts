import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { type Channel } from '@slack/web-api/dist/types/response/ConversationsListResponse';

export const item = i.pins.data<Channel>({
  displayName: 'Channel',
  description: 'Slack conversation metadata as returned by the Web API.',
});

export const items = i.pins.data<Channel[]>({
  displayName: 'Channels',
  description:
    'Collection of Slack conversations accessible to the integration.',
});

export const id = i.pins.data({
  displayName: 'Channel ID',
  description: 'Slack channel or conversation ID.',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.select({
    placeholder: 'C1234567890',
    async options(opts) {
      const options: i.SelectControlOption<string>[] = [];

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

        for (const channel of response.channels ?? []) {
          if (!channel.id) {
            continue;
          }

          options.push({
            value: channel.id,
            suffix: `#${channel.name}`,
          });
        }

        cursor = response.response_metadata?.next_cursor || undefined;
      } while (cursor);

      return options;
    },
  }),
});

export const name = i.pins.data({
  displayName: 'Channel Name',
  description: 'Human-friendly channel name (without # prefix).',
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
  control: i.controls.text({
    placeholder: 'general',
  }),
});
