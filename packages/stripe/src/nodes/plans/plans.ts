import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Plans')

export const onPlan = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      eventType: pins.plan.eventType.with({
        displayName: 'When',
      }),
    }

    type Event = Extract<Stripe.Event, { type: `plan.${I['eventType']}` }>

    return nodes.trigger({
      description: 'Triggered when a plan event is received.',
      inputs,
      outputs: {
        plan: i.pins.data<Event['data']['object']>(),
      },
      async subscribe(opts) {
        function onPlanEvent(event: Stripe.Event) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            plan: event.data.object,
          } as any)
        }

        opts.state.events.on(`plan.${opts.inputs.eventType}`, onPlanEvent)

        return () => {
          opts.state.events.off(`plan.${opts.inputs.eventType}`, onPlanEvent)
        }
      },
    })
  },
)

export const createPlan = nodes.callable({
  description:
    'Create a new plan for recurring billing. Plans define the base price, currency, and billing cycle.',
  inputs: {
    productId: pins.plan.productId.with({
      description: 'The product whose pricing the plan determines.',
    }),
    nickname: pins.plan.nickname.with({
      description: 'A brief description of the plan.',
      optional: true,
    }),
    amount: pins.plan.amount.with({
      description: 'The unit amount in the smallest currency unit.',
    }),
    currency: pins.plan.currency.with({
      description: 'Three-letter ISO currency code.',
    }),
    interval: pins.plan.interval.with({
      description: 'The frequency at which a subscription is billed.',
    }),
    intervalCount: pins.plan.intervalCount.with({
      description: 'The number of intervals between billings.',
      optional: true,
    }),
    trialPeriodDays: pins.plan.trialPeriodDays.with({
      description: 'Default number of trial days.',
      optional: true,
    }),
    usageType: pins.plan.usageType.with({
      description: 'How the quantity per period should be determined.',
      optional: true,
    }),
    billingScheme: pins.plan.billingScheme.with({
      description: 'Describes how to compute the price per period.',
      optional: true,
    }),
    active: pins.plan.active.with({
      description: 'Whether the plan can be used for new purchases.',
      optional: true,
    }),
    metadata: pins.plan.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    plan: i.pins.data<Stripe.Plan>({
      description: 'The created plan object.',
    }),
  },
  async run(opts) {
    const plan = await opts.state.stripe.plans.create({
      product: opts.inputs.productId,
      nickname: opts.inputs.nickname,
      amount: opts.inputs.amount,
      currency: opts.inputs.currency,
      interval: opts.inputs.interval,
      interval_count: opts.inputs.intervalCount,
      trial_period_days: opts.inputs.trialPeriodDays,
      usage_type: opts.inputs.usageType,
      billing_scheme: opts.inputs.billingScheme,
      active: opts.inputs.active,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      plan,
    })
  },
})

export const getPlan = nodes.callable({
  description: 'Retrieve a plan by its ID.',
  inputs: {
    id: pins.plan.id.with({
      description: 'The ID of the plan to retrieve.',
    }),
  },
  outputs: {
    plan: i.pins.data<Stripe.Plan>({
      description: 'The retrieved plan object.',
    }),
  },
  async run(opts) {
    const plan = await opts.state.stripe.plans.retrieve(opts.inputs.id)

    return opts.next({
      plan,
    })
  },
})

export const updatePlan = nodes.callable({
  description: 'Update an existing plan.',
  inputs: {
    id: pins.plan.id.with({
      description: 'The ID of the plan to update.',
    }),
    nickname: pins.plan.nickname.with({
      description: 'Updated nickname for the plan.',
      optional: true,
    }),
    active: pins.plan.active.with({
      description: 'Whether the plan can be used for new purchases.',
      optional: true,
    }),
    trialPeriodDays: pins.plan.trialPeriodDays.with({
      description: 'Updated number of trial days.',
      optional: true,
    }),
    metadata: pins.plan.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    plan: i.pins.data<Stripe.Plan>({
      description: 'The updated plan object.',
    }),
  },
  async run(opts) {
    const plan = await opts.state.stripe.plans.update(opts.inputs.id, {
      nickname: opts.inputs.nickname,
      active: opts.inputs.active,
      trial_period_days: opts.inputs.trialPeriodDays,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      plan,
    })
  },
})

export const deletePlan = nodes.callable({
  description: 'Delete a plan. Existing subscriptions will remain unaffected.',
  inputs: {
    id: pins.plan.id.with({
      description: 'The ID of the plan to delete.',
    }),
  },
  outputs: {
    deleted: i.pins.data<boolean>({
      description: 'Whether the plan was successfully deleted.',
    }),
  },
  async run(opts) {
    const result = await opts.state.stripe.plans.del(opts.inputs.id)

    return opts.next({
      deleted: result.deleted,
    })
  },
})

export const listPlans = nodes.callable({
  description: 'List all plans in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of plans to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch plans that come after the given ID.',
      optional: true,
    }),
    productId: pins.plan.productId.with({
      description: 'Filter plans by product ID.',
      optional: true,
    }),
    active: pins.plan.active.with({
      description: 'Filter by whether the plan is active.',
      optional: true,
    }),
  },
  outputs: {
    plans: i.pins.data<Stripe.Plan[]>({
      description: 'List of plan objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more plans available.',
    }),
  },
  async run(opts) {
    const plans = await opts.state.stripe.plans.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
      product: opts.inputs.productId,
      active: opts.inputs.active,
    })

    return opts.next({
      plans: plans.data,
      hasMore: plans.has_more,
    })
  },
})
