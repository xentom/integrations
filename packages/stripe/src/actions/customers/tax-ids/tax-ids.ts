import * as pins from '@/pins';
import { createWebhook } from '@/utils/webhooks';
import { IconId } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { createAction, pin } from '@xentom/integration';

const group = 'Customers/Tax IDs';

export const onTaxIdCreated = createTaxIdTrigger('customer.tax_id.created');
export const onTaxIdUpdated = createTaxIdTrigger('customer.tax_id.updated');
export const onTaxIdDeleted = createTaxIdTrigger('customer.tax_id.deleted');

type TaxIdEvents<T> = T extends `customer.tax_id.${string}` ? T : never;

function createTaxIdTrigger(event: TaxIdEvents<Stripe.Event['type']>) {
  return createAction({
    group,
    icon: IconId,
    outputs: {
      exec: pin.exec(),
      taxId: pins.taxId,
    },
    run(context) {
      context.state.events.on(
        event,
        ({ data }: Extract<Stripe.Event, { type: typeof event }>) => {
          context.next('exec', {
            taxId: data.object,
          });
        },
      );

      createWebhook(context, {
        events: [event],
      });
    },
  });
}
