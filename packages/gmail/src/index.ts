import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { OAuth2Client } from 'google-auth-library'
import { gmail_v1 } from 'googleapis/build/src/apis/gmail/v1'
import { pubsub_v1 } from 'googleapis/build/src/apis/pubsub/v1'

import * as nodes from './nodes'

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
})

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    auth: OAuth2Client
    gmail: gmail_v1.Gmail
    pubsub: pubsub_v1.Pubsub
  }
}

export default i.integration({
  nodes,

  auth: i.auth.oauth2({
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/gmail.send',
      'email',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.compose',

      // Required for watch to inbox messages
      'https://www.googleapis.com/auth/pubsub',
    ],
    onAccessTokenUpdated(opts) {
      opts.state.auth.setCredentials({
        access_token: opts.auth.accessToken,
      })
    },
  }),

  start(opts) {
    opts.state.auth = new OAuth2Client({
      credentials: {
        access_token: opts.auth.accessToken,
      },
    })

    opts.state.gmail = new gmail_v1.Gmail({
      auth: opts.state.auth,
    })

    opts.state.pubsub = new pubsub_v1.Pubsub({
      auth: opts.state.auth,
    })
  },
})
