import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Prices')

export const createPrice = nodes.callable({
  description: 'Create a new price for a product in Stripe.',
  inputs: {
    productId: pins.product.id.with({
      displayName: 'Product ID',
      description: 'The ID of the product this price belongs to.',
    }),
    unitAmount: pins.price.unitAmount.with({
      description: 'The unit amount in smallest currency unit (e.g., cents).',
    }),
    currency: pins.price.currency.with({
      description: 'Three-letter ISO currency code.',
    }),
    recurring: pins.price.recurring.with({
      description: 'Recurring billing configuration (for subscriptions).',
      optional: true,
    }),
    metadata: pins.price.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    price: i.pins.data<Stripe.Price>({
      description: 'The created price object.',
    }),
  },
  async run(opts) {
    const price = await opts.state.stripe.prices.create({
      product: opts.inputs.productId,
      unit_amount: opts.inputs.unitAmount,
      currency: opts.inputs.currency,
      recurring: opts.inputs.recurring,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      price,
    })
  },
})

export const getPrice = nodes.callable({
  description: 'Retrieve a price by its ID.',
  inputs: {
    id: pins.price.id.with({
      description: 'The ID of the price to retrieve.',
    }),
  },
  outputs: {
    price: i.pins.data<Stripe.Price>({
      description: 'The retrieved price object.',
    }),
  },
  async run(opts) {
    const price = await opts.state.stripe.prices.retrieve(opts.inputs.id)

    return opts.next({
      price,
    })
  },
})

export const updatePrice = nodes.callable({
  description: 'Update an existing price in Stripe.',
  inputs: {
    id: pins.price.id.with({
      description: 'The ID of the price to update.',
    }),
    active: i.pins.data({
      description: 'Whether the price can be used for new purchases.',
      schema: v.boolean(),
      control: i.controls.switch(),
      optional: true,
    }),
    metadata: pins.price.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    price: i.pins.data<Stripe.Price>({
      description: 'The updated price object.',
    }),
  },
  async run(opts) {
    const price = await opts.state.stripe.prices.update(opts.inputs.id, {
      active: opts.inputs.active,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      price,
    })
  },
})

export const listPrices = nodes.callable({
  description: 'List all prices in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of prices to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch prices that come after the given ID.',
      optional: true,
    }),
    productId: pins.product.id.with({
      displayName: 'Product ID',
      description: 'Filter prices by product ID.',
      optional: true,
    }),
    active: i.pins.data({
      description: 'Filter by whether the price is active.',
      schema: v.boolean(),
      control: i.controls.switch(),
      optional: true,
    }),
  },
  outputs: {
    prices: i.pins.data<Stripe.Price[]>({
      description: 'List of price objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more prices available.',
    }),
  },
  async run(opts) {
    const prices = await opts.state.stripe.prices.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
      product: opts.inputs.productId,
      active: opts.inputs.active,
    })

    return opts.next({
      prices: prices.data,
      hasMore: prices.has_more,
    })
  },
})
