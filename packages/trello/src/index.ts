import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { TrelloClient } from 'trello.js'

import * as nodes from './nodes'

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
})

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    client: TrelloClient
  }
}

export default i.integration({
  nodes,

  env: {
    TRELLO_API_KEY: i.env({
      control: i.controls.text({
        label: 'API Key',
        description:
          'Your Trello API Key. Generate one at https://trello.com/power-ups/admin',
        placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        sensitive: true,
      }),
    }),
    TRELLO_TOKEN: i.env({
      control: i.controls.text({
        label: 'Token',
        description:
          'Your Trello Token. Generate one at https://trello.com/1/authorize?expiration=never&scope=read,write&response_type=token&key=YOUR_API_KEY',
        placeholder:
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        sensitive: true,
      }),
    }),
  },

  async start(opts) {
    const client = new TrelloClient({
      key: opts.env.TRELLO_API_KEY,
      token: opts.env.TRELLO_TOKEN,
    })

    try {
      await client.members.getMember({ id: 'me' })
    } catch (error) {
      throw new Error(
        `Failed to authenticate with Trello. Your API key or token may be invalid or expired. Please verify your credentials and try again. Details: ${
          error instanceof Error ? error.message : String(error)
        }`,
      )
    }

    opts.state.client = client
  },
})
