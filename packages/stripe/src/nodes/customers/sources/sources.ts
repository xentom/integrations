import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Customers/Sources')

export const onCustomerSource = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      eventType: i.pins.data({
        displayName: 'When',
        description: 'The type of customer source event to trigger on.',
        control: i.controls.select({
          options: [
            { label: 'Created', value: 'created' },
            { label: 'Updated', value: 'updated' },
            { label: 'Deleted', value: 'deleted' },
            { label: 'Expiring', value: 'expiring' },
          ],
          defaultValue: 'created',
        } as const),
      }),
    }

    type Event = Extract<
      Stripe.Event,
      { type: `customer.source.${I['eventType']}` }
    >

    return nodes.trigger({
      description: 'Triggered when a customer source event is received.',
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

        opts.state.events.on(
          `customer.source.${opts.inputs.eventType}`,
          onSourceEvent,
        )

        return () => {
          opts.state.events.off(
            `customer.source.${opts.inputs.eventType}`,
            onSourceEvent,
          )
        }
      },
    })
  },
)

export const createCustomerSource = nodes.callable({
  description: 'Attach a payment source to a customer.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer to attach the source to.',
    }),
    source: pins.source.token.with({
      description: 'A token ID or source ID to attach to the customer.',
    }),
    metadata: pins.source.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    source: i.pins.data<Stripe.CustomerSource>({
      description: 'The created source object.',
    }),
  },
  async run(opts) {
    const source = await opts.state.stripe.customers.createSource(
      opts.inputs.customerId,
      {
        source: opts.inputs.source,
        metadata: opts.inputs.metadata,
      },
    )

    return opts.next({
      source,
    })
  },
})

export const getCustomerSource = nodes.callable({
  description: 'Retrieve a specific source attached to a customer.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer.',
    }),
    sourceId: pins.source.customerSourceId.with({
      description: 'The ID of the source to retrieve.',
    }),
  },
  outputs: {
    source: i.pins.data<Stripe.CustomerSource>({
      description: 'The retrieved source object.',
    }),
  },
  async run(opts) {
    const source = await opts.state.stripe.customers.retrieveSource(
      opts.inputs.customerId,
      opts.inputs.sourceId,
    )

    return opts.next({
      source,
    })
  },
})

export const updateCustomerSource = nodes.callable({
  description: 'Update a source attached to a customer (card details, etc.).',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer.',
    }),
    sourceId: pins.source.customerSourceId.with({
      description: 'The ID of the source to update.',
    }),
    addressCity: pins.source.addressCity.with({
      description: 'City for the billing address.',
      optional: true,
    }),
    addressCountry: pins.source.addressCountry.with({
      description: 'Country for the billing address.',
      optional: true,
    }),
    addressLine1: pins.source.addressLine1.with({
      description: 'Address line 1.',
      optional: true,
    }),
    addressLine2: pins.source.addressLine2.with({
      description: 'Address line 2.',
      optional: true,
    }),
    addressState: pins.source.addressState.with({
      description: 'State for the billing address.',
      optional: true,
    }),
    addressZip: pins.source.addressZip.with({
      description: 'Postal code for the billing address.',
      optional: true,
    }),
    expMonth: pins.source.expMonth.with({
      description: 'Card expiration month.',
      optional: true,
    }),
    expYear: pins.source.expYear.with({
      description: 'Card expiration year.',
      optional: true,
    }),
    name: pins.source.cardholderName.with({
      description: 'Cardholder name.',
      optional: true,
    }),
    metadata: pins.source.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    source: i.pins.data<Stripe.CustomerSource>({
      description: 'The updated source object.',
    }),
  },
  async run(opts) {
    const source = await opts.state.stripe.customers.updateSource(
      opts.inputs.customerId,
      opts.inputs.sourceId,
      {
        address_city: opts.inputs.addressCity,
        address_country: opts.inputs.addressCountry,
        address_line1: opts.inputs.addressLine1,
        address_line2: opts.inputs.addressLine2,
        address_state: opts.inputs.addressState,
        address_zip: opts.inputs.addressZip,
        exp_month: opts.inputs.expMonth?.toString(),
        exp_year: opts.inputs.expYear?.toString(),
        name: opts.inputs.name,
        metadata: opts.inputs.metadata,
      },
    )

    return opts.next({
      source,
    })
  },
})

export const deleteCustomerSource = nodes.callable({
  description: 'Delete a source attached to a customer.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer.',
    }),
    sourceId: pins.source.customerSourceId.with({
      description: 'The ID of the source to delete.',
    }),
  },
  outputs: {
    deleted: i.pins.data<boolean>({
      description: 'Whether the source was successfully deleted.',
    }),
  },
  async run(opts) {
    const result = await opts.state.stripe.customers.deleteSource(
      opts.inputs.customerId,
      opts.inputs.sourceId,
    )

    const deleted = 'deleted' in result ? result.deleted === true : true

    return opts.next({
      deleted,
    })
  },
})

export const verifyCustomerBankAccount = nodes.callable({
  description:
    'Verify a bank account with micro-deposit amounts for ACH payments.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer.',
    }),
    bankAccountId: pins.source.bankAccountId.with({
      description: 'The ID of the bank account to verify.',
    }),
    amounts: pins.source.verificationAmounts.with({
      description: 'The two micro-deposit amounts (in cents).',
    }),
  },
  outputs: {
    bankAccount: i.pins.data<Stripe.BankAccount>({
      description: 'The verified bank account object.',
    }),
  },
  async run(opts) {
    const bankAccount = await opts.state.stripe.customers.verifySource(
      opts.inputs.customerId,
      opts.inputs.bankAccountId,
      {
        amounts: opts.inputs.amounts,
      },
    )

    return opts.next({
      bankAccount,
    })
  },
})

export const listCustomerSources = nodes.callable({
  description: 'List all sources attached to a customer.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer.',
    }),
    object: pins.source.objectType.with({
      description: 'Filter by source type.',
      optional: true,
    }),
    limit: pins.common.limit.with({
      description: 'Maximum number of sources to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch sources that come after the given ID.',
      optional: true,
    }),
  },
  outputs: {
    sources: i.pins.data<Stripe.CustomerSource[]>({
      description: 'List of source objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more sources available.',
    }),
  },
  async run(opts) {
    const sources = await opts.state.stripe.customers.listSources(
      opts.inputs.customerId,
      {
        object: opts.inputs.object,
        limit: opts.inputs.limit,
        starting_after: opts.inputs.after,
      },
    )

    return opts.next({
      sources: sources.data,
      hasMore: sources.has_more,
    })
  },
})
