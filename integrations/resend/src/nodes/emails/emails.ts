import * as pins from '@/pins';
import { type GetEmailResponseSuccess } from 'resend';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

const category = {
  path: ['Emails'],
} satisfies i.NodeCategory;

export const sendEmail = i.nodes.callable({
  category,
  description: 'Send a simple email using Resend.',

  inputs: {
    from: pins.email.addressWithDisplayName.with({
      description:
        'Sender\'s email address. You can include a name using the format: "Your Name <sender@domain.com>".',
    }),
    to: pins.email.addresses.with({
      description: 'Recipient email addresses.',
    }),
    subject: pins.email.subject.with({
      description: 'Email subject line.',
    }),
    body: pins.email.body.with({
      description: 'Email body content. This is a simple text message.',
    }),
  },

  outputs: {
    id: pins.email.uuid.with({
      description: 'The ID of the sent email.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.emails.send({
      from: opts.inputs.from,
      to: opts.inputs.to,
      subject: opts.inputs.subject,
      text: opts.inputs.body,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('Missing response data');
    }

    return opts.next({
      id: response.data.id,
    });
  },
});

export const getEmail = i.nodes.callable({
  category,
  description: 'Retrieve details of a sent email by its ID.',

  inputs: {
    id: pins.email.uuid.with({
      description: 'The ID of the email to retrieve.',
    }),
  },

  outputs: {
    email: i.pins.data<GetEmailResponseSuccess>(),
  },

  async run(opts) {
    const response = await opts.state.resend.emails.get(opts.inputs.id);
    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('Missing response data');
    }

    return opts.next({
      email: response.data,
    });
  },
});

export const updateEmail = i.nodes.callable({
  category,
  description: 'Update a scheduled email by its ID.',

  inputs: {
    id: pins.email.uuid.with({
      description: 'The ID of the email to update.',
    }),
    scheduledAt: i.pins.data({
      description: 'New scheduled time for the email in ISO 8601 format.',
      control: i.controls.text({
        placeholder: '2023-10-01T12:00:00Z',
      }),
      schema: v.pipe(v.string(), v.isoDateTime()),
    }),
  },

  outputs: {
    id: pins.email.uuid.with({
      description: 'The ID of the updated email.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.emails.update({
      id: opts.inputs.id,
      scheduledAt: opts.inputs.scheduledAt,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('Missing response data');
    }

    return opts.next({
      id: response.data.id,
    });
  },
});

export const cancelEmail = i.nodes.callable({
  category,
  description: 'Cancel a previously sent email by its ID.',

  inputs: {
    id: pins.email.uuid.with({
      description: 'The ID of the email to cancel.',
    }),
  },

  outputs: {
    id: pins.email.uuid.with({
      description: 'The ID of the cancelled email.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.emails.cancel(opts.inputs.id);
    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('Missing response data');
    }

    return opts.next({
      id: response.data.id,
    });
  },
});
