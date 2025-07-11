import * as i from '@acme/integration-framework';

import * as pins from '../../pins';

const category = {
  path: ['Reactions'],
} satisfies i.NodeCategory;

export const addReaction = i.nodes.callable({
  category,
  description: 'Add a reaction to a message.',

  inputs: {
    channel: pins.chat.channel.with({
      description: 'Channel containing the message to react to.',
    }),
    name: pins.reaction.name.with({
      description: 'Emoji name to react with (without colons).',
    }),
    timestamp: pins.common.timestamp.with({
      description: 'Timestamp of the message to react to.',
    }),
  },

  outputs: {
    response: pins.common.slackResponse.with({
      description: 'Response from adding the reaction.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.reactions.add({
      channel: opts.inputs.channel,
      name: opts.inputs.name,
      timestamp: opts.inputs.timestamp,
    });

    if (!response.ok) {
      throw new Error(`Failed to add reaction: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const removeReaction = i.nodes.callable({
  category,
  description: 'Remove a reaction from a message.',

  inputs: {
    channel: pins.chat.channel.with({
      description: 'Channel containing the message.',
    }),
    name: pins.reaction.name.with({
      description: 'Emoji name to remove (without colons).',
    }),
    timestamp: pins.common.timestamp.with({
      description: 'Timestamp of the message.',
    }),
  },

  outputs: {
    response: pins.common.slackResponse.with({
      description: 'Response from removing the reaction.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.reactions.remove({
      channel: opts.inputs.channel,
      name: opts.inputs.name,
      timestamp: opts.inputs.timestamp,
    });

    if (!response.ok) {
      throw new Error(`Failed to remove reaction: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const getReactions = i.nodes.callable({
  category,
  description: 'Get reactions for a message.',

  inputs: {
    channel: pins.chat.channel.with({
      description: 'Channel containing the message.',
    }),
    timestamp: pins.common.timestamp.with({
      description: 'Timestamp of the message.',
    }),
    full: pins.reaction.full.with({
      description: 'Include full user info for reactions.',
      optional: true,
    }),
  },

  outputs: {
    response: pins.reaction.reactionsGetResponse.with({
      description: 'Reaction information for the message.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.reactions.get({
      channel: opts.inputs.channel,
      timestamp: opts.inputs.timestamp,
      full: opts.inputs.full,
    });

    if (!response.ok) {
      throw new Error(`Failed to get reactions: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const listReactions = i.nodes.callable({
  category,
  description: 'List reactions made by the authenticated user.',

  inputs: {
    user: pins.user.userId.with({
      description: 'User to get reactions for.',
      optional: true,
    }),
    full: pins.reaction.full.with({
      description: 'Include full user info for reactions.',
      optional: true,
    }),
    count: pins.common.limit.with({
      description: 'Number of reactions to return.',
      optional: true,
    }),
    page: pins.reaction.page.with({
      description: 'Page number for pagination.',
      optional: true,
    }),
  },

  outputs: {
    response: pins.reaction.reactionsListResponse.with({
      description: 'List of reactions by the user.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.reactions.list({
      user: opts.inputs.user,
      full: opts.inputs.full,
      count: opts.inputs.count,
      page: opts.inputs.page ? Number(opts.inputs.page) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to list reactions: ${response.error}`);
    }

    return opts.next({ response });
  },
});
