import {
  type GetContactResponseSuccess,
  type ListContactsResponseSuccess,
} from 'resend';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';
import * as controls from '@/controls';
import * as schemas from '@/schemas';

const category = {
  path: ['Contacts'],
} satisfies i.NodeCategory;

export const createContact = i.nodes.callable({
  category,
  description: 'Create a new contact in Resend.',
  inputs: {
    audienceId: i.pins.data({
      description: 'The ID of the audience to add the contact to.',
      control: controls.uuid,
      schema: schemas.uuid,
    }),
    email: i.pins.data({
      description: 'The email address of the contact.',
      control: controls.email,
      schema: schemas.email,
    }),
    firstName: i.pins.data({
      description: 'First name of the contact.',
      control: i.controls.text({
        placeholder: 'Jane',
      }),
      schema: v.optional(v.string()),
    }),
    lastName: i.pins.data({
      description: 'Last name of the contact.',
      control: i.controls.text({
        placeholder: 'Smith',
      }),
      schema: v.optional(v.string()),
    }),
    unsubscribed: i.pins.data({
      description: 'Whether the contact is unsubscribed.',
      control: i.controls.switch(),
      schema: v.optional(v.boolean()),
    }),
  },
  outputs: {
    id: i.pins.data({
      description: 'The ID of the created contact.',
      schema: v.string(),
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: response.data!.id,
    });
  },
});

export const getContact = i.nodes.callable({
  category,
  description: 'Retrieve a contact by its ID.',
  inputs: {
    audienceId: i.pins.data({
      description: 'The ID of the audience to add the contact to.',
      control: i.controls.text({
        placeholder: '00000000-000-...',
      }),
      schema: schemas.uuid,
    }),
    id: i.pins.data({
      description: 'The ID of the contact.',
      control: i.controls.text({
        placeholder: '00000000-000-...',
      }),
      schema: v.optional(schemas.uuid),
    }),
    email: i.pins.data({
      description: 'The email address of the contact.',
      control: controls.email,
      schema: v.optional(schemas.email),
    }),
  },
  outputs: {
    contact: i.pins.data<GetContactResponseSuccess>({
      description: 'The contact object.',
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.contacts.get({
      audienceId: opts.inputs.audienceId,
      id: opts.inputs.id,
      email: opts.inputs.email,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      contact: response.data!,
    });
  },
});

export const listContacts = i.nodes.callable({
  category,
  description: 'List all contacts in Resend.',
  inputs: {
    audienceId: i.pins.data({
      description: 'The ID of the audience to list the contacts from.',
      control: i.controls.text({
        placeholder: '00000000-000-...',
      }),
      schema: schemas.uuid,
    }),
  },
  outputs: {
    contacts: i.pins.data<ListContactsResponseSuccess>({
      description: 'Array of contact objects.',
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.contacts.list({
      audienceId: opts.inputs.audienceId,
    });
    if (response.error) {
      throw new Error(response.error.message);
    }
    return opts.next({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      contacts: response.data!,
    });
  },
});

export const updateContact = i.nodes.callable({
  category,
  description: 'Update an existing contact by its ID.',
  inputs: {
    audienceId: i.pins.data({
      description: 'The ID of the audience to update the contact in.',
      control: i.controls.text({
        placeholder: '00000000-000-...',
      }),
      schema: schemas.uuid,
    }),
    id: i.pins.data({
      description: 'The ID of the contact.',
      control: i.controls.text({
        placeholder: '00000000-000-...',
      }),
      schema: schemas.uuid,
    }),
    email: i.pins.data({
      description: 'The email address of the contact.',
      control: controls.email,
      schema: v.optional(schemas.email),
    }),
    firstName: i.pins.data({
      description: 'First name of the contact.',
      control: i.controls.text({
        placeholder: 'Jane',
      }),
      schema: v.optional(v.string()),
    }),
    lastName: i.pins.data({
      description: 'Last name of the contact.',
      control: i.controls.text({
        placeholder: 'Smith',
      }),
      schema: v.optional(v.string()),
    }),
    unsubscribed: i.pins.data({
      description: 'Whether the contact is unsubscribed.',
      control: i.controls.switch(),
      schema: v.optional(v.boolean()),
    }),
  },
  outputs: {
    id: i.pins.data({
      description: 'The ID of the updated contact.',
      schema: v.string(),
    }),
  },
  async run(opts) {
    const response = await opts.state.resend.contacts.update({
      audienceId: opts.inputs.audienceId,
      id: opts.inputs.id,
      email: opts.inputs.email,
      firstName: opts.inputs.firstName,
      lastName: opts.inputs.lastName,
      unsubscribed: opts.inputs.unsubscribed,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: response.data!.id,
    });
  },
});

export const deleteContact = i.nodes.callable({
  category,
  description: 'Delete a contact by its ID.',
  inputs: {
    audienceId: i.pins.data({
      description: 'The ID of the audience to delete the contact from.',
      control: i.controls.text({
        placeholder: '00000000-000-...',
      }),
      schema: schemas.uuid,
    }),
    id: i.pins.data({
      description: 'The ID of the contact.',
      control: i.controls.text({
        placeholder: '00000000-000-...',
      }),
      schema: schemas.uuid,
    }),
  },
  outputs: {
    id: i.pins.data({
      description: 'The ID of the deleted contact.',
      schema: v.string(),
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: response.data!.contact,
    });
  },
});
