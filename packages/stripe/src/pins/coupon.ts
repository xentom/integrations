import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from './common'

export const eventType = i.pins.data({
  description: 'The type of coupon event to trigger on.',
  control: i.controls.select({
    options: [
      { label: 'Created', value: 'created' },
      { label: 'Updated', value: 'updated' },
      { label: 'Deleted', value: 'deleted' },
    ],
    defaultValue: 'created',
  } as const),
})

export const id = i.pins.data({
  displayName: 'Coupon ID',
  description: 'The unique identifier for the coupon.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.select({
    async options({ state }) {
      const coupons = await state.stripe.coupons.list({
        limit: 100,
      })

      return coupons.data.map((coupon) => ({
        value: coupon.id,
        label: coupon.name || coupon.id,
        suffix: coupon.id,
      }))
    },
  }),
})

export const name = common.name.with({
  description: 'Name of the coupon displayed to customers.',
})

export const percentOff = i.pins.data({
  displayName: 'Percent Off',
  description:
    'A positive float larger than 0, and smaller or equal to 100, that represents the discount the coupon will apply.',
  schema: v.pipe(v.number(), v.minValue(0.01), v.maxValue(100)),
  control: i.controls.expression(),
})

export const amountOff = i.pins.data({
  displayName: 'Amount Off',
  description:
    'A positive integer representing the amount to subtract from an invoice total in the smallest currency unit.',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.expression(),
})

export const currency = common.currency.with({
  description: 'Three-letter ISO currency code. Required if amount_off is set.',
})

export const duration = i.pins.data({
  description: 'Specifies how long the discount will be in effect.',
  schema: v.picklist(['forever', 'once', 'repeating']),
  control: i.controls.select({
    options: [
      { value: 'forever', label: 'Forever' },
      { value: 'once', label: 'Once' },
      { value: 'repeating', label: 'Repeating' },
    ],
    defaultValue: 'once',
  }),
})

export const durationInMonths = i.pins.data({
  displayName: 'Duration in Months',
  description:
    'Number of months the coupon applies. Required if duration is repeating.',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.expression(),
})

export const maxRedemptions = i.pins.data({
  displayName: 'Max Redemptions',
  description: 'Maximum number of times this coupon can be redeemed in total.',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.expression(),
})

export const redeemBy = i.pins.data({
  displayName: 'Redeem By',
  description: 'Date after which the coupon can no longer be redeemed.',
  schema: v.pipe(v.number(), v.integer()),
  control: i.controls.expression(),
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the coupon.',
})
