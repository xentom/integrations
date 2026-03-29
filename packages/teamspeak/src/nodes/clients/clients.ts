import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import {
  type ClientConnectEvent,
  type ClientDisconnectEvent,
  type ClientMovedEvent,
  ReasonIdentifier,
} from 'ts3-nodejs-library'

import * as pins from '@/pins'

const nodes = i.nodes.group('Clients')

export const onClient = nodes.trigger({
  inputs: {
    action: pins.client.action,
  },
  outputs: {
    client: pins.client.item,
  },
  async subscribe(opts) {
    function onClientEvent({
      client,
    }: ClientConnectEvent | ClientDisconnectEvent) {
      if (!client) return
      void opts.next(
        { client },
        {
          deduplication: {
            id: client.cid,
          },
        },
      )
    }

    opts.state.teamspeak.on(opts.inputs.action as any, onClientEvent)
    return () => {
      opts.state.teamspeak.off(opts.inputs.action, onClientEvent)
    }
  },
})

export const onClientMoved = nodes.trigger({
  outputs: {
    client: pins.client.item,
    channel: pins.channel.item,
  },
  subscribe(opts) {
    function onClientMoved({ client, channel }: ClientMovedEvent) {
      void opts.next(
        { client, channel },
        {
          deduplication: {
            id: client.cid,
          },
        },
      )
    }

    opts.state.teamspeak.on('clientmoved', onClientMoved)
    return () => {
      opts.state.teamspeak.off('clientmoved', onClientMoved)
    }
  },
})

export const getClientById = nodes.pure({
  description: 'Get a TeamSpeak client by its id',
  inputs: {
    id: pins.client.id,
  },
  outputs: {
    client: pins.client.item,
  },
  async run(opts) {
    const client = await opts.state.teamspeak.getClientById(opts.inputs.id)
    if (!client) {
      throw new Error(`Client with the ID "${opts.inputs.id}" not found`)
    }

    opts.outputs.client = client
  },
})

export const listClients = nodes.pure({
  description: 'List all TeamSpeak clients',
  outputs: {
    clients: pins.client.items,
  },
  async run(opts) {
    opts.outputs.clients = await opts.state.teamspeak.clientList()
  },
})

export const kickClient = nodes.action({
  description: 'Kick a TeamSpeak client',
  inputs: {
    client: pins.client.item,
    reason: i.pins.data({
      description: 'The reason for kicking the client.',
      schema: v.string(),
      control: i.controls.text(),
    }),
    scope: i.pins.data({
      description: 'Where to kick the client from.',
      schema: v.union([
        v.literal(ReasonIdentifier.KICK_SERVER),
        v.literal(ReasonIdentifier.KICK_CHANNEL),
      ]),
      control: i.controls.select({
        options: [
          { label: 'Channel', value: ReasonIdentifier.KICK_CHANNEL },
          { label: 'Server', value: ReasonIdentifier.KICK_SERVER },
        ],
      }),
    }),
  },
  async run(opts) {
    await opts.state.teamspeak.clientKick(
      opts.inputs.client,
      opts.inputs.scope,
      opts.inputs.reason,
    )

    return opts.next()
  },
})
