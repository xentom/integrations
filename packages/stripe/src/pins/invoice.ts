import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from './common'

export const id = common.id.with({
  displayName: 'Invoice ID',
  description: 'The unique identifier for the invoice.',
  control: i.controls.text({
    placeholder: 'in_...',
  }),
  schema: v.pipe(v.string(), v.startsWith('in_')),
})

export const customerId = i.pins.data({
  displayName: 'Customer ID',
  description: 'The ID of the customer for this invoice.',
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

export const description = common.description.with({
  description: 'An arbitrary string attached to the invoice.',
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the invoice.',
})

export const collectionMethod = i.pins.data({
  description: 'How to collect payment for this invoice.',
  schema: v.picklist(['charge_automatically', 'send_invoice']),
  control: i.controls.select({
    options: [
      { value: 'charge_automatically', label: 'Charge Automatically' },
      { value: 'send_invoice', label: 'Send Invoice' },
    ],
  }),
})

export const daysUntilDue = i.pins.data({
  description:
    'The number of days from when the invoice is created until it is due.',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1)),
  control: i.controls.expression(),
})

export const footer = i.pins.data({
  description: 'Footer to be displayed on the invoice.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Thank you for your business!',
    rows: 2,
  }),
})
