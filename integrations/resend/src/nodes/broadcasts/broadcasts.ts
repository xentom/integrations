import * as pins from '@/pins';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

const category = {
  path: ['Broadcasts'],
} satisfies i.NodeCategory;

export const createBroadcast = i.nodes.callable({
  category,
  description: 'Create a new broadcast.',

  inputs: {
    audienceId: pins.audience.id.with({
      description: 'The ID of the audience to send the broadcast to.',
    }),
    from: pins.email.addressWithDisplayName.with({
      description:
        'Sender email address. Include a name using format: "Your Name <sender@domain.com>".',
    }),
    subject: pins.broadcast.subject.with({
      description: 'Email subject line.',
    }),
    name: pins.broadcast.name.with({
      description: 'The name of the broadcast.',
      optional: true,
    }),
    html: pins.email.html.with({
      description: 'The HTML content of the broadcast.',
      optional: true,
    }),
    text: pins.email.text.with({
      description: 'The plain text content of the broadcast.',
      optional: true,
    }),
    previewText: pins.email.previewText.with({
      description: 'A short snippet shown in email previews.',
      optional: true,
    }),
    replyTo: pins.email.addresses.with({
      description: 'Reply-to email addresses.',
      optional: true,
    }),
  },

  outputs: {
    broadcast: pins.broadcast.object.with({
      description: 'The created broadcast object.',
      control: false,
    }),
  },

  async run(opts) {
    // Validate that at least one EmailRenderOption is provided
    if (!opts.inputs.html && !opts.inputs.text) {
      throw new Error('At least one of html or text must be provided');
    }

    const response = await opts.state.resend.broadcasts.create({
      audienceId: opts.inputs.audienceId,
      from: opts.inputs.from,
      subject: opts.inputs.subject,
      html: opts.inputs.html,
      text: opts.inputs.text,
      react: undefined,
      name: opts.inputs.name,
      previewText: opts.inputs.previewText,
      replyTo: opts.inputs.replyTo,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('Missing response data');
    }

    return opts.next({
      broadcast: response.data,
    });
  },
});

export const getBroadcast = i.nodes.callable({
  category,
  description: 'Retrieve details of a broadcast by its ID.',

  inputs: {
    id: pins.broadcast.id.with({
      description: 'The ID of the broadcast to retrieve.',
    }),
  },

  outputs: {
    broadcast: pins.broadcast.object.with({
      description: 'The broadcast object.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.broadcasts.get(opts.inputs.id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('Missing response data');
    }

    return opts.next({
      broadcast: response.data,
    });
  },
});

export const listBroadcasts = i.nodes.callable({
  category,
  description: 'Retrieve a list of broadcasts.',

  outputs: {
    broadcasts: pins.broadcast.list.with({
      description: 'The list of broadcasts.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.broadcasts.list();

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('Missing response data');
    }

    return opts.next({
      broadcasts: response.data,
    });
  },
});

export const updateBroadcast = i.nodes.callable({
  category,
  description: 'Update an existing broadcast.',

  inputs: {
    id: pins.broadcast.id.with({
      description: 'The ID of the broadcast to update.',
    }),
    name: pins.broadcast.name.with({
      description: 'The name of the broadcast.',
      optional: true,
    }),
    audienceId: pins.audience.id.with({
      description: 'The ID of the audience to send the broadcast to.',
      optional: true,
    }),
    from: pins.email.addressWithDisplayName.with({
      description: 'Sender email address.',
      optional: true,
    }),
    subject: pins.broadcast.subject.with({
      description: 'Email subject line.',
      optional: true,
    }),
    html: pins.email.html.with({
      description: 'The HTML content of the broadcast.',
      optional: true,
    }),
    text: pins.email.text.with({
      description: 'The plain text content of the broadcast.',
      optional: true,
    }),
    previewText: pins.email.previewText.with({
      description: 'A short snippet shown in email previews.',
      optional: true,
    }),
    replyTo: pins.email.addresses.with({
      description: 'Reply-to email addresses.',
      optional: true,
    }),
  },

  outputs: {
    broadcast: pins.broadcast.object.with({
      description: 'The updated broadcast object.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.broadcasts.update(opts.inputs.id, {
      name: opts.inputs.name,
      audienceId: opts.inputs.audienceId,
      from: opts.inputs.from,
      subject: opts.inputs.subject,
      html: opts.inputs.html,
      text: opts.inputs.text,
      previewText: opts.inputs.previewText,
      replyTo: opts.inputs.replyTo,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('Missing response data');
    }

    return opts.next({
      broadcast: response.data,
    });
  },
});

export const sendBroadcast = i.nodes.callable({
  category,
  description: 'Send a broadcast to its audience.',

  inputs: {
    id: pins.broadcast.id.with({
      description: 'The ID of the broadcast to send.',
    }),
    scheduledAt: i.pins.data({
      description:
        'When to send the broadcast in ISO 8601 format or relative time (e.g., "in 2 days"). If not provided, sends immediately.',
      control: i.controls.text({
        placeholder: '2023-10-01T12:00:00Z',
      }),
      schema: v.optional(v.pipe(v.string(), v.minLength(1))),
      optional: true,
    }),
  },

  outputs: {
    broadcast: pins.broadcast.object.with({
      description: 'The sent broadcast object.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.broadcasts.send(opts.inputs.id, {
      scheduledAt: opts.inputs.scheduledAt,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('Missing response data');
    }

    return opts.next({
      broadcast: response.data,
    });
  },
});

export const deleteBroadcast = i.nodes.callable({
  category,
  description: 'Delete a broadcast by its ID.',

  inputs: {
    id: pins.broadcast.id.with({
      description: 'The ID of the broadcast to delete.',
    }),
  },

  outputs: {
    result: i.pins.data({
      description: 'The deletion result.',
      control: false,
    }),
  },

  async run(opts) {
    const response = await opts.state.resend.broadcasts.remove(opts.inputs.id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error('Missing response data');
    }

    return opts.next({
      result: response.data,
    });
  },
});
