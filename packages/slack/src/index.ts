import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { WebClient } from '@slack/web-api';

import * as nodes from './nodes';

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    slack: WebClient;
  }
}

export default i.integration({
  nodes,

  auth: i.auth.oauth2({
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scopes: ['chat:write', 'channels:read', 'groups:read'],
    onAccessTokenUpdated(opts) {
      opts.state.slack = new WebClient(opts.auth.accessToken);
    },
  }),

  async start(opts) {
    opts.state.slack = new WebClient(opts.auth.accessToken);

    const auth = await opts.state.slack.auth.test();
    if (!auth.ok) {
      throw new Error(auth.error ?? 'Slack authentication failed');
    }
  },
});
