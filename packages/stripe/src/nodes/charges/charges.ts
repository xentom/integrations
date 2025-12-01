import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Charges')

export const onCharge = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      eventType: pins.charge.eventType.with({
        displayName: 'When',
      }),
    }

    type Event = Extract<Stripe.Event, { type: `charge.${I['eventType']}` }>

    return nodes.trigger({
      description: 'Triggered when a charge event is received.',
      inputs,
      outputs: {
        charge: i.pins.data<Event['data']['object']>(),
      },
      async subscribe(opts) {
        function onChargeEvent(event: Stripe.Event) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            charge: event.data.object,
          } as any)
        }

        opts.state.events.on(`charge.${opts.inputs.eventType}`, onChargeEvent)

        return () => {
          opts.state.events.off(
            `charge.${opts.inputs.eventType}`,
            onChargeEvent,
          )
        }
      },
    })
  },
)

export const createCharge = nodes.callable({
  description: 'Create a new charge to charge a payment source.',
  inputs: {
    amount: pins.charge.amount.with({
      description: 'Amount to charge in the smallest currency unit.',
    }),
    currency: pins.charge.currency.with({
      description: 'Three-letter ISO currency code.',
    }),
    customerId: pins.customer.id.with({
      description: 'The ID of the customer to charge.',
      optional: true,
    }),
    source: pins.charge.source.with({
      description: 'A payment source to charge.',
      optional: true,
    }),
    description: pins.charge.description.with({
      description: 'An arbitrary string attached to the charge.',
      optional: true,
    }),
    receiptEmail: pins.charge.receiptEmail.with({
      description: 'Email address to send the receipt to.',
      optional: true,
    }),
    capture: pins.charge.capture.with({
      description:
        'Whether to immediately capture the charge. Defaults to true.',
      optional: true,
    }),
    statementDescriptor: pins.charge.statementDescriptor.with({
      description: 'Statement descriptor for the charge.',
      optional: true,
    }),
    metadata: pins.charge.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    charge: i.pins.data<Stripe.Charge>({
      description: 'The created charge object.',
    }),
  },
  async run(opts) {
    const charge = await opts.state.stripe.charges.create({
      amount: opts.inputs.amount,
      currency: opts.inputs.currency,
      customer: opts.inputs.customerId,
      source: opts.inputs.source,
      description: opts.inputs.description,
      receipt_email: opts.inputs.receiptEmail,
      capture: opts.inputs.capture,
      statement_descriptor: opts.inputs.statementDescriptor,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      charge,
    })
  },
})

export const getCharge = nodes.callable({
  description: 'Retrieve a charge by its ID.',
  inputs: {
    id: pins.charge.id.with({
      description: 'The ID of the charge to retrieve.',
    }),
  },
  outputs: {
    charge: i.pins.data<Stripe.Charge>({
      description: 'The retrieved charge object.',
    }),
  },
  async run(opts) {
    const charge = await opts.state.stripe.charges.retrieve(opts.inputs.id)

    return opts.next({
      charge,
    })
  },
})

export const updateCharge = nodes.callable({
  description: 'Update an existing charge.',
  inputs: {
    id: pins.charge.id.with({
      description: 'The ID of the charge to update.',
    }),
    description: pins.charge.description.with({
      description: 'Updated description.',
      optional: true,
    }),
    metadata: pins.charge.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
    receiptEmail: pins.charge.receiptEmail.with({
      description: 'Updated receipt email address.',
      optional: true,
    }),
  },
  outputs: {
    charge: i.pins.data<Stripe.Charge>({
      description: 'The updated charge object.',
    }),
  },
  async run(opts) {
    const charge = await opts.state.stripe.charges.update(opts.inputs.id, {
      description: opts.inputs.description,
      metadata: opts.inputs.metadata,
      receipt_email: opts.inputs.receiptEmail,
    })

    return opts.next({
      charge,
    })
  },
})

export const captureCharge = nodes.callable({
  description: 'Capture a previously authorized charge.',
  inputs: {
    id: pins.charge.id.with({
      description: 'The ID of the charge to capture.',
    }),
    amount: pins.charge.amount.with({
      description:
        'Amount to capture. Defaults to the full authorization amount.',
      optional: true,
    }),
    receiptEmail: pins.charge.receiptEmail.with({
      description: 'Email address to send the receipt to.',
      optional: true,
    }),
    statementDescriptor: pins.charge.statementDescriptor.with({
      description: 'Statement descriptor for the capture.',
      optional: true,
    }),
  },
  outputs: {
    charge: i.pins.data<Stripe.Charge>({
      description: 'The captured charge object.',
    }),
  },
  async run(opts) {
    const charge = await opts.state.stripe.charges.capture(opts.inputs.id, {
      amount: opts.inputs.amount,
      receipt_email: opts.inputs.receiptEmail,
      statement_descriptor: opts.inputs.statementDescriptor,
    })

    return opts.next({
      charge,
    })
  },
})

export const listCharges = nodes.callable({
  description: 'List all charges in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of charges to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch charges that come after the given ID.',
      optional: true,
    }),
    customerId: pins.customer.id.with({
      description: 'Filter charges by customer ID.',
      optional: true,
    }),
  },
  outputs: {
    charges: i.pins.data<Stripe.Charge[]>({
      description: 'List of charge objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more charges available.',
    }),
  },
  async run(opts) {
    const charges = await opts.state.stripe.charges.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
      customer: opts.inputs.customerId,
    })

    return opts.next({
      charges: charges.data,
      hasMore: charges.has_more,
    })
  },
})
