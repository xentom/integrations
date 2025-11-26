import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from './common'

export const id = common.id.with({
  displayName: 'Price ID',
  description: 'The unique identifier for the price.',
  control: i.controls.select({
    async options({ state }) {
      const response = await state.stripe.prices.list({
        limit: 100,
        expand: ['data.product'],
      })
      return response.data.map((price) => {
        const productName =
          typeof price.product === 'object' && 'name' in price.product
            ? price.product.name
            : price.product
        return {
          value: price.id,
          label: `${productName} - ${price.unit_amount ? price.unit_amount / 100 : 0} ${price.currency.toUpperCase()}`,
          suffix: price.id,
        }
      })
    },
  }),
  schema: v.pipe(v.string(), v.startsWith('price_')),
})

export const unitAmount = i.pins.data({
  description:
    'The unit amount in the smallest currency unit (e.g., cents for USD).',
  schema: v.pipe(v.number(), v.integer(), v.minValue(0)),
  control: i.controls.expression(),
})

export const currency = common.currency.with({
  description: 'Three-letter ISO currency code for the price.',
})

export const recurring = i.pins.data({
  description: 'The recurring components of a price such as interval.',
  schema: v.object({
    interval: v.picklist(['day', 'week', 'month', 'year']),
    interval_count: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
  }),
  control: i.controls.expression({
    defaultValue: {
      interval: 'month' as const,
      interval_count: 1,
    },
  }),
})

export const billingScheme = i.pins.data({
  description: 'Describes how to compute the price per period.',
  schema: v.picklist(['per_unit', 'tiered']),
  control: i.controls.select({
    options: [
      { value: 'per_unit', label: 'Per Unit' },
      { value: 'tiered', label: 'Tiered' },
    ],
  }),
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the price.',
})
