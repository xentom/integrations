import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from '../common'

export const id = common.id.with({
  displayName: 'Checkout Session ID',
  description: 'The unique identifier for the checkout session.',
  control: i.controls.text({
    placeholder: 'cs_...',
  }),
  schema: v.pipe(v.string(), v.startsWith('cs_')),
})

export const mode = i.pins.data({
  description: 'The mode of the Checkout Session.',
  schema: v.picklist(['payment', 'setup', 'subscription']),
  control: i.controls.select({
    options: [
      { value: 'payment', label: 'Payment' },
      { value: 'setup', label: 'Setup' },
      { value: 'subscription', label: 'Subscription' },
    ],
  }),
})

export const successUrl = i.pins.data({
  displayName: 'Success URL',
  description:
    'The URL to redirect to when a checkout is completed successfully.',
  schema: v.pipe(v.string(), v.url()),
  control: i.controls.text({
    placeholder: 'https://example.com/success',
  }),
})

export const cancelUrl = i.pins.data({
  displayName: 'Cancel URL',
  description: 'The URL to redirect to when a checkout is canceled.',
  schema: v.pipe(v.string(), v.url()),
  control: i.controls.text({
    placeholder: 'https://example.com/cancel',
  }),
})

export const customerEmail = common.email.with({
  displayName: 'Customer Email',
  description:
    "If no existing customer, the customer's email to use for the checkout session.",
})

export const lineItems = i.pins.data({
  description: 'A list of items the customer is purchasing.',
  schema: v.array(
    v.object({
      price: v.string(),
      quantity: v.pipe(v.number(), v.integer(), v.minValue(1)),
    }),
  ),
  control: i.controls.expression({
    defaultValue: [{ price: 'price_...', quantity: 1 }],
  }),
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the checkout session.',
})

export const allowPromotionCodes = i.pins.data({
  description: 'Enables user redeemable promotion codes.',
  schema: v.boolean(),
  control: i.controls.switch(),
})

