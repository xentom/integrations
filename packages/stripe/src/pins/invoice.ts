import { IconFileInvoice } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { pin } from '@xentom/integration';

export const invoice = pin.custom<Stripe.Invoice>().extend({
  icon: IconFileInvoice,
  isEditable: false,
});
