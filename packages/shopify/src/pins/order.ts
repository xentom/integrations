import { type getOrder } from '@/lib/shopify';
import { IconInbox } from '@tabler/icons-react';
import { pin } from '@xentom/integration';

export const order = pin.custom<Awaited<ReturnType<typeof getOrder>>>().extend({
  icon: IconInbox,
});
