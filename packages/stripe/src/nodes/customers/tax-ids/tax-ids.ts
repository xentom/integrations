import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Customers/Tax IDs')

export const onCustomerTaxId = i.generic(
  <I extends i.GenericInputs<typeof inputs>>() => {
    const inputs = {
      eventType: pins.taxId.eventType.with({
        displayName: 'When',
      }),
    }

    type Event = Extract<
      Stripe.Event,
      { type: `customer.tax_id.${I['eventType']}` }
    >

    return nodes.trigger({
      description: 'Triggered when a customer tax ID event is received.',
      inputs,
      outputs: {
        taxId: i.pins.data<Event['data']['object']>(),
      },
      async subscribe(opts) {
        function onTaxIdEvent(event: Stripe.Event) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void opts.next({
            taxId: event.data.object,
          } as any)
        }

        opts.state.events.on(
          `customer.tax_id.${opts.inputs.eventType}`,
          onTaxIdEvent,
        )

        return () => {
          opts.state.events.off(
            `customer.tax_id.${opts.inputs.eventType}`,
            onTaxIdEvent,
          )
        }
      },
    })
  },
)

export const createCustomerTaxId = nodes.callable({
  displayName: 'Create Tax ID',
  description: 'Create a new tax ID for a customer.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer to add the tax ID to.',
    }),
    type: pins.taxId.type.with({
      description: 'Type of the tax ID.',
    }),
    value: pins.taxId.value.with({
      description: 'Value of the tax ID.',
    }),
  },
  outputs: {
    taxId: i.pins.data<Stripe.TaxId>({
      displayName: 'Tax ID',
      description: 'The created tax ID object.',
    }),
  },
  async run(opts) {
    const taxId = await opts.state.stripe.customers.createTaxId(
      opts.inputs.customerId,
      {
        type: opts.inputs.type as Stripe.CustomerCreateTaxIdParams.Type,
        value: opts.inputs.value,
      },
    )

    return opts.next({
      taxId,
    })
  },
})

export const getCustomerTaxId = nodes.callable({
  displayName: 'Get Tax ID',
  description: 'Retrieve a specific tax ID for a customer.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer.',
    }),
    taxIdId: pins.taxId.id.with({
      displayName: 'Tax ID',
      description: 'The ID of the tax ID to retrieve.',
    }),
  },
  outputs: {
    taxId: i.pins.data<Stripe.TaxId>({
      displayName: 'Tax ID',
      description: 'The retrieved tax ID object.',
    }),
  },
  async run(opts) {
    const taxId = await opts.state.stripe.customers.retrieveTaxId(
      opts.inputs.customerId,
      opts.inputs.taxIdId,
    )

    return opts.next({
      taxId,
    })
  },
})

export const deleteCustomerTaxId = nodes.callable({
  displayName: 'Delete Tax ID',
  description: 'Delete a tax ID from a customer.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer.',
    }),
    taxIdId: pins.taxId.id.with({
      displayName: 'Tax ID',
      description: 'The ID of the tax ID to delete.',
    }),
  },
  outputs: {
    deleted: i.pins.data<boolean>({
      description: 'Whether the tax ID was successfully deleted.',
    }),
  },
  async run(opts) {
    const result = await opts.state.stripe.customers.deleteTaxId(
      opts.inputs.customerId,
      opts.inputs.taxIdId,
    )

    return opts.next({
      deleted: result.deleted,
    })
  },
})

export const listCustomerTaxIds = nodes.callable({
  displayName: 'List Tax IDs',
  description: 'List all tax IDs for a customer.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer.',
    }),
    limit: pins.common.limit.with({
      description: 'Maximum number of tax IDs to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch tax IDs that come after the given ID.',
      optional: true,
    }),
  },
  outputs: {
    taxIds: i.pins.data<Stripe.TaxId[]>({
      displayName: 'Tax IDs',
      description: 'List of tax ID objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more tax IDs available.',
    }),
  },
  async run(opts) {
    const taxIds = await opts.state.stripe.customers.listTaxIds(
      opts.inputs.customerId,
      {
        limit: opts.inputs.limit,
        starting_after: opts.inputs.after,
      },
    )

    return opts.next({
      taxIds: taxIds.data,
      hasMore: taxIds.has_more,
    })
  },
})
