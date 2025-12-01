import * as i from '@xentom/integration-framework';

import type Stripe from 'stripe';

import * as pins from '@/pins';

const nodes = i.nodes.group('Customers/Discounts');

export const onCustomerDiscount = i.generic(<
  I extends i.GenericInputs<typeof inputs>
>() => {
  const inputs = {
    eventType: pins.discount.eventType.with({
      displayName: 'When',
    }),
  };

  type Event = Extract<
    Stripe.Event,
    { type: `customer.discount.${I['eventType']}` }
  >;

  return nodes.trigger({
    description: 'Triggered when a customer discount event is received.',
    inputs,
    outputs: {
      discount: i.pins.data<Event['data']['object']>(),
    },
    async subscribe(opts) {
      function onDiscountEvent(event: Stripe.Event) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        void opts.next({
          discount: event.data.object,
        } as any);
      }

      opts.state.events.on(
        `customer.discount.${opts.inputs.eventType}`,
        onDiscountEvent
      );

      return () => {
        opts.state.events.off(
          `customer.discount.${opts.inputs.eventType}`,
          onDiscountEvent
        );
      };
    },
  });
});

export const deleteCustomerDiscount = nodes.callable({
  description: 'Remove the currently applied discount from a customer.',
  inputs: {
    customerId: pins.customer.id.with({
      description: 'The ID of the customer whose discount to remove.',
    }),
  },
  outputs: {
    deleted: i.pins.data<boolean>({
      description: 'Whether the discount was successfully deleted.',
    }),
  },
  async run(opts) {
    const result = await opts.state.stripe.customers.deleteDiscount(
      opts.inputs.customerId
    );

    return opts.next({
      deleted: result.deleted,
    });
  },
});

export const deleteSubscriptionDiscount = nodes.callable({
  description: 'Remove the currently applied discount from a subscription.',
  inputs: {
    subscriptionId: pins.subscription.id.with({
      description: 'The ID of the subscription whose discount to remove.',
    }),
  },
  outputs: {
    deleted: i.pins.data<boolean>({
      description: 'Whether the discount was successfully deleted.',
    }),
  },
  async run(opts) {
    const result = await opts.state.stripe.subscriptions.deleteDiscount(
      opts.inputs.subscriptionId
    );

    return opts.next({
      deleted: result.deleted,
    });
  },
});
