import { Resend } from 'resend';
import * as v from 'valibot';

import * as i from '@acme/integration';

import * as actions from './actions';

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

export interface IntegrationState {
  resend: Resend;
}

export default i.integration({
  actions,

  env: {
    API_KEY: i.env({
      control: i.controls.text({
        label: 'API Key',
        description:
          'Enter your Resend API key, which you can generate from your Resend dashboard: https://resend.com/api-keys',
        placeholder: 're_...',
        sensitive: true,
      }),
      schema: v.pipeAsync(
        v.string(),
        v.startsWith('re_'),
        v.checkAsync(async (token) => {
          const resend = new Resend(token);

          try {
            const response = await resend.apiKeys.list();
            if (response.error) {
              throw new Error(response.error.message);
            }

            return true;
          } catch (error) {
            console.error(
              'Resend API key validation failed:',
              error instanceof Error ? error.message : error,
            );

            return false;
          }
        }, 'Invalid Resend API key. Please check your key and permissions.'),
      ),
    }),
  },

  start(opts) {
    opts.state.resend = new Resend(process.env.API_KEY);
  },
});
