import { createWebhookHandler, getOrder } from '@/lib/shopify';
import * as pins from '@/pins';
import { IconUser } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Orders';

export const onOrderCreated = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a order is created',
  outputs: {
    exec: pin.exec(),
    order: pins.order.extend({
      description: 'The order that was created',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'ORDERS_CREATE',
      async callback({ admin_graphql_api_id: id }) {
        const order = await getOrder(context.state.graphql, id);
        if (!order) {
          return;
        }

        context.next('exec', {
          order,
        });
      },
    });
  },
});

export const onOrderUpdated = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a order is updated',
  outputs: {
    exec: pin.exec(),
    order: pins.order.extend({
      description: 'The order that was updated',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'ORDERS_UPDATED',
      async callback({ admin_graphql_api_id: id }) {
        const order = await getOrder(context.state.graphql, id);
        if (!order) {
          return;
        }

        context.next('exec', {
          order,
        });
      },
    });
  },
});

export const onOrderDeleted = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a order is deleted',
  outputs: {
    exec: pin.exec(),
    id: pin.string({
      label: 'Order ID',
      description: 'The ID of the order that was deleted',
      isEditable: false,
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'ORDERS_DELETE',
      callback({ id }) {
        context.next('exec', {
          id: `gid://shopify/Order/${id}`,
        });
      },
    });
  },
});

export const onOrderPaid = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a order is paid',
  outputs: {
    exec: pin.exec(),
    order: pins.order.extend({
      description: 'The order that was paid',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'ORDERS_PAID',
      async callback({ admin_graphql_api_id: id }) {
        const order = await getOrder(context.state.graphql, id);
        if (!order) {
          return;
        }

        context.next('exec', {
          order,
        });
      },
    });
  },
});

export const onOrderCancelled = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a order is cancelled',
  outputs: {
    exec: pin.exec(),
    order: pins.order.extend({
      description: 'The order that was cancelled',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'ORDERS_CANCELLED',
      async callback({ admin_graphql_api_id: id }) {
        const order = await getOrder(context.state.graphql, id);
        if (!order) {
          return;
        }

        context.next('exec', {
          order,
        });
      },
    });
  },
});

export const onOrderEdited = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a order is edited',
  outputs: {
    exec: pin.exec(),
    order: pins.order.extend({
      description: 'The order that was edited',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'ORDERS_EDITED',
      async callback({ admin_graphql_api_id: id }) {
        const order = await getOrder(context.state.graphql, id);
        if (!order) {
          return;
        }

        context.next('exec', {
          order,
        });
      },
    });
  },
});

export const onOrderFulfilled = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a order is fulfilled',
  outputs: {
    exec: pin.exec(),
    order: pins.order.extend({
      description: 'The order that was fulfilled',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'ORDERS_FULFILLED',
      async callback({ admin_graphql_api_id: id }) {
        const order = await getOrder(context.state.graphql, id);
        if (!order) {
          return;
        }

        context.next('exec', {
          order,
        });
      },
    });
  },
});

export const onOrderPartiallyFulfilled = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a order is partially fulfilled',
  outputs: {
    exec: pin.exec(),
    order: pins.order.extend({
      description: 'The order that was partially fulfilled',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'ORDERS_PARTIALLY_FULFILLED',
      async callback({ admin_graphql_api_id: id }) {
        const order = await getOrder(context.state.graphql, id);
        if (!order) {
          return;
        }

        context.next('exec', {
          order,
        });
      },
    });
  },
});
