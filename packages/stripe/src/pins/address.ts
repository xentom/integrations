import { IconMap } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { pin } from '@xentom/integration';

export const address = pin.custom<Stripe.Address>().extend({
  icon: IconMap,
  isEditable: false,
});
