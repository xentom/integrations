import * as pins from '@/pins';
import { createWebhook } from '@/utils/webhooks';
import { IconRosetteDiscount } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { createAction, pin } from '@xentom/integration';

const group = 'Customers/Discounts';

export const onDiscountCreated = createDiscountTrigger(
  'customer.discount.created',
);
export const onDiscountUpdated = createDiscountTrigger(
  'customer.discount.updated',
);
export const onDiscountDeleted = createDiscountTrigger(
  'customer.discount.deleted',
);

type DiscountEvents<T> = T extends `customer.discount.${string}` ? T : never;

function createDiscountTrigger(event: DiscountEvents<Stripe.Event['type']>) {
  return createAction({
    group,
    icon: IconRosetteDiscount,
    outputs: {
      exec: pin.exec(),
      discount: pins.discount,
    },
    run(context) {
      context.state.events.on(
        event,
        ({ data }: Extract<Stripe.Event, { type: typeof event }>) => {
          context.next('exec', {
            discount: data.object,
          });
        },
      );

      createWebhook(context, {
        events: [event],
      });
    },
  });
}
