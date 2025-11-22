import * as i from '@xentom/integration-framework';

import { OAuth2Client } from 'google-auth-library';
import { drive_v3 } from 'googleapis/build/src/apis/drive/v3';
import { sheets_v4 } from 'googleapis/build/src/apis/sheets/v4';

import * as nodes from './nodes';

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    auth: OAuth2Client;
    sheets: sheets_v4.Sheets;
    drive: drive_v3.Drive;
  }
}

export default i.integration({
  nodes,

  auth: i.auth.oauth2({
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
    onAccessTokenUpdated(opts) {
      opts.state.auth.setCredentials({
        access_token: opts.auth.accessToken,
      });
    },
  }),

  start(opts) {
    opts.state.auth = new OAuth2Client({
      credentials: {
        access_token: opts.auth.accessToken,
      },
    });

    opts.state.sheets = new sheets_v4.Sheets({
      auth: opts.state.auth,
    });

    opts.state.drive = new drive_v3.Drive({
      auth: opts.state.auth,
    });
  },
});
