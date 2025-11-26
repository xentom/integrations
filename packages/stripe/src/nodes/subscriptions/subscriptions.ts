import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Subscriptions')

export const createSubscription = nodes.callable({
  description: 'Create a new subscription for a customer.',
  inputs: {
    customerId: pins.subscription.customerId.with({
      description: 'The ID of the customer to subscribe.',
    }),
    priceId: pins.subscription.priceId.with({
      description: 'The ID of the recurring price to subscribe to.',
    }),
    description: pins.subscription.description.with({
      description: 'An arbitrary string attached to the subscription.',
      optional: true,
    }),
    collectionMethod: pins.subscription.collectionMethod.with({
      description: 'How to collect payments for this subscription.',
      optional: true,
    }),
    trialPeriodDays: pins.subscription.trialPeriodDays.with({
      description: 'Number of trial period days.',
      optional: true,
    }),
    metadata: pins.subscription.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    subscription: i.pins.data<Stripe.Subscription>({
      description: 'The created subscription object.',
    }),
  },
  async run(opts) {
    const subscription = await opts.state.stripe.subscriptions.create({
      customer: opts.inputs.customerId,
      items: [{ price: opts.inputs.priceId }],
      description: opts.inputs.description,
      collection_method: opts.inputs.collectionMethod,
      trial_period_days: opts.inputs.trialPeriodDays,
      metadata: opts.inputs.metadata,
    })

    return opts.next({ subscription })
  },
})

export const getSubscription = nodes.callable({
  description: 'Retrieve a subscription by its ID.',
  inputs: {
    id: pins.subscription.id.with({
      description: 'The ID of the subscription to retrieve.',
    }),
  },
  outputs: {
    subscription: i.pins.data<Stripe.Subscription>({
      description: 'The retrieved subscription object.',
    }),
  },
  async run(opts) {
    const subscription = await opts.state.stripe.subscriptions.retrieve(
      opts.inputs.id,
    )
    return opts.next({ subscription })
  },
})

export const updateSubscription = nodes.callable({
  description: 'Update an existing subscription.',
  inputs: {
    id: pins.subscription.id.with({
      description: 'The ID of the subscription to update.',
    }),
    priceId: pins.subscription.priceId.with({
      description: 'The ID of the new price to switch to.',
      optional: true,
    }),
    description: pins.subscription.description.with({
      description: 'Updated description.',
      optional: true,
    }),
    cancelAtPeriodEnd: pins.subscription.cancelAtPeriodEnd.with({
      description: 'Cancel the subscription at the end of the period.',
      optional: true,
    }),
    metadata: pins.subscription.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    subscription: i.pins.data<Stripe.Subscription>({
      description: 'The updated subscription object.',
    }),
  },
  async run(opts) {
    const updateParams: Stripe.SubscriptionUpdateParams = {
      description: opts.inputs.description,
      cancel_at_period_end: opts.inputs.cancelAtPeriodEnd,
      metadata: opts.inputs.metadata,
    }

    if (opts.inputs.priceId) {
      const currentSubscription =
        await opts.state.stripe.subscriptions.retrieve(opts.inputs.id)
      const firstItem = currentSubscription.items.data[0]
      if (firstItem) {
        updateParams.items = [
          {
            id: firstItem.id,
            price: opts.inputs.priceId,
          },
        ]
      }
    }

    const subscription = await opts.state.stripe.subscriptions.update(
      opts.inputs.id,
      updateParams,
    )

    return opts.next({ subscription })
  },
})

export const cancelSubscription = nodes.callable({
  description: 'Cancel a subscription immediately or at period end.',
  inputs: {
    id: pins.subscription.id.with({
      description: 'The ID of the subscription to cancel.',
    }),
    cancelAtPeriodEnd: pins.subscription.cancelAtPeriodEnd.with({
      description:
        'If true, cancel at period end. If false, cancel immediately.',
      optional: true,
    }),
  },
  outputs: {
    subscription: i.pins.data<Stripe.Subscription>({
      description: 'The canceled subscription object.',
    }),
  },
  async run(opts) {
    let subscription: Stripe.Subscription

    if (opts.inputs.cancelAtPeriodEnd) {
      subscription = await opts.state.stripe.subscriptions.update(
        opts.inputs.id,
        {
          cancel_at_period_end: true,
        },
      )
    } else {
      subscription = await opts.state.stripe.subscriptions.cancel(
        opts.inputs.id,
      )
    }

    return opts.next({ subscription })
  },
})

export const listSubscriptions = nodes.callable({
  description: 'List all subscriptions in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of subscriptions to return (1-100).',
      optional: true,
    }),
    customerId: pins.subscription.customerId.with({
      description: 'Filter subscriptions by customer ID.',
      optional: true,
    }),
    status: i.pins.data({
      description: 'Filter subscriptions by status.',
      schema: v.picklist([
        'active',
        'past_due',
        'unpaid',
        'canceled',
        'incomplete',
        'incomplete_expired',
        'trialing',
        'paused',
        'all',
        'ended',
      ]),
      control: i.controls.select({
        options: [
          { value: 'active', label: 'Active' },
          { value: 'past_due', label: 'Past Due' },
          { value: 'unpaid', label: 'Unpaid' },
          { value: 'canceled', label: 'Canceled' },
          { value: 'incomplete', label: 'Incomplete' },
          { value: 'incomplete_expired', label: 'Incomplete Expired' },
          { value: 'trialing', label: 'Trialing' },
          { value: 'paused', label: 'Paused' },
          { value: 'all', label: 'All' },
          { value: 'ended', label: 'Ended' },
        ],
      }),
      optional: true,
    }),
  },
  outputs: {
    subscriptions: i.pins.data<Stripe.Subscription[]>({
      description: 'List of subscription objects.',
    }),
  },
  async run(opts) {
    const response = await opts.state.stripe.subscriptions.list({
      limit: opts.inputs.limit,
      customer: opts.inputs.customerId,
      status: opts.inputs.status as
        | Stripe.SubscriptionListParams.Status
        | undefined,
    })

    return opts.next({ subscriptions: response.data })
  },
})
