import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Subscriptions')

export const onSubscription = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      eventType: pins.subscription.eventType.with({
        displayName: 'When',
      }),
    }

    type Event = Extract<
      Stripe.Event,
      { type: `customer.subscription.${I['eventType']}` }
    >

    return nodes.trigger({
      description: 'Triggered when a subscription event is received.',
      inputs,
      outputs: {
        subscription: i.pins.data<Event['data']['object']>(),
      },
      async subscribe(opts) {
        function onSubscriptionEvent(event: Stripe.Event) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            subscription: event.data.object,
          } as any)
        }

        opts.state.events.on(
          `customer.subscription.${opts.inputs.eventType}`,
          onSubscriptionEvent,
        )

        return () => {
          opts.state.events.off(
            `customer.subscription.${opts.inputs.eventType}`,
            onSubscriptionEvent,
          )
        }
      },
    })
  },
)

export const createSubscription = nodes.callable({
  description: 'Create a new subscription for a customer.',
  inputs: {
    customerId: pins.customer.id.with({
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

    return opts.next({
      subscription,
    })
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

    return opts.next({
      subscription,
    })
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

    return opts.next({
      subscription,
    })
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
    const subscription = opts.inputs.cancelAtPeriodEnd
      ? await opts.state.stripe.subscriptions.update(opts.inputs.id, {
          cancel_at_period_end: true,
        })
      : await opts.state.stripe.subscriptions.cancel(opts.inputs.id)

    return opts.next({
      subscription,
    })
  },
})

export const listSubscriptions = nodes.callable({
  description: 'List all subscriptions in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of subscriptions to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch subscriptions that come after the given ID.',
      optional: true,
    }),
    customerId: pins.customer.id.with({
      description: 'Filter subscriptions by customer ID.',
      optional: true,
    }),
    status: pins.subscription.status.with({
      description: 'Filter subscriptions by status.',
      optional: true,
    }),
  },
  outputs: {
    subscriptions: i.pins.data<Stripe.Subscription[]>({
      description: 'List of subscription objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more subscriptions available.',
      optional: true,
    }),
  },
  async run(opts) {
    const subscriptions = await opts.state.stripe.subscriptions.list({
      // Pagination
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,

      // Filters
      customer: opts.inputs.customerId,
      status: opts.inputs.status,
    })

    return opts.next({
      subscriptions: subscriptions.data,
      hasMore: subscriptions.has_more,
    })
  },
})
