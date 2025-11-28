import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Customers')

export const createCustomer = nodes.callable({
  description: 'Create a new customer in Stripe.',
  inputs: {
    email: pins.customer.email.with({
      description: "The customer's email address.",
      optional: true,
    }),
    name: pins.customer.name.with({
      description: "The customer's full name or business name.",
      optional: true,
    }),
    phone: pins.customer.phone.with({
      description: "The customer's phone number.",
      optional: true,
    }),
    description: pins.customer.description.with({
      description: 'An arbitrary string attached to the customer.',
      optional: true,
    }),
    address: pins.customer.address.with({
      description: "The customer's address.",
      optional: true,
    }),
    metadata: pins.customer.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    customer: i.pins.data<Stripe.Customer>({
      description: 'The created customer object.',
    }),
  },
  async run(opts) {
    const customer = await opts.state.stripe.customers.create({
      email: opts.inputs.email,
      name: opts.inputs.name,
      phone: opts.inputs.phone,
      description: opts.inputs.description,
      address: opts.inputs.address,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      customer,
    })
  },
})

export const getCustomer = nodes.callable({
  description: 'Retrieve a customer by their ID.',
  inputs: {
    id: pins.customer.id.with({
      description: 'The ID of the customer to retrieve.',
    }),
  },
  outputs: {
    customer: i.pins.data<Stripe.Customer>({
      description: 'The retrieved customer object.',
    }),
  },
  async run(opts) {
    const customer = await opts.state.stripe.customers.retrieve(opts.inputs.id)

    if (customer.deleted) {
      throw new Error('Customer has been deleted')
    }

    return opts.next({
      customer,
    })
  },
})

export const updateCustomer = nodes.callable({
  description: 'Update an existing customer in Stripe.',
  inputs: {
    id: pins.customer.id.with({
      description: 'The ID of the customer to update.',
    }),
    email: pins.customer.email.with({
      description: "The customer's new email address.",
      optional: true,
    }),
    name: pins.customer.name.with({
      description: "The customer's new name.",
      optional: true,
    }),
    phone: pins.customer.phone.with({
      description: "The customer's new phone number.",
      optional: true,
    }),
    description: pins.customer.description.with({
      description: 'Updated description for the customer.',
      optional: true,
    }),
    address: pins.customer.address.with({
      description: "The customer's new address.",
      optional: true,
    }),
    metadata: pins.customer.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    customer: i.pins.data<Stripe.Customer>({
      description: 'The updated customer object.',
    }),
  },
  async run(opts) {
    const customer = await opts.state.stripe.customers.update(opts.inputs.id, {
      email: opts.inputs.email,
      name: opts.inputs.name,
      phone: opts.inputs.phone,
      description: opts.inputs.description,
      address: opts.inputs.address,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      customer,
    })
  },
})

export const deleteCustomer = nodes.callable({
  description: 'Permanently delete a customer from Stripe.',
  inputs: {
    id: pins.customer.id.with({
      description: 'The ID of the customer to delete.',
    }),
  },
  outputs: {
    deleted: i.pins.data<boolean>({
      description: 'Whether the customer was successfully deleted.',
    }),
  },
  async run(opts) {
    const result = await opts.state.stripe.customers.del(opts.inputs.id)

    return opts.next({
      deleted: result.deleted,
    })
  },
})

export const listCustomers = nodes.callable({
  description: 'List all customers in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of customers to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch customers that come after the given ID.',
      optional: true,
    }),
    email: pins.customer.email.with({
      description: 'Filter customers by email address.',
      optional: true,
    }),
  },
  outputs: {
    customers: i.pins.data<Stripe.Customer[]>({
      description: 'List of customer objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more customers available.',
    }),
  },
  async run(opts) {
    const customers = await opts.state.stripe.customers.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
      email: opts.inputs.email,
    })

    return opts.next({
      customers: customers.data,
      hasMore: customers.has_more,
    })
  },
})
