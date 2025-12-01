import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import type Stripe from 'stripe'

import * as common from './common'

export const eventType = i.pins.data({
  description: 'The type of refund event to trigger on.',
  control: i.controls.select({
    options: [
      { label: 'Created', value: 'created' },
      { label: 'Updated', value: 'updated' },
      { label: 'Failed', value: 'failed' },
    ],
    defaultValue: 'created',
  } as const),
})

export const id = common.id.with({
  displayName: 'Refund ID',
  description: 'The unique identifier for the refund.',
  control: i.controls.select({
    async options({ state }) {
      const refunds = await state.stripe.refunds.list({
        limit: 100,
      })

      return refunds.data.map((refund) => ({
        value: refund.id,
        label: `${refund.amount / 100} ${refund.currency.toUpperCase()}`,
        suffix: refund.status ?? undefined,
      }))
    },
  }),
  schema: v.pipe(v.string(), v.startsWith('re_')),
})

export const amount = common.amount.with({
  description:
    'Amount to refund in the smallest currency unit. Defaults to the full charge amount.',
})

export const reason = i.pins.data<Stripe.RefundCreateParams.Reason>({
  description: 'Reason for the refund.',
  schema: v.picklist(['duplicate', 'fraudulent', 'requested_by_customer']),
  control: i.controls.select({
    options: [
      { value: 'duplicate', label: 'Duplicate' },
      { value: 'fraudulent', label: 'Fraudulent' },
      { value: 'requested_by_customer', label: 'Requested by Customer' },
    ],
  }),
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the refund.',
})

export const instructionsEmail = i.pins.data({
  displayName: 'Instructions Email',
  description:
    'For payment methods that require customer action, this email will be sent with refund instructions.',
  schema: v.pipe(v.string(), v.email()),
  control: i.controls.text({
    placeholder: 'customer@example.com',
  }),
})

export const refundApplicationFee = i.pins.data({
  displayName: 'Refund Application Fee',
  description:
    'Whether the application fee should be refunded when refunding this charge.',
  schema: v.boolean(),
  control: i.controls.switch(),
})

export const reverseTransfer = i.pins.data({
  displayName: 'Reverse Transfer',
  description:
    'Whether the transfer should be reversed when refunding this charge.',
  schema: v.boolean(),
  control: i.controls.switch(),
})
