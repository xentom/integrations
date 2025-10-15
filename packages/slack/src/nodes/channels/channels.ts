import * as i from '@xentom/integration-framework';

import { type Channel } from '@slack/web-api/dist/types/response/ConversationsListResponse';

import * as pins from '@/pins';
import { type ChannelEvent } from '@/pins/channel';
import { type EventPayload } from '@/utils/event';

const nodes = i.nodes.group('Slack/Channels');

export const onChannelEvent = i.generic(<
  I extends i.GenericInputs<typeof inputs>,
>() => {
  const inputs = {
    type: pins.channel.eventType,
  };

  return nodes.trigger({
    description: 'Triggered when a channel event is received.',
    inputs,
    outputs: {
      event: i.pins.data<Extract<ChannelEvent, { type: I['type'] }>>(),
    },
    subscribe(opts) {
      async function onEvent(payload: EventPayload<ChannelEvent>) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await opts.next({
          event: payload.event,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      }

      opts.state.socket.on(opts.inputs.type, onEvent);
      return () => {
        opts.state.socket.off(opts.inputs.type, onEvent);
      };
    },
  });
});

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
      const response = await opts.state.client.conversations.list({
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
