import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import * as common from './common'

export const eventType = i.pins.data({
  description: 'The type of payment intent event to trigger on.',
  control: i.controls.select({
    options: [
      { label: 'Created', value: 'created' },
      { label: 'Succeeded', value: 'succeeded' },
      { label: 'Canceled', value: 'canceled' },
      { label: 'Payment Failed', value: 'payment_failed' },
      { label: 'Processing', value: 'processing' },
      { label: 'Requires Action', value: 'requires_action' },
      {
        label: 'Amount Capturable Updated',
        value: 'amount_capturable_updated',
      },
      { label: 'Partially Funded', value: 'partially_funded' },
    ],
    defaultValue: 'succeeded',
  } as const),
})

export const id = common.id.with({
  displayName: 'Payment Intent ID',
  description: 'The unique identifier for the payment intent.',
  control: i.controls.select({
    async options({ state }) {
      const paymentIntents = await state.stripe.paymentIntents.list({
        limit: 100,
      })

      return paymentIntents.data.map((pi) => ({
        value: pi.id,
        label: `${pi.amount / 100} ${pi.currency.toUpperCase()}`,
        suffix: pi.status,
      }))
    },
  }),
  schema: v.pipe(v.string(), v.startsWith('pi_')),
})

export const amount = common.amount.with({
  description:
    'Amount intended to be collected by this payment intent in the smallest currency unit.',
})

export const currency = common.currency.with({
  description: 'Three-letter ISO currency code for the payment.',
})

export const description = common.description.with({
  description: 'An arbitrary string attached to the payment intent.',
})

export const metadata = common.metadata.with({
  description:
    'Set of key-value pairs for storing additional information about the payment intent.',
})

export const paymentMethodTypes = i.pins.data({
  description:
    'The list of payment method types that this payment intent accepts.',
  schema: v.array(v.string()),
  control: i.controls.select({
    multiple: true,
    options: [
      { value: 'card', label: 'Card' },
      { value: 'acss_debit', label: 'ACSS Debit' },
      { value: 'affirm', label: 'Affirm' },
      { value: 'afterpay_clearpay', label: 'Afterpay / Clearpay' },
      { value: 'alipay', label: 'Alipay' },
      { value: 'au_becs_debit', label: 'AU BECS Debit' },
      { value: 'bacs_debit', label: 'Bacs Debit' },
      { value: 'bancontact', label: 'Bancontact' },
      { value: 'boleto', label: 'Boleto' },
      { value: 'eps', label: 'EPS' },
      { value: 'fpx', label: 'FPX' },
      { value: 'giropay', label: 'Giropay' },
      { value: 'grabpay', label: 'GrabPay' },
      { value: 'ideal', label: 'iDEAL' },
      { value: 'klarna', label: 'Klarna' },
      { value: 'konbini', label: 'Konbini' },
      { value: 'link', label: 'Link' },
      { value: 'oxxo', label: 'OXXO' },
      { value: 'p24', label: 'Przelewy24' },
      { value: 'paynow', label: 'PayNow' },
      { value: 'pix', label: 'Pix' },
      { value: 'promptpay', label: 'PromptPay' },
      { value: 'sepa_debit', label: 'SEPA Debit' },
      { value: 'sofort', label: 'Sofort' },
      { value: 'us_bank_account', label: 'US Bank Account' },
      { value: 'wechat_pay', label: 'WeChat Pay' },
    ],
  }),
})

export const receiptEmail = i.pins.data({
  description:
    'Email address to send the receipt to. If provided, a receipt will be sent.',
  schema: v.pipe(v.string(), v.email()),
  control: i.controls.text({
    placeholder: 'customer@example.com',
  }),
})

export const statementDescriptor = i.pins.data({
  description:
    'Extra information about a payment shown on the bank statement (max 22 characters).',
  schema: v.pipe(v.string(), v.maxLength(22)),
  control: i.controls.text({
    placeholder: 'ACME Corp',
  }),
})
