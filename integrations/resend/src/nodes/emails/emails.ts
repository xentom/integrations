import * as controls from '@/controls';
import * as pins from '@/pins';
import * as schemas from '@/schemas';
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
    from: i.pins.data({
      description:
        'Sender\'s email address. You can include a name using the format: "Your Name <sender@domain.com>".',
      control: controls.email,
      schema: v.union(
        [schemas.email, schemas.emailWithDisplayName],
        'Please enter a valid email address, with or without a display name.',
      ),
    }),

    to: i.pins.data({
      description: 'Recipient email addresses.',
      control: controls.email,
      schema: v.pipe(
        v.string(),
        v.transform((emails) => emails.split(',')),
        v.pipe(v.array(schemas.email), v.maxLength(50)),
      ),
    }),

    subject: i.pins.data({
      description: 'Email subject line.',
      control: i.controls.text({
        placeholder: 'Subject of the email',
      }),
      schema: v.string(),
    }),

    body: i.pins.data({
      description: 'Email body content. This is a simple text message.',
      control: i.controls.text({
        placeholder: 'Write your email as plain text here',
        rows: 5,
      }),
      schema: v.string(),
    }),
  },

  outputs: {
    id: i.pins.data({
      description: 'The ID of the sent email.',
      schema: v.string(),
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

    return opts.next({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: response.data!.id,
    });
  },
});

export const getEmail = i.nodes.callable({
  category,
  description: 'Retrieve details of a sent email by its ID.',

  inputs: {
    id: pins.emailIdWithControl,
  },

  outputs: {
    email: i.pins.data<GetEmailResponseSuccess>(),
  },

  async run(opts) {
    const response = await opts.state.resend.emails.get(opts.inputs.id);
    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      email: response.data!,
    });
  },
});

export const updateEmail = i.nodes.callable({
  category,
  description: 'Update a scheduled email by its ID.',

  inputs: {
    id: pins.emailIdWithControl,
    scheduledAt: i.pins.data({
      description: 'New scheduled time for the email in ISO 8601 format.',
      control: i.controls.text({
        placeholder: '2023-10-01T12:00:00Z',
      }),
      schema: v.pipe(v.string(), v.isoDateTime()),
    }),
  },

  outputs: {
    id: pins.emailId,
  },

  async run(opts) {
    const response = await opts.state.resend.emails.update({
      id: opts.inputs.id,
      scheduledAt: opts.inputs.scheduledAt,
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

export const cancelEmail = i.nodes.callable({
  category,
  description: 'Cancel a previously sent email by its ID.',

  inputs: {
    id: pins.emailIdWithControl,
  },

  outputs: {
    id: pins.emailId,
  },

  async run(opts) {
    const response = await opts.state.resend.emails.cancel(opts.inputs.id);
    if (response.error) {
      throw new Error(response.error.message);
    }

    return opts.next({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: response.data!.id,
    });
  },
});
