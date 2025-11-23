import * as i from '@xentom/integration-framework';

import * as pins from '@/pins';

const nodes = i.nodes.group('Contacts');

export const createContact = nodes.callable({
  description: 'Create a new contact in Resend.',
  inputs: {
    audienceId: pins.audience.id.with({
      description: 'The ID of the audience to add the contact to.',
    }),
    email: pins.email.address.with({
      description: 'The email address of the contact.',
    }),
    firstName: pins.contact.firstName.with({
      optional: true,
    }),
    lastName: pins.contact.lastName.with({
      optional: true,
    }),
    unsubscribed: pins.contact.unsubscribed.with({
      optional: true,
    }),
  },
  outputs: {
    id: pins.contact.id.with({
      description: 'The ID of the created contact.',
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.contacts.create({
      email: opts.inputs.email,
      firstName: opts.inputs.firstName,
      lastName: opts.inputs.lastName,
      unsubscribed: opts.inputs.unsubscribed,
      audienceId: opts.inputs.audienceId,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      id: response.data.id,
    });
  },
});

export const getContact = nodes.callable({
  description: 'Retrieve a contact by its ID.',
  inputs: {
    audienceId: pins.audience.id.with({
      description: 'The ID of the audience the contact belongs to.',
    }),
    id: pins.contact.id.with({
      optional: true,
    }),
    email: pins.email.address.with({
      description: 'The email address of the contact.',
      optional: true,
    }),
  },
  outputs: {
    contact: pins.contact.item.with(),
  },
  async run(opts) {
    if (!opts.inputs.id && !opts.inputs.email) {
      throw new Error('Either ID or email must be provided.');
    }

    const response = await opts.state.resend.contacts.get({
      audienceId: opts.inputs.audienceId,
      ...(opts.inputs.id
        ? { id: opts.inputs.id }
        : // biome-ignore lint/style/noNonNullAssertion: <email is guaranteed to be provided>
          { email: opts.inputs.email! }),
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      contact: response.data,
    });
  },
});

export const listContacts = nodes.callable({
  description: 'List all contacts in Resend.',
  inputs: {
    audienceId: pins.audience.id.with({
      description: 'The ID of the audience to list the contacts from.',
    }),
  },
  outputs: {
    contacts: pins.contact.items,
  },
  async run(opts) {
    const response = await opts.state.resend.contacts.list({
      audienceId: opts.inputs.audienceId,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      contacts: response.data.data,
    });
  },
});

export const updateContact = nodes.callable({
  description: 'Update an existing contact by its ID.',
  inputs: {
    audienceId: pins.audience.id.with({
      description: 'The ID of the audience to update the contact in.',
    }),
    id: pins.contact.id,
    email: pins.email.address.with({
      description: 'The email address of the contact.',
      optional: true,
    }),
    firstName: pins.contact.firstName.with({
      description: 'First name of the contact.',
      optional: true,
    }),
    lastName: pins.contact.lastName.with({
      description: 'Last name of the contact.',
      optional: true,
    }),
    unsubscribed: pins.contact.unsubscribed.with({
      description: 'Whether the contact is unsubscribed.',
      optional: true,
    }),
  },
  outputs: {
    id: pins.contact.id.with({
      description: 'The ID of the updated contact.',
      control: false,
    }),
  },
  async run(opts) {
    if (!opts.inputs.id && !opts.inputs.email) {
      throw new Error('Either ID or email must be provided.');
    }

    const response = await opts.state.resend.contacts.update({
      audienceId: opts.inputs.audienceId,
      firstName: opts.inputs.firstName,
      lastName: opts.inputs.lastName,
      unsubscribed: opts.inputs.unsubscribed,

      ...(opts.inputs.id
        ? { id: opts.inputs.id }
        : // biome-ignore lint/style/noNonNullAssertion: <email is guaranteed to be provided>
          { email: opts.inputs.email! }),
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      id: response.data.id,
    });
  },
});

export const deleteContact = nodes.callable({
  description: 'Delete a contact by its ID.',
  inputs: {
    audienceId: pins.audience.id.with({
      description: 'The ID of the audience to delete the contact from.',
    }),
    id: pins.contact.id,
  },
  outputs: {
    id: pins.contact.id.with({
      description: 'The ID of the deleted contact.',
      control: false,
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.contacts.remove({
      audienceId: opts.inputs.audienceId,
      id: opts.inputs.id,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      id: response.data.contact,
    });
  },
});
