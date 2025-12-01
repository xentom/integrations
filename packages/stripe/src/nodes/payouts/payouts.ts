import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Payouts')

export const onPayout = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      eventType: pins.payout.eventType.with({
        displayName: 'When',
      }),
    }

    type Event = Extract<Stripe.Event, { type: `payout.${I['eventType']}` }>

    return nodes.trigger({
      description: 'Triggered when a payout event is received.',
      inputs,
      outputs: {
        payout: i.pins.data<Event['data']['object']>(),
      },
      async subscribe(opts) {
        function onPayoutEvent(event: Stripe.Event) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            payout: event.data.object,
          } as any)
        }

        opts.state.events.on(`payout.${opts.inputs.eventType}`, onPayoutEvent)

        return () => {
          opts.state.events.off(
            `payout.${opts.inputs.eventType}`,
            onPayoutEvent,
          )
        }
      },
    })
  },
)

export const createPayout = nodes.callable({
  description: 'Create a payout to send funds to your bank account or card.',
  inputs: {
    amount: pins.payout.amount.with({
      description: 'A positive integer in the smallest currency unit.',
    }),
    currency: pins.payout.currency.with({
      description: 'Three-letter ISO currency code.',
    }),
    description: pins.payout.description.with({
      description: 'An arbitrary string attached to the payout.',
      optional: true,
    }),
    destination: pins.payout.destination.with({
      description:
        'The ID of a bank account or card. Defaults to the default external account.',
      optional: true,
    }),
    method: pins.payout.method.with({
      description: 'The method used to send the payout. Standard or instant.',
      optional: true,
    }),
    sourceType: pins.payout.sourceType.with({
      description: 'The balance type of the source of the payout.',
      optional: true,
    }),
    statementDescriptor: pins.payout.statementDescriptor.with({
      description: 'A string to display on the bank statement.',
      optional: true,
    }),
    metadata: pins.payout.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    payout: i.pins.data<Stripe.Payout>({
      description: 'The created payout object.',
    }),
  },
  async run(opts) {
    const payout = await opts.state.stripe.payouts.create({
      amount: opts.inputs.amount,
      currency: opts.inputs.currency,
      description: opts.inputs.description,
      destination: opts.inputs.destination,
      method: opts.inputs.method,
      source_type: opts.inputs.sourceType,
      statement_descriptor: opts.inputs.statementDescriptor,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      payout,
    })
  },
})

export const getPayout = nodes.callable({
  description: 'Retrieve a payout by its ID.',
  inputs: {
    id: pins.payout.id.with({
      description: 'The ID of the payout to retrieve.',
    }),
  },
  outputs: {
    payout: i.pins.data<Stripe.Payout>({
      description: 'The retrieved payout object.',
    }),
  },
  async run(opts) {
    const payout = await opts.state.stripe.payouts.retrieve(opts.inputs.id)

    return opts.next({
      payout,
    })
  },
})

export const updatePayout = nodes.callable({
  description: 'Update an existing payout.',
  inputs: {
    id: pins.payout.id.with({
      description: 'The ID of the payout to update.',
    }),
    metadata: pins.payout.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    payout: i.pins.data<Stripe.Payout>({
      description: 'The updated payout object.',
    }),
  },
  async run(opts) {
    const payout = await opts.state.stripe.payouts.update(opts.inputs.id, {
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      payout,
    })
  },
})

export const cancelPayout = nodes.callable({
  description: 'Cancel a payout. Only pending payouts can be canceled.',
  inputs: {
    id: pins.payout.id.with({
      description: 'The ID of the payout to cancel.',
    }),
  },
  outputs: {
    payout: i.pins.data<Stripe.Payout>({
      description: 'The canceled payout object.',
    }),
  },
  async run(opts) {
    const payout = await opts.state.stripe.payouts.cancel(opts.inputs.id)

    return opts.next({
      payout,
    })
  },
})

export const reversePayout = nodes.callable({
  description:
    'Reverse a paid payout. Only payouts for connected accounts are reversible.',
  inputs: {
    id: pins.payout.id.with({
      description: 'The ID of the payout to reverse.',
    }),
    metadata: pins.payout.metadata.with({
      description: 'Metadata for the reversal.',
      optional: true,
    }),
  },
  outputs: {
    payout: i.pins.data<Stripe.Payout>({
      description: 'The reversed payout object.',
    }),
  },
  async run(opts) {
    const payout = await opts.state.stripe.payouts.reverse(opts.inputs.id, {
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      payout,
    })
  },
})

export const listPayouts = nodes.callable({
  description: 'List all payouts in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of payouts to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch payouts that come after the given ID.',
      optional: true,
    }),
    status: pins.payout.status.with({
      description: 'Filter payouts by status.',
      optional: true,
    }),
    destination: pins.payout.destination.with({
      description: 'Filter payouts by destination.',
      optional: true,
    }),
  },
  outputs: {
    payouts: i.pins.data<Stripe.Payout[]>({
      description: 'List of payout objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more payouts available.',
    }),
  },
  async run(opts) {
    const payouts = await opts.state.stripe.payouts.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
      status: opts.inputs.status,
      destination: opts.inputs.destination,
    })

    return opts.next({
      payouts: payouts.data,
      hasMore: payouts.has_more,
    })
  },
})
