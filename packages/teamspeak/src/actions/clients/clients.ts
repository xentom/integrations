import * as teamspeakPin from '@/pins';
import { IconUser, IconUsers } from '@tabler/icons-react';
import { TeamSpeakChannel, TeamSpeakClient } from 'ts3-nodejs-library';
import { createAction, pin } from '@xentom/integration';

const group = 'Clients';

export const onClientConnected = createAction({
  group,
  icon: IconUser,
  description: 'Triggers when a client connects to the server',
  outputs: {
    exec: pin.exec(),
    client: teamspeakPin.client.extend({
      description: 'Returns the client that connected',
    }),
  },
  run({ state, next }) {
    state.ts.on('clientconnect', (event) => {
      next('exec', {
        client: event.client,
      });
    });
  },
});

export const onClientDisconnected = createAction({
  group,
  icon: IconUser,
  description: 'Triggers when a client disconnects from the server',
  outputs: {
    exec: pin.exec(),
    client: teamspeakPin.client.extend({
      description: 'Returns the client that disconnected',
    }),
  },
  run({ state, next }) {
    state.ts.on('clientdisconnect', (event) => {
      next('exec', {
        client: event.client,
      });
    });
  },
});

export const onClientJoinChannel = createAction({
  group,
  icon: IconUser,
  description: 'Triggers when a client joins a channel',
  outputs: {
    exec: pin.exec(),
    client: teamspeakPin.client.extend({
      description: 'Returns the client that joined the channel',
    }),
    channel: teamspeakPin.channel.extend({
      description: 'Returns the channel that the client joined',
    }),
  },
  run({ state, next }) {
    state.ts.on('clientmoved', (event) => {
      next('exec', {
        client: event.client,
        channel: event.channel,
      });
    });
  },
});

export const getClients = createAction({
  group,
  icon: IconUsers,
  description: 'Returns all clients on the server',
  outputs: {
    clients: teamspeakPin.client.custom<TeamSpeakClient[]>().extend({
      icon: IconUsers,
      description: 'Returns all clients on the server',
    }),
  },
  async run({ state, outputs }) {
    outputs.clients = await state.ts.clientList({
      clientType: 0,
    });
  },
});

export const botClient = createAction({
  group,
  icon: IconUser,
  description: "Returns the bot's client",
  outputs: {
    client: teamspeakPin.client.extend({
      description: "Returns the bot's client",
    }),
  },
  async run({ outputs, state }) {
    outputs.client = await state.ts.self();
  },
});

export const getClientById = createAction({
  group,
  icon: IconUser,
  description: 'Returns a client by their ID',
  inputs: {
    clientId: pin.number({
      description: 'The ID of the client to return',
    }),
  },
  outputs: {
    client: teamspeakPin.client.extend({
      description: 'Returns the client with the specified ID',
      isOptional: true,
    }),
  },
  async run({ inputs, outputs, state }) {
    outputs.client = await state.ts.getClientById(inputs.clientId);
  },
});

export const getClientByNickname = createAction({
  group,
  icon: IconUser,
  description: 'Returns a client by their nickname',
  inputs: {
    nickname: pin.string({
      description: 'The nickname of the client to return',
    }),
  },
  outputs: {
    client: teamspeakPin.client.extend({
      description: 'Returns the client with the specified nickname',
      isOptional: true,
    }),
  },
  async run({ inputs, outputs, state }) {
    outputs.client = await state.ts.getClientByName(inputs.nickname);
  },
});

export const moveClient = createAction({
  group,
  icon: IconUser,
  description: 'Move a client to a channel',
  inputs: {
    exec: pin.exec({
      async run({ inputs, next }) {
        if (!(inputs.client instanceof TeamSpeakClient)) {
          throw new Error('Failed to move client: Invalid client');
        }

        if (!(inputs.channel instanceof TeamSpeakChannel)) {
          throw new Error('Failed to move client: Invalid channel');
        }

        await inputs.client.move(inputs.channel);
        next('exec');
      },
    }),
    client: teamspeakPin.client.extend({
      description: 'The client to move',
    }),
    channel: teamspeakPin.channel.extend({
      description: 'The channel to move the client to',
    }),
  },
  outputs: {
    exec: pin.exec(),
  },
});
