import * as i from '@xentom/integration-framework'

import { OAuth2Client } from 'google-auth-library'
import { forms_v1 } from 'googleapis/build/src/apis/forms/v1'

import * as nodes from './nodes'

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    auth: OAuth2Client
    forms: forms_v1.Forms
  }
}

export default i.integration({
  nodes,

  auth: i.auth.oauth2({
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/forms.body',
      'https://www.googleapis.com/auth/forms.responses.readonly',
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

    opts.state.forms = new forms_v1.Forms({
      auth: opts.state.auth,
    })
  },
})
