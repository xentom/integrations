import { IconUser } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { pin } from '@xentom/integration';

export const customer = pin.custom<Stripe.Customer>().extend({
  icon: IconUser,
  isEditable: false,
});
