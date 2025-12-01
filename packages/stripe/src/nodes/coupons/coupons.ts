import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Coupons')

export const onCoupon = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      eventType: pins.coupon.eventType.with({
        displayName: 'When',
      }),
    }

    type Event = Extract<Stripe.Event, { type: `coupon.${I['eventType']}` }>

    return nodes.trigger({
      description: 'Triggered when a coupon event is received.',
      inputs,
      outputs: {
        coupon: i.pins.data<Event['data']['object']>(),
      },
      async subscribe(opts) {
        function onCouponEvent(event: Stripe.Event) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            coupon: event.data.object,
          } as any)
        }

        opts.state.events.on(`coupon.${opts.inputs.eventType}`, onCouponEvent)

        return () => {
          opts.state.events.off(
            `coupon.${opts.inputs.eventType}`,
            onCouponEvent,
          )
        }
      },
    })
  },
)

export const createCoupon = nodes.callable({
  description: 'Create a new coupon for discounts.',
  inputs: {
    name: pins.coupon.name.with({
      description: 'Name of the coupon displayed to customers.',
      optional: true,
    }),
    percentOff: pins.coupon.percentOff.with({
      description: 'Percentage discount (use either percentOff or amountOff).',
      optional: true,
    }),
    amountOff: pins.coupon.amountOff.with({
      description:
        'Amount to discount in smallest currency unit (use either percentOff or amountOff).',
      optional: true,
    }),
    currency: pins.coupon.currency.with({
      description: 'Currency for amount_off. Required if amount_off is set.',
      optional: true,
    }),
    duration: pins.coupon.duration.with({
      description: 'How long the discount will be in effect.',
      optional: true,
    }),
    durationInMonths: pins.coupon.durationInMonths.with({
      description:
        'Months the coupon applies. Required if duration is repeating.',
      optional: true,
    }),
    maxRedemptions: pins.coupon.maxRedemptions.with({
      description: 'Maximum number of times this coupon can be redeemed.',
      optional: true,
    }),
    redeemBy: pins.coupon.redeemBy.with({
      description: 'Unix timestamp after which the coupon cannot be redeemed.',
      optional: true,
    }),
    metadata: pins.coupon.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    coupon: i.pins.data<Stripe.Coupon>({
      description: 'The created coupon object.',
    }),
  },
  async run(opts) {
    const coupon = await opts.state.stripe.coupons.create({
      name: opts.inputs.name,
      percent_off: opts.inputs.percentOff,
      amount_off: opts.inputs.amountOff,
      currency: opts.inputs.currency,
      duration: opts.inputs.duration,
      duration_in_months: opts.inputs.durationInMonths,
      max_redemptions: opts.inputs.maxRedemptions,
      redeem_by: opts.inputs.redeemBy,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      coupon,
    })
  },
})

export const getCoupon = nodes.callable({
  description: 'Retrieve a coupon by its ID.',
  inputs: {
    id: pins.coupon.id.with({
      description: 'The ID of the coupon to retrieve.',
    }),
  },
  outputs: {
    coupon: i.pins.data<Stripe.Coupon>({
      description: 'The retrieved coupon object.',
    }),
  },
  async run(opts) {
    const coupon = await opts.state.stripe.coupons.retrieve(opts.inputs.id)

    return opts.next({
      coupon,
    })
  },
})

export const updateCoupon = nodes.callable({
  description: 'Update an existing coupon.',
  inputs: {
    id: pins.coupon.id.with({
      description: 'The ID of the coupon to update.',
    }),
    name: pins.coupon.name.with({
      description: 'Updated name for the coupon.',
      optional: true,
    }),
    metadata: pins.coupon.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    coupon: i.pins.data<Stripe.Coupon>({
      description: 'The updated coupon object.',
    }),
  },
  async run(opts) {
    const coupon = await opts.state.stripe.coupons.update(opts.inputs.id, {
      name: opts.inputs.name,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      coupon,
    })
  },
})

export const deleteCoupon = nodes.callable({
  description: 'Delete a coupon. Cannot be undone.',
  inputs: {
    id: pins.coupon.id.with({
      description: 'The ID of the coupon to delete.',
    }),
  },
  outputs: {
    deleted: i.pins.data<boolean>({
      description: 'Whether the coupon was successfully deleted.',
    }),
  },
  async run(opts) {
    const result = await opts.state.stripe.coupons.del(opts.inputs.id)

    return opts.next({
      deleted: result.deleted,
    })
  },
})

export const listCoupons = nodes.callable({
  description: 'List all coupons in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of coupons to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch coupons that come after the given ID.',
      optional: true,
    }),
  },
  outputs: {
    coupons: i.pins.data<Stripe.Coupon[]>({
      description: 'List of coupon objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more coupons available.',
    }),
  },
  async run(opts) {
    const coupons = await opts.state.stripe.coupons.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
    })

    return opts.next({
      coupons: coupons.data,
      hasMore: coupons.has_more,
    })
  },
})
