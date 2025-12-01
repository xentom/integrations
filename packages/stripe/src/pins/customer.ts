import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from './common'

export const eventType = i.pins.data({
  description: 'The type of customer event to trigger on.',
  control: i.controls.select({
    options: [
      {
        label: 'Created',
        value: 'created',
      },
      {
        label: 'Updated',
        value: 'updated',
      },
      {
        label: 'Deleted',
        value: 'deleted',
      },
    ],
    defaultValue: 'created',
  } as const),
})

export const id = common.id.with({
  displayName: 'Customer ID',
  description: 'The unique identifier for the customer.',
  control: i.controls.select({
    async options({ state }) {
      const customers = await state.stripe.customers.list({
        limit: 100,
      })

      return customers.data.map((customer) => ({
        value: customer.id,
        label: customer.name || customer.email || customer.id,
        suffix: customer.id,
      }))
    },
  }),
  schema: v.pipe(v.string(), v.startsWith('cus_')),
})

export const email = common.email.with({
  description: "The customer's email address.",
})

export const name = common.name.with({
  description: "The customer's full name or business name.",
})

export const phone = common.phone.with({
  description: "The customer's phone number.",
})

export const description = common.description.with({
  description: 'An arbitrary string attached to the customer.',
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the customer.',
})

export const address = i.pins.data({
  description: "The customer's address.",
  schema: v.object({
    line1: v.optional(v.string()),
    line2: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    postal_code: v.optional(v.string()),
    country: v.optional(v.string()),
  }),
  control: i.controls.expression({
    defaultValue: {
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94102',
      country: 'US',
    },
  }),
})
