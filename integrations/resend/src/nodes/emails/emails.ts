import * as pins from '@/pins';
import { type GetEmailResponseSuccess } from 'resend';
import * as v from 'valibot';

import * as i from '@xentom/integration-framework';

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
    html: pins.email.html.with({
      description: 'The HTML content of the email.',
      optional: true,
    }),
    text: pins.email.text.with({
      description: 'The plain text content of the email.',
      optional: true,
    }),
    cc: pins.email.addresses.with({
      description: 'Carbon copy recipient email addresses.',
      optional: true,
    }),
    bcc: pins.email.addresses.with({
      description: 'Blind carbon copy recipient email addresses.',
      optional: true,
    }),
    replyTo: pins.email.addresses.with({
      description: 'Reply-to email addresses.',
      optional: true,
    }),
    scheduledAt: pins.email.scheduledAt.with({
      description:
        'Schedule email for future sending (ISO 8601 format or natural language like "in 1 min").',
      optional: true,
    }),
    headers: pins.email.headers.with({
      description: 'Custom email headers as key-value pairs.',
      optional: true,
    }),
    attachments: pins.email.attachments.with({
      description:
        'File attachments (JSON array with content, filename, path, contentType).',
      optional: true,
    }),
    tags: pins.email.tags.with({
      description: 'Custom key/value metadata for email tracking.',
      optional: true,
    }),
    idempotencyKey: pins.email.idempotencyKey.with({
      description:
        'Unique key for safe retries without duplicating operations.',
      optional: true,
    }),
  },

  outputs: {
    id: pins.email.id.with({
      description: 'The ID of the sent email.',
      control: false,
    }),
  },

  async run(opts) {
    // Validate that at least one content type is provided
    if (!opts.inputs.html && !opts.inputs.text) {
      throw new Error('At least one of html or text must be provided');
    }

    const response = await opts.state.resend.emails.send(
      {
        from: opts.inputs.from,
        to: opts.inputs.to,
        subject: opts.inputs.subject,
        html: opts.inputs.html,
        text: opts.inputs.text,
        react: undefined,
        cc: opts.inputs.cc,
        bcc: opts.inputs.bcc,
        replyTo: opts.inputs.replyTo,
        scheduledAt: opts.inputs.scheduledAt,
        headers: opts.inputs.headers,
        attachments: opts.inputs.attachments,
        tags: opts.inputs.tags,
      },
      {
        idempotencyKey: opts.inputs.idempotencyKey,
      },
    );

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
    id: pins.email.id.with({
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
    id: pins.email.id.with({
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
    id: pins.email.id.with({
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
    id: pins.email.id.with({
      description: 'The ID of the email to cancel.',
    }),
  },

  outputs: {
    id: pins.email.id.with({
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
