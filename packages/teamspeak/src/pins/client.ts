import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { TeamSpeakClient } from 'ts3-nodejs-library'

export const action = i.pins.data({
  description: 'The action type of the client event',
  control: i.controls.select({
    options: [
      {
        label: 'Connected',
        value: 'clientconnect',
      },
      {
        label: 'Disconnected',
        value: 'clientdisconnect',
      },
    ],
    defaultValue: 'clientconnect',
  } as const),
})

export const item = i.pins.data({
  schema: v.pipe(
    v.custom<TeamSpeakClient>((i) => i instanceof TeamSpeakClient),
  ),
})

export const items = i.pins.data({
  schema: v.array(
    v.pipe(v.custom<TeamSpeakClient>((i) => i instanceof TeamSpeakClient)),
  ),
})

export const id = i.pins.data({
  displayName: 'ID',
  description: 'The ID of a TeamSpeak client',
  schema: v.string(),
  control: i.controls.select({
    async options(opts) {
      const clients = await opts.state.teamspeak.clientList()
      return {
        items: clients.map((client) => ({
          value: client.clid,
          suffix: client.nickname,
        })),
      }
    },
  }),
})
