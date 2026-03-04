import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { type ClientConnectEvent, ReasonIdentifier } from 'ts3-nodejs-library'

import * as pins from '@/pins'

const nodes = i.nodes.group('Clients')

export const onClientConnected = nodes.trigger({
  outputs: {
    client: pins.client.item.output,
  },
  subscribe(opts) {
    function onClientConnected(event: ClientConnectEvent) {
      void opts.next(
        {
          client: event.client,
        },
        {
          deduplication: {
            id: event.client.cid,
          },
        },
      )
    }

    opts.state.teamspeak.on('clientconnect', onClientConnected)
    return () => {
      opts.state.teamspeak.off('clientconnect', onClientConnected)
    }
  },
})

export const getClientById = nodes.pure({
  description: 'Get a TeamSpeak client by its id',
  inputs: {
    id: pins.client.idSelection,
  },
  outputs: {
    client: pins.client.item.output,
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
    clients: pins.client.items.output,
  },
  async run(opts) {
    opts.outputs.clients = await opts.state.teamspeak.clientList()
  },
})

export const kickClient = nodes.callable({
  description: 'Kick a TeamSpeak client',
  inputs: {
    client: pins.client.item.input,
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
