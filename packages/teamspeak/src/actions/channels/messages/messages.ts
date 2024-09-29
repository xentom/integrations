import * as teamspeakPin from '@/pins';
import { IconMessage, IconMessagePlus } from '@tabler/icons-react';
import { TeamSpeakChannel, TextMessageTargetMode } from 'ts3-nodejs-library';
import { createAction, pin } from '@xentom/integration';

const group = 'Channels/Messages';

export const onChannelMessage = createAction({
  group,
  icon: IconMessage,
  description: 'Triggers when a message is sent in a channel',
  outputs: {
    exec: pin.exec(),
    channel: teamspeakPin.channel.extend({
      description: 'Returns the channel where the message was sent',
    }),
    author: teamspeakPin.client.extend({
      description: 'Returns the client that sent the message',
    }),
    message: pin.string({
      description: 'Returns the message that was sent',
      isEditable: false,
    }),
  },
  run({ state, next }) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    state.ts.on('textmessage', async (event) => {
      // Ignore messages sent by the bot
      if (event.invoker.clid === state.whoami.clientId) {
        return;
      }

      // Ignore messages that are not sent in a channel
      if (event.targetmode !== TextMessageTargetMode.CHANNEL) {
        return;
      }

      const channel = await state.ts.getChannelById(event.invoker.cid);
      next('exec', {
        channel,
        author: event.invoker,
        message: event.msg,
      });
    });
  },
});

export const sendChannelMessage = createAction({
  group,
  icon: IconMessagePlus,
  description: 'Send a message to a channel',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        if (!(inputs.channel instanceof TeamSpeakChannel)) {
          throw new Error('Failed to send channel message: Invalid channel');
        }

        await inputs.channel.message(inputs.message);
        next('exec');
      },
    }),
    channel: teamspeakPin.channel.extend({
      description: 'The channel to send the message to',
    }),
    message: pin.string({
      description: 'The message to send',
    }),
  },
  outputs: {
    exec: pin.exec(),
  },
});
