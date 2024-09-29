import { createWebhookHandler, getCustomer } from '@/lib/shopify';
import * as pins from '@/pins';
import { IconUser } from '@tabler/icons-react';
import { createAction, pin } from '@xentom/integration';

const group = 'Customers';

export const onCustomerCreated = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a customer is created',
  outputs: {
    exec: pin.exec(),
    customer: pins.customer.extend({
      description: 'The customer that was created',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'CUSTOMERS_CREATE',
      async callback({ admin_graphql_api_id: id }) {
        const customer = await getCustomer(context.state.graphql, id);
        if (!customer) {
          return;
        }

        context.next('exec', {
          customer,
        });
      },
    });
  },
});

export const onCustomerUpdated = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a customer is updated',
  outputs: {
    exec: pin.exec(),
    customer: pins.customer.extend({
      description: 'The customer that was updated',
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'CUSTOMERS_UPDATE',
      async callback({ admin_graphql_api_id: id }) {
        const customer = await getCustomer(context.state.graphql, id);
        if (!customer) {
          return;
        }

        context.next('exec', {
          customer,
        });
      },
    });
  },
});

export const onCustomerDeleted = createAction({
  group,
  icon: IconUser,
  description: 'Triggered when a customer is deleted',
  outputs: {
    exec: pin.exec(),
    id: pin.string({
      label: 'Customer ID',
      description: 'The ID of the customer that was deleted',
      isEditable: false,
    }),
  },
  run(context) {
    createWebhookHandler(context, {
      topic: 'CUSTOMERS_DELETE',
      callback({ admin_graphql_api_id: id }) {
        context.next('exec', {
          id,
        });
      },
    });
  },
});
