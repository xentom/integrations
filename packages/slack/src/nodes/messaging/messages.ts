import * as i from '@xentom/integration-framework';

import { type AnyBlock, type MessageEvent } from '@slack/web-api';

import * as pins from '@/pins';
import { type EventPayload } from '@/utils/event';

const nodes = i.nodes.group('Slack/Messages');

export const onMessageEvent = i.generic(<
  I extends i.GenericInputs<typeof inputs>,
>() => {
  const inputs = {
    subtype: pins.message.eventSubtype.with({
      optional: true,
    }),
    channelType: pins.channel.type.with({
      optional: true,
    }),
  };

  return nodes.trigger({
    description: 'Triggered when a message is sent.',
    inputs,
    outputs: {
      event: i.pins.data<Extract<MessageEvent, { subtype: I['subtype'] }>>(),
    },
    subscribe(opts) {
      async function onEvent(payload: EventPayload<MessageEvent>) {
        if (payload.event.subtype !== opts.inputs.subtype) {
          return;
        }

        if (
          opts.inputs.channelType &&
          payload.event.channel_type !== opts.inputs.channelType
        ) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await opts.next({
          event: payload.event,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      }

      opts.state.socket.on('message', onEvent);
      return () => {
        opts.state.socket.off('message', onEvent);
      };
    },
  });
});

export const sendMessage = nodes.callable({
  description:
    'Send a message to a Slack channel or direct message conversation.',
  inputs: {
    channelId: pins.channel.id.with({
      description: 'Destination channel or conversation ID.',
    }),
    text: pins.message.text.with({
      description: 'The message text to deliver.',
      optional: true,
    }),
    markdown: pins.message.markdown.with({
      description: 'The message markdown to deliver.',
      optional: true,
    }),
    blocks: pins.message.blocks.with({
      description: 'The message blocks to deliver.',
      optional: true,
    }),
    threadTs: pins.message.threadTs.with({
      description: 'Parent message timestamp when replying in a thread.',
      optional: true,
    }),
  },
  outputs: {
    message: pins.message.item.with({
      description: 'Message payload returned by the Slack API.',
      control: false,
      optional: true,
    }),
  },
  async run(opts) {
    const blocks: AnyBlock[] = opts.inputs.blocks ?? [];

    if (opts.inputs.markdown) {
      blocks.push({
        type: 'markdown',
        text: opts.inputs.markdown,
      });
    }

    const response = await opts.state.client.chat.postMessage({
      channel: opts.inputs.channelId,
      thread_ts: opts.inputs.threadTs,
      text: opts.inputs.text ?? opts.inputs.markdown,
      blocks,
    });

    if (!response.ok || !response.message) {
      throw new Error(response.error ?? 'Slack API did not return a message.');
    }

    return opts.next({
      message: response.message,
    });
  },
});
