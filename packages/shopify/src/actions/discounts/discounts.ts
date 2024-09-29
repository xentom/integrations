import { createWebhookHandler, getDiscount } from '@/lib/shopify';
import * as pins from '@/pins';
import { IconRosetteDiscount } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Discounts';

export const onDiscountCreated = createAction({
  group,
  icon: IconRosetteDiscount,
  description: 'Triggered when a discount is created',
  outputs: {
    exec: pin.exec(),
    discount: pins.discount.extend({
      description: 'The discount that was created',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'DISCOUNTS_CREATE',
      async callback({ admin_graphql_api_id: id }) {
        const discount = await getDiscount(context.state.graphql, id);
        if (!discount) {
          return;
        }

        context.next('exec', {
          discount,
        });
      },
    });
  },
});

export const onDiscountUpdated = createAction({
  group,
  icon: IconRosetteDiscount,
  description: 'Triggered when a discount is updated',
  outputs: {
    exec: pin.exec(),
    discount: pins.discount.extend({
      description: 'The discount that was updated',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'DISCOUNTS_UPDATE',
      async callback({ admin_graphql_api_id: id }) {
        const discount = await getDiscount(context.state.graphql, id);
        if (!discount) {
          return;
        }

        context.next('exec', {
          discount,
        });
      },
    });
  },
});

export const onDiscountDeleted = createAction({
  group,
  icon: IconRosetteDiscount,
  description: 'Triggered when a discount is deleted',
  outputs: {
    exec: pin.exec(),
    id: pin.string({
      label: 'Discount ID',
      description: 'The ID of the discount that was deleted',
      isEditable: false,
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'DISCOUNTS_DELETE',
      callback({ admin_graphql_api_id: id }) {
        context.next('exec', {
          id,
        });
      },
    });
  },
});
