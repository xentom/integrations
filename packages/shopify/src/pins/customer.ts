import { type getCustomer } from '@/lib/shopify';
import { IconUser } from '@tabler/icons-react';
import { pin } from '@xentom/integration';

export const customer = pin
  .custom<Awaited<ReturnType<typeof getCustomer>>>()
  .extend({
    icon: IconUser,
  });
