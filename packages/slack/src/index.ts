import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { SocketModeClient } from '@slack/socket-mode';
import { LogLevel, WebClient, type SlackEvent } from '@slack/web-api';

import * as nodes from './nodes';
import { type EventPayload } from './utils/event';

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    client: WebClient;
    socket: SocketModeClient;
  }
}

export default i.integration({
  nodes,

  auth: i.auth.oauth2({
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scopes: ['chat:write', 'channels:read', 'groups:read'],
    onAccessTokenUpdated(opts) {
      opts.state.client = new WebClient(opts.auth.accessToken);
    },
  }),

  env: {
    SLACK_APP_LEVEL_TOKEN: i.env({
      schema: v.pipe(v.string(), v.startsWith('xapp-')),
      control: i.controls.text({
        label: 'Slack App Level Token',
        placeholder: 'xapp-...',
        sensitive: true,
      }),
    }),
  },

  async start(opts) {
    opts.state.client = new WebClient(opts.auth.accessToken);
    opts.state.socket = new SocketModeClient({
      appToken: opts.env.SLACK_APP_LEVEL_TOKEN,
      logLevel: LogLevel.DEBUG,
    });

    opts.state.socket.on('authenticated', () => {
      console.debug('Slack websocket authenticated');
    });

    opts.state.socket.on('connected', () => {
      console.debug('Slack websocket connected');
    });

    // Automatically acknowledge incoming Slack events to confirm receipt
    opts.state.socket.on('slack_event', (payload: EventPayload<SlackEvent>) => {
      void payload.ack();
    });

    await opts.state.socket.start();
  },

  async stop(opts) {
    await opts.state.socket?.disconnect();
  },
});
