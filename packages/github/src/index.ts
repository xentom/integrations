import { Webhooks } from '@octokit/webhooks';
import { Octokit } from 'octokit';
import { auth, createIntegration } from '@xentom/integration';
import * as actions from './actions';

declare module '@xentom/integration' {
  interface IntegrationState {
    webhooks: Webhooks;
    webhookSecret: string;
    octokit: Octokit;
  }
}

export default createIntegration({
  actions,

  auth: auth.oauth2({
    grantType: 'authorization_code',
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scopes: ['admin:repo_hook', 'admin:org_hook'],
  }),

  async onStart({ state, http }) {
    if (!process.auth.accessToken) {
      throw new Error(
        'Failed to authenticate with GitHub. Missing access token.',
      );
    }

    const { randomBytes } = await import('node:crypto');
    state.webhookSecret = randomBytes(32).toString('hex');
    state.webhooks = new Webhooks({
      secret: state.webhookSecret,
    });

    http.post('/webhook', async (request) => {
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

    state.octokit = new Octokit({
      auth: process.auth.accessToken,
    });
  },
});
