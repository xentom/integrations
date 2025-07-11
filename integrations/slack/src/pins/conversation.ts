import {
  type ConversationsCreateResponse,
  type ConversationsHistoryResponse,
  type ConversationsInfoResponse,
  type ConversationsListResponse,
  type ConversationsMembersResponse,
  type ConversationsSetPurposeResponse,
  type ConversationsSetTopicResponse,
} from '@slack/web-api';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

// Channel/conversation ID
export const channelId = i.pins.data({
  description: 'A Slack channel/conversation ID (e.g., C1234567890).',
  control: i.controls.text({
    placeholder: 'C1234567890',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Channel name for creation
export const channelName = i.pins.data({
  description: 'Name for the channel (without # prefix).',
  control: i.controls.text({
    placeholder: 'general',
  }),
  schema: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1),
    v.maxLength(21),
    v.regex(
      /^[a-z0-9_-]+$/,
      'Channel name must contain only lowercase letters, numbers, hyphens, and underscores',
    ),
  ),
});

// Channel purpose/description
export const purpose = i.pins.data({
  description: 'Purpose or description for the channel.',
  control: i.controls.text({
    placeholder: 'This channel is for...',
  }),
  schema: v.pipe(v.string(), v.trim(), v.maxLength(250)),
});

// Channel topic
export const topic = i.pins.data({
  description: 'Topic for the channel.',
  control: i.controls.text({
    placeholder: 'Channel topic',
  }),
  schema: v.pipe(v.string(), v.trim(), v.maxLength(250)),
});

// Private channel flag
export const isPrivate = i.pins.data({
  description: 'Create a private channel instead of public.',
  control: i.controls.switch(),
  optional: true,
  schema: v.optional(v.boolean()),
});

// Conversation types filter
export const types = i.pins.data({
  description: 'Types of conversations to include (comma-separated).',
  control: i.controls.text({
    placeholder: 'public_channel,private_channel,im,mpim',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// Exclude archived channels flag
export const excludeArchived = i.pins.data({
  description: 'Exclude archived channels from results.',
  control: i.controls.switch(),
  optional: true,
  schema: v.optional(v.boolean()),
});

// Include number of members in each conversation
export const includeNumMembers = i.pins.data({
  description: 'Include the number of members in each conversation.',
  control: i.controls.switch(),
  optional: true,
  schema: v.optional(v.boolean()),
});

// User ID for filtering user's conversations
export const userId = i.pins.data({
  description: 'User ID to filter conversations for.',
  control: i.controls.text({
    placeholder: 'U1234567890',
  }),
  optional: true,
  schema: v.optional(v.pipe(v.string(), v.trim())),
});

// Conversations list response
export const conversationsListResponse = i.pins.data<ConversationsListResponse>(
  {
    description: 'List of conversations from Slack.',
  },
);

// Single conversation info response
export const conversationInfoResponse = i.pins.data<ConversationsInfoResponse>({
  description: 'Detailed information about a conversation.',
});

// Conversation creation response
export const conversationCreateResponse =
  i.pins.data<ConversationsCreateResponse>({
    description: 'Response from creating a new conversation.',
  });

// User list for invitations (comma-separated IDs)
export const userList = i.pins.data({
  description: 'Comma-separated list of user IDs.',
  control: i.controls.text({
    placeholder: 'U1234567890,U0987654321',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Include inclusive flag for history queries
export const inclusive = i.pins.data({
  description: 'Include messages with latest or oldest timestamp in results.',
  control: i.controls.switch(),
  optional: true,
  schema: v.optional(v.boolean()),
});

// Conversation members response
export const membersResponse = i.pins.data<ConversationsMembersResponse>({
  description: 'List of conversation members from Slack.',
});

// Conversation history response
export const historyResponse = i.pins.data<ConversationsHistoryResponse>({
  description: 'Conversation message history from Slack.',
});

// Purpose response
export const purposeResponse = i.pins.data<ConversationsSetPurposeResponse>({
  description: 'Response from setting conversation purpose.',
});

// Topic response
export const topicResponse = i.pins.data<ConversationsSetTopicResponse>({
  description: 'Response from setting conversation topic.',
});
