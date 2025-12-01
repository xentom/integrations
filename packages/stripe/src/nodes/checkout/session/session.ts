import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Checkout/Session')

export const onCheckoutSession = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      eventType: pins.checkout.session.eventType.with({
        displayName: 'When',
      }),
    }

    type Event = Extract<
      Stripe.Event,
      { type: `checkout.session.${I['eventType']}` }
    >

    return nodes.trigger({
      description: 'Triggered when a checkout session event is received.',
      inputs,
      outputs: {
        session: i.pins.data<Event['data']['object']>(),
      },
      async subscribe(opts) {
        function onCheckoutSessionEvent(event: Stripe.Event) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            session: event.data.object,
          } as any)
        }

        opts.state.events.on(
          `checkout.session.${opts.inputs.eventType}`,
          onCheckoutSessionEvent,
        )

        return () => {
          opts.state.events.off(
            `checkout.session.${opts.inputs.eventType}`,
            onCheckoutSessionEvent,
          )
        }
      },
    })
  },
)

export const createCheckoutSession = nodes.callable({
  description: 'Create a new Stripe Checkout session for collecting payments.',
  inputs: {
    mode: pins.checkout.session.mode.with({
      description: 'The mode of the Checkout Session.',
    }),
    successUrl: pins.checkout.session.successUrl.with({
      description: 'URL to redirect after successful checkout.',
    }),
    cancelUrl: pins.checkout.session.cancelUrl.with({
      description: 'URL to redirect when checkout is canceled.',
    }),
    lineItems: pins.checkout.session.lineItems.with({
      description: 'List of items the customer is purchasing.',
    }),
    customerId: pins.customer.id.with({
      description: 'ID of an existing customer.',
      optional: true,
    }),
    customerEmail: pins.checkout.session.customerEmail.with({
      description: 'Email for a new customer.',
      optional: true,
    }),
    allowPromotionCodes: pins.checkout.session.allowPromotionCodes.with({
      description: 'Allow customer to enter promotion codes.',
      optional: true,
    }),
    metadata: pins.checkout.session.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    session: i.pins.data<Stripe.Checkout.Session>({
      description: 'The created checkout session object.',
    }),
    url: i.pins.data<string, string, true>({
      displayName: 'Checkout URL',
      description: 'The URL to redirect the customer to for payment.',
      optional: true,
    }),
  },
  async run(opts) {
    const session = await opts.state.stripe.checkout.sessions.create({
      mode: opts.inputs.mode,
      success_url: opts.inputs.successUrl,
      cancel_url: opts.inputs.cancelUrl,
      line_items: opts.inputs.lineItems,
      customer: opts.inputs.customerId,
      customer_email: opts.inputs.customerEmail,
      allow_promotion_codes: opts.inputs.allowPromotionCodes,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      session,
      url: session.url ?? undefined,
    })
  },
})

export const getCheckoutSession = nodes.callable({
  description: 'Retrieve a Checkout Session by its ID.',
  inputs: {
    id: pins.checkout.session.id.with({
      description: 'The ID of the checkout session to retrieve.',
    }),
  },
  outputs: {
    session: i.pins.data<Stripe.Checkout.Session>({
      description: 'The retrieved checkout session object.',
    }),
  },
  async run(opts) {
    const session = await opts.state.stripe.checkout.sessions.retrieve(
      opts.inputs.id,
    )

    return opts.next({
      session,
    })
  },
})

export const expireCheckoutSession = nodes.callable({
  description: 'Expire an open Checkout Session.',
  inputs: {
    id: pins.checkout.session.id.with({
      description: 'The ID of the checkout session to expire.',
    }),
  },
  outputs: {
    session: i.pins.data<Stripe.Checkout.Session>({
      description: 'The expired checkout session object.',
    }),
  },
  async run(opts) {
    const session = await opts.state.stripe.checkout.sessions.expire(
      opts.inputs.id,
    )

    return opts.next({
      session,
    })
  },
})

export const listCheckoutSessions = nodes.callable({
  description: 'List all Checkout Sessions in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of sessions to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch sessions that come after the given ID.',
      optional: true,
    }),
    customerId: pins.customer.id.with({
      description: 'Filter sessions by customer ID.',
      optional: true,
    }),
  },
  outputs: {
    sessions: i.pins.data<Stripe.Checkout.Session[]>({
      description: 'List of checkout session objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more sessions available.',
    }),
  },
  async run(opts) {
    const sessions = await opts.state.stripe.checkout.sessions.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
      customer: opts.inputs.customerId,
    })

    return opts.next({
      sessions: sessions.data,
      hasMore: sessions.has_more,
    })
  },
})
