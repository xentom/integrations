import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from './common'

export const eventType = i.pins.data({
  description: 'The type of source event to trigger on.',
  control: i.controls.select({
    options: [
      { label: 'Canceled', value: 'canceled' },
      { label: 'Chargeable', value: 'chargeable' },
      { label: 'Failed', value: 'failed' },
      { label: 'Mandate Notification', value: 'mandate_notification' },
      {
        label: 'Refund Attributes Required',
        value: 'refund_attributes_required',
      },
      { label: 'Transaction Created', value: 'transaction.created' },
      { label: 'Transaction Updated', value: 'transaction.updated' },
    ],
    defaultValue: 'chargeable',
  } as const),
})

export const id = common.id.with({
  displayName: 'Source ID',
  description: 'The unique identifier for the source.',
  control: i.controls.text({
    placeholder: 'src_...',
  }),
  schema: v.pipe(v.string(), v.startsWith('src_')),
})

export const type = i.pins.data({
  displayName: 'Source Type',
  description: 'The type of the source to create.',
  schema: v.picklist([
    'ach_credit_transfer',
    'ach_debit',
    'alipay',
    'bancontact',
    'card',
    'card_present',
    'eps',
    'giropay',
    'ideal',
    'klarna',
    'multibanco',
    'p24',
    'sepa_debit',
    'sofort',
    'three_d_secure',
    'wechat',
  ]),
  control: i.controls.select({
    options: [
      { value: 'ach_credit_transfer', label: 'ACH Credit Transfer' },
      { value: 'ach_debit', label: 'ACH Debit' },
      { value: 'alipay', label: 'Alipay' },
      { value: 'bancontact', label: 'Bancontact' },
      { value: 'card', label: 'Card' },
      { value: 'eps', label: 'EPS' },
      { value: 'giropay', label: 'Giropay' },
      { value: 'ideal', label: 'iDEAL' },
      { value: 'klarna', label: 'Klarna' },
      { value: 'multibanco', label: 'Multibanco' },
      { value: 'p24', label: 'Przelewy24' },
      { value: 'sepa_debit', label: 'SEPA Debit' },
      { value: 'sofort', label: 'Sofort' },
      { value: 'three_d_secure', label: '3D Secure' },
      { value: 'wechat', label: 'WeChat Pay' },
    ],
  }),
})

export const amount = common.amount.with({
  description:
    'Amount associated with the source. Required for single-use sources.',
})

export const currency = common.currency.with({
  description: 'Three-letter ISO currency code for the source.',
})

export const flow = i.pins.data({
  description: 'The authentication flow of the source.',
  schema: v.picklist(['redirect', 'receiver', 'code_verification', 'none']),
  control: i.controls.select({
    options: [
      { value: 'redirect', label: 'Redirect' },
      { value: 'receiver', label: 'Receiver' },
      { value: 'code_verification', label: 'Code Verification' },
      { value: 'none', label: 'None' },
    ],
  }),
})

export const usage = i.pins.data({
  description: 'Whether the source should be reusable or single use.',
  schema: v.picklist(['reusable', 'single_use']),
  control: i.controls.select({
    options: [
      { value: 'reusable', label: 'Reusable' },
      { value: 'single_use', label: 'Single Use' },
    ],
    defaultValue: 'single_use',
  }),
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the source.',
})

export const owner = i.pins.data({
  description: 'Information about the owner of the source.',
  schema: v.object({
    address: v.optional(
      v.object({
        city: v.optional(v.string()),
        country: v.optional(v.string()),
        line1: v.optional(v.string()),
        line2: v.optional(v.string()),
        postal_code: v.optional(v.string()),
        state: v.optional(v.string()),
      }),
    ),
    email: v.optional(v.pipe(v.string(), v.email())),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
  }),
  control: i.controls.expression({
    defaultValue: {
      email: 'customer@example.com',
      name: 'John Doe',
    },
  }),
})

export const redirect = i.pins.data({
  description: 'Parameters for redirect flow sources.',
  schema: v.object({
    return_url: v.pipe(v.string(), v.url()),
  }),
  control: i.controls.expression({
    defaultValue: {
      return_url: 'https://example.com/return',
    },
  }),
})

export const statementDescriptor = i.pins.data({
  displayName: 'Statement Descriptor',
  description:
    'Extra information about a source to display on the customer statement.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Up to 22 characters',
  }),
})

export const token = i.pins.data({
  description:
    'An optional token used to create the source. When passed, token parameters override other provided parameters.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'tok_...',
  }),
})

// Customer source specific pins
export const customerSourceId = i.pins.data({
  displayName: 'Source ID',
  description: 'The ID of the source (card, bank account, etc.).',
  schema: v.pipe(v.string(), v.nonEmpty()),
  control: i.controls.text({
    placeholder: 'card_... or ba_... or src_...',
  }),
})

export const addressCity = i.pins.data({
  displayName: 'Address City',
  description: 'City/District/Suburb/Town/Village.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'San Francisco',
  }),
})

export const addressCountry = i.pins.data({
  displayName: 'Address Country',
  description: 'Billing address country.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'US',
  }),
})

export const addressLine1 = i.pins.data({
  displayName: 'Address Line 1',
  description: 'Address line 1 (Street address/PO Box/Company name).',
  schema: v.string(),
  control: i.controls.text({
    placeholder: '123 Main St',
  }),
})

export const addressLine2 = i.pins.data({
  displayName: 'Address Line 2',
  description: 'Address line 2 (Apartment/Suite/Unit/Building).',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Apt 4B',
  }),
})

export const addressState = i.pins.data({
  displayName: 'Address State',
  description: 'State/County/Province/Region.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'CA',
  }),
})

export const addressZip = i.pins.data({
  displayName: 'Address Zip',
  description: 'ZIP or postal code.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: '94102',
  }),
})

export const expMonth = i.pins.data({
  displayName: 'Expiration Month',
  description: 'Card expiration month (1-12).',
  schema: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(12)),
  control: i.controls.expression(),
})

export const expYear = i.pins.data({
  displayName: 'Expiration Year',
  description: 'Four-digit card expiration year.',
  schema: v.pipe(v.number(), v.integer(), v.minValue(2024)),
  control: i.controls.expression(),
})

export const cardholderName = i.pins.data({
  displayName: 'Cardholder Name',
  description: 'Cardholder name.',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'John Doe',
  }),
})

export const bankAccountId = i.pins.data({
  displayName: 'Bank Account ID',
  description: 'The ID of the bank account to verify.',
  schema: v.pipe(v.string(), v.startsWith('ba_')),
  control: i.controls.text({
    placeholder: 'ba_...',
  }),
})

export const verificationAmounts = i.pins.data({
  displayName: 'Verification Amounts',
  description:
    'Two positive integers representing the amounts of micro-deposits sent to the bank account.',
  schema: v.tuple([
    v.pipe(v.number(), v.integer(), v.minValue(1)),
    v.pipe(v.number(), v.integer(), v.minValue(1)),
  ]),
  control: i.controls.expression({
    defaultValue: [32, 45],
  }),
})

export const objectType = i.pins.data({
  displayName: 'Object Type',
  description: 'Filter by source type.',
  schema: v.picklist(['card', 'bank_account']),
  control: i.controls.select({
    options: [
      { value: 'card', label: 'Card' },
      { value: 'bank_account', label: 'Bank Account' },
    ],
  }),
})
