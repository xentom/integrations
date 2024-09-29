import { IconRotate2 } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { pin } from '@xentom/integration';

export const subscription = pin.custom<Stripe.Subscription>().extend({
  icon: IconRotate2,
  isEditable: false,
});
