import { type ChatUpdateResponse } from '@slack/web-api';

import * as i from '@acme/integration-framework';

import * as pins from '../../pins';

const category = {
  path: ['Chat'],
} satisfies i.NodeCategory;

export const postMessage = i.nodes.callable({
  category,
  description: 'Send a message to a channel, group, or DM.',

  inputs: {
    // Required fields first
    channel: pins.chat.channel.with({
      description:
        'Channel, group, or DM to send message to. Can be an ID or name.',
    }),
    text: pins.chat.messageText.with({
      description: 'The text content of the message.',
    }),

    // Optional formatting options
    blocks: pins.chat.blocks.with({
      description: 'Block Kit blocks for rich formatting (JSON string).',
      optional: true,
    }),
    attachments: pins.chat.attachments.with({
      description: 'Legacy message attachments (JSON string).',
      optional: true,
    }),

    // Thread options
    threadTs: pins.chat.threadTs.with({
      description: 'Provide to reply to a specific message thread.',
      optional: true,
    }),
    replyBroadcast: pins.chat.replyBroadcast.with({
      description: 'Broadcast thread reply to the entire channel.',
      optional: true,
    }),

    // Advanced options
    parse: pins.chat.parse.with({
      description: 'Change how messages are treated.',
      optional: true,
    }),
    linkNames: pins.chat.linkNames.with({
      description: 'Find and link channel names and usernames.',
      optional: true,
    }),
    unfurlLinks: pins.chat.unfurlLinks.with({
      description: 'Enable automatic link unfurling.',
      optional: true,
    }),
    unfurlMedia: pins.chat.unfurlMedia.with({
      description: 'Enable automatic media unfurling.',
      optional: true,
    }),
  },

  outputs: {
    response: pins.chat.messageResponse.with({
      description: 'The response from posting the message.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.chat.postMessage({
      channel: opts.inputs.channel,
      text: opts.inputs.text,
      blocks: opts.inputs.blocks,
      attachments: opts.inputs.attachments,
      thread_ts: opts.inputs.threadTs,
      parse: opts.inputs.parse,
      link_names: opts.inputs.linkNames,
      unfurl_links: opts.inputs.unfurlLinks,
      unfurl_media: opts.inputs.unfurlMedia,
    });

    if (!response.ok) {
      throw new Error(`Failed to post message: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const postEphemeral = i.nodes.callable({
  category,
  description: 'Send an ephemeral message to a user in a channel.',

  inputs: {
    // Required fields
    channel: pins.chat.channel.with({
      description: 'Channel, group, or DM to send ephemeral message to.',
    }),
    user: pins.chat.ephemeralUser.with({
      description: 'User to send the ephemeral message to.',
    }),
    text: pins.chat.messageText.with({
      description: 'The text content of the ephemeral message.',
    }),

    // Optional formatting
    blocks: pins.chat.blocks.with({
      description: 'Block Kit blocks for rich formatting (JSON string).',
      optional: true,
    }),
    attachments: pins.chat.attachments.with({
      description: 'Legacy message attachments (JSON string).',
      optional: true,
    }),

    // Threading
    threadTs: pins.chat.threadTs.with({
      description: 'Provide to make the ephemeral message part of a thread.',
      optional: true,
    }),

    // Options
    parse: pins.chat.parse.with({
      description: 'Change how messages are treated.',
      optional: true,
    }),
    linkNames: pins.chat.linkNames.with({
      description: 'Find and link channel names and usernames.',
      optional: true,
    }),
  },

  outputs: {
    response: pins.chat.messageResponse.with({
      description: 'The response from posting the ephemeral message.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.chat.postEphemeral({
      channel: opts.inputs.channel,
      user: opts.inputs.user,
      text: opts.inputs.text,
      blocks: opts.inputs.blocks,
      attachments: opts.inputs.attachments,
      thread_ts: opts.inputs.threadTs,
      parse: opts.inputs.parse,
      link_names: opts.inputs.linkNames,
    });

    if (!response.ok) {
      throw new Error(`Failed to post ephemeral message: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const deleteMessage = i.nodes.callable({
  category,
  description: 'Delete a message from a channel.',

  inputs: {
    channel: pins.chat.channel.with({
      description: 'Channel containing the message to delete.',
    }),
    ts: pins.common.timestamp.with({
      description: 'Timestamp of the message to delete.',
    }),
    asUser: pins.chat.asUser.with({
      description: 'Pass true to delete the message as the authenticated user.',
      optional: true,
    }),
  },

  outputs: {
    response: pins.chat.messageResponse.with({
      description: 'The response from deleting the message.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.chat.delete({
      channel: opts.inputs.channel,
      ts: opts.inputs.ts,
      as_user: opts.inputs.asUser,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete message: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const updateMessage = i.nodes.callable({
  category,
  description: 'Update a message in a channel.',

  inputs: {
    // Required fields
    channel: pins.chat.channel.with({
      description: 'Channel containing the message to update.',
    }),
    ts: pins.common.timestamp.with({
      description: 'Timestamp of the message to update.',
    }),
    text: pins.chat.messageText.with({
      description: 'New text for the message.',
    }),

    // Optional formatting
    blocks: pins.chat.blocks.with({
      description: 'New Block Kit blocks for the message (JSON string).',
      optional: true,
    }),
    attachments: pins.chat.attachments.with({
      description: 'New message attachments (JSON string).',
      optional: true,
    }),

    // Options
    parse: pins.chat.parse.with({
      description: 'Change how messages are treated.',
      optional: true,
    }),
    linkNames: pins.chat.linkNames.with({
      description: 'Find and link channel names and usernames.',
      optional: true,
    }),
    asUser: pins.chat.asUser.with({
      description: 'Update the message as the authenticated user.',
      optional: true,
    }),
  },

  outputs: {
    response: pins.chat.messageResponse.with<ChatUpdateResponse>({
      description: 'The response from updating the message.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.chat.update({
      channel: opts.inputs.channel,
      ts: opts.inputs.ts,
      text: opts.inputs.text,
      blocks: opts.inputs.blocks,
      attachments: opts.inputs.attachments,
      parse: opts.inputs.parse,
      link_names: opts.inputs.linkNames,
      as_user: opts.inputs.asUser,
    });

    if (!response.ok) {
      throw new Error(`Failed to update message: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const getPermalink = i.nodes.callable({
  category,
  description: 'Get a permanent link to a message.',

  inputs: {
    channel: pins.chat.channel.with({
      description: 'Channel containing the message.',
    }),
    messageTs: pins.common.timestamp.with({
      description: 'Timestamp of the message to get permalink for.',
    }),
  },

  outputs: {
    response: pins.chat.messageResponse.with({
      description: 'The response containing the permalink.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.chat.getPermalink({
      channel: opts.inputs.channel,
      message_ts: opts.inputs.messageTs,
    });

    if (!response.ok) {
      throw new Error(`Failed to get permalink: ${response.error}`);
    }

    return opts.next({ response });
  },
});
