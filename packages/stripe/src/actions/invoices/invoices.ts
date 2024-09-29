import * as pins from '@/pins';
import { createWebhook } from '@/utils/webhooks';
import { IconFileInvoice } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { createAction, pin } from '@xentom/integration';

const group = 'Invoices';

export const onInvoiceCreated = createInvoiceTrigger('invoice.created');
export const onInvoiceUpdated = createInvoiceTrigger('invoice.updated');
export const onInvoiceDeleted = createInvoiceTrigger('invoice.deleted');
export const onInvoiceSent = createInvoiceTrigger('invoice.sent');
export const onInvoicePaid = createInvoiceTrigger('invoice.paid');
export const onInvoiceVoided = createInvoiceTrigger('invoice.voided');
export const onInvoiceUpcoming = createInvoiceTrigger('invoice.upcoming');
export const onInvoiceFinalized = createInvoiceTrigger('invoice.finalized');
export const onInvoiceFinalizationFailed = createInvoiceTrigger(
  'invoice.finalization_failed',
);
export const onInvoicePaymentActionRequired = createInvoiceTrigger(
  'invoice.payment_action_required',
);
export const onInvoicePaymentSucceeded = createInvoiceTrigger(
  'invoice.payment_succeeded',
);
export const onInvoicePaymentFailed = createInvoiceTrigger(
  'invoice.payment_failed',
);
export const onInvoiceMarkedUncollectible = createInvoiceTrigger(
  'invoice.marked_uncollectible',
);

type InvoiceEvents<T> = T extends `invoice.${string}` ? T : never;

function createInvoiceTrigger(event: InvoiceEvents<Stripe.Event['type']>) {
  return createAction({
    group,
    icon: IconFileInvoice,
    outputs: {
      exec: pin.exec(),
      invoice: pins.invoice,
    },
    run(context) {
      context.state.events.on(
        event,
        ({ data }: Extract<Stripe.Event, { type: typeof event }>) => {
          context.next('exec', {
            invoice: data.object,
          });
        },
      );

      createWebhook(context, {
        events: [event],
      });
    },
  });
}
