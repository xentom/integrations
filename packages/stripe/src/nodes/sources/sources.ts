import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Sources')

export const onSource = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      eventType: pins.source.eventType.with({
        displayName: 'When',
      }),
    }

    type Event = Extract<Stripe.Event, { type: `source.${I['eventType']}` }>

    return nodes.trigger({
      description: 'Triggered when a source event is received.',
      inputs,
      outputs: {
        source: i.pins.data<Event['data']['object']>(),
      },
      async subscribe(opts) {
        function onSourceEvent(event: Stripe.Event) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            source: event.data.object,
          } as any)
        }

        opts.state.events.on(`source.${opts.inputs.eventType}`, onSourceEvent)

        return () => {
          opts.state.events.off(
            `source.${opts.inputs.eventType}`,
            onSourceEvent,
          )
        }
      },
    })
  },
)

export const createSource = nodes.callable({
  description:
    'Create a new source object. Sources are used to represent payment instruments.',
  inputs: {
    type: pins.source.type.with({
      description: 'The type of source to create.',
    }),
    amount: pins.source.amount.with({
      description: 'Amount for the source (required for single-use sources).',
      optional: true,
    }),
    currency: pins.source.currency.with({
      description: 'Three-letter ISO currency code.',
      optional: true,
    }),
    flow: pins.source.flow.with({
      description: 'The authentication flow of the source.',
      optional: true,
    }),
    usage: pins.source.usage.with({
      description: 'Whether the source is reusable or single use.',
      optional: true,
    }),
    owner: pins.source.owner.with({
      description: 'Information about the owner of the source.',
      optional: true,
    }),
    redirect: pins.source.redirect.with({
      description: 'Parameters for redirect flow sources.',
      optional: true,
    }),
    statementDescriptor: pins.source.statementDescriptor.with({
      description: 'Extra information to display on the statement.',
      optional: true,
    }),
    token: pins.source.token.with({
      description: 'A token to create the source from.',
      optional: true,
    }),
    metadata: pins.source.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    source: i.pins.data<Stripe.Source>({
      description: 'The created source object.',
    }),
  },
  async run(opts) {
    const source = await opts.state.stripe.sources.create({
      type: opts.inputs.type,
      amount: opts.inputs.amount,
      currency: opts.inputs.currency,
      flow: opts.inputs.flow,
      usage: opts.inputs.usage,
      owner: opts.inputs.owner,
      redirect: opts.inputs.redirect,
      statement_descriptor: opts.inputs.statementDescriptor,
      token: opts.inputs.token,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      source,
    })
  },
})

export const getSource = nodes.callable({
  description: 'Retrieve a source by its ID.',
  inputs: {
    id: pins.source.id.with({
      description: 'The ID of the source to retrieve.',
    }),
  },
  outputs: {
    source: i.pins.data<Stripe.Source>({
      description: 'The retrieved source object.',
    }),
  },
  async run(opts) {
    const source = await opts.state.stripe.sources.retrieve(opts.inputs.id)

    return opts.next({
      source,
    })
  },
})

export const updateSource = nodes.callable({
  description: 'Update an existing source.',
  inputs: {
    id: pins.source.id.with({
      description: 'The ID of the source to update.',
    }),
    amount: pins.source.amount.with({
      description: 'Updated amount for the source.',
      optional: true,
    }),
    owner: pins.source.owner.with({
      description: 'Updated owner information.',
      optional: true,
    }),
    metadata: pins.source.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    source: i.pins.data<Stripe.Source>({
      description: 'The updated source object.',
    }),
  },
  async run(opts) {
    const source = await opts.state.stripe.sources.update(opts.inputs.id, {
      amount: opts.inputs.amount,
      owner: opts.inputs.owner,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      source,
    })
  },
})

export const listSourceTransactions = nodes.callable({
  description: 'List transactions that have been created for a source.',
  inputs: {
    sourceId: pins.source.id.with({
      description: 'The ID of the source.',
    }),
    limit: pins.common.limit.with({
      description: 'Maximum number of transactions to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch transactions that come after the given ID.',
      optional: true,
    }),
  },
  outputs: {
    transactions: i.pins.data<Stripe.SourceTransaction[]>({
      description: 'List of source transaction objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more transactions available.',
    }),
  },
  async run(opts) {
    const transactions = await opts.state.stripe.sources.listSourceTransactions(
      opts.inputs.sourceId,
      {
        limit: opts.inputs.limit,
        starting_after: opts.inputs.after,
      },
    )

    return opts.next({
      transactions: transactions.data,
      hasMore: transactions.has_more,
    })
  },
})
