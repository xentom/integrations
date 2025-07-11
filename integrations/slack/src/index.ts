import { WebClient } from '@slack/web-api';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

import * as nodes from './nodes';

export interface IntegrationState {
  slack: WebClient;
}

export default i.integration({
  nodes,
  env: {
    SLACK_BOT_TOKEN: i.env({
      control: i.controls.text({
        label: 'Slack Bot Token',
        sensitive: true,
        description:
          'Your Slack bot token for API access (usually starts with xoxb-)',
        placeholder: 'xoxb-your-bot-token-here',
      }),
      schema: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, 'Slack bot token is required'),
        v.startsWith('xoxb-', 'Bot token should start with "xoxb-"'),
      ),
    }),
  },
  start(opts) {
    // Initialize Slack WebClient with the provided token
    opts.state.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
  },
});
