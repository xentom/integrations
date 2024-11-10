import OpenAI from 'openai';
import { createIntegration, env } from '@xentom/integration';
import * as actions from './actions';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
    }
  }
}

declare module '@xentom/integration' {
  interface IntegrationState {
    client: OpenAI;
  }
}

export default createIntegration({
  actions,

  env: {
    OPENAI_API_KEY: env.string({
      label: 'OpenAI API Key',
      description: 'API key for authenticating requests to the OpenAI API.',
      isSensitive: true,
    }),
  },

  onStart({ state }) {
    state.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  },
});
