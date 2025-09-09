import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { google, type Auth, type gmail_v1, type pubsub_v1 } from 'googleapis';

import * as nodes from './nodes';

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

export interface IntegrationState {
  auth: Auth.OAuth2Client;
  gmail: gmail_v1.Gmail;
  pubsub: pubsub_v1.Pubsub;
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
      });
    },
  }),

  start(opts) {
    opts.state.auth = new google.auth.OAuth2({
      projectId: 'rock-arc-471517-m2',
      project_id: 'rock-arc-471517-m2',
      quotaProjectId: 'rock-arc-471517-m2',
      quota_project_id: 'rock-arc-471517-m2',
    });
    opts.state.auth.setCredentials({
      access_token: opts.auth.accessToken,
    });

    console.log(opts.state.auth.projectId);

    opts.state.gmail = google.gmail({
      version: 'v1',
      auth: opts.state.auth,
    });

    opts.state.pubsub = google.pubsub({
      version: 'v1',
      auth: opts.state.auth,
    });
  },
});
