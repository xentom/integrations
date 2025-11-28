import * as i from '@xentom/integration-framework'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Products')

export const createProduct = nodes.callable({
  description: 'Create a new product in Stripe.',
  inputs: {
    name: pins.product.name.with({
      description: "The product's name, shown to customers.",
    }),
    description: pins.product.description.with({
      description: "The product's description.",
      optional: true,
    }),
    active: pins.product.active.with({
      description: 'Whether the product is available for purchase.',
      optional: true,
    }),
    images: pins.product.images.with({
      description: 'A list of up to 8 image URLs for this product.',
      optional: true,
    }),
    url: pins.product.url.with({
      description: 'A URL of a publicly-accessible webpage for this product.',
      optional: true,
    }),
    metadata: pins.product.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    product: i.pins.data<Stripe.Product>({
      description: 'The created product object.',
    }),
  },
  async run(opts) {
    const product = await opts.state.stripe.products.create({
      name: opts.inputs.name,
      description: opts.inputs.description,
      active: opts.inputs.active,
      images: opts.inputs.images,
      url: opts.inputs.url,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      product,
    })
  },
})

export const getProduct = nodes.callable({
  description: 'Retrieve a product by its ID.',
  inputs: {
    id: pins.product.id.with({
      description: 'The ID of the product to retrieve.',
    }),
  },
  outputs: {
    product: i.pins.data<Stripe.Product>({
      description: 'The retrieved product object.',
    }),
  },
  async run(opts) {
    const product = await opts.state.stripe.products.retrieve(opts.inputs.id)

    if (product.deleted) {
      throw new Error('Product has been deleted')
    }

    return opts.next({
      product,
    })
  },
})

export const updateProduct = nodes.callable({
  description: 'Update an existing product in Stripe.',
  inputs: {
    id: pins.product.id.with({
      description: 'The ID of the product to update.',
    }),
    name: pins.product.name.with({
      description: "The product's new name.",
      optional: true,
    }),
    description: pins.product.description.with({
      description: "The product's new description.",
      optional: true,
    }),
    active: pins.product.active.with({
      description: 'Whether the product is available for purchase.',
      optional: true,
    }),
    images: pins.product.images.with({
      description: 'Updated list of image URLs.',
      optional: true,
    }),
    url: pins.product.url.with({
      description: 'Updated publicly-accessible webpage URL.',
      optional: true,
    }),
    metadata: pins.product.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    product: i.pins.data<Stripe.Product>({
      description: 'The updated product object.',
    }),
  },
  async run(opts) {
    const product = await opts.state.stripe.products.update(opts.inputs.id, {
      name: opts.inputs.name,
      description: opts.inputs.description,
      active: opts.inputs.active,
      images: opts.inputs.images,
      url: opts.inputs.url,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      product,
    })
  },
})

export const deleteProduct = nodes.callable({
  description:
    'Delete a product from Stripe. Products can only be deleted if they have no prices.',
  inputs: {
    id: pins.product.id.with({
      description: 'The ID of the product to delete.',
    }),
  },
  outputs: {
    deleted: i.pins.data<boolean>({
      description: 'Whether the product was successfully deleted.',
    }),
  },
  async run(opts) {
    const result = await opts.state.stripe.products.del(opts.inputs.id)

    return opts.next({
      deleted: result.deleted,
    })
  },
})

export const listProducts = nodes.callable({
  description: 'List all products in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of products to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch products that come after the given ID.',
      optional: true,
    }),
    active: pins.product.active.with({
      description: 'Filter by whether the product is active.',
      optional: true,
    }),
  },
  outputs: {
    products: i.pins.data<Stripe.Product[]>({
      description: 'List of product objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more products available.',
    }),
  },
  async run(opts) {
    const products = await opts.state.stripe.products.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
      active: opts.inputs.active,
    })

    return opts.next({
      products: products.data,
      hasMore: products.has_more,
    })
  },
})
