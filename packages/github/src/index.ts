import { controls, env, integration } from '@acme/integration';
import { Webhooks } from '@octokit/webhooks';
import { Octokit } from 'octokit';
import { randomBytes } from 'node:crypto';

import * as v from 'valibot';
import * as actions from './actions';

export default integration({
  actions,

  env: {
    GITHUB_TOKEN: env({
      schema: v.string(),
      control: controls.input(),
    }),
  },

  async start({ state, webhook }) {
    state.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    state.webhookSecret = randomBytes(32).toString('hex');
    state.webhooks = new Webhooks({
      secret: state.webhookSecret,
    });

    webhook.subscribe(async (request) => {
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
      if (!(await state.webhooks.verify(payload, signature))) {
        console.warn('Webhook signature invalid');
        return;
      }

      await state.webhooks.receive({
        id: delivery,
        name: event as any,
        payload: JSON.parse(payload),
      });
    });
  },
});
