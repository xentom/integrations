import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import { getPagination } from '@/utils/pagination'
import * as common from './common'

export const eventType = i.pins.data({
  description: 'The type of product event to trigger on.',
  control: i.controls.select({
    options: [
      { label: 'Created', value: 'created' },
      { label: 'Updated', value: 'updated' },
      { label: 'Deleted', value: 'deleted' },
    ],
    defaultValue: 'created',
  } as const),
})

export const id = common.id.with({
  displayName: 'Product ID',
  description: 'The unique identifier for the product.',
  control: i.controls.select({
    async options({ state, pagination, search }) {
      const products = search
        ? await state.stripe.products.search({
            ...getPagination(pagination),
            query: `name~"${search}"`,
          })
        : await state.stripe.products.list({
            ...getPagination(pagination),
          })

      return {
        hasMore: products.has_more,
        items: products.data.map((product) => ({
          value: product.id,
          label: product.name,
          suffix: product.id,
        })),
      }
    },
  }),
  schema: v.pipe(v.string(), v.startsWith('prod_')),
})

export const name = common.name.with({
  description: "The product's name, meant to be displayable to the customer.",
})

export const description = common.description.with({
  description:
    "The product's description, meant to be displayable to the customer.",
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the product.',
})

export const active = i.pins.data({
  description: 'Whether the product is currently available for purchase.',
  schema: v.boolean(),
  control: i.controls.switch(),
})

export const images = i.pins.data({
  description: 'A list of up to 8 URLs of images for this product.',
  schema: v.array(v.pipe(v.string(), v.url())),
  control: i.controls.expression({
    defaultValue: [],
  }),
})

export const url = i.pins.data({
  displayName: 'URL',
  description: 'A URL of a publicly-accessible webpage for this product.',
  schema: v.pipe(v.string(), v.url()),
  control: i.controls.text({
    placeholder: 'https://example.com/product',
  }),
})
