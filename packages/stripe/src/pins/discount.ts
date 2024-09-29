import { IconRosetteDiscount } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { pin } from '@xentom/integration';

export const discount = pin.custom<Stripe.Discount>().extend({
  icon: IconRosetteDiscount,
  isEditable: false,
});
