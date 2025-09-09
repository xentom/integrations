import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { randomBytes } from 'node:crypto';
import { Webhooks } from '@octokit/webhooks';
import { type EmitterWebhookEvent } from '@octokit/webhooks/types';
import { Octokit } from 'octokit';

import * as nodes from './nodes';

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
  nodes,

  auth: i.auth.oauth2({
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scopes: ['admin:repo_hook', 'admin:org', 'repo'],
  }),

  start(opts) {
    opts.state.octokit = new Octokit({
      auth: opts.auth.accessToken,
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
