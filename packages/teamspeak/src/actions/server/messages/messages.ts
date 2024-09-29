import * as teamspeakPin from '@/pins';
import { IconMessage, IconMessagePlus } from '@tabler/icons-react';
import { TextMessageTargetMode } from 'ts3-nodejs-library';
import { createAction, pin } from '@xentom/integration';

const group = 'Server/Messages';

export const onServerMessage = createAction({
  group,
  icon: IconMessage,
  description: 'Triggers when a message is sent to the server chat',
  outputs: {
    exec: pin.exec(),
    author: teamspeakPin.client.extend({
      description: 'The client that sent the message',
    }),
    message: pin.string({
      description: 'The message that was sent',
      isEditable: false,
    }),
  },
  run({ state, next }) {
    state.ts.on('textmessage', (event) => {
      // Ignore messages sent by the bot
      if (event.invoker.clid === state.whoami.clientId) {
        return;
      }

      // Ignore messages that are not sent to the server
      if (event.targetmode !== TextMessageTargetMode.SERVER) {
        return;
      }

      next('exec', {
        author: event.invoker,
        message: event.msg,
      });
    });
  },
});

export const sendServerMessage = createAction({
  group,
  icon: IconMessagePlus,
  description: 'Send a message to the server chat',
  inputs: {
    exec: pin.exec({
      run({ inputs, state, next }) {
        state.ts.sendTextMessage(
          '0',
          TextMessageTargetMode.SERVER,
          inputs.message,
        );

        next('exec');
      },
    }),
    message: pin.string({
      description: 'The message to send',
    }),
  },
  outputs: {
    exec: pin.exec(),
  },
});
