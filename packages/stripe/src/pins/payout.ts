import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from './common'

export const eventType = i.pins.data({
  description: 'The type of payout event to trigger on.',
  control: i.controls.select({
    options: [
      { label: 'Created', value: 'created' },
      { label: 'Updated', value: 'updated' },
      { label: 'Canceled', value: 'canceled' },
      { label: 'Failed', value: 'failed' },
      { label: 'Paid', value: 'paid' },
      { label: 'Reconciliation Completed', value: 'reconciliation_completed' },
    ],
    defaultValue: 'created',
  } as const),
})

export const id = common.id.with({
  displayName: 'Payout ID',
  description: 'The unique identifier for the payout.',
  control: i.controls.select({
    async options({ state }) {
      const payouts = await state.stripe.payouts.list({
        limit: 100,
      })

      return payouts.data.map((payout) => ({
        value: payout.id,
        label: `${payout.amount / 100} ${payout.currency.toUpperCase()}`,
        suffix: payout.status,
      }))
    },
  }),
  schema: v.pipe(v.string(), v.startsWith('po_')),
})

export const amount = common.amount.with({
  description: 'A positive integer in the smallest currency unit.',
})

export const currency = common.currency.with({
  description: 'Three-letter ISO currency code for the payout.',
})

export const description = common.description.with({
  description: 'An arbitrary string attached to the payout.',
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the payout.',
})

export const destination = i.pins.data({
  description:
    'The ID of a bank account or card to send the payout to. Defaults to the default external account.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'ba_... or card_...',
  }),
})

export const method = i.pins.data({
  description: 'The method used to send the payout.',
  schema: v.picklist(['standard', 'instant']),
  control: i.controls.select({
    options: [
      { value: 'standard', label: 'Standard' },
      { value: 'instant', label: 'Instant' },
    ],
    defaultValue: 'standard',
  }),
})

export const sourceType = i.pins.data({
  displayName: 'Source Type',
  description: 'The balance type of the source of the payout.',
  schema: v.picklist(['bank_account', 'card', 'fpx']),
  control: i.controls.select({
    options: [
      { value: 'bank_account', label: 'Bank Account' },
      { value: 'card', label: 'Card' },
      { value: 'fpx', label: 'FPX' },
    ],
  }),
})

export const statementDescriptor = i.pins.data({
  displayName: 'Statement Descriptor',
  description: 'A string to display on the bank statement for this payout.',
  schema: v.pipe(v.string(), v.maxLength(22)),
  control: i.controls.text({
    placeholder: 'Up to 22 characters',
  }),
})

export const status = i.pins.data({
  description: 'Filter payouts by status.',
  schema: v.picklist(['pending', 'paid', 'failed', 'canceled']),
  control: i.controls.select({
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'paid', label: 'Paid' },
      { value: 'failed', label: 'Failed' },
      { value: 'canceled', label: 'Canceled' },
    ],
  }),
})

export const arrivalDate = i.pins.data({
  displayName: 'Arrival Date',
  description: 'Filter payouts by estimated arrival date (Unix timestamp).',
  schema: v.pipe(v.number(), v.integer()),
  control: i.controls.expression(),
})
