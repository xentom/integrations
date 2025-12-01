import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

export const id = i.pins.data({
  displayName: 'ID',
  description: 'A unique identifier for the Stripe object.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'obj_...',
  }),
})

export const email = i.pins.data({
  description: 'An email address.',
  schema: v.pipe(v.string(), v.trim(), v.email()),
  control: i.controls.text({
    placeholder: 'customer@example.com',
  }),
})

export const currency = i.pins.data({
  description: 'Three-letter ISO currency code in lowercase.',
  schema: v.pipe(v.string(), v.toLowerCase(), v.length(3)),
  control: i.controls.text({
    placeholder: 'usd',
  }),
})

export const amount = i.pins.data({
  description: 'Amount in the smallest currency unit (e.g., cents for USD).',
  schema: v.pipe(v.number(), v.integer()),
  control: i.controls.expression(),
})

export const metadata = i.pins.data({
  description:
    'Set of key-value pairs for storing additional information about the object.',
  schema: v.record(v.string(), v.string()),
  control: i.controls.expression({
    defaultValue: {},
  }),
})

export const description = i.pins.data({
  description: 'An arbitrary string attached to the object.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Description...',
    rows: 2,
  }),
})

export const name = i.pins.data({
  description: 'The name of the object.',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'Name...',
  }),
})

export const phone = i.pins.data({
  description: 'A phone number.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: '+1 555 555 5555',
  }),
})

export const limit = i.pins.data({
  description: 'A limit on the number of objects to return (1-100).',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(100)),
  control: i.controls.expression(),
})

export const after = i.pins.data({
  description:
    'Pagination cursor. Provide the ID of the last item returned in the previous request to fetch the next page.',
  schema: v.string(),
})

export const hasMore = i.pins.data({
  description: 'Whether there are more items available.',
  schema: v.boolean(),
})
