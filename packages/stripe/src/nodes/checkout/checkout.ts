import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Checkout')

export const createCheckoutSession = nodes.callable({
  description: 'Create a new Stripe Checkout session for collecting payments.',
  inputs: {
    mode: pins.checkoutSession.mode.with({
      description: 'The mode of the Checkout Session.',
    }),
    successUrl: pins.checkoutSession.successUrl.with({
      description: 'URL to redirect after successful checkout.',
    }),
    cancelUrl: pins.checkoutSession.cancelUrl.with({
      description: 'URL to redirect when checkout is canceled.',
    }),
    lineItems: pins.checkoutSession.lineItems.with({
      description: 'List of items the customer is purchasing.',
    }),
    customerId: pins.checkoutSession.customerId.with({
      description: 'ID of an existing customer.',
      optional: true,
    }),
    customerEmail: pins.checkoutSession.customerEmail.with({
      description: 'Email for a new customer.',
      optional: true,
    }),
    allowPromotionCodes: pins.checkoutSession.allowPromotionCodes.with({
      description: 'Allow customer to enter promotion codes.',
      optional: true,
    }),
    metadata: pins.checkoutSession.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    session: i.pins.data<Stripe.Checkout.Session>({
      description: 'The created checkout session object.',
    }),
    url: i.pins.data<string>({
      displayName: 'Checkout URL',
      description: 'The URL to redirect the customer to for payment.',
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
      url: session.url || '',
    })
  },
})

export const getCheckoutSession = nodes.callable({
  description: 'Retrieve a Checkout Session by its ID.',
  inputs: {
    id: pins.checkoutSession.id.with({
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
    return opts.next({ session })
  },
})

export const expireCheckoutSession = nodes.callable({
  description: 'Expire an open Checkout Session.',
  inputs: {
    id: pins.checkoutSession.id.with({
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
    return opts.next({ session })
  },
})

export const listCheckoutSessions = nodes.callable({
  description: 'List all Checkout Sessions in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of sessions to return (1-100).',
      optional: true,
    }),
    customerId: pins.checkoutSession.customerId.with({
      displayName: 'Customer ID',
      description: 'Filter sessions by customer ID.',
      optional: true,
    }),
  },
  outputs: {
    sessions: i.pins.data<Stripe.Checkout.Session[]>({
      description: 'List of checkout session objects.',
    }),
  },
  async run(opts) {
    const response = await opts.state.stripe.checkout.sessions.list({
      limit: opts.inputs.limit,
      customer: opts.inputs.customerId,
    })

    return opts.next({ sessions: response.data })
  },
})
