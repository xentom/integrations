import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from './common'

export const id = common.id.with({
  displayName: 'Subscription ID',
  description: 'The unique identifier for the subscription.',
  control: i.controls.text({
    placeholder: 'sub_...',
  }),
  schema: v.pipe(v.string(), v.startsWith('sub_')),
})

export const customerId = i.pins.data({
  displayName: 'Customer ID',
  description: 'The ID of the customer for this subscription.',
  schema: v.pipe(v.string(), v.startsWith('cus_')),
  control: i.controls.select({
    async options({ state }) {
      const response = await state.stripe.customers.list({ limit: 100 })
      return response.data.map((customer) => ({
        value: customer.id,
        label: customer.name || customer.email || customer.id,
        suffix: customer.id,
      }))
    },
  }),
})

export const priceId = i.pins.data({
  displayName: 'Price ID',
  description: 'The ID of the price the customer is subscribed to.',
  schema: v.pipe(v.string(), v.startsWith('price_')),
  control: i.controls.select({
    async options({ state }) {
      const response = await state.stripe.prices.list({
        limit: 100,
        expand: ['data.product'],
      })
      return response.data
        .filter((price) => price.recurring)
        .map((price) => {
          const productName =
            typeof price.product === 'object' && 'name' in price.product
              ? price.product.name
              : price.product
          return {
            value: price.id,
            label: `${productName} - ${price.unit_amount ? price.unit_amount / 100 : 0} ${price.currency.toUpperCase()}/${price.recurring?.interval}`,
            suffix: price.id,
          }
        })
    },
  }),
})

export const description = common.description.with({
  description: 'An arbitrary string attached to the subscription.',
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the subscription.',
})

export const collectionMethod = i.pins.data({
  description: 'How to collect payments for this subscription.',
  schema: v.picklist(['charge_automatically', 'send_invoice']),
  control: i.controls.select({
    options: [
      { value: 'charge_automatically', label: 'Charge Automatically' },
      { value: 'send_invoice', label: 'Send Invoice' },
    ],
  }),
})

export const cancelAtPeriodEnd = i.pins.data({
  description:
    'If true, the subscription will be canceled at the end of the current billing period.',
  schema: v.boolean(),
  control: i.controls.switch(),
})

export const trialPeriodDays = i.pins.data({
  description: 'Number of trial period days granted when subscribing.',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.expression(),
})
