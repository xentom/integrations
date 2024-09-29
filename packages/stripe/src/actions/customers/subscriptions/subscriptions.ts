import * as pins from '@/pins';
import { createWebhook } from '@/utils/webhooks';
import { IconRotate2 } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { createAction, pin } from '@xentom/integration';

const group = 'Customers/Subscriptions';

export const onSubscriptionCreated = createSubscriptionTrigger(
  'customer.subscription.created',
);
export const onSubscriptionUpdated = createSubscriptionTrigger(
  'customer.subscription.updated',
);
export const onSubscriptionDeleted = createSubscriptionTrigger(
  'customer.subscription.deleted',
);
export const onSubscriptionPaused = createSubscriptionTrigger(
  'customer.subscription.paused',
);
export const onSubscriptionResumed = createSubscriptionTrigger(
  'customer.subscription.resumed',
);
// prettier-ignore
export const onSubscriptionPendingUpdateApplied = createSubscriptionTrigger('customer.subscription.pending_update_applied');
// prettier-ignore
export const onSubscriptionPendingUpdateExpired = createSubscriptionTrigger('customer.subscription.pending_update_expired');
export const onSubscriptionTrailWillEnd = createSubscriptionTrigger(
  'customer.subscription.trial_will_end',
);

type SubscriptionEvents<T> = T extends `customer.subscription.${string}`
  ? T
  : never;

function createSubscriptionTrigger(
  event: SubscriptionEvents<Stripe.Event['type']>,
) {
  return createAction({
    group,
    icon: IconRotate2,
    outputs: {
      exec: pin.exec(),
      subscription: pins.subscription,
    },
    run(context) {
      context.state.events.on(
        event,
        ({ data }: Extract<Stripe.Event, { type: typeof event }>) => {
          context.next('exec', {
            subscription: data.object,
          });
        },
      );

      createWebhook(context, {
        events: [event],
      });
    },
  });
}
