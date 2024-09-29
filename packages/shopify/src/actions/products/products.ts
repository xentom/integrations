import { createWebhookHandler, getProduct } from '@/lib/shopify';
import * as pins from '@/pins';
import { IconTag } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Products';

export const onProductCreated = createAction({
  group,
  icon: IconTag,
  description: 'Triggered when a product is created',
  outputs: {
    exec: pin.exec(),
    product: pins.product.extend({
      description: 'The product that was created',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'PRODUCTS_CREATE',
      async callback({ admin_graphql_api_id: id }) {
        const product = await getProduct(context.state.graphql, id);
        if (!product) {
          return;
        }

        context.next('exec', {
          product,
        });
      },
    });
  },
});

export const onProductUpdated = createAction({
  group,
  icon: IconTag,
  description: 'Triggered when a product is updated',
  outputs: {
    exec: pin.exec(),
    product: pins.product.extend({
      description: 'The product that was updated',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'PRODUCTS_UPDATE',
      async callback({ admin_graphql_api_id: id }) {
        const product = await getProduct(context.state.graphql, id);
        if (!product) {
          return;
        }

        context.next('exec', {
          product,
        });
      },
    });
  },
});

export const onProductDeleted = createAction({
  group,
  icon: IconTag,
  description: 'Triggered when a product is deleted',
  outputs: {
    exec: pin.exec(),
    id: pin.string({
      label: 'Product ID',
      description: 'The ID of the product that was deleted',
      isEditable: false,
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'PRODUCTS_DELETE',
      callback({ id }) {
        context.next('exec', {
          id: `gid://shopify/Product/${id}`,
        });
      },
    });
  },
});
