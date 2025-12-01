import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { getPagination } from '@/utils/pagination'
import * as common from './common'

export const eventType = i.pins.data({
  description: 'The type of invoice event to trigger on.',
  control: i.controls.select({
    options: [
      { label: 'Created', value: 'created' },
      { label: 'Updated', value: 'updated' },
      { label: 'Deleted', value: 'deleted' },
      { label: 'Finalized', value: 'finalized' },
      { label: 'Paid', value: 'paid' },
      { label: 'Payment Failed', value: 'payment_failed' },
      { label: 'Payment Succeeded', value: 'payment_succeeded' },
      { label: 'Sent', value: 'sent' },
      { label: 'Voided', value: 'voided' },
    ],
    defaultValue: 'created',
  } as const),
})

export const id = common.id.with({
  displayName: 'Invoice ID',
  description: 'The unique identifier for the invoice.',
  control: i.controls.select({
    async options({ state, pagination, search }) {
      const invoices = search
        ? await state.stripe.invoices.search({
            ...getPagination(pagination),
            query: `number~"${search}"`,
          })
        : await state.stripe.invoices.list({
            ...getPagination(pagination),
          })

      return {
        hasMore: invoices.has_more,
        items: invoices.data.map((invoice) => ({
          value: invoice.id,
          label: invoice.number ?? invoice.id,
          suffix: invoice.status ?? undefined,
        })),
      }
    },
  }),
  schema: v.pipe(v.string(), v.startsWith('in_')),
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
