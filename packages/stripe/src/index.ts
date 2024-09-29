import { type EventEmitter } from 'node:events';
import Stripe from 'stripe';
import { createIntegration, env } from '@xentom/integration';
import * as actions from './actions';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STRIPE_API_KEY: string;
    }
  }
}

declare module '@xentom/integration' {
  interface IntegrationState {
    stripe: Stripe;
    webhookSecret?: string;
    events: EventEmitter<StripeEventMap>;
  }
}

type StripeEventMap = {
  [key in Stripe.Event['type']]: [Extract<Stripe.Event, { type: key }>];
};

export default createIntegration({
  actions,

  env: {
    STRIPE_API_KEY: env.string({
      label: 'Stripe API Key',
      isSensitive: true,
    }),
  },

  async onStart({ state, http }) {
    state.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2024-06-20',
      telemetry: false,
      maxNetworkRetries: 5,
    });

    const { EventEmitter } = await import('node:events');
    state.events = new EventEmitter<StripeEventMap>();

    http.post('/webhook', async (request) => {
      const sig = request.headers.get('stripe-signature');
      if (!sig) {
        console.warn('Webhook signature missing');
        return;
      }

      if (!state.webhookSecret) {
        console.warn('Webhook secret missing');
        return;
      }

      const event = await state.stripe.webhooks.constructEventAsync(
        await request.text(),
        sig,
        state.webhookSecret,
      );
      state.events.emit(event.type, event as any);
    });
  },
});
