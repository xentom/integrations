import * as i from '@xentom/integration-framework'
import * as v from 'valibot'

import type Stripe from 'stripe'

import * as pins from '@/pins'

const nodes = i.nodes.group('Payment Intents')

export const createPaymentIntent = nodes.callable({
  description: 'Create a new payment intent for collecting a payment.',
  inputs: {
    amount: pins.paymentIntent.amount.with({
      description: 'Amount to collect in the smallest currency unit.',
    }),
    currency: pins.paymentIntent.currency.with({
      description: 'Three-letter ISO currency code.',
    }),
    customerId: pins.customer.id.with({
      description: 'ID of the customer this payment is for.',
      optional: true,
    }),
    description: pins.paymentIntent.description.with({
      description: 'An arbitrary string attached to the payment intent.',
      optional: true,
    }),
    paymentMethodTypes: pins.paymentIntent.paymentMethodTypes.with({
      description: 'Accepted payment method types.',
      optional: true,
    }),
    receiptEmail: pins.paymentIntent.receiptEmail.with({
      description: 'Email address to send the receipt to.',
      optional: true,
    }),
    statementDescriptor: pins.paymentIntent.statementDescriptor.with({
      description: 'Extra information shown on the bank statement.',
      optional: true,
    }),
    metadata: pins.paymentIntent.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    paymentIntent: i.pins.data<Stripe.PaymentIntent>({
      description: 'The created payment intent object.',
    }),
  },
  async run(opts) {
    const paymentIntent = await opts.state.stripe.paymentIntents.create({
      amount: opts.inputs.amount,
      currency: opts.inputs.currency,
      customer: opts.inputs.customerId,
      description: opts.inputs.description,
      payment_method_types: opts.inputs.paymentMethodTypes,
      receipt_email: opts.inputs.receiptEmail,
      statement_descriptor: opts.inputs.statementDescriptor,
      metadata: opts.inputs.metadata,
    })

    return opts.next({
      paymentIntent,
    })
  },
})

export const getPaymentIntent = nodes.callable({
  description: 'Retrieve a payment intent by its ID.',
  inputs: {
    id: pins.paymentIntent.id.with({
      description: 'The ID of the payment intent to retrieve.',
    }),
  },
  outputs: {
    paymentIntent: i.pins.data<Stripe.PaymentIntent>({
      description: 'The retrieved payment intent object.',
    }),
  },
  async run(opts) {
    const paymentIntent = await opts.state.stripe.paymentIntents.retrieve(
      opts.inputs.id,
    )

    return opts.next({
      paymentIntent,
    })
  },
})

export const updatePaymentIntent = nodes.callable({
  description: 'Update an existing payment intent.',
  inputs: {
    id: pins.paymentIntent.id.with({
      description: 'The ID of the payment intent to update.',
    }),
    amount: pins.paymentIntent.amount.with({
      description: 'Updated amount to collect.',
      optional: true,
    }),
    currency: pins.paymentIntent.currency.with({
      description: 'Updated currency code.',
      optional: true,
    }),
    customerId: pins.customer.id.with({
      description: 'Updated customer ID.',
      optional: true,
    }),
    description: pins.paymentIntent.description.with({
      description: 'Updated description.',
      optional: true,
    }),
    metadata: pins.paymentIntent.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    paymentIntent: i.pins.data<Stripe.PaymentIntent>({
      description: 'The updated payment intent object.',
    }),
  },
  async run(opts) {
    const paymentIntent = await opts.state.stripe.paymentIntents.update(
      opts.inputs.id,
      {
        amount: opts.inputs.amount,
        currency: opts.inputs.currency,
        customer: opts.inputs.customerId,
        description: opts.inputs.description,
        metadata: opts.inputs.metadata,
      },
    )

    return opts.next({
      paymentIntent,
    })
  },
})

export const confirmPaymentIntent = nodes.callable({
  description: 'Confirm a payment intent to begin the payment process.',
  inputs: {
    id: pins.paymentIntent.id.with({
      description: 'The ID of the payment intent to confirm.',
    }),
    paymentMethod: i.pins.data({
      displayName: 'Payment Method ID',
      description: 'ID of the payment method to use for this payment.',
      schema: v.pipe(v.string(), v.startsWith('pm_')),
      control: i.controls.text({
        placeholder: 'pm_...',
      }),
      optional: true,
    }),
  },
  outputs: {
    paymentIntent: i.pins.data<Stripe.PaymentIntent>({
      description: 'The confirmed payment intent object.',
    }),
  },
  async run(opts) {
    const paymentIntent = await opts.state.stripe.paymentIntents.confirm(
      opts.inputs.id,
      {
        payment_method: opts.inputs.paymentMethod,
      },
    )

    return opts.next({
      paymentIntent,
    })
  },
})

export const cancelPaymentIntent = nodes.callable({
  description: 'Cancel a payment intent.',
  inputs: {
    id: pins.paymentIntent.id.with({
      description: 'The ID of the payment intent to cancel.',
    }),
    cancellationReason: i.pins.data({
      description: 'Reason for canceling the payment intent.',
      schema: v.picklist([
        'duplicate',
        'fraudulent',
        'requested_by_customer',
        'abandoned',
      ]),
      control: i.controls.select({
        options: [
          { value: 'duplicate', label: 'Duplicate' },
          { value: 'fraudulent', label: 'Fraudulent' },
          { value: 'requested_by_customer', label: 'Requested by Customer' },
          { value: 'abandoned', label: 'Abandoned' },
        ],
      }),
      optional: true,
    }),
  },
  outputs: {
    paymentIntent: i.pins.data<Stripe.PaymentIntent>({
      description: 'The canceled payment intent object.',
    }),
  },
  async run(opts) {
    const paymentIntent = await opts.state.stripe.paymentIntents.cancel(
      opts.inputs.id,
      {
        cancellation_reason: opts.inputs
          .cancellationReason as Stripe.PaymentIntentCancelParams.CancellationReason,
      },
    )

    return opts.next({
      paymentIntent,
    })
  },
})

export const listPaymentIntents = nodes.callable({
  description: 'List all payment intents in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of payment intents to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch payment intents that come after the given ID.',
      optional: true,
    }),
    customerId: pins.customer.id.with({
      description: 'Filter payment intents by customer ID.',
      optional: true,
    }),
  },
  outputs: {
    paymentIntents: i.pins.data<Stripe.PaymentIntent[]>({
      description: 'List of payment intent objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more payment intents available.',
    }),
  },
  async run(opts) {
    const paymentIntents = await opts.state.stripe.paymentIntents.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
      customer: opts.inputs.customerId,
    })

    return opts.next({
      paymentIntents: paymentIntents.data,
      hasMore: paymentIntents.has_more,
    })
  },
})
