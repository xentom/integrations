import {
  type ChatPostMessageResponse,
  type KnownBlock,
  type MessageAttachment,
} from '@slack/web-api';
import * as v from 'valibot';

import * as i from '@acme/integration-framework';

// Channel ID pin
export const channel = i.pins.data({
  description: 'A Slack channel ID (e.g., C1234567890).',
  control: i.controls.text({
    placeholder: 'C1234567890',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Message text pin
export const messageText = i.pins.data({
  description: 'The text content of the message.',
  control: i.controls.text({
    placeholder: 'Hello, world!',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Thread timestamp pin for replies
export const threadTs = i.pins.data({
  description: 'Thread timestamp to reply to a specific message thread.',
  control: i.controls.text({
    placeholder: '1234567890.123456',
  }),
  schema: v.pipe(v.string(), v.trim()),
});

// Message response object
export const messageResponse = i.pins.data<ChatPostMessageResponse>({
  description: 'Response from sending a message containing message details.',
});

// Blocks for rich message formatting (JSON string)
export const blocks = i.pins.data({
  description: 'Block Kit blocks for rich message formatting (JSON string).',
  control: i.controls.expression<KnownBlock[]>(),
});

// Attachments for legacy formatting
export const attachments = i.pins.data<MessageAttachment[]>({
  description: 'Legacy message attachments (JSON string).',
  control: i.controls.expression<MessageAttachment[]>(),
});

// User ID for ephemeral messages
export const ephemeralUser = i.pins.data({
  description: 'User ID to send ephemeral message to.',
  control: i.controls.text({
    placeholder: 'U1234567890',
  }),
  schema: v.pipe(v.string(), v.trim(), v.minLength(1)),
});

// Parse mode for text formatting
export const parse = i.pins.data({
  description: 'How to parse the message text.',
  control: i.controls.select({
    options: [
      { label: 'Full', value: 'full' },
      { label: 'None', value: 'none' },
    ],
  }),
  schema: v.picklist(['full', 'none']),
});

// Link names flag
export const linkNames = i.pins.data({
  description: 'Find and link channel names and usernames.',
  control: i.controls.switch(),
  schema: v.boolean(),
});

// Unfurl links flag
export const unfurlLinks = i.pins.data({
  description: 'Enable automatic link unfurling.',
  control: i.controls.switch(),
  schema: v.boolean(),
});

// Unfurl media flag
export const unfurlMedia = i.pins.data({
  description: 'Enable automatic media unfurling.',
  control: i.controls.switch(),
  schema: v.boolean(),
});

// As user flag for posting as bot
export const asUser = i.pins.data({
  description: 'Post the message as the authenticated user.',
  control: i.controls.switch({
    defaultValue: false,
  }),
  schema: v.boolean(),
});

// Reply broadcast flag
export const replyBroadcast = i.pins.data({
  description: 'Broadcast thread reply to channel.',
  control: i.controls.switch(),
  schema: v.boolean(),
});
