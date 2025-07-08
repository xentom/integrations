import * as pins from '@/pins';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

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
    id: pins.audience.uuid.with({
      description: 'The ID of the created audience.',
      control: false,
    }),
    name: pins.audience.name.with({
      description: 'The name of the created audience.',
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

    if (!response.data) {
      throw new Error('No audience data returned');
    }

    return opts.next({
      id: response.data.id,
      name: response.data.name,
    });
  },
});

export const listAudiences = i.nodes.callable({
  category,
  description: 'List all audiences in Resend.',

  inputs: {},

  outputs: {
    audiences: i.pins.data({
      description: 'List of audiences',
      control: false,
      schema: v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          created_at: v.string(),
        }),
      ),
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.audiences.list();

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('No audience data returned');
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
    id: pins.audience.uuid.with({
      description: 'The ID of the audience to retrieve.',
    }),
  },

  outputs: {
    id: pins.audience.uuid.with({
      description: 'The ID of the audience.',
      control: false,
    }),
    name: pins.audience.name.with({
      description: 'The name of the audience.',
      control: false,
    }),
    createdAt: pins.audience.createdAt.with({
      description: 'When the audience was created.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.audiences.get(opts.inputs.id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('No audience data returned');
    }

    return opts.next({
      id: response.data.id,
      name: response.data.name,
      createdAt: response.data.created_at,
    });
  },
});

export const deleteAudience = i.nodes.callable({
  category,
  description: 'Delete an audience by ID.',

  inputs: {
    id: pins.audience.uuid.with({
      description: 'The ID of the audience to delete.',
    }),
  },

  outputs: {
    id: pins.audience.uuid.with({
      description: 'The ID of the deleted audience.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.audiences.remove(opts.inputs.id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('No audience data returned');
    }

    if (!response.data.deleted) {
      throw new Error('Failed to delete audience');
    }

    return opts.next({
      id: response.data.id,
    });
  },
});
