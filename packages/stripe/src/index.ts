import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { EventEmitter } from 'node:events'
import Stripe from 'stripe'

import * as nodes from './nodes'

v.setGlobalConfig({
  abortEarly: true,
  abortPipeEarly: true,
})

type StripeEventMap = {
  [E in Stripe.Event as E['type']]: [E]
}

declare module '@xentom/integration-framework' {
  interface IntegrationState {
    stripe: Stripe
    events: EventEmitter<StripeEventMap>
  }
}

export default i.integration({
  nodes,

  auth: i.auth.token({
    control: i.controls.text({
      label: 'API Key',
      description:
        'Enter your Stripe API key, which you can find in your Stripe dashboard: https://dashboard.stripe.com/apikeys',
      placeholder: 'sk_...',
    }),
    schema: v.pipeAsync(
      v.string(),
      v.regex(
        /^sk_(test|live)_/,
        'API key must start with sk_test_ or sk_live_',
      ),
      v.checkAsync(async (token) => {
        const stripe = new Stripe(token)

        try {
          await stripe.balance.retrieve()
          return true
        } catch (error) {
          console.error(
            'Stripe API key validation failed:',
            error instanceof Error ? error.message : error,
          )
          return false
        }
      }, 'Invalid Stripe API key. Please check your key and permissions.'),
    ),
  }),

  async start(opts) {
    opts.state.stripe = new Stripe(opts.auth.token)
    opts.state.events = new EventEmitter<StripeEventMap>()

    const endpointSecretKey = `endpoint:${Bun.hash(opts.webhook.url)}:secret`
    const endpointSecret: string =
      (await opts.kv.get(endpointSecretKey)) ??
      (await opts.state.stripe.webhookEndpoints
        .create({
          url: opts.webhook.url,
          enabled_events: ['*'],
        })
        .then(async ({ secret }) => {
          if (!secret) {
            throw new Error('Failed to create webhook endpoint')
          }

          await opts.kv.set(endpointSecretKey, secret)
          return secret
        }))

    opts.webhook.subscribe(async (request) => {
      const signature = request.headers.get('stripe-signature')
      if (!signature) {
        return new Response('Unauthorized', { status: 401 })
      }

      const event = await opts.state.stripe.webhooks.constructEventAsync(
        Buffer.from(await request.arrayBuffer()),
        signature,
        endpointSecret,
      )

      // @ts-expect-error -
      opts.state.events.emit(event.type, event)
    })
  },
})
