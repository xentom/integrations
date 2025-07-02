import { randomBytes } from 'node:crypto';
import { Webhooks } from '@octokit/webhooks';
import { type EmitterWebhookEvent } from '@octokit/webhooks/types';
import { Octokit, RequestError } from 'octokit';
import * as v from 'valibot';

import * as i from '@acme/integration';

import * as actions from './actions';

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
});

export interface IntegrationState {
  octokit: Octokit;
  webhookSecret: string;
  webhooks: Webhooks;
}

export default i.integration({
  actions,

  env: {
    GITHUB_TOKEN: i.env({
      control: i.controls.text({
        label: 'GitHub Token',
        description:
          'A personal access token with the necessary permissions to access your repositories.',
        placeholder: 'ghp_...',
        sensitive: true,
      }),
      schema: v.pipeAsync(
        v.string(),
        v.startsWith('ghp_'),
        v.checkAsync(async (token) => {
          const octokit = new Octokit({
            auth: token,
          });

          try {
            await octokit.rest.users.getAuthenticated();
            return true;
          } catch (error) {
            console.error(
              'GitHub token validation failed:',
              error instanceof RequestError ? error.message : error,
            );

            return false;
          }
        }, 'Invalid GitHub token. Please check your token and permissions.'),
      ),
    }),
  },

  start(opts) {
    opts.state.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    opts.state.webhookSecret = randomBytes(32).toString('hex');
    opts.state.webhooks = new Webhooks({
      secret: opts.state.webhookSecret,
    });

    opts.webhook.subscribe(async (request) => {
      console.log('{GITHUB} Webhook received', request.url);

      const delivery = request.headers.get('X-GitHub-Delivery');
      if (!delivery) {
        console.warn('Webhook delivery missing');
        return;
      }

      const event = request.headers.get('X-GitHub-Event');
      if (!event) {
        console.warn('Webhook event missing');
        return;
      }

      const signature = request.headers.get('X-Hub-Signature-256');
      if (!signature) {
        console.warn('Webhook signature missing');
        return;
      }

      const payload = await request.text();
      if (!(await opts.state.webhooks.verify(payload, signature))) {
        console.warn('Webhook signature invalid');
        return;
      }

      await opts.state.webhooks.receive({
        id: delivery,
        name: event,
        payload: JSON.parse(payload) as unknown,
      } as EmitterWebhookEvent);
    });
  },
});
