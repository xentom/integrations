import { IconCreditCard } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { pin } from '@xentom/integration';

export const customerSource = pin.custom<Stripe.CustomerSource>().extend({
  icon: IconCreditCard,
  isEditable: false,
});
