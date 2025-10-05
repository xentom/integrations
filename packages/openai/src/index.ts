import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import OpenAI from 'openai';
import { type Model } from 'openai/resources';

import * as nodes from './nodes';

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    client: OpenAI;
    models: Model[];
  }
}

export default i.integration({
  nodes,

  auth: i.auth.token({
    control: i.controls.text({
      label: 'API Key',
      description:
        'Generate your OpenAI API key by visiting: https://platform.openai.com/api-keys',
      placeholder: 'sk-...',
    }),
    schema: v.pipeAsync(
      v.string(),
      v.startsWith('sk-'),
      v.checkAsync(async (apiKey) => {
        const client = new OpenAI({
          apiKey,
        });

        try {
          await client.models.list();
          return true;
        } catch (error) {
          console.error(
            'OpenAI token validation failed:',
            error instanceof Error ? error.message : error,
          );

          return false;
        }
      }, 'Invalid OpenAI token. Please check your token and permissions.'),
    ),
  }),

  async start(opts) {
    opts.state.client = new OpenAI({
      apiKey: opts.auth.token,
    });

    opts.state.models = [];
    const models = await opts.state.client.models.list();
    for await (const model of models.iterPages()) {
      opts.state.models.push(...model.data);
    }
  },
});
