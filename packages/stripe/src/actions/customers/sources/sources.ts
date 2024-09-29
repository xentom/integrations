import * as pins from '@/pins';
import { createWebhook } from '@/utils/webhooks';
import { IconCreditCard } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { createAction, pin } from '@xentom/integration';

const group = 'Customers/Sources';

export const onSourceCreated = createSourceTrigger('customer.source.created');
export const onSourceUpdated = createSourceTrigger('customer.source.updated');
export const onSourceDeleted = createSourceTrigger('customer.source.deleted');
export const onSourceExpiring = createSourceTrigger('customer.source.expiring');

type SourceEvents<T> = T extends `customer.source.${string}` ? T : never;

function createSourceTrigger(event: SourceEvents<Stripe.Event['type']>) {
  return createAction({
    group,
    icon: IconCreditCard,
    outputs: {
      exec: pin.exec(),
      source: pins.customerSource,
    },
    run(context) {
      context.state.events.on(
        event,
        ({ data }: Extract<Stripe.Event, { type: typeof event }>) => {
          context.next('exec', {
            source: data.object,
          });
        },
      );

      createWebhook(context, {
        events: [event],
      });
    },
  });
}
