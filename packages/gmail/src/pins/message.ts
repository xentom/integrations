import * as i from '@xentom/integration-framework';
import * as v from 'valibot';

import { type gmail_v1 } from 'googleapis';

export const item = i.pins.data<gmail_v1.Schema$Message>({
  description: 'A Gmail message object with full content and metadata',
});

export const id = i.pins.data({
  displayName: 'Message ID',
  description: 'Gmail message identifier',
  schema: v.string(),
  control: i.controls.text({
    placeholder: '18b2c3d4e5f6g7h8',
  }),
});

export const subject = i.pins.data({
  description: 'Email subject line',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Email subject',
  }),
});

export const body = i.pins.data({
  description: 'Email body content (HTML or plain text)',
  schema: v.string(),
  control: i.controls.text({
    placeholder: 'Email content',
    rows: 5,
  }),
});

export const headers = i.pins.data({
  description: 'Email headers with common fields extracted',
  schema: v.object({
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    cc: v.optional(v.string()),
    bcc: v.optional(v.string()),
    subject: v.optional(v.string()),
    date: v.optional(v.string()),
    messageId: v.optional(v.string()),
    replyTo: v.optional(v.string()),
  }),
  examples: [
    {
      title: 'Email Headers',
      value: {
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'Weekly Report',
        date: 'Mon, 1 Jan 2024 12:00:00 +0000',
        messageId: '<message-id@example.com>',
      },
    },
  ],
});

export const draft = i.pins.data({
  description: 'A Gmail draft message',
  schema: v.object({
    id: v.optional(v.string()),
    message: v.optional(v.any()),
  }),
  examples: [
    {
      title: 'Draft Email',
      value: {
        id: 'd123456789',
        message: {
          id: '18b2c3d4e5f6g7h8',
          threadId: '18b2c3d4e5f6g7h8',
          payload: {
            headers: [
              { name: 'To', value: 'recipient@example.com' },
              { name: 'Subject', value: 'Draft Subject' },
            ],
          },
        },
      },
    },
  ],
});

export const address = i.pins.data({
  description: 'A validated email address',
  schema: v.pipe(v.string(), v.email()),
  control: i.controls.text({
    placeholder: 'user@example.com',
  }),
  examples: [
    {
      title: 'Email Address',
      value: 'user@example.com',
    },
  ],
});

export const addresses = i.pins.data({
  description: 'A comma-separated list of email addresses or an array',
  control: i.controls.text({
    placeholder: 'user1@example.com, user2@example.com',
  }),
  schema: v.union([
    v.pipe(
      v.string(),
      v.transform((str) => str.split(',').map((s) => s.trim())),
    ),
    v.array(v.pipe(v.string(), v.email())),
  ]),
  examples: [
    {
      title: 'Multiple Recipients',
      value: 'alice@example.com, bob@example.com',
    },
  ],
});

export const cc = addresses.with({
  displayName: 'CC',
  description: 'Carbon copy recipients',
});

export const bcc = addresses.with({
  displayName: 'BCC',
  description: 'Blind carbon copy recipients',
});
