import OpenAI from 'openai';
import { type Model } from 'openai/resources';
import * as v from 'valibot';

import * as i from '@acme/integration';

import * as actions from './actions';

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

export interface IntegrationState {
  client: OpenAI;
  models: Model[];
}

export default i.integration({
  actions,

  env: {
    API_KEY: i.env({
      control: i.controls.text({
        label: 'API Key',
        description:
          'Generate your OpenAI API key by visiting: https://platform.openai.com/api-keys',
        placeholder: 'sk-...',
        sensitive: true,
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
  },

  async start(opts) {
    opts.state.client = new OpenAI({
      apiKey: process.env.API_KEY,
    });

    opts.state.models = [];
    const models = await opts.state.client.models.list();
    for await (const model of models.iterPages()) {
      opts.state.models.push(...model.data);
    }
  },
});
