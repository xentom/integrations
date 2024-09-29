import { IconId } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { pin } from '@xentom/integration';

export const taxId = pin.custom<Stripe.TaxId>().extend({
  icon: IconId,
  isEditable: false,
});
