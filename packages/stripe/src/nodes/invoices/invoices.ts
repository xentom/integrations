import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Invoices')

export const onInvoice = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      eventType: pins.invoice.eventType.with({
        displayName: 'When',
      }),
    }

    type Event = Extract<Stripe.Event, { type: `invoice.${I['eventType']}` }>

    return nodes.trigger({
      description: 'Triggered when an invoice event is received.',
      inputs,
      outputs: {
        invoice: i.pins.data<Event['data']['object']>(),
      },
      async subscribe(opts) {
        function onInvoiceEvent(event: Stripe.Event) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            invoice: event.data.object,
          } as any)
        }

        opts.state.events.on(`invoice.${opts.inputs.eventType}`, onInvoiceEvent)

        return () => {
          opts.state.events.off(
            `invoice.${opts.inputs.eventType}`,
            onInvoiceEvent,
          )
        }
      },
    })
  },
)

export const createInvoice = nodes.callable({
  description: 'Create a new invoice for a customer.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer to invoice.',
    }),
    description: pins.invoice.description.with({
      description: 'An arbitrary string attached to the invoice.',
      optional: true,
    }),
    collectionMethod: pins.invoice.collectionMethod.with({
      description: 'How to collect payment for this invoice.',
      optional: true,
    }),
    daysUntilDue: pins.invoice.daysUntilDue.with({
      description: 'Days until the invoice is due (for send_invoice method).',
      optional: true,
    }),
    footer: pins.invoice.footer.with({
      description: 'Footer to be displayed on the invoice.',
      optional: true,
    }),
    metadata: pins.invoice.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    invoice: i.pins.data<Stripe.Invoice>({
      description: 'The created invoice object.',
    }),
  },
  async run(opts) {
    const invoice = await opts.state.stripe.invoices.create({
      customer: opts.inputs.customerId,
      description: opts.inputs.description,
      collection_method: opts.inputs.collectionMethod,
      days_until_due: opts.inputs.daysUntilDue,
      footer: opts.inputs.footer,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      invoice,
    })
  },
})

export const getInvoice = nodes.callable({
  description: 'Retrieve an invoice by its ID.',
  inputs: {
    id: pins.invoice.id.with({
      description: 'The ID of the invoice to retrieve.',
    }),
  },
  outputs: {
    invoice: i.pins.data<Stripe.Invoice>({
      description: 'The retrieved invoice object.',
    }),
  },
  async run(opts) {
    const invoice = await opts.state.stripe.invoices.retrieve(opts.inputs.id)

    return opts.next({
      invoice,
    })
  },
})

export const updateInvoice = nodes.callable({
  description: 'Update an existing draft invoice.',
  inputs: {
    id: pins.invoice.id.with({
      description: 'The ID of the invoice to update.',
    }),
    description: pins.invoice.description.with({
      description: 'Updated description.',
      optional: true,
    }),
    footer: pins.invoice.footer.with({
      description: 'Updated footer text.',
      optional: true,
    }),
    metadata: pins.invoice.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    invoice: i.pins.data<Stripe.Invoice>({
      description: 'The updated invoice object.',
    }),
  },
  async run(opts) {
    const invoice = await opts.state.stripe.invoices.update(opts.inputs.id, {
      description: opts.inputs.description,
      footer: opts.inputs.footer,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      invoice,
    })
  },
})

export const finalizeInvoice = nodes.callable({
  description: 'Finalize a draft invoice to make it ready for payment.',
  inputs: {
    id: pins.invoice.id.with({
      description: 'The ID of the invoice to finalize.',
    }),
  },
  outputs: {
    invoice: i.pins.data<Stripe.Invoice>({
      description: 'The finalized invoice object.',
    }),
  },
  async run(opts) {
    const invoice = await opts.state.stripe.invoices.finalizeInvoice(
      opts.inputs.id,
    )

    return opts.next({
      invoice,
    })
  },
})

export const payInvoice = nodes.callable({
  description: 'Pay an open invoice.',
  inputs: {
    id: pins.invoice.id.with({
      description: 'The ID of the invoice to pay.',
    }),
  },
  outputs: {
    invoice: i.pins.data<Stripe.Invoice>({
      description: 'The paid invoice object.',
    }),
  },
  async run(opts) {
    const invoice = await opts.state.stripe.invoices.pay(opts.inputs.id)

    return opts.next({
      invoice,
    })
  },
})

export const sendInvoice = nodes.callable({
  description: 'Send an invoice to the customer by email.',
  inputs: {
    id: pins.invoice.id.with({
      description: 'The ID of the invoice to send.',
    }),
  },
  outputs: {
    invoice: i.pins.data<Stripe.Invoice>({
      description: 'The sent invoice object.',
    }),
  },
  async run(opts) {
    const invoice = await opts.state.stripe.invoices.sendInvoice(opts.inputs.id)

    return opts.next({
      invoice,
    })
  },
})

export const voidInvoice = nodes.callable({
  description: 'Void an invoice. This marks it as uncollectable.',
  inputs: {
    id: pins.invoice.id.with({
      description: 'The ID of the invoice to void.',
    }),
  },
  outputs: {
    invoice: i.pins.data<Stripe.Invoice>({
      description: 'The voided invoice object.',
    }),
  },
  async run(opts) {
    const invoice = await opts.state.stripe.invoices.voidInvoice(opts.inputs.id)

    return opts.next({
      invoice,
    })
  },
})

export const listInvoices = nodes.callable({
  description: 'List all invoices in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of invoices to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch invoices that come after the given ID.',
      optional: true,
    }),
    customerId: pins.customer.id.with({
      description: 'Filter invoices by customer ID.',
      optional: true,
    }),
    status: i.pins.data({
      description: 'Filter invoices by status.',
      schema: v.picklist(['draft', 'open', 'paid', 'uncollectible', 'void']),
      control: i.controls.select({
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'open', label: 'Open' },
          { value: 'paid', label: 'Paid' },
          { value: 'uncollectible', label: 'Uncollectible' },
          { value: 'void', label: 'Void' },
        ],
      }),
      optional: true,
    }),
  },
  outputs: {
    invoices: i.pins.data<Stripe.Invoice[]>({
      description: 'List of invoice objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more invoices available.',
    }),
  },
  async run(opts) {
    const invoices = await opts.state.stripe.invoices.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
      customer: opts.inputs.customerId,
      status: opts.inputs.status as Stripe.InvoiceListParams.Status | undefined,
    })

    return opts.next({
      invoices: invoices.data,
      hasMore: invoices.has_more,
    })
  },
})
