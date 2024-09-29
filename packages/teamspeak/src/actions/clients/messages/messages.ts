import * as teamspeakPin from '@/pins';
import { IconMessage, IconMessagePlus } from '@tabler/icons-react';
import { TeamSpeakClient, TextMessageTargetMode } from 'ts3-nodejs-library';
import { createAction, pin } from '@xentom/integration';

const group = 'Clients/Messages';

export const onClientMessage = createAction({
  group,
  icon: IconMessage,
  description: 'Triggers when a message is sent to the bot',
  outputs: {
    exec: pin.exec(),
    author: teamspeakPin.client.extend({
      description: 'Returns the client that sent the message',
    }),
    message: pin.string({
      description: 'Returns the message that was sent',
      isEditable: false,
    }),
  },
  run({ state, next }) {
    state.ts.on('textmessage', (event) => {
      // Ignore messages sent by the bot
      if (event.invoker.clid === state.whoami.clientId) {
        return;
      }

      // Ignore messages that are not sent to a client
      if (event.targetmode !== TextMessageTargetMode.CLIENT) {
        return;
      }

      next('exec', {
        author: event.invoker,
        message: event.msg,
      });
    });
  },
});

export const sendClientMessage = createAction({
  group,
  icon: IconMessagePlus,
  description: 'Send a message to a client',
  inputs: {
    exec: pin.exec({
      run({ inputs, next }) {
        if (!(inputs.client instanceof TeamSpeakClient)) {
          throw new Error('Failed to send client message: Invalid client');
        }

        inputs.client.message(inputs.message);
        next('exec');
      },
    }),
    client: teamspeakPin.client.extend({
      description: 'The client to send the message to',
    }),
    message: pin.string({
      description: 'The message to send',
    }),
  },
});
