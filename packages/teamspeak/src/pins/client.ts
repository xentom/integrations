import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { TeamSpeakClient } from 'ts3-nodejs-library'
import { type ClientEntry } from 'ts3-nodejs-library/lib/types/ResponseTypes'

export const item = {
  input: i.pins.data({
    schema({ state }) {
      return v.pipe(
        v.custom<ClientEntry>((value) => {
          return !!value && typeof value === 'object' && 'cid' in value
        }),
        v.transform((data) => new TeamSpeakClient(state.teamspeak, data)),
      )
    },
  }),
  output: i.pins.data({
    schema: v.pipe(
      v.custom<TeamSpeakClient>((value) => {
        return value instanceof TeamSpeakClient
      }),
      v.transform((value) => {
        return value.toJSON() as ClientEntry
      }),
    ),
  }),
}

export const items = {
  output: i.pins.data({
    schema: v.pipe(
      v.array(
        v.custom<TeamSpeakClient>((value) => {
          return value instanceof TeamSpeakClient
        }),
      ),
      v.transform((clients) => {
        return clients.map((client) => client.toJSON() as ClientEntry)
      }),
    ),
  }),
}

export const id = i.pins.data({
  displayName: 'ID',
  description: 'The ID of a TeamSpeak client',
  schema: v.string(),
  control: i.controls.text({
    placeholder: '1',
  }),
})

export const idSelection = id.with({
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
