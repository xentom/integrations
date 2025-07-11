import * as i from '@acme/integration-framework';

import * as pins from '../../pins';

const category = {
  path: ['Conversations'],
} satisfies i.NodeCategory;

export const listConversations = i.nodes.callable({
  category,
  description: 'List all conversations in a Slack workspace.',

  inputs: {
    types: pins.conversation.types.with({
      description:
        'Mix and match conversation types by providing a comma-separated list.',
    }),
    excludeArchived: pins.conversation.excludeArchived.with({
      description: 'Set to true to exclude archived channels from the list.',
    }),
    limit: pins.common.limit.with({
      description: 'The maximum number of items to return.',
    }),
    cursor: pins.common.cursor.with({
      description:
        'Paginate through collections by providing the next_cursor value.',
    }),
  },

  outputs: {
    response: pins.conversation.conversationsListResponse.with({
      description: 'List of conversations.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.list({
      types: opts.inputs.types,
      exclude_archived: opts.inputs.excludeArchived,
      limit: opts.inputs.limit,
      cursor: opts.inputs.cursor,
    });

    if (!response.ok) {
      throw new Error(`Failed to list conversations: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const getConversationInfo = i.nodes.callable({
  category,
  description: 'Get information about a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to get info on.',
    }),
    includeLocale: pins.user.includeLocale.with({
      description:
        'Set this to true to receive the locale for this conversation.',
    }),
    includeNumMembers: pins.conversation.includeNumMembers.with({
      description:
        'Set to true to include the member count for the returned conversation.',
    }),
  },

  outputs: {
    response: pins.conversation.conversationInfoResponse.with({
      description: 'Information about the conversation.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.info({
      channel: opts.inputs.channel,
      include_locale: opts.inputs.includeLocale,
      include_num_members: opts.inputs.includeNumMembers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get conversation info: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const createConversation = i.nodes.callable({
  category,
  description: 'Create a new conversation (channel).',

  inputs: {
    name: pins.conversation.channelName.with({
      description: 'Name of the conversation to create.',
    }),
    isPrivate: pins.conversation.isPrivate.with({
      description: 'Create a private channel instead of public.',
    }),
    teamId: pins.user.teamId.with({
      description: 'Team ID for Enterprise Grid.',
    }),
  },

  outputs: {
    response: pins.conversation.conversationCreateResponse.with({
      description: 'Information about the created conversation.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.create({
      name: opts.inputs.name,
      is_private: opts.inputs.isPrivate,
      team_id: opts.inputs.teamId,
    });

    if (!response.ok) {
      throw new Error(`Failed to create conversation: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const joinConversation = i.nodes.callable({
  category,
  description: 'Join an existing conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to join.',
    }),
  },

  outputs: {
    response: pins.conversation.conversationInfoResponse.with({
      description: 'Information about the joined conversation.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.join({
      channel: opts.inputs.channel,
    });

    if (!response.ok) {
      throw new Error(`Failed to join conversation: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const leaveConversation = i.nodes.callable({
  category,
  description: 'Leave a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to leave.',
    }),
  },

  outputs: {
    response: pins.common.slackResponse.with({
      description: 'Response from leaving the conversation.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.leave({
      channel: opts.inputs.channel,
    });

    if (!response.ok) {
      throw new Error(`Failed to leave conversation: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const archiveConversation = i.nodes.callable({
  category,
  description: 'Archive a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to archive.',
    }),
  },

  outputs: {
    response: pins.common.slackResponse.with({
      description: 'Response from archiving the conversation.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.archive({
      channel: opts.inputs.channel,
    });

    if (!response.ok) {
      throw new Error(`Failed to archive conversation: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const unarchiveConversation = i.nodes.callable({
  category,
  description: 'Unarchive a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to unarchive.',
    }),
  },

  outputs: {
    response: pins.common.slackResponse.with({
      description: 'Response from unarchiving the conversation.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.unarchive({
      channel: opts.inputs.channel,
    });

    if (!response.ok) {
      throw new Error(`Failed to unarchive conversation: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const inviteToConversation = i.nodes.callable({
  category,
  description: 'Invite users to a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to invite users to.',
    }),
    users: pins.conversation.userList.with({
      description: 'Comma-separated list of user IDs to invite.',
    }),
  },

  outputs: {
    response: pins.conversation.conversationInfoResponse.with({
      description: 'Updated conversation information after inviting users.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.invite({
      channel: opts.inputs.channel,
      users: opts.inputs.users,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to invite users to conversation: ${response.error}`,
      );
    }

    return opts.next({ response });
  },
});

export const kickFromConversation = i.nodes.callable({
  category,
  description: 'Remove a user from a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to remove user from.',
    }),
    user: pins.user.userId.with({
      description: 'User ID to remove from the conversation.',
    }),
  },

  outputs: {
    response: pins.common.slackResponse.with({
      description: 'Response from removing user from conversation.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.kick({
      channel: opts.inputs.channel,
      user: opts.inputs.user,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to remove user from conversation: ${response.error}`,
      );
    }

    return opts.next({ response });
  },
});

export const getConversationMembers = i.nodes.callable({
  category,
  description: 'Get members of a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to get members for.',
    }),
    limit: pins.common.limit.with({
      description: 'Maximum number of users to return.',
    }),
    cursor: pins.common.cursor.with({
      description:
        'Paginate through collections by providing the next_cursor value.',
    }),
  },

  outputs: {
    response: pins.conversation.membersResponse.with({
      description: 'List of conversation members.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.members({
      channel: opts.inputs.channel,
      limit: opts.inputs.limit,
      cursor: opts.inputs.cursor,
    });

    if (!response.ok) {
      throw new Error(`Failed to get conversation members: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const getConversationHistory = i.nodes.callable({
  category,
  description: 'Get message history for a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to get history for.',
    }),
    latest: pins.common.timestamp.with({
      description: 'End of time range of messages to include.',
    }),
    oldest: pins.common.timestamp.with({
      description: 'Start of time range of messages to include.',
    }),
    inclusive: pins.conversation.inclusive.with({
      description: 'Include messages with latest or oldest timestamp.',
    }),
    limit: pins.common.limit.with({
      description: 'Number of messages to return.',
    }),
    cursor: pins.common.cursor.with({
      description:
        'Paginate through collections by providing the next_cursor value.',
    }),
  },

  outputs: {
    response: pins.conversation.historyResponse.with({
      description: 'Conversation message history.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.history({
      channel: opts.inputs.channel,
      latest: opts.inputs.latest,
      oldest: opts.inputs.oldest,
      inclusive: opts.inputs.inclusive,
      limit: opts.inputs.limit,
      cursor: opts.inputs.cursor,
    });

    if (!response.ok) {
      throw new Error(`Failed to get conversation history: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const setConversationPurpose = i.nodes.callable({
  category,
  description: 'Set the purpose of a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to set purpose for.',
    }),
    purpose: pins.conversation.purpose.with({
      description: 'New purpose for the conversation.',
      optional: false,
    }),
  },

  outputs: {
    response: pins.conversation.purposeResponse.with({
      description: 'Response from setting conversation purpose.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.setPurpose({
      channel: opts.inputs.channel,
      purpose: opts.inputs.purpose,
    });

    if (!response.ok) {
      throw new Error(`Failed to set conversation purpose: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const setConversationTopic = i.nodes.callable({
  category,
  description: 'Set the topic of a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to set topic for.',
    }),
    topic: pins.conversation.topic.with({
      description: 'New topic for the conversation.',
      optional: false,
    }),
  },

  outputs: {
    response: pins.conversation.topicResponse.with({
      description: 'Response from setting conversation topic.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.setTopic({
      channel: opts.inputs.channel,
      topic: opts.inputs.topic,
    });

    if (!response.ok) {
      throw new Error(`Failed to set conversation topic: ${response.error}`);
    }

    return opts.next({ response });
  },
});

export const renameConversation = i.nodes.callable({
  category,
  description: 'Rename a conversation.',

  inputs: {
    channel: pins.conversation.channelId.with({
      description: 'Conversation to rename.',
    }),
    name: pins.conversation.channelName.with({
      description: 'New name for the conversation.',
    }),
  },

  outputs: {
    response: pins.conversation.conversationInfoResponse.with({
      description: 'Updated conversation information after renaming.',
    }),
  },

  async run(opts) {
    const response = await opts.state.slack.conversations.rename({
      channel: opts.inputs.channel,
      name: opts.inputs.name,
    });

    if (!response.ok) {
      throw new Error(`Failed to rename conversation: ${response.error}`);
    }

    return opts.next({ response });
  },
});
