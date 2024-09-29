import * as pins from '@/pins';
import { createWebhook } from '@/utils/webhooks';
import { IconUser, IconUsers } from '@tabler/icons-react';
import type Stripe from 'stripe';
import { createAction, pin } from '@xentom/integration';

const group = 'Customers';

export const onCustomerCreated = createCustomerTrigger('customer.created');
export const onCustomerUpdated = createCustomerTrigger('customer.updated');
export const onCustomerDeleted = createCustomerTrigger('customer.deleted');

type CustomerEvents<T> =
  T extends `customer.${'created' | 'updated' | 'deleted'}` ? T : never;

function createCustomerTrigger(event: CustomerEvents<Stripe.Event['type']>) {
  return createAction({
    group,
    icon: IconUser,
    outputs: {
      exec: pin.exec(),
      customer: pins.customer,
    },
    run(context) {
      context.state.events.on(
        event,
        ({ data }: Extract<Stripe.Event, { type: typeof event }>) => {
          context.next('exec', {
            customer: data.object,
          });
        },
      );

      createWebhook(context, {
        events: [event],
      });
    },
  });
}

export const getCustomer = createAction({
  group,
  icon: IconUser,
  inputs: {
    id: pin.string({
      label: 'ID',
      description: 'The ID of the customer to retrieve.',
    }),
  },
  outputs: {
    customer: pins.customer,
  },
  async run({ inputs, state, outputs }) {
    outputs.customer = await state.stripe.customers.retrieve(inputs.id);
  },
});

export const forEachCustomer = createAction({
  group,
  icon: IconUsers,
  inputs: {
    exec: pin.exec({
      async run({ state, next }) {
        let completed = false;
        let starting_after: string | undefined;
        while (!completed) {
          const customers = await state.stripe.customers.list({
            limit: 100,
            starting_after,
          });

          for (const customer of customers.data) {
            next('callback', {
              customer,
            });
          }

          if (customers.has_more) {
            starting_after = customers.data[customers.data.length - 1].id;
          } else {
            completed = true;
          }
        }
      },
    }),
  },
  outputs: {
    completed: pin.exec({
      description: 'Executes when all customers have been processed.',
    }),
    callback: pin.exec({
      label: 'Callback',
      description: 'Executes for each customer.',
    }),
    customer: pins.customer,
  },
});

export const createCustomer = createAction({
  group,
  icon: IconUser,
  inputs: {
    exec: pin.exec({
      async run({ inputs, state, next }) {
        next('exec', {
          customer: await state.stripe.customers.create({
            name: inputs.name,
            email: inputs.email,
            description: inputs.description,
            address: inputs.address,
          }),
        });
      },
    }),
    name: pin.string({
      description: "The customer's full name or business name.",
      isOptional: true,
    }),
    email: pin.string({
      description:
        "Customer's email address. It's displayed alongside the customer in your dashboard and can be useful for searching and tracking. This may be up to 512 characters.",
      isOptional: true,
    }),
    description: pin.string({
      description:
        'An arbitrary string that you can attach to a customer object. It is displayed alongside the customer in the dashboard.',
      isOptional: true,
    }),
    address: pins.address.extend({
      isOptional: true,
    }),
  },
  outputs: {
    exec: pin.exec(),
    customer: pins.customer,
  },
});

export const updateCustomer = createAction({
  group,
  icon: IconUser,
  inputs: {
    exec: pin.exec({
      async run({ inputs, state, next }) {
        next('exec', {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          customer: await state.stripe.customers.update(inputs.customer.id, {
            name: inputs.name,
            email: inputs.email,
            description: inputs.description,
            address: inputs.address,
          }),
        });
      },
    }),
    customer: pins.customer,
    name: pin.string({
      description: "The customer's full name or business name.",
      isOptional: true,
    }),
    email: pin.string({
      description:
        "Customer's email address. It's displayed alongside the customer in your dashboard and can be useful for searching and tracking. This may be up to 512 characters.",
      isOptional: true,
    }),
    description: pin.string({
      description:
        'An arbitrary string that you can attach to a customer object. It is displayed alongside the customer in the dashboard.',
      isOptional: true,
    }),
    address: pins.address.extend({
      isOptional: true,
    }),
  },
  outputs: {
    exec: pin.exec(),
    customer: pins.customer,
  },
});

export const deleteCustomer = createAction({
  group,
  icon: IconUser,
  inputs: {
    exec: pin.exec({
      async run({ inputs, state, next }) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await state.stripe.customers.del(inputs.customer.id);
        next('exec');
      },
    }),
    customer: pins.customer,
  },
  outputs: {
    exec: pin.exec(),
  },
});
