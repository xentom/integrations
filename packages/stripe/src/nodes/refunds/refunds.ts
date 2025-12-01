import * as i from '@xentom/integration-framework';

import type Stripe from 'stripe';

import * as pins from '@/pins';

const nodes = i.nodes.group('Refunds');

export const onRefund = i.generic(<
  I extends i.GenericInputs<typeof inputs>
>() => {
  const inputs = {
    eventType: pins.refund.eventType.with({
      displayName: 'When',
    }),
  };

  type Event = Extract<Stripe.Event, { type: `refund.${I['eventType']}` }>;

  return nodes.trigger({
    description: 'Triggered when a refund event is received.',
    inputs,
    outputs: {
      refund: i.pins.data<Event['data']['object']>(),
    },
    async subscribe(opts) {
      function onRefundEvent(event: Stripe.Event) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        void opts.next({
          refund: event.data.object,
        } as any);
      }

      opts.state.events.on(`refund.${opts.inputs.eventType}`, onRefundEvent);

      return () => {
        opts.state.events.off(`refund.${opts.inputs.eventType}`, onRefundEvent);
      };
    },
  });
});

export const createRefund = nodes.callable({
  description:
    'Create a refund to return funds to a customer. Can refund a charge or a PaymentIntent.',
  inputs: {
    chargeId: pins.refund.chargeId.with({
      description: 'The ID of the charge to refund.',
      optional: true,
    }),
    paymentIntentId: pins.refund.paymentIntentId.with({
      description:
        'The ID of the PaymentIntent to refund. Use this or chargeId.',
      optional: true,
    }),
    amount: pins.refund.amount.with({
      description: 'Amount to refund. Defaults to the full charge amount.',
      optional: true,
    }),
    reason: pins.refund.reason.with({
      description: 'Reason for the refund.',
      optional: true,
    }),
    instructionsEmail: pins.refund.instructionsEmail.with({
      description: 'Email for refund instructions.',
      optional: true,
    }),
    refundApplicationFee: pins.refund.refundApplicationFee.with({
      description: 'Whether to refund the application fee.',
      optional: true,
    }),
    reverseTransfer: pins.refund.reverseTransfer.with({
      description: 'Whether to reverse the transfer.',
      optional: true,
    }),
    metadata: pins.refund.metadata.with({
      description: 'Set of key-value pairs for additional information.',
      optional: true,
    }),
  },
  outputs: {
    refund: i.pins.data<Stripe.Refund>({
      description: 'The created refund object.',
    }),
  },
  async run(opts) {
    const refund = await opts.state.stripe.refunds.create({
      charge: opts.inputs.chargeId,
      payment_intent: opts.inputs.paymentIntentId,
      amount: opts.inputs.amount,
      reason: opts.inputs.reason,
      instructions_email: opts.inputs.instructionsEmail,
      refund_application_fee: opts.inputs.refundApplicationFee,
      reverse_transfer: opts.inputs.reverseTransfer,
      metadata: opts.inputs.metadata,
    });

    return opts.next({
      refund,
    });
  },
});

export const getRefund = nodes.callable({
  description: 'Retrieve a refund by its ID.',
  inputs: {
    id: pins.refund.id.with({
      description: 'The ID of the refund to retrieve.',
    }),
  },
  outputs: {
    refund: i.pins.data<Stripe.Refund>({
      description: 'The retrieved refund object.',
    }),
  },
  async run(opts) {
    const refund = await opts.state.stripe.refunds.retrieve(opts.inputs.id);

    return opts.next({
      refund,
    });
  },
});

export const updateRefund = nodes.callable({
  description: 'Update an existing refund.',
  inputs: {
    id: pins.refund.id.with({
      description: 'The ID of the refund to update.',
    }),
    metadata: pins.refund.metadata.with({
      description: 'Updated metadata key-value pairs.',
      optional: true,
    }),
  },
  outputs: {
    refund: i.pins.data<Stripe.Refund>({
      description: 'The updated refund object.',
    }),
  },
  async run(opts) {
    const refund = await opts.state.stripe.refunds.update(opts.inputs.id, {
      metadata: opts.inputs.metadata,
    });

    return opts.next({
      refund,
    });
  },
});

export const cancelRefund = nodes.callable({
  description:
    'Cancel a refund that has not yet been completed. Only refunds with status=requires_action can be canceled.',
  inputs: {
    id: pins.refund.id.with({
      description: 'The ID of the refund to cancel.',
    }),
  },
  outputs: {
    refund: i.pins.data<Stripe.Refund>({
      description: 'The canceled refund object.',
    }),
  },
  async run(opts) {
    const refund = await opts.state.stripe.refunds.cancel(opts.inputs.id);

    return opts.next({
      refund,
    });
  },
});

export const listRefunds = nodes.callable({
  description: 'List all refunds in your Stripe account.',
  inputs: {
    limit: pins.common.limit.with({
      description: 'Maximum number of refunds to return (1-100).',
      optional: true,
    }),
    after: pins.common.after.with({
      description:
        'Pagination cursor. Fetch refunds that come after the given ID.',
      optional: true,
    }),
    chargeId: pins.refund.chargeId.with({
      description: 'Filter refunds by charge ID.',
      optional: true,
    }),
    paymentIntentId: pins.refund.paymentIntentId.with({
      description: 'Filter refunds by PaymentIntent ID.',
      optional: true,
    }),
  },
  outputs: {
    refunds: i.pins.data<Stripe.Refund[]>({
      description: 'List of refund objects.',
    }),
    hasMore: pins.common.hasMore.with({
      description: 'Whether there are more refunds available.',
    }),
  },
  async run(opts) {
    const refunds = await opts.state.stripe.refunds.list({
      limit: opts.inputs.limit,
      starting_after: opts.inputs.after,
      charge: opts.inputs.chargeId,
      payment_intent: opts.inputs.paymentIntentId,
    });

    return opts.next({
      refunds: refunds.data,
      hasMore: refunds.has_more,
    });
  },
});
