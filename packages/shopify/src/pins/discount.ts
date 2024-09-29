import { type getDiscount } from '@/lib/shopify';
import { IconRosetteDiscount } from '@tabler/icons-react';
import { pin } from '@xentom/integration';

export const discount = pin
  .custom<Awaited<ReturnType<typeof getDiscount>>>()
  .extend({
    icon: IconRosetteDiscount,
  });
