import * as i from '@xentom/integration-framework';

import * as pins from '@/pins';

const category = {
  path: ['Audiences'],
} satisfies i.NodeCategory;

export const createAudience = i.nodes.callable({
  category,
  description: 'Create a new audience in Resend.',

  inputs: {
    name: pins.audience.name.with({
      description: 'The name of the audience to create.',
    }),
  },

  outputs: {
    id: pins.audience.id.with({
      description: 'The ID of the created audience.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.audiences.create({
      name: opts.inputs.name,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      id: response.data.id,
    });
  },
});

export const listAudiences = i.nodes.callable({
  category,
  description: 'List all audiences in Resend.',

  outputs: {
    audiences: pins.audience.items.with({
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.audiences.list();

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      audiences: response.data.data,
    });
  },
});

export const getAudience = i.nodes.callable({
  category,
  description: 'Get a specific audience by ID.',

  inputs: {
    id: pins.audience.id.with({
      description: 'The ID of the audience to retrieve.',
    }),
  },

  outputs: {
    audience: pins.audience.item.with({
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.audiences.get(opts.inputs.id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      audience: response.data,
    });
  },
});

export const deleteAudience = i.nodes.callable({
  category,
  description: 'Delete an audience by ID.',

  inputs: {
    id: pins.audience.id.with({
      description: 'The ID of the audience to delete.',
    }),
  },

  outputs: {
    id: pins.audience.id.with({
      description: 'The ID of the deleted audience.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.audiences.remove(opts.inputs.id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data.deleted) {
      throw new Error('Failed to delete audience');
    }

    return opts.next({
      id: response.data.id,
    });
  },
});
