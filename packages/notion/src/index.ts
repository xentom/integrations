import * as i from '@xentom/integration-framework'

import { Client } from '@notionhq/client'

import * as nodes from './nodes'

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    client: Client
  }
}

export default i.integration({
  nodes,

  auth: i.auth.oauth2({
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenUrl: 'https://api.notion.com/v1/oauth/token',
    scopes: [],
    onAccessTokenUpdated(opts) {
      opts.state.client = new Client({
        auth: opts.auth.accessToken,
      })
    },
  }),

  start(opts) {
    opts.state.client = new Client({
      auth: opts.auth.accessToken,
    })
  },
})
