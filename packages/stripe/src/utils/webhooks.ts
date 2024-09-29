import type Stripe from 'stripe';
import { onCleanup, type IntegrationContext } from '@xentom/integration';

let timeout: Timer;
const events = new Set<Stripe.Event['type']>();

export interface CreateWebhookData {
  events: Stripe.Event['type'][];
}

export function createWebhook(
  context: IntegrationContext,
  data: CreateWebhookData,
) {
  clearTimeout(timeout);
  data.events.forEach((event) => events.add(event));

  timeout = setTimeout(() => {
    async function createWebhooks() {
      const webhook = await context.state.stripe.webhookEndpoints.create({
        url: `${context.http.baseUrl}/webhook`,
        enabled_events: [...events],
        api_version: '2024-06-20',
      });

      context.state.webhookSecret = webhook.secret;
      onCleanup(async () => {
        await context.state.stripe.webhookEndpoints.del(webhook.id);
      });
    }

    createWebhooks();
  }, 500);
}
