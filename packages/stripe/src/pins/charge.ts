import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from './common'

export const eventType = i.pins.data({
  description: 'The type of charge event to trigger on.',
  control: i.controls.select({
    options: [
      { label: 'Captured', value: 'captured' },
      { label: 'Expired', value: 'expired' },
      { label: 'Failed', value: 'failed' },
      { label: 'Pending', value: 'pending' },
      { label: 'Refunded', value: 'refunded' },
      { label: 'Succeeded', value: 'succeeded' },
      { label: 'Updated', value: 'updated' },
    ],
    defaultValue: 'succeeded',
  } as const),
})

export const id = common.id.with({
  displayName: 'Charge ID',
  description: 'The unique identifier for the charge.',
  control: i.controls.select({
    async options({ state }) {
      const charges = await state.stripe.charges.list({
        limit: 100,
      })

      return charges.data.map((charge) => ({
        value: charge.id,
        label: `${charge.amount / 100} ${charge.currency.toUpperCase()}`,
        suffix: charge.status,
      }))
    },
  }),
  schema: v.pipe(v.string(), v.startsWith('ch_')),
})

export const amount = common.amount.with({
  description:
    'Amount intended to be collected by this charge in the smallest currency unit.',
})

export const currency = common.currency.with({
  description: 'Three-letter ISO currency code for the charge.',
})

export const source = i.pins.data({
  description:
    'A payment source to charge. Can be a token ID, source ID, or card ID.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'tok_... or src_... or card_...',
  }),
})

export const description = common.description.with({
  description: 'An arbitrary string attached to the charge.',
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the charge.',
})

export const receiptEmail = common.email.with({
  displayName: 'Receipt Email',
  description:
    'The email address to send the receipt to. Overrides customer email if set.',
})

export const capture = i.pins.data({
  description:
    'Whether to immediately capture the charge. If false, the charge is an authorization.',
  schema: v.boolean(),
  control: i.controls.switch(),
})

export const statementDescriptor = i.pins.data({
  description:
    'Extra information about the charge to appear on the customer statement.',
  schema: v.pipe(v.string(), v.maxLength(22)),
  control: i.controls.text({
    placeholder: 'Up to 22 characters',
  }),
})
