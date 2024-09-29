import { type getProduct } from '@/lib/shopify';
import { IconTag } from '@tabler/icons-react';
import { pin } from '@xentom/integration';

export const product = pin
  .custom<Awaited<ReturnType<typeof getProduct>>>()
  .extend({
    icon: IconTag,
  });
