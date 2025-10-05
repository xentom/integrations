import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import Anthropic from '@anthropic-ai/sdk';

import * as nodes from './nodes';

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    client: Anthropic;
  }
}

export default i.integration({
  nodes,

  auth: i.auth.token({
    control: i.controls.text({
      label: 'API Key',
      description:
        'Your Anthropic API key for authentication. Generate your API key by visiting: https://console.anthropic.com/settings/keys',
      placeholder: 'sk-ant-...',
    }),
    schema: v.pipeAsync(
      v.string(),
      v.startsWith('sk-ant-'),
      v.checkAsync(async (apiKey) => {
        const client = new Anthropic({ apiKey });
        await client.models.list({ limit: 1 });
        return true;
      }, 'Invalid Anthropic API key. Please check your key and permissions.'),
    ),
  }),

  start({ state, auth }) {
    state.client = new Anthropic({
      apiKey: auth.token,
    });
  },
});
